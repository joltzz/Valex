import * as paymentRepository from "../repositories/paymentRepository";
import * as cardRepository from "../repositories/cardRepository";
import * as businessRepository from "../repositories/businessRepository";
import * as verifications from "../utils/verifications";
import { calculateBalance } from "../utils/calculateBalance";

import { PaymentInsertData } from "../repositories/paymentRepository";

export async function payment(cardId: number, password: string, businessId: number, amount: number) {
    const card = await cardRepository.findById(cardId);

    //verifica se cartão está cadastrado
    await verifications.verifyCardRegistration(cardId);

    //verifica se cartão não está ativado
    await verifications.verifyCardIsActived(cardId);

    //verifica se cartão já está expirado
    verifications.verifyExpiredCard(card.expirationDate);

    //verifica se cartão está bloqueado
    await verifications.verifyCardIsBlocked(cardId);

    //verifica senha
    await verifications.verifyPassword(cardId, password)

    //verifica se estabelecimento está cadastrado
    const business = await businessRepository.findById(businessId);
    if (!business) {
        throw { code: "Not found", message: "estabelecimento não cadastrado" }
    }

    //verifica se tipos são compatíveis
    if (business.type !== card.type) {
        throw { code: "Bad request", message: "estabelecimento não compatível com o tipo de cartão" }
    }

    //verifica se saldo é suficiente para cobrir o montante da compra
    const balance = await calculateBalance(cardId);
    if (balance < amount) {
        throw { code: "Bad request", message: "saldo insuficiente" }
    }

    //salva compra
    const paymentData: PaymentInsertData = {
        cardId,
        businessId,
        amount
    };

    await paymentRepository.insert(paymentData);
}