import { adapter } from "../../db/db-config.ts";
import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient({ adapter });

export async function createLink(req: express.Request, res: express.Response) {
    const { original } = req.body;
    const payload = {
        original,
        shortCode: Math.random().toString(36).substring(2, 8), // Gera um código curto aleatório
        createdAt: new Date(),
        clicks: 0,
    };

    await prisma.link.create({ data: payload });
    res.status(201).json({
        message: "Link criado com sucesso!",
        url: `http://localhost:3000/${payload.shortCode}`,
    });
}
