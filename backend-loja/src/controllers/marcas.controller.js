import { pool } from "../db.js";

/**
 * Tabela: marcas
 * colunas: id, nome (UNIQUE), criado_em
 */

// GET /api/marcas
export async function listarMarcas(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, nome, criado_em
         FROM marcas
         ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar marcas" });
  }
}

// GET /api/marcas/:id
export async function obterMarca(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, nome, criado_em
         FROM marcas
        WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Marca não encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter marca" });
  }
}

// POST /api/marcas
export async function criarMarca(req, res) {
  try {
    const { nome } = req.body;

    if (!nome || String(nome).trim() === "") {
      return res.status(400).json({ message: "Campo 'nome' é obrigatório" });
    }

    const [result] = await pool.query(
      `INSERT INTO marcas (nome) VALUES (?)`,
      [nome.trim()]
    );

    const [rows] = await pool.query(
      `SELECT id, nome, criado_em
         FROM marcas WHERE id = ?`,
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Já existe uma marca com esse nome" });
    }
    console.error(err);
    res.status(500).json({ message: "Erro ao criar marca" });
  }
}

// PUT /api/marcas/:id
export async function atualizarMarca(req, res) {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const [existe] = await pool.query(`SELECT id FROM marcas WHERE id = ?`, [id]);
    if (existe.length === 0) {
      return res.status(404).json({ message: "Marca não encontrada" });
    }

    const [result] = await pool.query(
      `UPDATE marcas
          SET nome = COALESCE(?, nome)
        WHERE id = ?`,
      [nome ?? null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Nada para atualizar" });
    }

    const [rows] = await pool.query(
      `SELECT id, nome, criado_em
         FROM marcas WHERE id = ?`,
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Já existe uma marca com esse nome" });
    }
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar marca" });
  }
}

// DELETE /api/marcas/:id
export async function deletarMarca(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM marcas WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Marca não encontrada" });
    }
    res.json({ message: "Marca removida com sucesso" });
  } catch (err) {
    console.error(err);
    if (err?.errno === 1451) {
      return res.status(409).json({ message: "Marca vinculada a produtos. Remova/atualize os produtos primeiro." });
    }
    res.status(500).json({ message: "Erro ao deletar marca" });
  }
}
