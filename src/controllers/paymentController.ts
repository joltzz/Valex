import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";

export async function payment(req: Request, res: Response) {
    const { cardId, password, businessId, amount } =  req.body;

    await paymentService.payment(cardId, password, businessId, amount);

    res.status(200).send("compra realizada com sucesso");
}