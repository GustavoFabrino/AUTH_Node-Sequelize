const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { upload, nomearquivo } = require("./multer");
require("dotenv").config();

// Controladora de ROTAS
exports.publicRoute = (req, res) => {
  res.status(200).json({ msg: "bem vindo a API" });
};

exports.createUser = async (req, res) => {
  const { name, email, password, confirmpassword, storage } = req.body;

  // validações
  console.log(req.body); // validar o json do front
  if (!name) {
    return res.status(422).json({ msg: "nome não pode ser nulo" });
  }
  if (!email) {
    return res.status(423).json({ msg: "email não pode ser nulo" });
  }
  if (!password) {
    return res.status(424).json({ msg: "senha não pode ser nulo" });
  }
  if (password !== confirmpassword) {
    return res.status(425).json({ msg: "Senhas não são iguais" });
  }
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    return res.status(426).json({ msg: "Email ja esta em uso" });
  }

  //criando senha
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //criando usuario no banco

  const user = new User({
    name,
    email,
    password: passwordHash,
    max_storage: storage,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "usuario criado com sucesso" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: "Erro ao criar o usuario" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body); // validar o json do front

  if (!email) {
    return res.status(423).json({ msg: "email não pode ser nulo" });
    console.log("email nulo");
  }
  if (!password) {
    return res.status(424).json({ msg: "senha não pode ser nulo" });
    console.log("senha nulo");
  }
  const userlogin = await User.findOne({ where: { email } });
  if (!userlogin) {
    return res.status(427).json({ msg: "Email não está em uso" });
  }
  // validando senha correta
  const valpass = await bcrypt.compare(password, userlogin.password);
  if (!valpass) {
    return res.status(428).json({ msg: "Senha errada" });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: userlogin._id,
      },
      secret
    );
    // remover os campos antes de enviar para o front
    const userResponse = userlogin.toJSON();
    delete userResponse.password;
    delete userResponse.createdAt;
    delete userResponse.updatedAt;
    res.status(201).json({ user: userResponse, token });
    console.log({ user: userResponse, token });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: "Erro no logon", error });
  }
};

exports.validaToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Authorization Header:", authHeader); // Log para verificar o header de autorização
  console.log("Token:", token); // Log para verificar o token extraído

  if (!token) {
    return res.status(401).json({ msg: "sem token" });
  }
  try {
    const secret = process.env.SECRET;
    console.log("Secret:", secret); // Log para verificar o secret usado na verificação

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error("erro da JVM:", err); // Log para verificar o erro de verificação
        return res.status(400).json({ msg: "token invalido" });
      }
      req.user = decoded; // Adiciona as informações do usuário ao objeto de requisição
      next();
    });
  } catch (error) {
    console.error("Error:", error); // Log para verificar qualquer outro erro
    res.status(400).json({ msg: "token invalido" });
  }
};

exports.tokenuser = async (req, res) => {
  const id = req.params.id;

  try {
    /* validar se o usuario existe */
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }, // Excluindo o campo password
    });

    if (!user) {
      return res.status(404).json({ msg: "Usuario não encontrado" });
    }

    res.status(201).json({ user });
  } catch (error) {
    console.error("Error:", error); // Log para verificar qualquer outro erro
    res.status(500).json({ msg: "Erro no servidor", error });
  }
};

exports.upload = (req, res) => {
  const id = req.body.id;
  const type = req.body.type;
  console.log({ id, type });
  if (!id || !type) {
    return res.status(401).json({ error: "Campos id e type são necessários" });
  }
  const arquivoProcessado = nomearquivo();

  try {
    const nomeDaPasta = req.body.idstorage; // Obter o nome da pasta do corpo da solicitação

    const pastaCaminho = path.join(__dirname, "..", "uploads", nomeDaPasta); // Caminho da pasta

    // Verificar se a pasta existe
    if (!fs.existsSync(pastaCaminho)) {
      // Se a pasta não existir, criar a pasta
      fs.mkdirSync(pastaCaminho, { recursive: true });
    }

    // Mover o arquivo para a pasta especificada
    const novoCaminhoArquivo = path.join(pastaCaminho, req.file.filename);
    fs.renameSync(req.file.path, novoCaminhoArquivo);

    res.status(201).json({
      message: "Arquivo enviado com sucesso",
      diretorio: pastaCaminho,
      arquivo: arquivoProcessado,
      fields: {
        id,
        type,
      },
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};
