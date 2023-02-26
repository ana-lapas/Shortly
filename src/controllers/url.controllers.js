import connection from "../config/database.connection.js";
import { newURLSchema } from "../schemas/url.schemas.js";
import { nanoid } from 'nanoid'

export async function shorten(req, res) {
    const user = res.locals.user;
    const newURL = req.body;
    const { error } = newURLSchema.validate(newURL, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }
    const shortUrl = nanoid(8);
    try {
        await connection.query(`INSERT INTO urls("url", "shortUrl", "userId") VALUES ($1, $2, $3)`, [newURL.url, shortUrl, user.userId]);
        const checkId = await connection.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [shortUrl]);
        return res.status(201).send({ "id": checkId.rows[0].id, "shortUrl": shortUrl })
    } catch (err) {
        return res.status(500).send(err.message);
    }
}