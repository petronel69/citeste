'use client'
import { useSession } from "next-auth/react";
import { updateName, State } from "@/app/lib/actions";
import { useActionState, useEffect, useState, useTransition } from 'react';
import { PrimaryButton } from "@/components/buttons";
import { LoaderCircle } from "lucide-react";

export default function Page() {
  const session = useSession();
  const initialState: State = { status: "", message: "" };
  const [state, formAction] = useActionState(updateName, initialState);
  let [name, setName] = useState(session?.data?.user?.name || "");
  let [isPending, startTransition] = useTransition();
  useEffect(() => {
  if(state.status == "success") {
      session.update({
          user: {
              ...session?.data?.user,
              name: state.message
          }
      })
      state.status = "";
  }
  }, [state.status]);
  const onSubmit = async (formData: FormData) => {
      startTransition(() => {
          formAction(formData);
      });
  }
  return (
    <>
    <h1>Setari</h1>
    <form className="flex flex-col gap-4 w-full max-w-md mx-auto p-4 rounded-md shadow-md bg-gray-100 my-6" action={onSubmit}>
      <label className="text-lg" htmlFor="name">Numele meu</label>
      <input className="border border-gray-300 rounded-md p-2 w-full" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
      <PrimaryButton type="submit" text={isPending ? <div className="w-full flex justify-center mx-auto animate-spin"><LoaderCircle /></div> : "Salveaza"} disabled={isPending}/>
    </form>
    
    {/* <pre>{JSON.stringify(context.data, null, 2)}</pre> */}
    </>
  );
}
