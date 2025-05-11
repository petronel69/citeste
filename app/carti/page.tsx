import { getClase } from "@/app/lib/data";

import Link from 'next/link';
import Card from "@/components/card";

export default async function Page() {
  let clase = await getClase();
  return (
    <>
    <h1>Carti</h1>
    </>
  );
}
