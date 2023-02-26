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
        await connection.query(`INSERT INTO urls("url", "shortUrl", "userId") 
        VALUES ($1, $2, $3)`,
            [newURL.url, shortUrl, user.userId]);
        const checkId = await connection.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [shortUrl]);
        return res.status(201).send({ "id": checkId.rows[0].id, "shortUrl": shortUrl })
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function getShorten(req, res) {
    const { id } = req.params;
    try {
        const getById = await connection.query(`SELECT * FROM urls WHERE id=$1`, [id]);
        return res.status(200).send({ "id": id, "shortUrl": getById.rows[0].shortUrl, "url": getById.rows[0].url })
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function goShorten(req, res) {
    const { shortUrl } = req.params;
    try {
        const getBySUrl = await connection.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [shortUrl]);
        const updatedViews = getBySUrl.rows[0].views + 1;
        await connection.query(`UPDATE urls SET "views"=$1 WHERE "shortUrl"=$2`, [updatedViews, shortUrl]);
        res.status(302).redirect([getBySUrl.rows[0].url]);
        return;
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function deleteShorten(req, res) {
    const { id } = req.params;
    try {
        await connection.query(`DELETE FROM urls WHERE id=$1`, [id]);
        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};