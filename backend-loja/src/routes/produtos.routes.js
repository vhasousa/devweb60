// src/routes/produtos.routes.js
import { Router } from "express";
import {
  listarProdutos,
  obterProduto,
  criarProduto,
  atualizarProduto,
  excluirProduto
} from "../controllers/produtos.controller.js";

const router = Router();

// lista com paginação/filtros/ordenação
router.get("/", listarProdutos);

// CRUD básico
router.get("/:id", obterProduto);
router.post("/", criarProduto);
router.put("/:id", atualizarProduto);
router.delete("/:id", excluirProduto);

export default router;
