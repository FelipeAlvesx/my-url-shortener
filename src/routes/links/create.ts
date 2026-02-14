import { prisma } from "../../index.ts";
import express from "express";
import { isValidUrl } from "./validator/urlValidator.ts";

export async function createLink(req: express.Request, res: express.Response) {
    const { original } = req.body;
    if(!original || !isValidUrl(original)) {
        return res.status(400).json({ message: "URL inválida" });
    }
    const shortCode = Math.random().toString(36).substring(2, 8) // Gera um código curto aleatório
    const link = await prisma.link.create({ data: { original, shortCode, clicks: 0, createdAt: new Date() } });
    res.status(201).json({
        message: "Link criado com sucesso!",
        shortCode: link.shortCode,
        url: `${process.env.BASE_URL}/${shortCode}`,
    });
}
