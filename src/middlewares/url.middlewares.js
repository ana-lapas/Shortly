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
    } catch (err) {
        res.status(500).send(err.message);
        return;
    }
    next();
};