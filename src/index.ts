import "dotenv/config";
import express from "express";
import { adapter } from "./db/db-config.ts";
import { PrismaClient } from "@prisma/client";
import { linkRouter } from "./routes/linkRoute.ts";
import { authRouter } from "./routes/authRoute.ts";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.ts";

const app = express();
const PORT = process.env.PORT;
export const prisma = new PrismaClient({ adapter });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "URL Shortener API Docs",
    }),
);

app.use(linkRouter);
app.use("/auth", authRouter);

/**
 * @swagger
 * /health/ping:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API está funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: pong
 */
app.get("/health/ping", (req, res) => {
    res.json({ message: "pong" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(
        `Documentação Swagger disponível em http://localhost:${PORT}/docs`,
    );
});

// Graceful shutdown
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});
