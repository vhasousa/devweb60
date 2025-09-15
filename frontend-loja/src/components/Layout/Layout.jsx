import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdDashboard, MdInventory2, MdCategory, MdLocalOffer, MdPeople, MdReceiptLong } from "react-icons/md";
import "./Layout.css";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <div className={`shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="logo">K</span>
          {!collapsed && <span className="brand-text">Painel Kabum</span>}
        </div>

        <nav className="menu">
          <NavLink to="/" end className="link">
            <span className="icon"><MdDashboard /></span>
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <div className="menu-label">{!collapsed && <span>Catálogo</span>}</div>
          <NavLink to="/produtos" className="link">
            <span className="icon"><MdInventory2 /></span>
            {!collapsed && <span>Produtos</span>}
          </NavLink>
          <NavLink to="/categorias" className="link">
            <span className="icon"><MdCategory /></span>
            {!collapsed && <span>Categorias</span>}
          </NavLink>
          <NavLink to="/marcas" className="link">
            <span className="icon"><MdLocalOffer /></span>
            {!collapsed && <span>Marcas</span>}
          </NavLink>

          <div className="menu-label">{!collapsed && <span>Operacional</span>}</div>
          <NavLink to="/pedidos" className="link">
            <span className="icon"><MdReceiptLong /></span>
            {!collapsed && <span>Pedidos</span>}
          </NavLink>
          <NavLink to="/clientes" className="link">
            <span className="icon"><MdPeople /></span>
            {!collapsed && <span>Clientes</span>}
          </NavLink>
        </nav>

        <button
          className="collapse-btn"
          onClick={() => setCollapsed(s => !s)}
          aria-label="Alternar sidebar"
          title="Recolher/Expandir"
        >
          {collapsed ? "»" : "«"}
        </button>
      </aside>

      <div className="main">
        <header className="topbar">
          <h1 className="topbar-title">Admin • Loja</h1>
        </header>
        <main className="content">{children}</main>
        <footer className="footer">
          <small>© {new Date().getFullYear()} Painel Kabum — didático</small>
        </footer>
      </div>
    </div>
  );
}
