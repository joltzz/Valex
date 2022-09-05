import { Request, Response } from "express";
import * as companieService from "../services/companieService";
import * as rechargeService from "../services/rechargeService";

export async function rechargeCard(req: Request, res: Response) {
    const apiKey = String(req.headers["x-api-key"]);
    const { cardId, amount } =  req.body;

    await companieService.validateApiKey(apiKey);
    await rechargeService.rechargeCard(cardId, amount);

    res.status(200).send("cartão carregado com sucesso");
}