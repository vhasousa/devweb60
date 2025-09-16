import { Router } from "express";
import {
  listarMarcas,
  obterMarca,
  criarMarca,
  atualizarMarca,
  deletarMarca,
} from "../controllers/marcas.controller.js";

const router = Router();

// /api/marcas
router.get("/", listarMarcas);
router.get("/:id", obterMarca);
router.post("/", criarMarca);
router.put("/:id", atualizarMarca);
router.delete("/:id", deletarMarca);

export default router;
