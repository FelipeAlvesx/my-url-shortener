import "dotenv/config";
import express from "express";
import { adapter } from "./db/db-config.ts";
import { PrismaClient } from "@prisma/client";
import { linkRouter } from "./routes/linkRoute.ts";
import { authRouter } from "./routes/authRoute.ts";

const app = express();
const PORT = process.env.PORT;
export const prisma = new PrismaClient({ adapter });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(linkRouter);
app.use("/auth", authRouter);

app.get("/health/ping", (req, res) => {
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
