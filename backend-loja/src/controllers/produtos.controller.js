// src/controllers/produtos.controller.js
import pool from "../db.js";

/**
 * GET /api/produtos
 * -> Lista simples (sem paginação, filtros, busca ou ordenação)
 */
export async function listarProdutos(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT
         p.id, p.nome, p.slug, p.preco, p.estoque, p.ativo, p.criado_em,
         c.nome AS categoria, m.nome AS marca
       FROM produtos p
       JOIN categorias c ON c.id = p.categoria_id
       JOIN marcas     m ON m.id = p.marca_id`
    );
    // retorna somente o array
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao listar produtos." });
  }
}

export async function obterProduto(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT p.*, c.nome AS categoria, m.nome AS marca
       FROM produtos p
       JOIN categorias c ON c.id = p.categoria_id
       JOIN marcas     m ON m.id = p.marca_id
       WHERE p.id = :id`,
      { id: Number(id) }
    );
    if (!rows.length) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao obter produto." });
  }
}

export async function criarProduto(req, res) {
  try {
    const { nome, descricao, categoria_id, marca_id, preco, estoque = 0, ativo = 1 } = req.body;

    if (!nome || !categoria_id || !marca_id || preco == null) {
      return res.status(400).json({ erro: "Campos obrigatórios: nome, categoria_id, marca_id, preco." });
    }

    const [result] = await pool.query(
      `INSERT INTO produtos (nome, descricao, categoria_id, marca_id, preco, estoque, ativo)
       VALUES (:nome, :descricao, :categoria_id, :marca_id, :preco, :estoque, :ativo)`,
      { nome, descricao: descricao || null, categoria_id, marca_id, preco, estoque, ativo }
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao criar produto." });
  }
}

export async function atualizarProduto(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, categoria_id, marca_id, preco, estoque, ativo } = req.body;

    const [result] = await pool.query(
      `UPDATE produtos
       SET
         nome = COALESCE(:nome, nome),
         descricao = COALESCE(:descricao, descricao),
         categoria_id = COALESCE(:categoria_id, categoria_id),
         marca_id = COALESCE(:marca_id, marca_id),
         preco = COALESCE(:preco, preco),
         estoque = COALESCE(:estoque, estoque),
         ativo = COALESCE(:ativo, ativo)
       WHERE id = :id`,
      { id: Number(id), nome, descricao, categoria_id, marca_id, preco, estoque, ativo }
    );

    if (result.affectedRows === 0) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao atualizar produto." });
  }
}

export async function excluirProduto(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM produtos WHERE id = :id`, { id: Number(id) });
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Produto não encontrado." });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao excluir produto." });
  }
}
