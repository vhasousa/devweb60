import { Router } from "express";
import {
  listarCategorias,
  obterCategoria,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria,
} from "../controllers/categorias.controller.js";

const router = Router();

// /api/categorias
router.get("/", listarCategorias);
router.get("/:id", obterCategoria);
router.post("/", criarCategoria);
router.put("/:id", atualizarCategoria);
router.delete("/:id", deletarCategoria);

export default router;
