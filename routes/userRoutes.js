const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// Definindo as rotas
router.post("/auth/register", userController.createUser);
router.post("/auth/login", userController.loginUser);
router.get("/user/:id", userController.validaToken, userController.tokenuser);
router.get("/", userController.publicRoute);

module.exports = router;

// sfdfsd
