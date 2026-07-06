import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && (!sqlHost || !sqlDbName || !user || !password)) {
  console.warn("Database credentials are not fully configured in environment variables. Drizzle-Kit might fail to connect.");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: databaseUrl ? {
    url: databaseUrl,
    ssl: databaseUrl.includes("sslmode=no-verify") || process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  } : {
    host: sqlHost || "",
    user: user || "",
    password: password || "",
    database: sqlDbName || "",
    ssl: false,
  },
  verbose: true,
});
