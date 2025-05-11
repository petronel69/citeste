import { getClase } from "@/app/lib/data";

import Link from 'next/link';
import Card from "@/components/card";

export default async function Page() {
  let clase = await getClase();
  return (
    <>
    <h1>Acasa</h1>
    <Card title="Clasele mele" description={<div className="text-lg text-gray-900">Te-ai alaturat la <span className="text-blue-500">{clase?.length}</span> clase</div>} href="/clase" footer="Clasele mele" />
    
    {/* <pre>{JSON.stringify(context.data, null, 2)}</pre> */}
    </>
  );
}
