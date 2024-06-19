require("dotenv").config();
const multer = require("multer");
const path = require("path");

let arquivo;

// Configurar o diretório de armazenamento dos arquivos
exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Diretório onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    // Obtém os valores de id e type dos campos de texto
    const id = req.body.id;
    const type = req.body.type;
    console.log({ id, type });
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    arquivo = `${id}-${type}-${uniqueSuffix}${path.extname(file.originalname)}`; // Construir o nome do arquivo
    cb(null, arquivo);
  },
});

// Criar e exportar a instância do multer com as configurações de armazenamento
exports.upload = multer({ storage: exports.storage });
exports.nomearquivo = () => arquivo;
