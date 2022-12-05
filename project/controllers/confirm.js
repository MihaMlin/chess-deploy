import { connection } from "../database.js";

export const confirmEmail = (req, res) => {
    const { email_token } = req.params;

    connection.query(`SELECT * FROM chess_user WHERE token = '${email_token}'`, (err, result, fields) => {
        if (err) throw err;

        if (result && result.length == 0) {
            res.send("ERROR: No such token found in the database.");
            return;
        }

        res.send("Email successfully confirmed! You can now login.");
    });

    connection.query(`UPDATE chess_user SET email_verified = 1 WHERE token = '${email_token}'`, (err, result, fields) => {
        if (err) throw err;
    });

    connection.query(`UPDATE chess_user SET token = NULL WHERE token = '${email_token}'`, (err, result, fields) => {
        if (err) throw err;
    });
};