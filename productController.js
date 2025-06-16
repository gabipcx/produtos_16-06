const { pool } = require('../config/db');
const path = require('path');
const fs = require('fs');

// GET /api/products - Lista todos os produtos
exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM produtos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
};

// GET /api/products/:id - Busca um produto pelo ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
};

// POST /api/products - Cria um novo produto
exports.createProduct = async (req, res) => {
    const { nomeProduto, precoProduto, descricaoProduto } = req.body;
    const imagemProduto = req.file ? `/uploads/produtos/${req.file.filename}` : null;

    if (!nomeProduto || !precoProduto) {
        return res.status(400).json({ error: 'Nome e preço do produto são obrigatórios' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO produtos (nomeProduto, precoProduto, descricaoProduto, imagemProduto) VALUES (?, ?, ?, ?)',
            [nomeProduto, precoProduto, descricaoProduto, imagemProduto]
        );
        res.status(201).json({ id: result.insertId, nomeProduto, precoProduto, descricaoProduto, imagemProduto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};
// PUT /api/products/:id - Atualiza um produto
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { nomeProduto, precoProduto, descricaoProduto } = req.body;
    const imagemProduto = req.file ? `/uploads/produtos/${req.file.filename}` : null;

    try {
        // Busca o produto atual para remover a imagem antiga
        const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const produtoAtual = rows[0];

        // Remove imagem antiga se uma nova for enviada
        if (imagemProduto && produtoAtual.imagemProduto) {
            const caminhoAntigo = path.join(__dirname, '../../', produtoAtual.imagemProduto);
            if (fs.existsSync(caminhoAntigo)) {
                fs.unlinkSync(caminhoAntigo);
            }
        }

        // Atualiza o produto no banco
        const [result] = await pool.query(
            'UPDATE produtos SET nomeProduto = ?, precoProduto = ?, descricaoProduto = ?, imagemProduto = ? WHERE id = ?',
            [
                nomeProduto || produtoAtual.nomeProduto,
                precoProduto || produtoAtual.precoProduto,
                descricaoProduto || produtoAtual.descricaoProduto,
                imagemProduto || produtoAtual.imagemProduto,
                id
            ]
        );

        res.json({ message: 'Produto atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

// DELETE /api/products/:id - Deleta um produto
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        const produto = rows[0];

        // Remove a imagem associada ao produto, se existir
        if (produto.imagemProduto) {
            const caminhoImagem = path.join(__dirname, '../../', produto.imagemProduto);
            if (fs.existsSync(caminhoImagem)) {
                fs.unlinkSync(caminhoImagem);
            }
        }

        await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
        res.json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
};
