import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env"), override: true });



export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_URL || process.env.DATABASE_URL!,
    authToken: process.env.TURSO_TOKEN!,
  },
});
