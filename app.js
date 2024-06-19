require("dotenv").config();
const sequelize = require("./config/bancodedados");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
/* const bodyParser = require("body-parser"); */ // ate o momento não foi nescessario usar

const app = express();

// CORS
app.use(cors());

// Middleware para analisar o corpo das requisições
/* app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); */

//Leitura de Json
app.use(express.json());
//sincoronização do banco de dados

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Banco de Dados sincronizado");
  })
  .catch((err) => {
    console.error("Banco de dados com error:", err);
  });

//ROTAS
app.post("/auth/register", userRoutes);
app.post("/auth/login", userRoutes);
app.get("/", userRoutes);
app.get("/user/:id", userRoutes);
app.get("/roll", userRoutes);
app.post("/upload", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
});
