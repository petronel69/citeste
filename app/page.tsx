import { getClase } from "@/app/lib/data";

import Card from "@/components/card";
import { Car } from "lucide-react";
import { Suspense } from "react";

export default async function Page() {
  let clase = await getClase();
  return (
    <>
    <h1>Acasa</h1>
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 mx-auto w-fit">
      <Suspense fallback={<div>Loading...</div>}>
        <Card title="Clasele mele" description={<div className="text-lg text-gray-900">In acest moment faci parte din <span className="text-blue-500">{clase?.length}</span> clase</div>} href="/clase" footer="Clasele mele" />
      </Suspense>
      <Card title="Exerseaza" description={<div className="text-lg text-gray-900">Vrei sa iti testezi capacitatile pentru urmatorul test, indiferent de materie sau capitol?</div>} href="/exerseaza" footer="Exerseaza" />
      <Card title="Manuale" description={<div className="text-lg text-gray-900">Acceseaza o lista completa de manuale in format digital</div>} href="/exerseaza" footer="Acceseaza lista" />
      <Card title="Setari" description={<div className="text-lg text-gray-900">Vrei sa iti schimbi numele de utilizator?</div>} href="/setari" footer="Setari" />
    </div>
    </>
  );
}
