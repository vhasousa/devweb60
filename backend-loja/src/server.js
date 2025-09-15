// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import produtosRoutes from "./routes/produtos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import marcasRoutes from "./routes/marcas.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas base para o front
app.use("/api/produtos", produtosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/marcas", marcasRoutes);

// Healthcheck simples
app.get("/", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
