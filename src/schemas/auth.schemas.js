import joi from "joi";

export const newUserSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().min(13).required(),
    password: joi.string().min(4).required(),
    confirmPassword: joi.any().valid(joi.ref('password')).required()
});