import joi from "joi";

const activeSchema = joi.object({
    cardId: joi.number().required(),
    CVC: joi.string().required(),
    password: joi.string().length(4).required()
});

export default activeSchema;