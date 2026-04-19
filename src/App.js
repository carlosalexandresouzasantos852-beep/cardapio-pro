import { useState, useEffect } from "react";

// ─── CATEGORIAS ──────────────────────────────────────────────────────────────
const CATEGORIAS_BASE = ["Todos", "Lanches", "Combos", "Bebidas", "Sobremesas"];

const PRODUTOS_INICIAIS = [
  { id: 1, categoria: "Lanches", nome: "X-Burguer Clássico", preco: 18.9, descricao: "Pão artesanal, hambúrguer 150g, queijo, alface e tomate", emoji: "🍔", ingredientes: ["Pão brioche", "Hambúrguer 150g", "Queijo cheddar", "Alface americana", "Tomate", "Maionese da casa", "Ketchup"], cor: "#f59e0b" },
  { id: 2, categoria: "Lanches", nome: "X-Bacon Especial", preco: 24.9, descricao: "Pão artesanal, hambúrguer 180g, bacon crocante e queijo duplo", emoji: "🥓", ingredientes: ["Pão brioche", "Hambúrguer 180g", "Bacon crocante", "Queijo cheddar duplo", "Cebola caramelizada", "Molho especial"], cor: "#ef4444" },
  { id: 3, categoria: "Lanches", nome: "Frango Crispy", preco: 21.9, descricao: "Frango empanado crocante, molho mel-mostarda, alface", emoji: "🍗", ingredientes: ["Pão artesanal", "Filé de frango empanado", "Molho mel-mostarda", "Alface", "Tomate", "Picles"], cor: "#f97316" },
  { id: 4, categoria: "Combos", nome: "Combo X-Burguer", preco: 29.9, descricao: "X-Burguer + Fritas médias + Refrigerante 350ml", emoji: "🍟", ingredientes: ["X-Burguer Clássico", "Batata frita média", "Refrigerante 350ml à escolha"], cor: "#8b5cf6" },
  { id: 5, categoria: "Combos", nome: "Combo X-Bacon", preco: 35.9, descricao: "X-Bacon Especial + Fritas grandes + Refrigerante 500ml", emoji: "🎯", ingredientes: ["X-Bacon Especial", "Batata frita grande", "Refrigerante 500ml à escolha"], cor: "#7c3aed" },
  { id: 6, categoria: "Bebidas", nome: "Refrigerante Lata", preco: 6.0, descricao: "Coca-Cola, Guaraná, Sprite ou Fanta 350ml", emoji: "🥤", ingredientes: ["Coca-Cola", "Guaraná Antarctica", "Sprite", "Fanta Laranja"], cor: "#06b6d4" },
  { id: 7, categoria: "Bebidas", nome: "Suco Natural", preco: 9.9, descricao: "Laranja, maracujá ou limão, feito na hora 400ml", emoji: "🍊", ingredientes: ["Fruta fresca", "Água gelada ou leite", "Açúcar a gosto", "400ml"], cor: "#10b981" },
  { id: 8, categoria: "Sobremesas", nome: "Sorvete Caseiro", preco: 8.9, descricao: "Bola dupla de sorvete artesanal com calda", emoji: "🍦", ingredientes: ["Sorvete artesanal (2 bolas)", "Calda de chocolate ou morango", "Granulado"], cor: "#ec4899" },
];

const ADMIN_SENHA = "mara2024";
const CORES_OPCOES = ["#f59e0b","#ef4444","#f97316","#10b981","#06b6d4","#8b5cf6","#7c3aed","#ec4899","#14b8a6","#84cc16"];

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [tela, setTela] = useState("login");
  const [usuario, setUsuario] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoAtual, setPedidoAtual] = useState(null);
  const [adminLogado, setAdminLogado] = useState(false);
  const [produtos, setProdutos] = useState(() => {
    try {
      const salvo = localStorage.getItem("mara_produtos");
      return salvo ? JSON.parse(salvo) : PRODUTOS_INICIAIS;
    } catch { return PRODUTOS_INICIAIS; }
  });

  useEffect(() => {
    try {
      const u = localStorage.getItem("mara_usuario");
      if (u) { setUsuario(JSON.parse(u)); setTela("cardapio"); }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("mara_produtos", JSON.stringify(produtos));
  }, [produtos]);

  const salvarUsuario = (u) => {
    localStorage.setItem("mara_usuario", JSON.stringify(u));
    setUsuario(u);
    setTela("cardapio");
  };

  const adicionarAoCarrinho = (produto) => {
    setCarrinho(prev => {
      const existe = prev.find(i => i.id === produto.id);
      if (existe) return prev.map(i => i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i);
      return [...prev, { ...produto, qtd: 1 }];
    });
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(prev => {
      const item = prev.find(i => i.id === id);
      if (item.qtd === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qtd: i.qtd - 1 } : i);
    });
  };

  const finalizarPedido = (pagamento) => {
    const novoPedido = {
      id: Date.now(), usuario, itens: carrinho,
      total: carrinho.reduce((s, i) => s + i.preco * i.qtd, 0),
      pagamento, status: "aguardando",
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      notificacao: null,
    };
    setPedidos(prev => [novoPedido, ...prev]);
    setPedidoAtual(novoPedido);
    setCarrinho([]);
    setTela("pedido");
  };

  const atualizarStatus = (pedidoId, novoStatus) => {
    setPedidos(prev => prev.map(p => {
      if (p.id !== pedidoId) return p;
      const msg = novoStatus === "preparando"
        ? `🍔 Olá ${p.usuario.nome}! Seu pedido na Mara Lanches está sendo preparado agora! 🔥`
        : `✅ Seu pedido está PRONTO! Em breve chegará até você. Obrigado por escolher a Mara Lanches! 💛`;
      return { ...p, status: novoStatus, notificacao: msg };
    }));
    if (pedidoAtual?.id === pedidoId) setPedidoAtual(prev => ({ ...prev, status: novoStatus }));
  };

  const cancelarPedido = (pedidoId) => {
    setPedidos(prev => prev.map(p => p.id === pedidoId ? { ...p, status: "cancelado" } : p));
  };

  const salvarProduto = (produto) => {
    setProdutos(prev => {
      if (produto.id) return prev.map(p => p.id === produto.id ? produto : p);
      return [...prev, { ...produto, id: Date.now() }];
    });
  };

  const excluirProduto = (id) => setProdutos(prev => prev.filter(p => p.id !== id));

  const totalCarrinho = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  const qtdCarrinho = carrinho.reduce((s, i) => s + i.qtd, 0);
  const pedidoAtualAtualizado = pedidoAtual ? pedidos.find(p => p.id === pedidoAtual.id) : null;

  return (
    <div style={S.app}>
      {tela === "login" && <TelaLogin onLogin={salvarUsuario} />}
      {tela === "cardapio" && (
        <TelaCardapio
          usuario={usuario} carrinho={carrinho} qtdCarrinho={qtdCarrinho} produtos={produtos}
          onAdicionar={adicionarAoCarrinho} onCarrinho={() => setTela("carrinho")}
          onAdmin={() => setTela("admin")} onMeusPedidos={() => setTela("pedido")}
        />
      )}
      {tela === "carrinho" && (
        <TelaCarrinho
          carrinho={carrinho} usuario={usuario} total={totalCarrinho}
          onAdicionar={adicionarAoCarrinho} onRemover={removerDoCarrinho}
          onVoltar={() => setTela("cardapio")} onFinalizar={() => setTela("pagamento")}
        />
      )}
      {tela === "pagamento" && (
        <TelaPagamento total={totalCarrinho} onVoltar={() => setTela("carrinho")} onConfirmar={finalizarPedido} />
      )}
      {tela === "pedido" && (
        <TelaPedido pedido={pedidoAtualAtualizado || pedidoAtual} onVoltar={() => setTela("cardapio")} />
      )}
      {tela === "admin" && (
        <TelaAdmin
          pedidos={pedidos} produtos={produtos} adminLogado={adminLogado}
          onLogin={() => setAdminLogado(true)} onAtualizarStatus={atualizarStatus}
          onCancelar={cancelarPedido} onVoltar={() => setTela("cardapio")}
          onSalvarProduto={salvarProduto} onExcluirProduto={excluirProduto}
        />
      )}
    </div>
  );
}

