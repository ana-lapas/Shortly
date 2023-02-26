import connection from "../config/database.connection.js";

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    try {
        const existingToken = await connection.query(`SELECT * FROM sessions WHERE token=$1`, [token]);
        if (existingToken.rows.length === 0) {
            return res.sendStatus(401);
        }
        res.locals.user = existingToken.rows[0];
        console.log(existingToken.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
        return;
    }
    next();
};

export async function validateId(req, res, next) {
    const { id } = req.params;
    try {
        const existingId = await connection.query(`SELECT * FROM urls WHERE id=$1`, [id]);
        if (existingId.rows.length === 0) {
            return res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err.message);
        return;
    }
    next();
};

export async function validateShortLink(req, res, next) {
    const { shortUrl } = req.params;
    try {
        const existingSUrl = await connection.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [shortUrl]);
        if (existingSUrl.rows.length === 0) {
            return res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err.message);
        return;
    }
    next();
};

export async function validateIdAndUser(req, res, next) {
    const { id } = req.params;
    const user = res.locals.user;
    try {
        const existingId = await connection.query(`SELECT * FROM urls WHERE "id"=$1`, [id]);
        if (existingId.rows.length === 0) {
            return res.sendStatus(404);
        }
        if (existingId.rows[0].userId != user.userId) {
            return res.sendStatus(401);
        }
    } catch (err) {
        res.status(500).send(err.message);
        return;
    }
    next();
};