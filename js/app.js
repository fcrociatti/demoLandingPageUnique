/*
 * Monta a página a partir de window.SITE_CONFIG (config.js).
 * Não precisa editar este arquivo para trocar peças, preços ou horários.
 */
(function () {
  "use strict";

  const C = window.SITE_CONFIG;
  if (!C) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const DIAS_CURTO = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  const DIAS_LABEL = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const URLQ = new URLSearchParams(location.search);
  // Pendências ([CONFIRMAR]): escondidas, a não ser que o config ou ?pendencias=1 peça
  const PEND = C.mostrarPendencias === true || URLQ.get("pendencias") === "1";

  /* ---------- Utilidades de texto ---------- */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function confirmar(rotulo) {
    return `<span class="confirmar">[CONFIRMAR${rotulo ? " " + esc(rotulo) : ""}]</span>`;
  }

  // Marca de revisão: só aparece com pendências ligadas
  const pend = (rotulo) => (PEND && rotulo ? confirmar(rotulo) : "");

  const icon = (id, extra = "") => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const preco = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  /* ---------- Links ---------- */

  const linkWa = (num, msg) => `https://wa.me/${num}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;
  const linkRota = (l) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${l.endereco}, ${l.cidade}`)}`;
  const ext = 'target="_blank" rel="noopener"';

  /* ---------- Horário (fuso da loja) ---------- */

  const toMin = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  function hora(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
  }

  // Permite simular um horário para testes: ?agora=sab-17:30
  function simulado() {
    const q = URLQ.get("agora");
    const m = q && q.toLowerCase().replace("á", "a").match(/^([a-z]{3})-(\d{1,2}):(\d{2})$/);
    if (!m || DIAS_CURTO.indexOf(m[1]) < 0) return null;
    return { dia: DIAS_CURTO.indexOf(m[1]), min: Number(m[2]) * 60 + Number(m[3]) };
  }

  function agora() {
    const sim = simulado();
    if (sim) return sim;
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: C.fuso || "America/Sao_Paulo",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { dia, min: Number(get("hour")) * 60 + Number(get("minute")) };
  }

  function status(horario) {
    const { dia, min } = agora();
    const hoje = horario[dia] || [];
    for (const [ini, fim] of hoje) {
      if (min >= toMin(ini) && min < toMin(fim)) return { aberto: true, detalhe: `Fecha às ${hora(fim)}` };
    }
    for (const [ini] of hoje) {
      if (min < toMin(ini)) return { aberto: false, detalhe: `Abre hoje às ${hora(ini)}` };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      const ints = horario[d] || [];
      if (ints.length) {
        const quando = i === 1 ? "amanhã" : DIAS_LABEL[d].toLowerCase();
        return { aberto: false, detalhe: `Abre ${quando} às ${hora(ints[0][0])}` };
      }
    }
    return { aberto: false, detalhe: "" };
  }

  // Agrupa dias com o mesmo horário: [{rotulo: "Seg a sex", horas: "11h–20h", dias: [1..5]}]
  function gruposHorario(horario) {
    const chave = (d) => (horario[d] || []).map(([a, b]) => `${hora(a)}–${hora(b)}`).join(", ") || "Fechado";
    const grupos = [];
    for (const d of [1, 2, 3, 4, 5, 6, 0]) {
      const k = chave(d);
      const ult = grupos[grupos.length - 1];
      if (ult && ult.horas === k) ult.dias.push(d);
      else grupos.push({ horas: k, dias: [d] });
    }
    return grupos.map((g) => ({
      ...g,
      rotulo: g.dias.length === 1 ? DIAS_LABEL[g.dias[0]] : `${DIAS_LABEL[g.dias[0]]} a ${DIAS_LABEL[g.dias[g.dias.length - 1]].toLowerCase()}`,
    }));
  }

  function selo(horario) {
    const s = status(horario);
    return `<span class="status ${s.aberto ? "status--open" : "status--closed"}"><span class="status__dot" aria-hidden="true"></span><b>${
      s.aberto ? "Aberto agora" : "Fechado agora"
    }</b>${s.detalhe ? ` · ${esc(s.detalhe)}` : ""}</span>`;
  }

  /* ---------- Faixa de prévia ---------- */

  function renderPrevia() {
    const el = $("#preview-bar");
    if (!C.previa || !C.previa.ativo) return;
    el.textContent = C.previa.texto;
    el.hidden = false;
  }

  /* ---------- Topo ---------- */

  function renderTopo() {
    const m = C.marca;
    const l = C.loja;
    const f = m.foto;
    // "Moda • Estilo • Exclusividade" vira três linhas no título
    const linhas = m.frase.split("•").map((t) => `<span>${esc(t.trim())}</span>`).join("");
    $("#topo").innerHTML = `
      <div class="topbar">
        <p class="topbar__logo">${esc(m.nome)}</p>
        <nav class="topbar__nav" aria-label="Seções">
          <a href="#pecas">Peças</a><a href="#loja">A loja</a>
          ${l && l.whatsapp ? `<a class="topbar__wa" href="${linkWa(l.whatsapp, l.mensagem)}" ${ext} aria-label="WhatsApp da loja">${icon("whatsapp")}</a>` : ""}
        </nav>
      </div>
      <div class="hero__inner">
        ${f && f.src ? `<figure class="hero__photo"><img src="${esc(f.src)}" alt="${esc(f.alt || "")}" width="${f.largura || 1066}" height="${f.altura || 1332}" fetchpriority="high" decoding="async"${
          f.posicao ? ` style="object-position:${esc(f.posicao)}"` : ""
        }></figure>` : ""}
        <div class="hero__text">
          <h1 class="hero__title" aria-label="${esc(m.frase)}">${linhas}</h1>
          <div class="hero__actions">
            <a class="btn btn--light" href="#pecas">${esc(m.botao)} ${icon("seta")}</a>
            ${l && l.whatsapp ? `<a class="btn btn--outline-light" href="${linkWa(l.whatsapp, l.mensagem)}" ${ext}>${icon("whatsapp")}WhatsApp</a>` : ""}
          </div>
          ${l ? `<p class="hero__meta">${icon("pin")}<span>${esc(l.endereco)} · ${esc(l.cidade.replace(/ - SP$/, ""))}</span></p>
          <p class="hero__meta">${selo(l.horario)}</p>` : ""}
        </div>
      </div>`;
  }

  /* ---------- Promoção ---------- */

  function renderPromo() {
    const p = C.promocao;
    const el = $("#promocao");
    if (!p || !p.ativo) return;
    el.innerHTML = `
      <div class="promo__inner">
        <p class="promo__titulo">${esc(p.titulo)}</p>
        <p class="promo__texto">${esc(p.texto)}${p.nota ? ` <span class="promo__nota">${esc(p.nota)}</span>` : ""} ${pend(p.pendencia)}</p>
      </div>`;
    el.hidden = false;
  }

  /* ---------- Vitrine ---------- */

  const V = C.vitrine || {};
  const TIPOS = C.tipos || {};
  const PRODUTOS = (C.produtos || []).filter((p) => p && p.nome && p.preco && p.fotos && p.fotos.length);
  const estado = { marca: "", tipo: "", ordem: "destaques" };

  const rotuloTipo = (t) => (TIPOS[t] && TIPOS[t].rotulo) || t;
  // Peça sem marca (null) aparece na vitrine, mas não vira opção de filtro
  const marcas = () => [...new Set(PRODUTOS.map((p) => p.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const daMarca = (m) => PRODUTOS.filter((p) => p.marca === m).length;
  const doTipo = (t) => PRODUTOS.filter((p) => p.tipo === t);
  const tipos = () => {
    const usados = new Set(PRODUTOS.map((p) => p.tipo));
    return [...Object.keys(TIPOS).filter((t) => usados.has(t)), ...[...usados].filter((t) => !TIPOS[t])];
  };

  const passa = (p, f) => (!f.marca || p.marca === f.marca) && (!f.tipo || p.tipo === f.tipo);

  function tamanhosTexto(p) {
    return p.tamanhos && p.tamanhos.length ? `Tamanhos: ${p.tamanhos.map(esc).join(" · ")}` : esc(V.semTamanhos || "Consulte tamanhos");
  }

  function mensagem(p) {
    const artigo = (TIPOS[p.tipo] && TIPOS[p.tipo].artigo) || "na";
    return (V.mensagem || "Olá! Tenho interesse {artigo} {nome} ({preco}). Qual tamanho tem disponível?")
      .replace("{artigo}", artigo)
      .replace("{nome}", p.nome)
      .replace("{preco}", preco(p.preco));
  }

  function chips(grupo, rotulo, opcoes, rotuloOpcao) {
    if (opcoes.length < 2) return "";
    const todos = grupo === "marca" ? "Todas" : "Todos";
    const botoes = [["", todos], ...opcoes.map((o) => [o, rotuloOpcao(o)])]
      .map(([valor, texto]) => {
        const filtro = { ...estado, [grupo]: valor };
        const n = PRODUTOS.filter((p) => passa(p, filtro)).length;
        const ativo = estado[grupo] === valor;
        return `<button type="button" class="chip" data-grupo="${grupo}" data-valor="${esc(valor)}" aria-pressed="${ativo}"${
          n || ativo ? "" : " disabled"
        }>${esc(texto)}<span class="chip__n">${n}</span></button>`;
      })
      .join("");
    return `<div class="filter" role="group" aria-label="Filtrar por ${esc(rotulo.toLowerCase())}">
      <span class="filter__label">${esc(rotulo)}</span><div class="filter__chips">${botoes}</div></div>`;
  }

  function cartao(p) {
    const foto = p.fotos[0];
    return `<li class="card">
      <a class="card__link" href="#peca=${esc(p.id)}" data-peca="${esc(p.id)}">
        <div class="photo"><img src="${esc(foto)}" alt="${esc(p.nome)}, foto de frente" width="600" height="800" loading="lazy" decoding="async"></div>
        <div class="card__body">
          <p class="card__marca">${esc(p.marca || rotuloTipo(p.tipo))}</p>
          <h3 class="card__nome">${esc(p.nome)}</h3>
          <p class="card__preco">${preco(p.preco)}</p>
          <p class="card__tam">${tamanhosTexto(p)}</p>
          ${pend(p.pendencia)}
        </div>
      </a>
    </li>`;
  }

  function lista() {
    const itens = PRODUTOS.filter((p) => passa(p, estado));
    if (estado.ordem === "menor") itens.sort((a, b) => a.preco - b.preco);
    if (estado.ordem === "maior") itens.sort((a, b) => b.preco - a.preco);
    return itens;
  }

  function renderVitrine() {
    const el = $("#pecas");
    if (!PRODUTOS.length) {
      el.hidden = true;
      return;
    }
    el.innerHTML = `
      <div class="wrap">
        <h2 class="kicker" id="pecas-titulo"><span>${esc(V.titulo || "Peças")}</span></h2>
        <div class="filters" id="filtros"></div>
        <div class="toolbar">
          <p class="toolbar__count" id="contagem" aria-live="polite"></p>
          <label class="sort"><span>Ordenar</span>
            <select id="ordem">
              <option value="destaques">Destaques</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
            </select>
          </label>
        </div>
        <ul class="grid" id="grade"></ul>
        <div class="empty" id="vazio" hidden>
          <p>Nenhuma peça com esses filtros.</p>
          <button type="button" class="btn btn--ghost" id="limpar">Limpar filtros</button>
        </div>
      </div>`;

    $("#ordem").addEventListener("change", (e) => {
      estado.ordem = e.target.value;
      atualizarVitrine();
    });
    $("#filtros").addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b || b.disabled) return;
      estado[b.dataset.grupo] = b.dataset.valor;
      atualizarVitrine();
    });
    $("#limpar").addEventListener("click", () => {
      estado.marca = estado.tipo = "";
      atualizarVitrine();
    });
    atualizarVitrine();
  }

  // Categorias e marcas: filtra a vitrine e rola até ela
  function filtrarEIr(grupo, valor) {
    estado.marca = estado.tipo = "";
    estado[grupo] = valor;
    atualizarVitrine();
    $("#pecas").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function atualizarVitrine() {
    $("#filtros").innerHTML = chips("marca", "Marca", marcas(), (m) => m) + chips("tipo", "Tipo", tipos(), rotuloTipo);
    const itens = lista();
    $("#grade").innerHTML = itens.map(cartao).join("");
    $("#contagem").textContent = `${itens.length} ${itens.length === 1 ? "peça" : "peças"}`;
    $("#vazio").hidden = itens.length > 0;
  }

  /* ---------- Antes da vitrine: categorias, destaque, como pedir, marcas ---------- */

  function renderCategorias() {
    const el = $("#categorias");
    const lista = tipos();
    if (!C.categorias || lista.length < 2) {
      el.hidden = true;
      return;
    }
    const blocos = lista
      .map((t) => {
        const pecas = doTipo(t);
        const tp = TIPOS[t] || {};
        const foto = tp.foto || pecas[0].fotos[0];
        const nome = tp.plural || rotuloTipo(t);
        return `<li><button type="button" class="cat" data-tipo="${esc(t)}">
          <span class="cat__photo"><img src="${esc(foto)}" alt="" width="600" height="800" loading="lazy" decoding="async"></span>
          <span class="cat__nome">${esc(nome)}</span>
          <span class="cat__n">${pecas.length} ${pecas.length === 1 ? "peça" : "peças"}</span>
        </button></li>`;
      })
      .join("");
    el.innerHTML = `
      <div class="wrap">
        <h2 class="kicker" id="categorias-titulo"><span>${esc(C.categorias.titulo || "Categorias")}</span></h2>
      </div>
      <ul class="rail rail--cats">${blocos}</ul>`;
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-tipo]");
      if (b) filtrarEIr("tipo", b.dataset.tipo);
    });
  }

  function renderDestaque() {
    const d = C.destaque;
    const el = $("#destaque");
    const pecas = d && d.pecas ? d.pecas.map((id) => PRODUTOS.find((p) => p.id === id)).filter(Boolean) : [];
    if (!pecas.length) {
      el.hidden = true;
      return;
    }
    el.innerHTML = `
      <div class="wrap feature__head">
        <h2 class="kicker" id="destaque-titulo"><span>${esc(d.titulo)}</span></h2>
        ${d.texto ? `<p class="feature__texto">${esc(d.texto)}</p>` : ""}
      </div>
      <ul class="rail rail--cards">${pecas.map(cartao).join("")}</ul>`;
  }

  function renderComoPedir() {
    const c = C.comoPedir;
    const el = $("#como-pedir");
    if (!c || !c.passos || !c.passos.length) {
      el.hidden = true;
      return;
    }
    el.innerHTML = `
      <div class="wrap">
        <h2 class="kicker" id="como-pedir-titulo"><span>${esc(c.titulo)}</span></h2>
        <ol class="steps__list">
          ${c.passos
            .map(
              (p, i) => `<li class="step"><span class="step__n" aria-hidden="true">${i + 1}</span>
              <div><h3 class="step__titulo">${esc(p.titulo)}</h3><p class="step__texto">${esc(p.texto)}</p></div></li>`
            )
            .join("")}
        </ol>
      </div>`;
  }

  function renderMarcas() {
    const el = $("#marcas");
    const lista = marcas();
    if (!C.marcas || lista.length < 2) {
      el.hidden = true;
      return;
    }
    el.innerHTML = `
      <div class="wrap">
        <h2 class="kicker" id="marcas-titulo"><span>${esc(C.marcas.titulo || "Marcas")}</span></h2>
        <ul class="brands__list">
          ${lista
            .map((m) => `<li><button type="button" class="brand" data-marca="${esc(m)}">${esc(m)}<span class="brand__n">${daMarca(m)}</span></button></li>`)
            .join("")}
        </ul>
      </div>`;
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-marca]");
      if (b) filtrarEIr("marca", b.dataset.marca);
    });
  }

  /* ---------- Peça aberta ---------- */

  const dlg = $("#peca");
  let empilhou = false; // abrimos com pushState? então o "voltar" fecha

  function abrirPeca(id, empilhar) {
    const p = PRODUTOS.find((x) => x.id === id);
    if (!p) return;
    const l = C.loja;
    const promo = C.promocao && C.promocao.ativo ? C.promocao : null;
    const fotos = p.fotos
      .map(
        (f, i) => `<li class="gallery__slide"><div class="photo"><img src="${esc(f)}" alt="${esc(p.nome)}, foto ${i + 1} de ${p.fotos.length}" width="600" height="800" decoding="async"></div></li>`
      )
      .join("");
    const pontos = p.fotos.length > 1 ? `<div class="gallery__dots" aria-hidden="true">${p.fotos.map((_, i) => `<span${i ? "" : ' class="on"'}></span>`).join("")}</div>` : "";
    const setas =
      p.fotos.length > 1
        ? `<button type="button" class="gallery__nav gallery__nav--prev" data-dir="-1" aria-label="Foto anterior">${icon("esq")}</button>
           <button type="button" class="gallery__nav gallery__nav--next" data-dir="1" aria-label="Próxima foto">${icon("dir")}</button>`
        : "";

    dlg.innerHTML = `
      <div class="product__inner">
        <button type="button" class="product__close" aria-label="Fechar">${icon("fechar")}</button>
        <div class="gallery">
          <ul class="gallery__track" id="galeria">${fotos}</ul>
          ${setas}${pontos}
        </div>
        <div class="product__info">
          <p class="card__marca">${p.marca ? `${esc(p.marca)} · ` : ""}${esc(rotuloTipo(p.tipo))}</p>
          <h2 class="product__nome" id="peca-nome">${esc(p.nome)}</h2>
          <p class="product__preco">${preco(p.preco)}</p>
          <p class="product__tam">${tamanhosTexto(p)}</p>
          ${l && l.whatsapp ? `<a class="btn btn--dark btn--block" href="${linkWa(l.whatsapp, mensagem(p))}" ${ext}>${icon("whatsapp")}Pedir no WhatsApp</a>` : ""}
          <p class="product__nota">Tamanho e disponibilidade você confirma direto com a loja.</p>
          ${promo ? `<p class="product__promo"><b>${esc(promo.titulo)}:</b> ${esc(promo.texto)} ${pend(promo.pendencia)}</p>` : ""}
          ${pend(p.pendencia)}
        </div>
      </div>`;

    const track = $("#galeria", dlg);
    const dots = $$(".gallery__dots span", dlg);
    const marcar = (i) => dots.forEach((d, j) => d.classList.toggle("on", i === j));
    const atual = () => Math.round(track.scrollLeft / track.clientWidth);
    track.addEventListener("scroll", () => marcar(atual()), { passive: true });
    // Setas dão a volta: na última foto, "próxima" volta para a primeira
    $$(".gallery__nav", dlg).forEach((b) =>
      b.addEventListener("click", () => {
        const n = p.fotos.length;
        const i = (atual() + Number(b.dataset.dir) + n) % n;
        track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
        marcar(i);
      })
    );
    $(".product__close", dlg).addEventListener("click", fecharPeca);

    if (empilhar) {
      history.pushState({ peca: id }, "", `#peca=${encodeURIComponent(id)}`);
      empilhou = true;
    }
    document.title = `${p.nome} · ${C.marca.nome}`;
    if (!dlg.open) dlg.showModal();
    document.documentElement.classList.add("travado");
  }

  // Fecha a janela; se ela entrou no histórico, volta uma página para o "voltar" do celular ficar certo
  function fecharPeca() {
    if (empilhou) {
      empilhou = false;
      history.back();
      return;
    }
    fecharVisual();
    if (location.hash.startsWith("#peca=")) history.replaceState(null, "", location.pathname + location.search);
  }

  function fecharVisual() {
    if (dlg.open) dlg.close();
    document.documentElement.classList.remove("travado");
    document.title = TITULO;
  }

  const TITULO = document.title;

  dlg.addEventListener("cancel", (e) => {
    e.preventDefault();
    fecharPeca();
  });
  // Toque fora da janela (no fundo escuro) fecha
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) fecharPeca();
  });

  function pecaDoEndereco() {
    const m = location.hash.match(/^#peca=(.+)$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  window.addEventListener("popstate", () => {
    const id = pecaDoEndereco();
    if (id) abrirPeca(id, false);
    else {
      empilhou = false;
      fecharVisual();
    }
  });

  /* ---------- A loja ---------- */

  function renderLoja() {
    const l = C.loja;
    const el = $("#loja");
    if (!l) {
      el.hidden = true;
      return;
    }
    const grupos = gruposHorario(l.horario);
    const hoje = agora().dia;
    el.innerHTML = `
      <div class="wrap">
        <h2 class="kicker" id="loja-titulo"><span>A loja</span></h2>
        <div class="store__grid">
          <div>
            <p class="store__addr">${esc(l.endereco)}</p>
            <p class="store__city">${esc(l.cidade)}</p>
            <p class="store__status">${selo(l.horario)}</p>
          </div>
          <dl class="hours">
            ${grupos
              .map(
                (g) => `<div class="hours__row${g.dias.includes(hoje) ? " hours__row--today" : ""}"><dt>${esc(g.rotulo)}</dt><dd>${esc(g.horas)}</dd></div>`
              )
              .join("")}
          </dl>
          ${
            l.fotos && l.fotos.length
              ? `<div class="store__photos">${l.fotos
                  .map((f) => `<div class="photo photo--cover"><img src="${esc(f.src)}" alt="${esc(f.alt || "")}" width="533" height="711" loading="lazy" decoding="async"></div>`)
                  .join("")}</div>`
              : ""
          }
          <div class="store__actions">
            <a class="btn btn--dark" href="${linkRota(l)}" ${ext}>${icon("rota")}Como chegar</a>
            ${l.whatsapp ? `<a class="btn btn--ghost" href="${linkWa(l.whatsapp, l.mensagem)}" ${ext}>${icon("whatsapp")}WhatsApp</a>` : pend("WhatsApp")}
          </div>
        </div>
      </div>`;
  }

  /* ---------- Rodapé ---------- */

  function renderRodape() {
    const l = C.loja || {};
    const ig = C.redes && C.redes.instagram;
    const ano = new Date().getFullYear();
    $("#rodape").innerHTML = `
      <div class="wrap foot">
        <p class="foot__logo">${esc(C.marca.nome)}</p>
        <p class="foot__tagline">${esc(C.marca.frase)}</p>
        <ul class="foot__links">
          ${ig ? `<li><a href="${esc(ig.url)}" ${ext}>${icon("instagram")}${esc(ig.usuario)}</a></li>` : ""}
          ${l.whatsapp ? `<li><a href="${linkWa(l.whatsapp, l.mensagem)}" ${ext}>${icon("whatsapp")}${esc(l.whatsappTexto || l.whatsapp)}</a></li>` : ""}
          ${l.endereco ? `<li><a href="${linkRota(l)}" ${ext}>${icon("pin")}${esc(l.endereco)} · ${esc(l.cidade)}</a></li>` : ""}
        </ul>
        <p class="foot__fine">© ${ano} ${esc(C.marca.nomeCompleto || C.marca.nome)}${
          C.previa && C.previa.ativo ? ` · ${esc(C.previa.texto)}` : ""
        }</p>
      </div>`;
  }

  /* ---------- Início ---------- */

  renderPrevia();
  renderTopo();
  renderPromo();
  renderCategorias();
  renderDestaque();
  renderComoPedir();
  renderMarcas();
  renderVitrine();
  renderLoja();
  renderRodape();

  // Toque numa peça (vitrine ou destaque) abre a janela dela
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-peca]");
    if (!a || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    abrirPeca(a.dataset.peca, true);
  });

  // Link direto para uma peça (#peca=id): abre por cima da vitrine
  const inicial = pecaDoEndereco();
  if (inicial) abrirPeca(inicial, false);
})();
