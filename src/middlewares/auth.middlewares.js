import { newUserSchema, newLoginSchema } from "../schemas/auth.schemas.js";
import connection from "../config/database.connection.js";
import bcrypt from 'bcrypt';

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
export async function validateSignIn(req, res, next) {
  const user = req.body;
  console.log(user)
  try {
    const { error } = newLoginSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(422).send(errors);
    }
    const existingCustomer = await connection.query(`SELECT * FROM users WHERE email=$1`, [user.email]);

    if (existingCustomer.rows.length === 0) {
      return res.status(409).send("Realize seu cadastro");
    }
    const checkPassword = bcrypt.compareSync(user.password, existingCustomer.rows[0].password);

    if (checkPassword === false) {
      return res.status(401).send("Este usuário não está autorizado a fazer login");
    };
    res.locals.user = existingCustomer;
  } catch (err) {
    res.status(500).send(err.message);
    return;
  }
  next();
};