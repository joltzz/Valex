import joi from "joi";

const cardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.valid('groceries', 'restaurants', 'transport', 'education', 'health')
});

export  default cardSchema;