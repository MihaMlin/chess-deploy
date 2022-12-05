import bcrypt, { hash } from 'bcrypt';
import { send_confirm_email, create_token } from '../mail.js';
import { connection } from "../database.js";

export const getUsers = (req, res) => {
    connection.query("SELECT * FROM chess_user", (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
};

export const createUser = async (req, res) => {
    const user = req.body;
    console.log(user);
    var token = create_token()

    // generiramo hash password
    const salt = await bcrypt.genSalt(); //default value 10
    const hashedPassword = await bcrypt.hash(user.password, salt); // salt se shrani v password

    // shranimo userja v database
    var sql = `INSERT INTO chess_user (first_name, last_name, username, email, user_password, token) VALUES ('${user.first_name}','${user.last_name}','${user.username}','${user.email}','${hashedPassword}','${token}');`

    send_confirm_email(user.email, user.username, token);

    connection.query(sql, (err, result) => {
        if (err) {
            res.send(`ERROR: ${err["sqlMessage"]}`);
            console.log(`ERROR: ${err["sqlMessage"]}`);
            return;
        }

        res.send(result);
    });
};

export const getUser =(req, res) => {
    const { id } = req.params;
    connection.query(`SELECT * FROM chess_user WHERE id = '${id}'`, (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
};

export const deleteUser =(req, res) => {
    const { id } = req.params;
    connection.query(`DELETE FROM chess_user WHERE id = '${id}'`, (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
};

export const updateUser = (req, res) => { // spremenimo le ime in priimek hkrati
    const { id } = req.params;
    const { first_name, last_name, username, email, user_password, rating } = req.body;
    if (first_name && last_name) {
        connection.query(`UPDATE chess_user SET first_name = '${first_name}', last_name = '${last_name}' WHERE id = '${id}'`, (err, result, fields) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
        });
    }
};
