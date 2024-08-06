const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("Conectado ao banco de dados MySQL");
    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1);
  }
}

const dbConnection = connectToDatabase();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  req.dbConnection = await dbConnection;
  next();
});

const routes = require("../routes/index");
app.use(routes);

app.listen(PORT, () => console.log(`Servidor rodando na porta: ${PORT}`));
