'use server'
import postgres from 'postgres';
import { auth } from "@/auth";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getClase() {
  try {
    const session = await auth();
    if(!session?.user?.id) return null;

    const data = await sql`
      SELECT clase.nume, clase.join_code, clase.created_at, clase.id_clasa, next_auth.users.name AS creator FROM elevi JOIN clase ON elevi.id_clasa = clase.id_clasa JOIN next_auth.users ON clase.created_by = next_auth.users.id WHERE elevi.id_elev = ${session?.user?.id} ORDER BY elevi.created_at ASC;
    `;
  
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clase.');
  }
}

export async function getClasa(id: number) {
  try {
    const session = await auth();
    if(!session?.user?.id) return null;

    const data = await sql`
      SELECT clase.nume, clase.join_code, clase.created_at, clase.id_clasa, clase.created_by, next_auth.users.name FROM elevi JOIN clase ON elevi.id_clasa = clase.id_clasa JOIN next_auth.users ON clase.created_by = next_auth.users.id WHERE elevi.id_elev = ${session?.user?.id} AND elevi.id_clasa = ${id};
    `;
    if(data[0].created_by !== session?.user?.id) data[0].created_by = null
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clasa by id (' + id + ').');
  }
}