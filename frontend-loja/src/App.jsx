import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";

import Home from "./pages/Home.jsx";
import Produtos from "./pages/Produtos.jsx";
import Categorias from "./pages/Categorias.jsx";
import Marcas from "./pages/Marcas.jsx";
import Pedidos from "./pages/Pedidos.jsx";
import Clientes from "./pages/Clientes.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/marcas" element={<Marcas />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
