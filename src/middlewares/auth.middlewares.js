import { newUserSchema } from "../schemas/auth.schemas.js";
import connection from "../config/database.connection.js";

export async function validateSignUp(req, res, next) {
  const user = req.body;
  const { email } = req.body;
  try {
    const { error } = newUserSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(422).send(errors);
    }
    const existingCustomer = await connection.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (existingCustomer.rows.length > 0) {
      return res.status(409).send("Cliente já cadastrado");
    }
  } catch (err) {
    res.status(500).send(err.message);
    return;
  }
  res.locals.user = user;
  next();
};