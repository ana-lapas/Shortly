import bcrypt from "bcrypt";
import { v4 as v4uuid } from "uuid";
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

export async function signIn(req, res) {
    const user = res.locals.user;
    const token = v4uuid();
    try {
        await connection.query(`INSERT INTO sessions("userId",token) VALUES ($1,$2)`, [user.rows[0].id, token]);
        return res.status(200).send({ token });
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

export async function getMe(req, res) {
    const { id, userId } = res.locals.user;
    try {
        const getById = await connection.query(`SELECT * FROM users JOIN urls ON users.id="urls"."userId" WHERE users.id=$1`, [userId]);
        const viewd = await connection.query(`SELECT * FROM urls WHERE "userId"=$1`, [userId]);
        const finalME = viewd.rows.map((me) => {
            return {
                "id": me.id,
                "shortUrl": me.shortUrl,
                "url": me.url,
                "visitCount": me.views
            }
        });
        const tryviews = viewd.rows;
        let allVisits = 0;
        if (finalME.length > 0) {
            for (let index = 0; index < finalME.length; index++) {
                allVisits += finalME[index].visitCount;
            }
        };

        return res.status(200).send({
            "id": id,
            "name": getById.rows[0].name,
            "visitCount": allVisits,
            "shortenedUrls": finalME
        });
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function getRanking(req, res) {
    try {
        const {rows} = await connection.query(`SELECT 
            users.id, users.name, COUNT (urls.id) AS "linksCount", COALESCE(SUM(urls.views), 0) AS "visitCount" FROM users
            LEFT JOIN urls ON users.id="urls"."userId" GROUP BY users.id ORDER BY "visitCount" DESC LIMIT 10`);
        return res.status(200).send(rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};