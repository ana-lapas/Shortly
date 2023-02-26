import bcrypt from 'bcrypt';
import { v4 as v4uuid } from 'uuid';
import connection from "../config/database.connection.js";

export async function signUp(req, res) {
    const { name, email, password } = res.locals.user;
    const hashPassWord = bcrypt.hashSync(password, 10);

    try {
        await connection.query(`INSERT INTO users(name,email,password) VALUES ($1,$2,$3)`, [name, email, hashPassWord]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};
