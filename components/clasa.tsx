import Link from "next/link";
import { getClase } from "@/app/lib/data";
import { stringToHexcolor } from "@/app/lib/utils";

export function Clasa(props: {clasa: {id_clasa: number, nume: string, join_code: string, creator: string}}) {
    const { clasa } = props;
    return (
        <>
        <Link href={`/clase/${clasa.id_clasa}`} key={clasa.id_clasa}>
        <div className="bg-white p-4 rounded-md shadow-md w-full hover:!bg-gray-100 hover:cursor-pointer" style={{ backgroundColor: stringToHexcolor(clasa.nume)}}>
                <h2 className="font-semibold text-lg">{clasa.nume}</h2>
                <p className="text-gray-600">Creată de {clasa.creator}</p>
                <p className="text-gray-600">Codul clasei: {clasa.join_code}</p>
            </div>
        </Link>
        </>
    )
}

export function ClasaSkeleton() {
    return (
        <div className="px-6 py-4 bg-gray-100 animate-pulse text-gray-600 rounded-md shadow-sm border border-gray-200 mb-4 transition-all duration-200 ease-in-out">
            <div className="font-bold text-xl mb-2 bg-gray-200 h-7 w-1/2"></div>
            <p className="text-gray-700 text-base bg-gray-200 h-7 w-full"></p>
        </div>
    )
}

export function ListaClaseSkeleton() {
    return <>
        <div className="flex flex-col gap-4">
            <ClasaSkeleton />
            <ClasaSkeleton />
            <ClasaSkeleton />
            <ClasaSkeleton />
            <ClasaSkeleton />
            <ClasaSkeleton />
        </div>
    </>
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function ListaClase(){
    let clase = await getClase();
    return (
        <div className="flex flex-col gap-4">
            {clase ? clase.map((clasa) => <Clasa clasa={clasa} key={clasa.id_clasa} />) : <p className="text-gray-500 text-sm">Nu ai nicio clasă. <Link href="/clase/creare" className="text-blue-500 hover:text-blue-700">Creează una!</Link></p>}
        </div>
    )
}
