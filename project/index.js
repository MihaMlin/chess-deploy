import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'

import usersRoutes from './routes/users.js';
import confirmRoute from './routes/confirm.js';
import loginRoute from './routes/login.js';

const app = express(); //celotna aplikacija v app
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ["http://localhost:4200"],
    method: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json());

app.use('/users', usersRoutes);

app.use("/login", loginRoute);

app.use("/confirm", confirmRoute);

app.get('/', (req, res) => res.send('Hello from homepage'));

app.use(express.static(__dirname+'/dist/chess-ang'));
app.get('/', (req, res) => res.sendFile(__dirname+'/dist/chess-ang/index.html'));

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