// ─── TELA LOGIN ───────────────────────────────────────────────────────────────
function TelaLogin({ onLogin }) {
  const [form, setForm] = useState({ nome: "", telefone: "", endereco: "" });
  const [erro, setErro] = useState("");

  const handleSubmit = () => {
    if (!form.nome || !form.telefone || !form.endereco) { setErro("Preencha todos os campos 😊"); return; }
    onLogin(form);
  };

  return (
    <div style={S.loginBg}>
      <div style={S.loginCard}>
        <div style={S.logoCircle}><span style={{ fontSize: 48 }}>🍔</span></div>
        <h1 style={S.loginTitulo}>Mara Lanches</h1>
        <p style={S.loginSub}>Faça seu cadastro para pedir 🛵</p>
        <p style={{ color: "#a78bfa", fontSize: 12, marginBottom: 20, textAlign: "center" }}>Preencha apenas uma vez — seus dados ficam salvos!</p>
        {["nome", "telefone", "endereco"].map(campo => (
          <div key={campo} style={{ width: "100%", marginBottom: 14 }}>
            <label style={S.label}>{campo === "nome" ? "👤 Seu nome" : campo === "telefone" ? "📱 WhatsApp" : "📍 Endereço completo"}</label>
            <input style={S.input} placeholder={campo === "nome" ? "Ex: João Silva" : campo === "telefone" ? "Ex: (11) 99999-9999" : "Rua, número, bairro"} value={form[campo]} onChange={e => setForm(p => ({ ...p, [campo]: e.target.value }))} />
          </div>
        ))}
        {erro && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 10, textAlign: "center" }}>{erro}</p>}
        <button style={S.btnAmarelo} onClick={handleSubmit}>Entrar no Cardápio 🚀</button>
      </div>
    </div>
  );
}

// ─── TELA CARDÁPIO ────────────────────────────────────────────────────────────
function TelaCardapio({ usuario, carrinho, qtdCarrinho, produtos, onAdicionar, onCarrinho, onAdmin, onMeusPedidos }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [virandoId, setVirandoId] = useState(null);
  const [adicionado, setAdicionado] = useState(null);

  const categorias = ["Todos", ...new Set(produtos.map(p => p.categoria))];
  const produtosFiltrados = categoriaAtiva === "Todos" ? produtos : produtos.filter(p => p.categoria === categoriaAtiva);
  const porCategoria = categorias.filter(c => c !== "Todos").reduce((acc, cat) => {
    const itens = produtosFiltrados.filter(p => p.categoria === cat);
    if (itens.length) acc[cat] = itens;
    return acc;
  }, {});

  const handleAdicionar = (produto) => {
    onAdicionar(produto);
    setAdicionado(produto.id);
    setTimeout(() => setAdicionado(null), 800);
  };

  return (
    <div style={S.tela}>
      <div style={S.header}>
        <div style={S.headerLogo}><span style={{ fontSize: 32 }}>🍔</span><div><div style={S.headerNome}>Mara Lanches</div><div style={S.headerSub}>Cardápio Digital</div></div></div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={S.btnIcon} onClick={onMeusPedidos} title="Meus pedidos">📦</button>
          <button style={S.btnIcon} onClick={onAdmin} title="Admin">⚙️</button>
          <button style={{ ...S.btnCarrinho, position: "relative" }} onClick={onCarrinho}>
            🛒{qtdCarrinho > 0 && <span style={S.badge}>{qtdCarrinho}</span>}
          </button>
        </div>
      </div>

      <div style={S.boasVindas}>
        <span style={{ fontSize: 22 }}>👋</span>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>Bem-vindo(a), {usuario?.nome?.split(" ")[0]}!</div>
          <div style={{ color: "#c4b5fd", fontSize: 13 }}>Faça seu pedido — entregamos na sua porta 🛵</div>
        </div>
      </div>

      <div style={S.categorias}>
        {categorias.map(cat => (
          <button key={cat} style={{ ...S.btnCat, ...(categoriaAtiva === cat ? S.btnCatAtivo : {}) }} onClick={() => setCategoriaAtiva(cat)}>{cat}</button>
        ))}
      </div>

      <div style={S.conteudo}>
        {produtos.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
            <div style={{ fontSize: 48 }}>🍽️</div>
            <p>Nenhum produto cadastrado ainda.</p>
            <p style={{ fontSize: 13 }}>Acesse o painel admin ⚙️ para adicionar produtos.</p>
          </div>
        )}
        {categoriaAtiva === "Todos"
          ? Object.entries(porCategoria).map(([cat, itens]) => (
            <div key={cat}>
              <h3 style={S.catTitulo}>{cat}</h3>
              <div style={S.grid}>
                {itens.map(p => <CardProduto key={p.id} produto={p} virado={virandoId === p.id} onVirar={() => setVirandoId(virandoId === p.id ? null : p.id)} adicionado={adicionado === p.id} onAdicionar={() => handleAdicionar(p)} />)}
              </div>
            </div>
          ))
          : <div style={S.grid}>{produtosFiltrados.map(p => <CardProduto key={p.id} produto={p} virado={virandoId === p.id} onVirar={() => setVirandoId(virandoId === p.id ? null : p.id)} adicionado={adicionado === p.id} onAdicionar={() => handleAdicionar(p)} />)}</div>
        }
      </div>

      {qtdCarrinho > 0 && (
        <button style={S.fabCarrinho} onClick={onCarrinho}>
          🛒 Ver carrinho · R$ {carrinho.reduce((s, i) => s + i.preco * i.qtd, 0).toFixed(2).replace(".", ",")}
          <span style={S.fabBadge}>{qtdCarrinho}</span>
        </button>
      )}
    </div>
  );
}

