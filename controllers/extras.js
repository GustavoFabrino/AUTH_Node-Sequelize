const fs = require("fs");
const path = require("path");

// funçoes

// Função para rolar um dado com um determinado número de faces
function rollDie(faces) {
  return Math.floor(Math.random() * faces) + 1;
}

// Função para rolar múltiplos dados
function rollDice(numberOfDice, faces) {
  const results = [];
  for (let i = 0; i < numberOfDice; i++) {
    results.push(rollDie(faces));
  }
  return results;
}

// ROTA PARA ROLAR DADOS

exports.dice = (req, res) => {
  const numberOfDice = parseInt(req.query.numberOfDice, 10);
  const faces = parseInt(req.query.faces, 10);

  if (isNaN(numberOfDice) || isNaN(faces)) {
    res
      .status(400)
      .send(
        "Por favor, forneça o número de dados e o número de faces como parâmetros de consulta. Exemplo: /roll?numberOfDice=3&faces=6"
      );
    return;
  }

  const results = rollDice(numberOfDice, faces);
  res.json({ results });
};
