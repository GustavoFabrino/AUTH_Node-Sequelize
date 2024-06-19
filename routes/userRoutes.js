const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const extraController = require("../controllers/extras");
const { upload } = require("../controllers/multer");
// Definindo as rotas
router.post("/auth/register", userController.createUser);
router.post("/auth/login", userController.loginUser);
router.get("/user/:id", userController.validaToken, userController.tokenuser);
router.get("/", userController.publicRoute);
router.get("/roll", extraController.dice);
router.post("/upload", upload.single("arquivo"), userController.upload);
module.exports = router;

// sfdfsd
