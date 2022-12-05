import { createConnection } from 'mysql';

export var connection = createConnection({
    host: "localhost",
    user: "root",
    //password: "root",
    database: "chess_RPO_2022"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the Database")
});