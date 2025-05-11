import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from "@/auth";
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(res, { error: 'Unauthorized' }, { status: 401 });
  }

  const { name, joinCode } = req.body;
  console.log(name, joinCode, req)

  try {
    await sql.begin(sql => [
      sql`INSERT INTO clase (nume, join_code, created_by) VALUES (${name}, ${joinCode}, ${session.user.id})`
    ]);
    return Response.json(res, { message: 'Class created successfully' });
  } catch (error) {
    return Response.json(res, { error: 'Failed to create class' }, { status: 500 });
  }
}
