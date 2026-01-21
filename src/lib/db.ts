import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

const url = process.env.TURSO_URL || process.env.DATABASE_URL!;
const authToken = process.env.TURSO_TOKEN;

export const client = createClient({ url, authToken });
export const db = drizzle(client, { schema });
