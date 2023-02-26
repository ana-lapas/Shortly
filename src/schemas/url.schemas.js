import joi from "joi";

export const newURLSchema = joi.object({
    url: joi.string().uri().required()
});