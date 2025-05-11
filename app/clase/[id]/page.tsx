import { getClasa } from "@/app/lib/data";
import { stringToHexcolor } from "@/app/lib/utils";
import FileUploader from "@/components/FileUploader";
import FileList from "@/components/FileList";
import { auth } from "@/auth";
import { Suspense } from "react";
import { ListaElevi, ListaEleviSkeleton } from "@/components/elevList";

export default async function Page(props : { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const clasa = await getClasa(id);
    const session = await auth();
    if (!clasa || clasa.length === 0) {
        return (
            <main>
                <h1>Această clasă nu a fost găsită</h1>
            </main>
        );
    }
    return (
        <main>
            {/* <h1>Clasa {id}</h1> */}
            <div className="bg-white p-4 rounded-md shadow-md w-full" style={{ backgroundColor: stringToHexcolor(clasa[0].nume)}}>
                <h2 className="font-semibold text-lg">{clasa[0].nume}</h2>
                <p className="text-gray-600">Creată de {clasa[0].name}</p>
                <p className="text-gray-600">Codul clasei: {clasa[0].join_code}</p>
            </div>
            {clasa[0]?.created_by === session?.user?.id && <ListaElevi clasa={id}/> }
            {clasa[0]?.created_by === session?.user?.id && <FileUploader bucket={id}/> }
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-6">Lecturi</h2>
            <FileList bucket={id} clasa={clasa} />
            {/* <pre>{JSON.stringify(clasa, null, 2)}</pre> */}
        </main>
    );
}