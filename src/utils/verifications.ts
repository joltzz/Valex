import * as cardRepository from "../repositories/cardRepository";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

export function verifyExpiredCard(expirationDate: string) {
    const now = dayjs().format("MM/YY");
    const monthNow: number = Number(now.split("/")[0]);
    const yearNow: number = Number(now.split("/")[1]);
    const monthExpiration: number = Number(expirationDate.split("/")[0]);
    const yearExpiration: number = Number(expirationDate.split("/")[1]);

    const expiredCard = yearNow > yearExpiration || yearNow === yearExpiration && monthNow > monthExpiration

    if (expiredCard) {
        throw { code: "Bad request", message: "cartão expirado" }
    }
}

export async function verifyCardRegistration(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if (!card) {
        throw { code: "Not found", message: "cartão não cadastrado" }
    }
}

export async function verifyCardIsActived(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if (!card.password) {
        throw { code: "Bad request", message: "cartão não está ativado ainda" }
    }
}

export async function verifyCardIsBlocked(cardId: number) {
    const card = await cardRepository.findById(cardId);
    if (card.isBlocked) {
        throw { code: "Conflict", message: "cartão está bloqueado" }
    }
}

export async function verifyPassword(cardId: number, password: string) {
    const card = await cardRepository.findById(cardId);

    //verifica se cartão não está ativado
    if (!card.password) {
        throw { code: "Bad request", message: "cartão não está ativado ainda" }
    }

    //verifica senha
    const correctPassword = bcrypt.compareSync(password, card.password);
    if(!correctPassword) {
        throw { code: "Unauthorized", message: "senha incorreta" }
    }
}