// ─── CARD PRODUTO FLIP ────────────────────────────────────────────────────────
function CardProduto({ produto, virado, onVirar, adicionado, onAdicionar }) {
  return (
    <div style={S.cardWrap}>
      <div style={{ ...S.cardInner, transform: virado ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        <div style={{ ...S.cardFace, ...S.cardFrente }}>
          <div style={{ ...S.cardEmoji, background: (produto.cor || "#f59e0b") + "22", border: `2px solid ${(produto.cor || "#f59e0b")}33` }}>{produto.emoji}</div>
          <div style={S.cardNome}>{produto.nome}</div>
          <div style={S.cardDesc}>{produto.descricao}</div>
          <div style={S.cardPreco}>R$ {Number(produto.preco).toFixed(2).replace(".", ",")}</div>
          <div style={S.cardBotoes}>
            <button style={S.btnInfo} onClick={onVirar}>📋 Ingredientes</button>
            <button style={{ ...S.btnAdd, background: adicionado ? "#10b981" : "#f59e0b" }} onClick={onAdicionar}>{adicionado ? "✓ Adicionado!" : "+ Adicionar"}</button>
          </div>
        </div>
        <div style={{ ...S.cardFace, ...S.cardVerso }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
          <div style={{ fontWeight: 700, color: "#f59e0b", marginBottom: 12, fontSize: 15 }}>Ingredientes</div>
          <ul style={S.listaIngredientes}>
            {(produto.ingredientes || []).map((ing, i) => <li key={i} style={S.ingredienteItem}>✓ {ing}</li>)}
          </ul>
          <button style={S.btnInfo} onClick={onVirar}>← Voltar</button>
        </div>
      </div>
    </div>
  );
}

// ─── TELA CARRINHO ────────────────────────────────────────────────────────────
function TelaCarrinho({ carrinho, usuario, total, onAdicionar, onRemover, onVoltar, onFinalizar }) {
  if (carrinho.length === 0) return (
    <div style={S.tela}>
      <div style={S.header}><button style={S.btnVoltar} onClick={onVoltar}>← Voltar</button><span style={S.headerNome}>Meu Carrinho</span><span /></div>
      <div style={S.vazio}><div style={{ fontSize: 64 }}>🛒</div><p style={{ color: "#6b7280" }}>Seu carrinho está vazio</p><button style={S.btnAmarelo} onClick={onVoltar}>Ver Cardápio</button></div>
    </div>
  );
  return (
    <div style={S.tela}>
      <div style={S.header}><button style={S.btnVoltar} onClick={onVoltar}>← Voltar</button><span style={S.headerNome}>Meu Carrinho 🛒</span><span /></div>
      <div style={S.conteudo}>
        <div style={S.infoCliente}><div style={{ fontSize: 18, marginBottom: 4 }}>📍 Entrega para:</div><div style={{ fontWeight: 700, color: "#1a1a2e" }}>{usuario?.nome}</div><div style={{ color: "#6b7280", fontSize: 13 }}>{usuario?.endereco}</div></div>
        {carrinho.map(item => (
          <div key={item.id} style={S.itemCarrinho}>
            <span style={{ fontSize: 28 }}>{item.emoji}</span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 14 }}>{item.nome}</div><div style={{ color: "#6b7280", fontSize: 12 }}>R$ {Number(item.preco).toFixed(2).replace(".", ",")} cada</div></div>
            <div style={S.qtdControle}><button style={S.btnQtd} onClick={() => onRemover(item.id)}>−</button><span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qtd}</span><button style={S.btnQtd} onClick={() => onAdicionar(item)}>+</button></div>
            <div style={{ fontWeight: 700, color: "#7c3aed", minWidth: 60, textAlign: "right" }}>R$ {(item.preco * item.qtd).toFixed(2).replace(".", ",")}</div>
          </div>
        ))}
        <div style={S.totalBox}><span style={{ color: "#6b7280" }}>Total</span><span style={{ fontWeight: 800, fontSize: 22, color: "#7c3aed" }}>R$ {total.toFixed(2).replace(".", ",")}</span></div>
        <button style={S.btnAmarelo} onClick={onFinalizar}>Finalizar Pedido 🚀</button>
      </div>
    </div>
  );
}

