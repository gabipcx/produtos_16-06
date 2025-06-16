// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que o diretório de uploads/produtos exista
const uploadDir = path.join(__dirname, '../../uploads/produtos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para armazenamento em disco
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Diretório onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        // Renomeia o arquivo para evitar colisões e mantém a extensão original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro de arquivos para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por arquivo
});

// Rotas CRUD para produtos
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', upload.single('imagemProduto'), productController.createProduct);
router.put('/:id', upload.single('imagemProduto'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;