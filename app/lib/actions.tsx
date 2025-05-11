'use server';
import { signIn, signOut } from "@/auth"
import { auth } from "@/auth";
import postgres from 'postgres';
import { randomBytes } from "crypto";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createBucket, setBucketCors } from "@/app/lib/r2";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type State = {
    status  : string | null;
    message : string | "";
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

    console.log("session", session.user.id)
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
    revalidatePath('/', 'layout')
    redirect("/clase");
}