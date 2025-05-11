import postgres from 'postgres';
import { auth } from "@/auth";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getClase() {
    const session = await auth();
    if(!session?.user?.id) return null;
    console.log(session?.user?.id)

    const data = await sql`
      SELECT clase.nume, clase.join_code, clase.created_at, clase.id_clasa FROM elevi JOIN clase ON elevi.id_clasa = clase.id_clasa WHERE elevi.id_elev = ${session?.user?.id};
    `;
  
    return data;
  }

export async function GET() {
    try {
        const result = await sql.begin((sql) => [
          getClase(),
        ]);
    
        return Response.json({ data: result });
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
}