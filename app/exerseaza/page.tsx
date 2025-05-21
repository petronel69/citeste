'use client';
import Test from "@/components/Test";
import { generateTest, State } from "@/app/lib/actions";
import { useActionState, useState, useTransition, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useSearchParams, useRouter } from 'next/navigation'

export default function Page() {
  let data: [{intrebare: string, raspunsuri: string[], raspuns_corect: number}] | null = null;
  const searchParams = useSearchParams()
  let [promptData, setPromptData] = useState({materie: searchParams.get("materie") || "", clasa: searchParams.get("clasa") || "",  capitol: searchParams.get("capitol") || "", numar_intrebari: parseInt(searchParams.get("numar_intrebari") || "5"), dificultate: searchParams.get("dificultate") || ""});
  const initialState: State = { status: "", message: "" };
  const [state, formAction] = useActionState(generateTest, initialState);
  const router = useRouter();
  let [isPending, startTransition] = useTransition();
  const onSubmit = async (formData: FormData) => {
      startTransition(() => {
          formAction(formData);
      });
  }
  
  useEffect(() => {
    if(state.status === "success") {
      router.push(encodeURI(`/exerseaza?materie=${promptData.materie}&clasa=${promptData.clasa}&capitol=${promptData.capitol}&numar_intrebari=${promptData.numar_intrebari}&dificultate=${promptData.dificultate}`));
    }
  }, [state]);

  if(state.status === "success")
    return(<Test test_data={state.message} />);
  
    

  return (
    <>
    <h1>Exerseaza</h1>
    {state.status === "error" && <p className="text-red-600">{state.message}</p>}
    <form action={onSubmit} className="space-y-4 bg-gray-50 p-6 rounded-md shadow-md">
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Materie:</label>
        <select 
          name="materie" 
          value={promptData.materie} 
          onChange={(e) => setPromptData({...promptData, materie: e.target.value})} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Alege o materie</option>
          <option value="engleza">Limba engleză</option>
          <option value="matematica">Matematică</option>
          <option value="fizica">Fizică</option>
          <option value="biologie">Biologie</option>
          <option value="chimie">Chimie</option>
          <option value="informatica">Informatică</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Clasa:</label>
        <select 
          name="clasa" 
          value={promptData.clasa} 
          onChange={(e) => setPromptData({...promptData, clasa: e.target.value})} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Alege o clasa</option>
          <option value="a 7-a">a 7-a</option>
          <option value="a 8-a">a 8-a</option>
          <option value="a 9-a">a 9-a</option>
          <option value="a 10-a">a 10-a</option>
          <option value="a 11-a">a 11-a</option>
          <option value="a 12-a">a 12-a</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Capitol:</label>
        <input 
          name="capitol" 
          type="text" 
          value={promptData.capitol} 
          onChange={(e) => setPromptData({...promptData, capitol: e.target.value})} 
          placeholder="Capitol" 
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Numar intrebari:</label>
        <input 
          name="numar_intrebari" 
          type="number" 
          min="1"
          max="20" 
          value={promptData.numar_intrebari} 
          onChange={(e) => setPromptData({...promptData, numar_intrebari: parseInt(e.target.value)})} 
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Dificultate:</label>
        <select 
          name="dificultate" 
          value={promptData.dificultate} 
          onChange={(e) => setPromptData({...promptData, dificultate: e.target.value})} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Alege o dificultate</option>
          <option value="usoara">Usoara</option>
          <option value="medie">Medie</option>
          <option value="grea">Grea</option>
          <option value="foarte grea">Foarte grea</option>
        </select>
      </div>
      <button type="submit" disabled={isPending} className="w-full bg-blue-400 hover:bg-blue-300 hover:text-blue-600 hover:cursor-pointer text-gray-100 rounded-md shadow-sm border border-gray-200 mb-4 transition-all duration-200 ease-in-out px-4 py-2 disabled:cursor-not-allowed">
        {isPending ? <LoaderCircle className="mx-auto animate-spin"/> : "Generează testul"}
      </button>
    </form>
    </>
  );
}
