import * as rechargeRepository from "../repositories/rechargeRepository";
import * as cardRepository from "../repositories/cardRepository";
import * as verifications from "../utils/verifications";

import { RechargeInsertData } from "../repositories/rechargeRepository";

export async function rechargeCard(cardId: number, amount: number) {
    const card = await cardRepository.findById(cardId);

    //verifica se cartão está cadastrado
    await verifications.verifyCardRegistration(cardId);

    //verifica se cartão não está ativado
    await verifications.verifyCardIsActived(cardId);

    //verifica se cartão já está expirado
    verifications.verifyExpiredCard(card.expirationDate);

    //salva recarga
    const rechargeData: RechargeInsertData = {
        cardId,
        amount
    };

    await rechargeRepository.insert(rechargeData);
}