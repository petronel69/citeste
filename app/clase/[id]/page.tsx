import { getClasa } from "@/app/lib/data";
import { stringToHexcolor } from "@/app/lib/utils";

export default async function Page(props : { params: Promise<{ id: number }> }) {
    const params = await props.params;
    const id = params.id;
    const clasa = await getClasa(id);
    if (!clasa || clasa.length === 0) {
        return (
            <main>
                <h1>Clasa {id} nu a fost gasita</h1>
            </main>
        );
    }
    return (
        <main>
            
            {/* <Form invoice={invoice} customers={customers} /> */}
            <div className="bg-white p-4 rounded-md shadow-md w-full" style={{ backgroundColor: stringToHexcolor(clasa[0].nume)}}>
                <h2 className="font-semibold text-lg">{clasa[0].nume}</h2>
                <p className="text-gray-600">Creată de {clasa[0].name}</p>
                <p className="text-gray-600">Codul clasei: {clasa[0].join_code}</p>
            </div>
            <h1>Clasa {id}</h1>
            <pre>{JSON.stringify(clasa, null, 2)}</pre>
        </main>
    );
}