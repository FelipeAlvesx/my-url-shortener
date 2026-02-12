import { PrismaClient } from "@prisma/client";
import express from "express";
import "dotenv/config";
import { adapter } from "./db/db-config.ts";
import { linkRouter } from "./routes/route.ts";

const app = express();
const PORT = process.env.PORT;
export const prisma = new PrismaClient({ adapter });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(linkRouter);

app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});
