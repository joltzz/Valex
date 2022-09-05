import * as companyRepository from "../repositories/companyRepository";

export async function validateApiKey(apiKey: string) {
    //verifica se chave api pertence a alguma empresa
    const company = await companyRepository.findByApiKey(apiKey);
    if(!company) {
        throw { code: "Unauthorized", message: "chave API inválida" }
    }
}