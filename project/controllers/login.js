import bcrypt from 'bcrypt';
import { connection } from "../database.js";

export const userLogin = (req, res) => {
    const { username, password } = req.body;

    connection.query(`SELECT * FROM chess_user WHERE username = '${username}'`, (err, result_sql, fields) => {
        if (result_sql && result_sql.length == 0) {
            res.send("ERROR: User not found");
            return;
        }

        if (err) throw err;

        bcrypt.compare(password, result_sql[0]["user_password"], function(err, result_bcrypt) {
            if (result_bcrypt) {
                if (result_sql[0]["email_verified"] == 0) {
                    res.send("ERROR: Email not verified")
                    return;
                }

                res.send("OK");
            } else {
                res.send("ERROR: Wrong password!");
            }
        });
    });
};