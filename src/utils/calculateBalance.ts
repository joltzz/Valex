import * as rechargeRepository from "../repositories/rechargeRepository";
import * as paymentRepository from "../repositories/paymentRepository";

export async function calculateBalance(cardId: number) {
    let { totalRecharges } = await rechargeRepository.getTotalRecharges(cardId);
    let { totalPayments } = await paymentRepository.getTotalPayments(cardId);

    const balance = totalRecharges - totalPayments;

    return balance;
}