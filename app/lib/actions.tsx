'use server';
import { signIn, signOut } from "@/auth"
import { auth } from "@/auth";
import postgres from 'postgres';
import { randomBytes } from "crypto";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createBucket, setBucketCors } from "@/app/lib/r2";
import { GoogleGenAI } from "@google/genai";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type State = {
    status  : string;
    message : string;
};

export async function signInAction() {
    await signIn();
}

export async function signOutAction() {
    await signOut();
}

export async function createClass(state: State, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { status: 'error', message: 'Unauthorized' }; // Return an error
    }

    const name = formData.get('name') as string;
    const joinCode = `${randomBytes(2).toString('hex')}-${randomBytes(2).toString('hex')}`;

    try {
        const result = await sql`
            INSERT INTO clase (nume, join_code, created_by) VALUES (${name}, ${joinCode}, ${session.user.id})
            RETURNING id_clasa
        `;
        const id_clasa = result[0].id_clasa;
        await sql`
            INSERT INTO elevi (id_elev, id_clasa) VALUES (${session.user.id}, ${id_clasa})
        `;
        await createBucket(id_clasa);
        await setBucketCors(id_clasa);
    } catch (error) {
        throw error;
    }
    revalidatePath('/', 'layout')
    redirect("/clase");
}

export async function updateName(state: State, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { status: 'error', message: 'Unauthorized' };
    }

    const name = formData.get('name') as string;

    try {
        await sql`
            UPDATE next_auth.users SET name = ${name} WHERE id = ${session.user.id}
        `;
    } catch (error) {
        throw error;
    }
    // await new Promise(resolve => setTimeout(resolve, 1000));
    revalidatePath('/', 'layout')
    return { status: 'success', message: name };
}

export async function requestJoinClass(state: State, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { status: 'error', message: 'Unauthorized' };
    }

    const joinCode = formData.get('join_code') as string;
    const id_elev = session.user.id;
    try {
    const clasa = await sql`
        SELECT id_clasa FROM clase WHERE join_code = ${joinCode}
    `;
    if (clasa.length === 0) {
        return { status: 'error', message: 'Cod de alăturare invalid' };
    }
    const id_clasa = clasa[0].id_clasa;
    const elev = await sql`
        SELECT * FROM elevi WHERE id_clasa = ${id_clasa} AND id_elev = ${id_elev}
    `;
    if (elev.length > 0) {
        return { status: 'error', message: 'Ai trimis deja o cerere de alăturare' };
    }
    await sql`
        INSERT INTO elevi (id_elev, id_clasa, status) VALUES (${id_elev}, ${id_clasa}, 'pending')
        ON CONFLICT (id_elev, id_clasa) DO NOTHING;
    `;
    return { status: 'success', message: 'Cerere trimisă' };
    } catch (error) {
        throw error;
    }
}

export async function generateTest(state: State, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { status: 'error', message: 'Unauthorized' };
    }

    let promptData = {materie: "", clasa: "", capitol: "", numar_intrebari: 0, dificultate: ""};

    promptData.materie = formData.get('materie') as string;
    promptData.clasa = formData.get('clasa') as string;
    promptData.capitol = formData.get('capitol') as string;
    promptData.numar_intrebari = parseInt(formData.get('numar_intrebari') as string);
    promptData.dificultate = formData.get('dificultate') as string;
    console.log(promptData);
    if(!promptData.materie || !promptData.clasa || !promptData.capitol || !promptData.numar_intrebari || !promptData.dificultate) return { status: 'error', message: 'Te rog să completezi toate câmpurile' };
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
        const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Genereaza un test de ${promptData.materie} pentru clasa ${promptData.clasa}, capitolul ${promptData.capitol}, cu ${promptData.numar_intrebari} intrebari, fiecare cu 4 variante de raspuns. Fiecare intrebare trebuie sa aiba un singur raspuns corect. Testul trebuie sa fie de dificultate ${promptData.dificultate}. Foloseste un limbaj simplu si clar, potrivit pentru elevii de clasa ${promptData.clasa}. Testul trebuie sa fie in limba romana. Te rog sa imi spui doar testul, fara alte explicatii sau introduceri, in urmatorul format JSON: \`[{"intrebare": "?", "raspunsuri": ["", "", "", ""], "raspuns_corect": 0}]\`, raspunzand doar cu obiectul JSON.`,
        });
        return { status: 'success', message: JSON.parse(response.text?.replace(/```json/g, "").replace(/```/g, "") || "")};
    } catch (error) {
        return { status: 'error', message: 'Testul nu a putut fi generat' };
    }
}