// ─── TELA PAGAMENTO ───────────────────────────────────────────────────────────
function TelaPagamento({ total, onVoltar, onConfirmar }) {
  const [forma, setForma] = useState(null);
  const [troco, setTroco] = useState("");
  return (
    <div style={S.tela}>
      <div style={S.header}><button style={S.btnVoltar} onClick={onVoltar}>← Voltar</button><span style={S.headerNome}>Pagamento 💳</span><span /></div>
      <div style={S.conteudo}>
        <div style={S.totalBox}><span>Total a pagar</span><span style={{ fontWeight: 800, fontSize: 24, color: "#7c3aed" }}>R$ {total.toFixed(2).replace(".", ",")}</span></div>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16, textAlign: "center" }}>Escolha a forma de pagamento:</p>
        <div style={{ ...S.cardPagamento, ...(forma === "pix" ? S.cardPagAtivo : {}) }} onClick={() => setForma("pix")}>
          <span style={{ fontSize: 32 }}>📱</span><div><div style={{ fontWeight: 700, fontSize: 16 }}>PIX</div><div style={{ color: "#6b7280", fontSize: 12 }}>Pagamento instantâneo</div></div>
          {forma === "pix" && <span style={{ marginLeft: "auto", color: "#10b981", fontSize: 20 }}>✓</span>}
        </div>
        <div style={{ ...S.cardPagamento, ...(forma === "dinheiro" ? S.cardPagAtivo : {}) }} onClick={() => setForma("dinheiro")}>
          <span style={{ fontSize: 32 }}>💵</span><div><div style={{ fontWeight: 700, fontSize: 16 }}>Dinheiro na entrega</div><div style={{ color: "#6b7280", fontSize: 12 }}>Pagamento na hora</div></div>
          {forma === "dinheiro" && <span style={{ marginLeft: "auto", color: "#10b981", fontSize: 20 }}>✓</span>}
        </div>
        {forma === "dinheiro" && (
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <label style={S.label}>💰 Troco para quanto? (opcional)</label>
            <input style={S.input} placeholder="Ex: 50,00" value={troco} onChange={e => setTroco(e.target.value)} />
          </div>
        )}
        {forma === "pix" && (
          <div style={S.pixBox}>
            <div style={{ fontSize: 40 }}>📲</div>
            <div style={{ fontWeight: 700, color: "#7c3aed" }}>Chave PIX:</div>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: "#1a1a2e", letterSpacing: 1 }}>(11) 99999-9999</div>
            <div style={{ color: "#6b7280", fontSize: 12, textAlign: "center" }}>Mara Lanches — após pagar, confirme o pedido abaixo</div>
          </div>
        )}
        <button style={{ ...S.btnAmarelo, opacity: forma ? 1 : 0.4 }} disabled={!forma} onClick={() => onConfirmar({ tipo: forma, troco: troco || null })}>Confirmar Pedido ✅</button>
      </div>
    </div>
  );
}

// ─── TELA PEDIDO ──────────────────────────────────────────────────────────────
function TelaPedido({ pedido, onVoltar }) {
  const [virandoInfo, setVirandoInfo] = useState(false);
  if (!pedido) return (
    <div style={S.tela}>
      <div style={S.header}><button style={S.btnVoltar} onClick={onVoltar}>← Voltar</button><span style={S.headerNome}>Meus Pedidos</span><span /></div>
      <div style={S.vazio}><div style={{ fontSize: 64 }}>📦</div><p style={{ color: "#6b7280" }}>Nenhum pedido ainda</p><button style={S.btnAmarelo} onClick={onVoltar}>Fazer Pedido</button></div>
    </div>
  );
  const statusConfig = {
    aguardando: { label: "Aguardando confirmação", emoji: "⏳", cor: "#f59e0b", prog: 25 },
    preparando: { label: "Em preparo 🔥", emoji: "👨‍🍳", cor: "#8b5cf6", prog: 65 },
    pronto: { label: "Pronto! A caminho 🛵", emoji: "✅", cor: "#10b981", prog: 100 },
    cancelado: { label: "Cancelado", emoji: "❌", cor: "#ef4444", prog: 0 },
  };
  const cfg = statusConfig[pedido.status] || statusConfig.aguardando;
  return (
    <div style={S.tela}>
      <div style={S.header}><button style={S.btnVoltar} onClick={onVoltar}>← Voltar</button><div style={S.headerLogo}><span style={{ fontSize: 24 }}>🍔</span><span style={S.headerNome}>Mara Lanches</span></div><span /></div>
      <div style={S.conteudo}>
        <h2 style={{ textAlign: "center", color: "#1a1a2e", marginBottom: 4 }}>📦 Meu Pedido</h2>
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, marginBottom: 20 }}>Pedido #{String(pedido.id).slice(-4)} · {pedido.hora}</p>
        {pedido.notificacao && <div style={S.notificacao}><span>🔔</span> {pedido.notificacao}</div>}
        <div style={{ ...S.statusCard, borderColor: cfg.cor }}>
          <div style={{ fontSize: 40 }}>{cfg.emoji}</div>
          <div style={{ fontWeight: 700, color: cfg.cor, fontSize: 18 }}>{cfg.label}</div>
          <div style={S.progressBar}><div style={{ ...S.progressFill, width: `${cfg.prog}%`, background: cfg.cor }} /></div>
        </div>
        <div style={S.steps}>
          {[{ s: "aguardando", label: "Recebido", emoji: "📥" }, { s: "preparando", label: "Preparando", emoji: "🍳" }, { s: "pronto", label: "A caminho", emoji: "🛵" }].map((step, i) => {
            const ordemAtual = ["aguardando", "preparando", "pronto"].indexOf(pedido.status);
            const ativo = i <= ordemAtual && pedido.status !== "cancelado";
            return (
              <div key={step.s} style={S.step}>
                <div style={{ ...S.stepCircle, background: ativo ? cfg.cor : "#e5e7eb", color: ativo ? "#fff" : "#9ca3af" }}>{step.emoji}</div>
                <div style={{ fontSize: 11, color: ativo ? cfg.cor : "#9ca3af", fontWeight: ativo ? 700 : 400 }}>{step.label}</div>
              </div>
            );
          })}
        </div>
        <div style={S.cardWrap} onClick={() => setVirandoInfo(!virandoInfo)}>
          <div style={{ ...S.cardInner, transform: virandoInfo ? "rotateY(180deg)" : "rotateY(0deg)", minHeight: 120 }}>
            <div style={{ ...S.cardFace, ...S.cardFrente, padding: "16px 20px", borderRadius: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, color: "#7c3aed" }}>📋 Resumo do pedido</div>
              {pedido.itens.map(i => (<div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{i.emoji} {i.nome} x{i.qtd}</span><span style={{ fontWeight: 600 }}>R$ {(i.preco * i.qtd).toFixed(2).replace(".", ",")}</span></div>))}
              <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 800 }}><span>Total</span><span style={{ color: "#7c3aed" }}>R$ {pedido.total.toFixed(2).replace(".", ",")}</span></div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 8 }}>Toque para ver dados de entrega ↩</div>
            </div>
            <div style={{ ...S.cardFace, ...S.cardVerso, padding: "16px 20px", borderRadius: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, color: "#f59e0b" }}>📍 Dados de entrega</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}><b>Nome:</b> {pedido.usuario.nome}</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}><b>WhatsApp:</b> {pedido.usuario.telefone}</div>
              <div style={{ fontSize: 14, marginBottom: 6 }}><b>Endereço:</b> {pedido.usuario.endereco}</div>
              <div style={{ fontSize: 14 }}><b>Pagamento:</b> {pedido.pagamento.tipo === "pix" ? "PIX" : `Dinheiro${pedido.pagamento.troco ? ` (troco p/ R$${pedido.pagamento.troco})` : ""}`}</div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 12 }}>Toque para voltar ↩</div>
            </div>
          </div>
        </div>
        <button style={{ ...S.btnAmarelo, marginTop: 16 }} onClick={onVoltar}>Fazer Novo Pedido 🍔</button>
      </div>
    </div>
  );
}

