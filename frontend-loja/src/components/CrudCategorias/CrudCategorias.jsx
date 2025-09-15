import { useEffect, useState } from "react";
import "./CrudCategorias.css";

const API = "http://localhost:4000/api/categorias";

export default function CrudCategorias() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: "",
    descricao: "",
  });

  const emEdicao = form.id !== null;

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    const res = await fetch(API);
    const dados = await res.json();
    setLista(dados || []);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function limparForm() {
    setForm({ id: null, nome: "", descricao: "" });
  }

  async function criarCategoria() {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        descricao: form.descricao,
      }),
    });

    // algumas APIs retornam {id: X}; outras retornam o objeto completo
    const novo = await res.json();

    // se sua API retornar só {id}, podemos recarregar a lista
    if (!novo || !novo.id) {
      await carregarCategorias();
    } else {
      // insere na lista local para sensação de velocidade
      setLista((antiga) => [novo, ...antiga]);
    }

    limparForm();
  }

  async function atualizarCategoria() {
    const res = await fetch(`${API}/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: form.nome,
        descricao: form.descricao,
      }),
    });

    const atualizado = await res.json();

    // se a API não devolver o objeto completo, recarregue a lista
    if (!atualizado || !atualizado.id) {
      await carregarCategorias();
    } else {
      setLista((itens) =>
        itens.map((c) => (c.id === atualizado.id ? atualizado : c))
      );
    }
    limparForm();
  }

  async function removerCategoria(id) {
    const confirmar = window.confirm("Tem certeza que deseja remover esta categoria?");
    if (!confirmar) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    setLista((itens) => itens.filter((c) => c.id !== id));
  }

  function iniciarEdicao(cat) {
    setForm(cat);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.nome.trim()) {
      alert("Nome é obrigatório.");
      return;
    }
    if (emEdicao) atualizarCategoria();
    else criarCategoria();
  }

  return (
    <div className="card crud">
      <h2 className="crud__title">Gestão de Categorias</h2>
      <p className="crud__subtitle">CRUD simples de Categorias consumindo API.</p>

      {/* FORMULÁRIO */}
      <form onSubmit={onSubmit} className="crud__form">
        <div className="form-row">
          <div className="form-field">
            <label className="label">Nome *</label>
            <input
              className="input"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex.: Monitores"
            />
          </div>

          <div className="form-field">
            <label className="label">Descrição</label>
            <input
              className="input"
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Opcional"
            />
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary">
            {emEdicao ? "Atualizar" : "Adicionar"}
          </button>
          <button type="button" onClick={limparForm} className="btn btn-ghost">
            Limpar
          </button>
        </div>
      </form>

      {/* LISTA */}
      <table className="table">
        <thead>
          <tr>
            <th className="th">Nome</th>
            <th className="th">Descrição</th>
            <th className="th">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td className="td" colSpan={3}>— Nenhuma categoria cadastrada —</td>
            </tr>
          ) : (
            lista.map((c) => (
              <tr key={c.id}>
                <td className="td">{c.nome}</td>
                <td className="td">{c.descricao || "—"}</td>
                <td className="td">
                  <div className="row-actions">
                    <button className="btn btn-small" onClick={() => iniciarEdicao(c)}>Editar</button>
                    <button className="btn btn-small" onClick={() => removerCategoria(c.id)}>Remover</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
