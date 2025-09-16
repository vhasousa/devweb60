import { pool } from "../db.js";

/**
 * Tabela: categorias
 * colunas: id, nome (UNIQUE), descricao, criado_em
 */

// GET /api/categorias
export async function listarCategorias(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, nome, descricao, criado_em
         FROM categorias
         ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar categorias" });
  }
}

// GET /api/categorias/:id
export async function obterCategoria(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, nome, descricao, criado_em
         FROM categorias
        WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter categoria" });
  }
}

// POST /api/categorias
export async function criarCategoria(req, res) {
  try {
    const { nome, descricao } = req.body;

    if (!nome || String(nome).trim() === "") {
      return res.status(400).json({ message: "Campo 'nome' é obrigatório" });
    }

    const [result] = await pool.query(
      `INSERT INTO categorias (nome, descricao) VALUES (?, ?)`,
      [nome.trim(), descricao ?? null]
    );

    const [rows] = await pool.query(
      `SELECT id, nome, descricao, criado_em
         FROM categorias WHERE id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Já existe uma categoria com esse nome" });
    }
    console.error(err);
    res.status(500).json({ message: "Erro ao criar categoria" });
  }
}

// PUT /api/categorias/:id
export async function atualizarCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    // garante que existe
    const [existe] = await pool.query(`SELECT id FROM categorias WHERE id = ?`, [id]);
    if (existe.length === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    const [result] = await pool.query(
      `UPDATE categorias
          SET nome = COALESCE(?, nome),
              descricao = COALESCE(?, descricao)
        WHERE id = ?`,
      [nome ?? null, descricao ?? null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Nada para atualizar" });
    }

    const [rows] = await pool.query(
      `SELECT id, nome, descricao, criado_em
         FROM categorias WHERE id = ?`,
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Já existe uma categoria com esse nome" });
    }
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar categoria" });
  }
}

// DELETE /api/categorias/:id
export async function deletarCategoria(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM categorias WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json({ message: "Categoria removida com sucesso" });
  } catch (err) {
    console.error(err);
    // Se houver FK em produtos -> categoria_id, o MySQL pode gerar ER_ROW_IS_REFERENCED_... (1451)
    if (err?.errno === 1451) {
      return res.status(409).json({ message: "Categoria vinculada a produtos. Remova/atualize os produtos primeiro." });
    }
    res.status(500).json({ message: "Erro ao deletar categoria" });
  }
}
