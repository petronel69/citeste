'use client';
import Test from "@/components/Test";
import { generateTest, State } from "@/app/lib/actions";
import { useActionState, useState } from "react";

export default function Page() {
  let data: [{intrebare: string, raspunsuri: string[], raspuns_corect: number}] | null = null;
  let [promptData, setPromptData] = useState({materie: "", clasa: "", capitol: "", numar_intrebari: 5, dificultate: ""});
  const initialState: State = { status: "", message: "" };
  const [state, formAction] = useActionState(generateTest, initialState);
  if(state.status === "success")
    return(<Test test_data={state.message} />);
  return (
    <>
    <h1>Exerseaza</h1>
    {state.status === "error" && <p className="text-red-600">{state.message}</p>}
    <form action={formAction} className="space-y-4 bg-gray-50 p-6 rounded-md shadow-md">
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Materie:</label>
        <select 
          name="materie" 
          value={promptData.materie} 
          onChange={(e) => setPromptData({...promptData, materie: e.target.value})} 
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Alege o materie</option>
          <option value="matematica">Matematica</option>
          <option value="fizica">Fizica</option>
          <option value="biologie">Biologie</option>
          <option value="chimie">Chimie</option>
          <option value="informatica">Informatica</option>
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
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
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
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md font-semibold hover:bg-blue-400 transition duration-300 hover:cursor-pointer">
        Generează testul
      </button>
    </form>
    </>
  );
}