// ─── TELA ADMIN ───────────────────────────────────────────────────────────────
function TelaAdmin({ pedidos, produtos, adminLogado, onLogin, onAtualizarStatus, onCancelar, onVoltar, onSalvarProduto, onExcluirProduto }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [aba, setAba] = useState("pedidos");

  const handleLogin = () => {
    if (senha === ADMIN_SENHA) onLogin();
    else setErro("Senha incorreta!");
  };

  if (!adminLogado) return (
    <div style={S.tela}>
      <div style={S.header}><button style={S.btnVoltar} onClick={onVoltar}>← Voltar</button><span style={S.headerNome}>⚙️ Admin</span><span /></div>
      <div style={S.vazio}>
        <div style={{ fontSize: 48 }}>🔐</div>
        <h3 style={{ color: "#1a1a2e", marginBottom: 16 }}>Área Administrativa</h3>
        <input type="password" style={{ ...S.input, maxWidth: 280 }} placeholder="Senha de acesso" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        {erro && <p style={{ color: "#ef4444", fontSize: 13 }}>{erro}</p>}
        <button style={S.btnAmarelo} onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  );

  return (
    <div style={S.tela}>
      <div style={S.header}>
        <button style={S.btnVoltar} onClick={onVoltar}>← Voltar</button>
        <div style={S.headerLogo}><span style={{ fontSize: 22 }}>🍔</span><span style={S.headerNome}>Painel Admin</span></div>
        <span />
      </div>
      <div style={{ display: "flex", background: "#1a1a2e", borderBottom: "2px solid #4c1d95" }}>
        {[{ id: "pedidos", label: "📦 Pedidos" }, { id: "produtos", label: "🍽️ Produtos" }].map(a => (
          <button key={a.id} style={{ flex: 1, padding: "12px", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, background: aba === a.id ? "#f59e0b" : "transparent", color: aba === a.id ? "#1a1a2e" : "#9ca3af", transition: "all 0.2s" }} onClick={() => setAba(a.id)}>{a.label}</button>
        ))}
      </div>
      {aba === "pedidos" && <PainelPedidos pedidos={pedidos} onAtualizarStatus={onAtualizarStatus} onCancelar={onCancelar} />}
      {aba === "produtos" && <PainelProdutos produtos={produtos} onSalvar={onSalvarProduto} onExcluir={onExcluirProduto} />}
    </div>
  );
}

// ─── PAINEL PEDIDOS ───────────────────────────────────────────────────────────
function PainelPedidos({ pedidos, onAtualizarStatus, onCancelar }) {
  const grupos = {
    aguardando: pedidos.filter(p => p.status === "aguardando"),
    preparando: pedidos.filter(p => p.status === "preparando"),
    pronto: pedidos.filter(p => p.status === "pronto"),
    cancelado: pedidos.filter(p => p.status === "cancelado"),
  };
  const corStatus = { aguardando: "#f59e0b", preparando: "#8b5cf6", pronto: "#10b981", cancelado: "#ef4444" };
  const labelStatus = { aguardando: "⏳ Aguardando", preparando: "🍳 Preparando", pronto: "✅ Prontos", cancelado: "❌ Cancelados" };
  return (
    <div style={S.conteudo}>
      <div style={S.contadores}>
        {Object.entries(grupos).map(([status, lista]) => (
          <div key={status} style={{ ...S.contador, borderColor: corStatus[status] }}>
            <div style={{ fontWeight: 800, fontSize: 22, color: corStatus[status] }}>{lista.length}</div>
            <div style={{ fontSize: 10, color: "#6b7280" }}>{labelStatus[status]}</div>
          </div>
        ))}
      </div>
      {pedidos.length === 0 && <div style={{ ...S.vazio, flex: "none", paddingTop: 40 }}><div style={{ fontSize: 48 }}>📭</div><p style={{ color: "#6b7280" }}>Nenhum pedido ainda</p></div>}
      {["aguardando", "preparando", "pronto", "cancelado"].map(status => (
        grupos[status].length > 0 && (
          <div key={status}>
            <h3 style={{ color: corStatus[status], marginBottom: 8, marginTop: 20 }}>{labelStatus[status]} ({grupos[status].length})</h3>
            {grupos[status].map(p => <PedidoAdmin key={p.id} pedido={p} onAtualizarStatus={onAtualizarStatus} onCancelar={onCancelar} />)}
          </div>
        )
      ))}
    </div>
  );
}

