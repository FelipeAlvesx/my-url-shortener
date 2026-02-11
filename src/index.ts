import { PrismaClient } from "@prisma/client";
import express from "express";
import "dotenv/config";
import { adapter } from "./db/db-config.ts";

const app = express();
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT;

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
