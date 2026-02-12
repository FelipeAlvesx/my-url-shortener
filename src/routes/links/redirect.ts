import { adapter } from "../../db/db-config.ts";
import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient({ adapter });

export async function redirectLink(
    req: express.Request,
    res: express.Response,
) {
    const { code } = req.params;
    const shortCode = Array.isArray(code) ? code[0] : code;

    if (!shortCode) {
        return res.status(400).json({ message: "Código inválido" });
    }

    const link = await prisma.link.findUnique({ where: { shortCode } });

    if (!link) {
        return res.status(404).json({ message: "Link não encontrado" });
    }

    await prisma.link.update({
        where: { shortCode },
        data: { clicks: link.clicks + 1 },
    });

    res.status(302).redirect(link.original);
}
