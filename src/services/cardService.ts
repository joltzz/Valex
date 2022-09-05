import * as employeeRepository from "../repositories/employeeRepository";
import * as cardRepository from "../repositories/cardRepository";
import * as rechargeRepository from "../repositories/rechargeRepository";
import * as paymentRepository from "../repositories/paymentRepository";

import { TransactionTypes } from "../repositories/cardRepository";
import { CardInsertData } from "../repositories/cardRepository";
import { CardUpdateData } from "../repositories/cardRepository";
import * as verifications from "../utils/verifications";
import { calculateBalance } from "../utils/calculateBalance";

import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export async function createCard(employeeId: number, type: TransactionTypes) {
    //verifica se empregado está cadastrado
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) {
        throw { code: "Not found", message: "empregado não cadastrado" }
    }

    //verifica se empregado já possui cartão deste tipo
    const verifyType = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
    if (verifyType) {
        throw { code: "Conflict", message: "empregado já possui cartão deste tipo" }
    }

    //gera numero do cartão
    const number: string = String(faker.random.numeric(16));

    //gera nome no cartão
    const fullName = employee.fullName;
    const names = fullName.split(" ");
    let cardholderName = "";
    for (let i = 0; i < names.length; i++) {
        if (i === 0) {
            cardholderName += names[i].toUpperCase() + " ";
        } else if (i === names.length - 1) {
            cardholderName += names[i].toUpperCase();
        } else if (names[i].length < 3) {
            continue;
        } else {
            cardholderName += names[i][0].toUpperCase() + " ";
        }
    }

    //gera data de expiração
    const expirationDate = dayjs().add(5, "year").format("MM/YY");

    //gera CVC
    const securityCode: string = String(faker.random.numeric(3));
    const secretKey = process.env.SECRET_KEY || "secret";
    const cryptr = new Cryptr(secretKey);
    const encryptedSecurityCode = cryptr.encrypt(securityCode);

    //cria cartão
    const cardData: CardInsertData = {
        employeeId,
        number,
        cardholderName,
        securityCode: encryptedSecurityCode,
        expirationDate,
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: false,
        type,
    };

    await cardRepository.insert(cardData);
}

export async function activeCard(cardId: number, CVC: string, password: string) {
    const card = await cardRepository.findById(cardId);

    //verifica se cartão está cadastrado
    await verifications.verifyCardRegistration(cardId);

    //verifica se cartão já está expirado
    verifications.verifyExpiredCard(card.expirationDate);

    //verifica se cartão já está ativado
    if (card.password) {
        throw { code: "Conflict", message: "cartão já ativado" }
    }

    //verifica CVC
    const secretKey = process.env.SECRET_KEY || "secret"
    const cryptr = new Cryptr(secretKey);
    const decryptedSecurityCode = cryptr.decrypt(card.securityCode);
    console.log(decryptedSecurityCode);
    if (decryptedSecurityCode !== CVC) {
        throw { code: "Unauthorized", message: "CVC incorreto" }
    }

    //criptografa senha
    const SALT = 10;
    const passwordHash = bcrypt.hashSync(password, SALT);

    //ativa cartão
    const cardData: CardUpdateData = {
        password: passwordHash
    }

    await cardRepository.update(cardId, cardData);
}

export async function blockCard(cardId: number, password: string) {
    const card = await cardRepository.findById(cardId);

    //verifica se cartão está cadastrado
    await verifications.verifyCardRegistration(cardId);

    //verifica senha
    await verifications.verifyPassword(cardId, password);

    //verifica se cartão já está expirado
    verifications.verifyExpiredCard(card.expirationDate);

    //verifica se cartão está bloqueado
    await verifications.verifyCardIsBlocked(cardId);

    //bloqueia cartão
    const cardData: CardUpdateData = {
        isBlocked: true
    }

    await cardRepository.update(cardId, cardData);
}

export async function unblockCard(cardId: number, password: string) {
    const card = await cardRepository.findById(cardId);

    //verifica se cartão está cadastrado
    await verifications.verifyCardRegistration(cardId);

    //verifica senha
    await verifications.verifyPassword(cardId, password);

    //verifica se cartão já está expirado
    verifications.verifyExpiredCard(card.expirationDate);

    //verifica se cartão está desbloqueado
    if (!card.isBlocked) {
        throw { code: "Conflict", message: "cartão já desbloqueado" }
    }

    //desbloqueia cartão
    const cardData: CardUpdateData = {
        isBlocked: false
    }

    await cardRepository.update(cardId, cardData);
}

export async function getBalanceById(cardId: number) {
    const card = await cardRepository.findById(cardId);

    //verifica se cartão está cadastrado
    await verifications.verifyCardRegistration(cardId);

    //calcula saldo
    const balance = await calculateBalance(cardId);
    console.log(balance);

    //pega transações
    const transactions = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);

    //envia objeto
    return {
        balance,
        transactions,
        recharges
    }
}