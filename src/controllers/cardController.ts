import { Request, Response } from "express";
import * as cardService from "../services/cardService";
import * as companieService from "../services/companieService";

export async function createCard(req: Request, res: Response) {
    const apiKey = String(req.headers["x-api-key"]);
    const { employeeId, type } = req.body;
    
    await companieService.validateApiKey(apiKey);
    await cardService.createCard(employeeId, type);

    res.status(201).send("cartão criado com sucesso");
}

export async function activeCard(req: Request, res: Response) {
    const { cardId, CVC, password } = req.body;

    await cardService.activeCard(cardId, CVC, password);

    res.status(200).send("cartão ativado com sucesso");
}

export async function blockCard(req: Request, res: Response) {
    const { cardId, password } = req.body;

    await cardService.blockCard(cardId, password);

    res.status(200).send("cartão bloqueado com sucesso");
}

export async function unblockCard(req: Request, res: Response) {
    const { cardId, password } = req.body;

    await cardService.unblockCard(cardId, password);

    res.status(200).send("cartão desbloqueado com sucesso");
}

export async function getBalanceById(req: Request, res: Response) {
    const { cardId } = req.params;

    const result = await cardService.getBalanceById(Number(cardId));

    res.status(200).send(result);
}