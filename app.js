require("dotenv").config();
const sequelize = require("./config/bancodedados");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");

const app = express();

// CORS
app.use(cors());

//Leitura de Json
app.use(express.json());
// Teste de sincoronização do banco de dados

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

app.listen(process.env.PORT);
