import { getClase } from "@/app/lib/data";

import Link from 'next/link';
import Card from "@/components/card";

export default async function Page() {
  let clase = await getClase();
  return (
    <>
    <h1>Acasa</h1>
    <pre>{JSON.stringify(context.data, null, 2)}</pre>
    </>
  );
}
