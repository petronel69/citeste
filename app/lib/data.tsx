'use server'
import postgres from 'postgres';
import { auth } from "@/auth";
import { get } from 'http';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getClase() {
  try {
    const session = await auth();
    if(!session?.user?.id) return null;

    const data = await sql`
      SELECT clase.nume, clase.join_code, clase.created_at, clase.id_clasa, next_auth.users.name AS creator FROM clase LEFT OUTER JOIN elevi ON elevi.id_clasa = clase.id_clasa JOIN next_auth.users ON clase.created_by = next_auth.users.id WHERE elevi.id_elev = ${session?.user?.id} AND elevi.status = 'active' OR clase.created_by = ${session?.user?.id} ORDER BY clase.created_at ASC;
    `;
  
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clase.');
  }
}

export async function getClasa(id: string) {
  if(!id) return null;
  try {
    const session = await auth();
    if(!session?.user?.id) return null;

    const data = await sql`
      SELECT clase.nume, clase.join_code, clase.created_at, clase.id_clasa, clase.created_by, next_auth.users.name FROM clase LEFT OUTER JOIN elevi ON elevi.id_clasa = clase.id_clasa JOIN next_auth.users ON clase.created_by = next_auth.users.id WHERE (elevi.id_elev = ${session?.user?.id} AND elevi.id_clasa = ${id} AND elevi.status = 'active') OR (clase.id_clasa = ${id} AND clase.created_by = ${session?.user?.id}) ORDER BY elevi.created_at ASC;
    `;
    if(data[0] && data[0]?.created_by !== session?.user?.id) data[0].created_by = null
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch clasa by id (' + id + ').');
  }
}

export async function getElevi(clasa: string) {
  if(!clasa) return null;
  try {
    const session = await auth();
    if(!session?.user?.id) return null;

    const data = await sql`
      SELECT elevi.id_elev, elevi.created_at, elevi.status, next_auth.users.name FROM elevi JOIN next_auth.users ON elevi.id_elev = next_auth.users.id JOIN clase ON clase.id_clasa = ${clasa} WHERE elevi.id_clasa = ${clasa} AND clase.created_by = ${session?.user?.id} ORDER BY elevi.created_at ASC;
    `;
    if(data[0] && data[0]?.created_by !== session?.user?.id) data[0].created_by = null
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch elevi for clasa (' + clasa + ').');
  }
}

export async function kickElev(id_clasa: string, id_elev: string) {
  if(!id_clasa || !id_elev) return null;
  try {
    const session = await auth();
    if(!session?.user?.id) return null;

    await sql`
      DELETE FROM elevi WHERE id_clasa = ${id_clasa} AND id_elev = ${id_elev} AND status = 'active';
    `;
    const elevi = await getElevi(id_clasa);
    return elevi;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to kick elev (' + id_elev + ') from clasa (' + id_clasa + ').');
  }
}

export async function acceptElev(id_clasa: string, id_elev: string) {
  if(!id_clasa || !id_elev) return null;
  try {
    const session = await auth();
    if(!session?.user?.id) return null;

    await sql`
      UPDATE elevi SET status = 'active' WHERE id_clasa = ${id_clasa} AND id_elev = ${id_elev} AND status = 'pending';
    `;
    const elevi = await getElevi(id_clasa);
    return elevi;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to kick elev (' + id_elev + ') from clasa (' + id_clasa + ').');
  }
}

export async function getUserStatusForClasa(id_clasa: string) {
  if(!id_clasa) return null;
  try {
    const session = await auth();
    if(!session?.user?.id) return null;

    const data = await sql`
      SELECT elevi.id_elev, clase.created_by FROM clase LEFT OUTER JOIN elevi ON elevi.id_clasa = clase.id_clasa AND elevi.id_elev = ${session?.user?.id} WHERE clase.id_clasa = ${id_clasa};
    `;
    if(data[0]?.created_by == session?.user?.id) return "profesor"
    if(data[0]?.id_elev == session?.user?.id) return "elev"
    return null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user status for clasa (' + id_clasa + ').');
  }
}