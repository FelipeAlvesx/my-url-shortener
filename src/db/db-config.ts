import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não definida no .env");

const adapter = new PrismaBetterSqlite3({ url });

export { adapter };
