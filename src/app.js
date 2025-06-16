require('dotenv').config(); // Carrega as variáveis de ambiente do .env
const express = require('express');
const path = require('path');
const { connectDB } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const app = express();
const PORT = process.env.PORT;

// Conecta ao banco de dados
connectDB();

// Middleware para parsear JSON e URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta 'uploads' (para as imagens)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve arquivos estáticos da pasta 'public' (para o frontend simples)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API de produtos
app.use('/api/products', productRoutes);

// Rota padrão para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota padrão para servir o frontend (agora é sua loja!)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/site', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Frontend disponível em http://localhost:${PORT}/site`);
    console.log(`API de produtos em http://localhost:${PORT}/api/products`);
});