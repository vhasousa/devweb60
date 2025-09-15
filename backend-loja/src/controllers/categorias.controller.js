// src/controllers/categorias.controller.js
import pool from "../db.js";

export async function listarCategorias(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, nome FROM categorias ORDER BY nome COLLATE utf8mb4_0900_ai_ci ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Falha ao listar categorias." });
  }
}