function PedidoAdmin({ pedido, onAtualizarStatus, onCancelar }) {
  const [expandido, setExpandido] = useState(true);
  const corBorda = { aguardando: "#f59e0b", preparando: "#8b5cf6", pronto: "#10b981", cancelado: "#ef4444" };
  const enviarWhatsApp = (msg) => {
    const tel = pedido.usuario.telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  return (
    <div style={{ ...S.pedidoAdmin, borderLeftColor: corBorda[pedido.status] || "#e5e7eb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpandido(!expandido)}>
        <div><span style={{ fontWeight: 700 }}>#{String(pedido.id).slice(-4)}</span><span style={{ color: "#6b7280", fontSize: 13, marginLeft: 8 }}>· {pedido.usuario.nome}</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 700, color: "#7c3aed" }}>R$ {pedido.total.toFixed(2).replace(".", ",")}</span><span>{expandido ? "▲" : "▼"}</span></div>
      </div>
      {expandido && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>📍 {pedido.usuario.endereco}</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>💳 {pedido.pagamento.tipo === "pix" ? "PIX" : `Dinheiro${pedido.pagamento.troco ? ` (troco p/ R$${pedido.pagamento.troco})` : ""}`}</div>
          {pedido.itens.map(i => <div key={i.id} style={{ fontSize: 13, marginBottom: 2 }}>{i.emoji} {i.nome} x{i.qtd} — R$ {(i.preco * i.qtd).toFixed(2).replace(".", ",")}</div>)}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {pedido.status === "aguardando" && (<>
              <button style={S.btnAção} onClick={() => { onAtualizarStatus(pedido.id, "preparando"); enviarWhatsApp(`🍔 Olá ${pedido.usuario.nome}! Seu pedido na *Mara Lanches* está sendo preparado agora! 🔥`); }}>🍳 Iniciar Preparo + Notificar</button>
              <button style={{ ...S.btnAção, background: "#fee2e2", color: "#ef4444" }} onClick={() => onCancelar(pedido.id)}>❌ Cancelar</button>
            </>)}
            {pedido.status === "preparando" && <button style={{ ...S.btnAção, background: "#d1fae5", color: "#065f46" }} onClick={() => { onAtualizarStatus(pedido.id, "pronto"); enviarWhatsApp(`✅ Olá ${pedido.usuario.nome}! Seu pedido na *Mara Lanches* está PRONTO! 🛵 Obrigado! 💛`); }}>✅ Marcar Pronto + Notificar</button>}
            {(pedido.status === "aguardando" || pedido.status === "preparando") && <button style={{ ...S.btnAção, background: "#ede9fe", color: "#7c3aed" }} onClick={() => enviarWhatsApp(`🍔 *Mara Lanches* — Olá ${pedido.usuario.nome}! Entramos em contato sobre seu pedido #${String(pedido.id).slice(-4)}.`)}>📱 WhatsApp</button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PAINEL PRODUTOS ──────────────────────────────────────────────────────────
function PainelProdutos({ produtos, onSalvar, onExcluir }) {
  const [editando, setEditando] = useState(null);
  const [confirmarExcluir, setConfirmarExcluir] = useState(null);

  if (editando !== null) return (
    <FormProduto produto={editando} onSalvar={(p) => { onSalvar(p); setEditando(null); }} onCancelar={() => setEditando(null)} />
  );

  return (
    <div style={S.conteudo}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#1a1a2e" }}>🍽️ Produtos</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{produtos.length} produto(s) cadastrado(s)</div>
        </div>
        <button style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", border: "none", borderRadius: 20, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={() => setEditando({})}>
          + Novo Produto
        </button>
      </div>

      {produtos.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
          <div style={{ fontSize: 48 }}>🍽️</div>
          <p>Nenhum produto ainda.</p>
          <p style={{ fontSize: 13 }}>Clique em "+ Novo Produto" para começar!</p>
        </div>
      )}

      {[...new Set(produtos.map(p => p.categoria))].map(cat => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <h3 style={S.catTitulo}>{cat}</h3>
          {produtos.filter(p => p.categoria === cat).map(p => (
            <div key={p.id} style={S.itemProdutoAdmin}>
              <div style={{ fontSize: 32, minWidth: 40, textAlign: "center" }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 15 }}>{p.nome}</div>
                <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{p.descricao}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, color: "#7c3aed" }}>R$ {Number(p.preco).toFixed(2).replace(".", ",")}</span>
                  <span style={{ background: (p.cor || "#7c3aed") + "22", color: p.cor || "#7c3aed", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{p.categoria}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 70 }}>
                <button style={{ ...S.btnMini, background: "#ede9fe", color: "#7c3aed" }} onClick={() => setEditando(p)}>✏️ Editar</button>
                <button style={{ ...S.btnMini, background: "#fee2e2", color: "#ef4444" }} onClick={() => setConfirmarExcluir(p.id)}>🗑️ Excluir</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {confirmarExcluir && (
        <div style={S.modalOverlay}>
          <div style={S.modalBox}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Excluir produto?</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Esta ação não pode ser desfeita.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={{ ...S.btnMini, background: "#fee2e2", color: "#ef4444", padding: "10px 20px", fontSize: 14 }} onClick={() => { onExcluir(confirmarExcluir); setConfirmarExcluir(null); }}>Sim, excluir</button>
              <button style={{ ...S.btnMini, background: "#f3f4f6", color: "#374151", padding: "10px 20px", fontSize: 14 }} onClick={() => setConfirmarExcluir(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FORMULÁRIO PRODUTO ───────────────────────────────────────────────────────
function FormProduto({ produto, onSalvar, onCancelar }) {
  const categoriasSemTodos = CATEGORIAS_BASE.filter(c => c !== "Todos");
  const [form, setForm] = useState({
    id: produto.id || null,
    nome: produto.nome || "",
    categoria: produto.categoria || "Lanches",
    preco: produto.preco ? String(produto.preco) : "",
    descricao: produto.descricao || "",
    emoji: produto.emoji || "🍔",
    cor: produto.cor || "#f59e0b",
    ingredientes: produto.ingredientes ? produto.ingredientes.join(", ") : "",
    novaCategoria: "",
  });
  const [erros, setErros] = useState({});
  const [usarNovaCategoria, setUsarNovaCategoria] = useState(false);

  const emojisRapidos = ["🍔","🌭","🍕","🍟","🥪","🌮","🌯","🥓","🍗","🍖","🥩","🧀","🥚","🍳","🥞","🧇","🫔","🥙","🧆","🥗","🍱","🍣","🍜","🍝","🥤","🧃","☕","🍺","🧋","🍦","🍰","🎂","🧁","🍩","🍪","🍫","🍬","🍭","🍮","🎯"];

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validar = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = "Nome obrigatório";
    if (!form.preco || isNaN(Number(form.preco.replace(",", ".")))) e.preco = "Preço inválido";
    if (!form.descricao.trim()) e.descricao = "Descrição obrigatória";
    if (usarNovaCategoria && !form.novaCategoria.trim()) e.novaCategoria = "Digite o nome da categoria";
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = () => {
    if (!validar()) return;
    onSalvar({
      id: form.id,
      nome: form.nome.trim(),
      categoria: usarNovaCategoria ? form.novaCategoria.trim() : form.categoria,
      preco: Number(form.preco.replace(",", ".")),
      descricao: form.descricao.trim(),
      emoji: form.emoji,
      cor: form.cor,
      ingredientes: form.ingredientes.split(",").map(i => i.trim()).filter(Boolean),
    });
  };

  return (
    <div style={S.conteudo}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button style={{ ...S.btnVoltar, color: "#7c3aed" }} onClick={onCancelar}>← Voltar</button>
        <h2 style={{ margin: 0, color: "#1a1a2e", fontSize: 18 }}>{form.id ? "✏️ Editar Produto" : "➕ Novo Produto"}</h2>
      </div>

      {/* Preview card */}
      <div style={{ background: "#faf5ff", border: "2px dashed #c4b5fd", borderRadius: 16, padding: "16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 42, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", background: (form.cor || "#f59e0b") + "22", borderRadius: "50%", border: `2px solid ${form.cor || "#f59e0b"}44` }}>{form.emoji}</div>
        <div>
          <div style={{ fontWeight: 800, color: "#1a1a2e", fontSize: 15 }}>{form.nome || "Nome do produto"}</div>
          <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>{form.descricao || "Descrição do produto"}</div>
          <div style={{ fontWeight: 800, color: "#7c3aed", marginTop: 4 }}>R$ {form.preco ? Number(form.preco.replace(",", ".")).toFixed(2).replace(".", ",") : "0,00"}</div>
        </div>
      </div>

      {/* Nome */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>📝 Nome do produto</label>
        <input style={{ ...S.input, ...(erros.nome ? { borderColor: "#ef4444" } : {}) }} placeholder="Ex: X-Tudo Especial" value={form.nome} onChange={e => set("nome", e.target.value)} />
        {erros.nome && <span style={{ color: "#ef4444", fontSize: 12 }}>{erros.nome}</span>}
      </div>

      {/* Preço */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>💰 Preço (R$)</label>
        <input style={{ ...S.input, ...(erros.preco ? { borderColor: "#ef4444" } : {}) }} placeholder="Ex: 25,90" value={form.preco} onChange={e => set("preco", e.target.value)} />
        {erros.preco && <span style={{ color: "#ef4444", fontSize: 12 }}>{erros.preco}</span>}
      </div>

      {/* Descrição */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>📄 Descrição</label>
        <input style={{ ...S.input, ...(erros.descricao ? { borderColor: "#ef4444" } : {}) }} placeholder="Ex: Hambúrguer artesanal com tudo!" value={form.descricao} onChange={e => set("descricao", e.target.value)} />
        {erros.descricao && <span style={{ color: "#ef4444", fontSize: 12 }}>{erros.descricao}</span>}
      </div>

      {/* Emoji */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>😋 Emoji do produto</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "10px", background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb", maxHeight: 110, overflowY: "auto" }}>
          {emojisRapidos.map(e => (
            <button key={e} style={{ fontSize: 22, background: form.emoji === e ? "#ede9fe" : "transparent", border: form.emoji === e ? "2px solid #7c3aed" : "2px solid transparent", borderRadius: 8, cursor: "pointer", padding: "2px 4px" }} onClick={() => set("emoji", e)}>{e}</button>
          ))}
        </div>
        <input style={{ ...S.input, marginTop: 6 }} placeholder="Ou cole um emoji personalizado aqui" value={form.emoji} onChange={e => set("emoji", e.target.value)} />
      </div>

      {/* Cor */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>🎨 Cor do card</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CORES_OPCOES.map(cor => (
            <button key={cor} style={{ width: 32, height: 32, borderRadius: "50%", background: cor, border: form.cor === cor ? "3px solid #1a1a2e" : "3px solid transparent", cursor: "pointer", transform: form.cor === cor ? "scale(1.2)" : "scale(1)", transition: "transform 0.15s" }} onClick={() => set("cor", cor)} />
          ))}
        </div>
      </div>

      {/* Categoria */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>📂 Categoria</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <button style={{ ...S.btnMini, background: !usarNovaCategoria ? "#7c3aed" : "#f3f4f6", color: !usarNovaCategoria ? "#fff" : "#374151" }} onClick={() => setUsarNovaCategoria(false)}>Existente</button>
          <button style={{ ...S.btnMini, background: usarNovaCategoria ? "#7c3aed" : "#f3f4f6", color: usarNovaCategoria ? "#fff" : "#374151" }} onClick={() => setUsarNovaCategoria(true)}>+ Nova categoria</button>
        </div>
        {!usarNovaCategoria
          ? <select style={{ ...S.input, cursor: "pointer" }} value={form.categoria} onChange={e => set("categoria", e.target.value)}>
              {categoriasSemTodos.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          : <div>
              <input style={{ ...S.input, ...(erros.novaCategoria ? { borderColor: "#ef4444" } : {}) }} placeholder="Ex: Pastéis, Açaí, Salgados..." value={form.novaCategoria} onChange={e => set("novaCategoria", e.target.value)} />
              {erros.novaCategoria && <span style={{ color: "#ef4444", fontSize: 12 }}>{erros.novaCategoria}</span>}
            </div>
        }
      </div>

      {/* Ingredientes */}
      <div style={{ marginBottom: 20 }}>
        <label style={S.label}>🥬 Ingredientes (separados por vírgula)</label>
        <textarea style={{ ...S.input, minHeight: 80, resize: "vertical", fontFamily: "inherit" }} placeholder="Ex: Pão brioche, Hambúrguer 150g, Queijo cheddar, Alface" value={form.ingredientes} onChange={e => set("ingredientes", e.target.value)} />
        {form.ingredientes && (
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {form.ingredientes.split(",").map((ing, i) => ing.trim() && (
              <span key={i} style={{ background: "#d1fae5", color: "#065f46", borderRadius: 20, padding: "2px 10px", fontSize: 12 }}>✓ {ing.trim()}</span>
            ))}
          </div>
        )}
      </div>

      <button style={S.btnAmarelo} onClick={handleSalvar}>{form.id ? "💾 Salvar Alterações" : "✅ Cadastrar Produto"}</button>
      <button style={{ ...S.btnAmarelo, background: "#f3f4f6", color: "#374151", boxShadow: "none", marginTop: 10 }} onClick={onCancelar}>Cancelar</button>
    </div>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f3f4f6" },
  tela: { maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" },
  header: { background: "#1a1a2e", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  headerLogo: { display: "flex", alignItems: "center", gap: 10 },
  headerNome: { color: "#f59e0b", fontWeight: 800, fontSize: 18 },
  headerSub: { color: "#9ca3af", fontSize: 11 },
  conteudo: { padding: "16px", flex: 1, overflowY: "auto" },
  loginBg: { minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e 0%, #4c1d95 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  loginCard: { background: "#fff", borderRadius: 24, padding: "32px 24px", maxWidth: 380, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  logoCircle: { width: 90, height: 90, borderRadius: "50%", background: "#fef3c7", border: "4px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  loginTitulo: { fontWeight: 900, fontSize: 28, color: "#1a1a2e", margin: 0 },
  loginSub: { color: "#7c3aed", fontWeight: 600, marginBottom: 8, fontSize: 15 },
  label: { display: "block", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #e5e7eb", background: "#faf5ff", fontSize: 14, color: "#1a1a2e", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  btnAmarelo: { background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff", fontWeight: 800, fontSize: 16, padding: "14px 28px", borderRadius: 50, border: "none", cursor: "pointer", width: "100%", marginTop: 8, boxShadow: "0 4px 15px rgba(245,158,11,0.4)" },
  boasVindas: { background: "linear-gradient(135deg, #1a1a2e, #4c1d95)", padding: "16px", display: "flex", gap: 12, alignItems: "center" },
  categorias: { display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" },
  btnCat: { background: "#fff", border: "2px solid #e5e7eb", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", color: "#6b7280" },
  btnCatAtivo: { background: "#7c3aed", borderColor: "#7c3aed", color: "#fff" },
  catTitulo: { color: "#1a1a2e", fontWeight: 800, fontSize: 16, marginTop: 16, marginBottom: 12, paddingLeft: 8, borderLeft: "4px solid #f59e0b" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 },
  cardWrap: { perspective: 1000, marginBottom: 0 },
  cardInner: { position: "relative", transformStyle: "preserve-3d", transition: "transform 0.5s", minHeight: 220 },
  cardFace: { position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 16, overflow: "hidden" },
  cardFrente: { background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center" },
  cardVerso: { background: "#1a1a2e", transform: "rotateY(180deg)", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center" },
  cardEmoji: { fontSize: 36, borderRadius: "50%", width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  cardNome: { fontWeight: 700, fontSize: 13, color: "#1a1a2e", textAlign: "center", marginBottom: 4, lineHeight: 1.3 },
  cardDesc: { fontSize: 11, color: "#9ca3af", textAlign: "center", marginBottom: 6, lineHeight: 1.4 },
  cardPreco: { fontWeight: 800, fontSize: 16, color: "#7c3aed", marginBottom: 8 },
  cardBotoes: { display: "flex", flexDirection: "column", gap: 6, width: "100%" },
  btnInfo: { background: "#ede9fe", color: "#7c3aed", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer" },
  btnAdd: { background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8, padding: "8px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.3s" },
  listaIngredientes: { listStyle: "none", padding: 0, margin: 0, width: "100%", marginBottom: 12 },
  ingredienteItem: { color: "#d1fae5", fontSize: 12, marginBottom: 4, textAlign: "left" },
  btnCarrinho: { background: "#f59e0b", border: "none", borderRadius: 50, width: 42, height: 42, fontSize: 20, cursor: "pointer", position: "relative" },
  btnIcon: { background: "transparent", border: "1px solid #374151", borderRadius: 50, width: 38, height: 38, fontSize: 18, cursor: "pointer", color: "#9ca3af" },
  badge: { position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  fabCarrinho: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff", border: "none", borderRadius: 50, padding: "14px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.5)", display: "flex", alignItems: "center", gap: 8, zIndex: 200 },
  fabBadge: { background: "#f59e0b", color: "#1a1a2e", borderRadius: "50%", width: 22, height: 22, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" },
  infoCliente: { background: "#faf5ff", border: "1px solid #ede9fe", borderRadius: 12, padding: "12px 16px", marginBottom: 16 },
  itemCarrinho: { display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: "1px solid #f3f4f6" },
  qtdControle: { display: "flex", alignItems: "center", gap: 6 },
  btnQtd: { background: "#ede9fe", color: "#7c3aed", border: "none", borderRadius: "50%", width: 28, height: 28, fontSize: 16, fontWeight: 700, cursor: "pointer" },
  totalBox: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", borderRadius: 12, padding: "14px 16px", marginTop: 12, marginBottom: 16, border: "1px solid #e5e7eb" },
  cardPagamento: { display: "flex", alignItems: "center", gap: 16, border: "2px solid #e5e7eb", borderRadius: 16, padding: "16px", marginBottom: 12, cursor: "pointer" },
  cardPagAtivo: { borderColor: "#7c3aed", background: "#faf5ff" },
  pixBox: { background: "#faf5ff", border: "2px dashed #7c3aed", borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  notificacao: { background: "linear-gradient(135deg, #7c3aed, #4c1d95)", color: "#fff", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5 },
  statusCard: { border: "2px solid #e5e7eb", borderRadius: 16, padding: "24px", textAlign: "center", marginBottom: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  progressBar: { width: "100%", height: 8, background: "#e5e7eb", borderRadius: 50, overflow: "hidden", marginTop: 8 },
  progressFill: { height: "100%", borderRadius: 50, transition: "width 0.5s ease" },
  steps: { display: "flex", justifyContent: "space-around", marginBottom: 20 },
  step: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  stepCircle: { width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, transition: "all 0.3s" },
  btnVoltar: { background: "transparent", border: "none", color: "#f59e0b", fontSize: 15, fontWeight: 700, cursor: "pointer", padding: "4px 8px" },
  vazio: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  contadores: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 4 },
  contador: { border: "2px solid #e5e7eb", borderRadius: 12, padding: "10px 8px", textAlign: "center" },
  pedidoAdmin: { background: "#fff", borderLeft: "4px solid #e5e7eb", borderRadius: 12, padding: "14px", marginBottom: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  btnAção: { background: "#fef3c7", color: "#92400e", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  itemProdutoAdmin: { display: "flex", alignItems: "flex-start", gap: 12, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "14px", marginBottom: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  btnMini: { border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: 20 },
  modalBox: { background: "#fff", borderRadius: 20, padding: "32px 24px", maxWidth: 320, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
};