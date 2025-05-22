import { ListaClase, ListaClaseSkeleton } from "@/components/clasa";
import Link from 'next/link';
import { Suspense } from 'react';


export default function Page() {
  return (
    <>
    <h1>Clasele mele</h1>
    <Suspense fallback={<ListaClaseSkeleton />}>
      <ListaClase />
    </Suspense>
    {/* <PrimaryButton text="Adaugă o clasă" href="/clase/creare" className="mt-4" /> */}
    <p className="text-gray-500 text-sm mt-2">Nu ai nicio clasă? <Link href="/clase/alaturare" className="text-blue-500 hover:text-blue-700">Alătură-te unei clase!</Link> sau <Link href="/clase/creare" className="text-blue-500 hover:text-blue-700">Crează una!</Link></p>
    </>
  );
}
