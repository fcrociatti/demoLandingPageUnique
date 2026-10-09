/*
 * CONFIGURAÇÃO DO SITE
 * ------------------------------------------------------------------
 * Este é o único arquivo que precisa mudar. O resto (index.html, css,
 * js) lê daqui.
 *
 * Convenções (iguais às da prévia da Lumina):
 * - Valor null é uma pendência. Com mostrarPendencias: false ele some da
 *   página (com a linha ou o botão dele). Com true, aparece como
 *   [CONFIRMAR] para revisão. ?pendencias=1 no endereço mostra as
 *   pendências sem mudar este arquivo.
 * - pendencia: "texto" marca algo que está na página mas ainda precisa de
 *   confirmação. Não esconde nada; só mostra [CONFIRMAR texto] na revisão.
 * - WhatsApp: só dígitos, com 55 + DDD (ex.: "5511999999999").
 * - Horário: dias 0=domingo ... 6=sábado; cada dia é uma lista de
 *   intervalos ["HH:MM", "HH:MM"]. Lista vazia = fechado.
 *
 * Fontes dos dados da Unique: briefing, perfil do Instagram
 * (@uniqueoficial__) e o catálogo em PDF do Canva (out/2026).
 */

// Pasta das fotos das peças. Cada peça tem 2 fotos verticais (3:4).
const PECAS = "assets/produtos/";

window.SITE_CONFIG = {
  // Faixa de prévia. Em um site oficial, troque ativo para false.
  previa: {
    ativo: true,
    texto: "Prévia de demonstração criada por Crociatti Digital. Não é o site oficial.",
  },

  // false: esconde tudo que ainda falta confirmar. true: mostra [CONFIRMAR].
  mostrarPendencias: false,

  fuso: "America/Sao_Paulo",

  // "claro" ou "escuro". Para comparar sem publicar: ?tema=escuro ou ?tema=claro no endereço.
  tema: "claro",

  cores: {
    destaque: "#D7141E", // vermelho: só na faixa de promoção
    marca: "#0B0B0B", // preto do topo e do rodapé, como no Instagram
    claro: { fundo: "#F4F1EE", texto: "#3A3A3A" },
    escuro: { fundo: "#141414", texto: "#EDEAE6" },
  },

  marca: {
    nome: "UNIQUE",
    nomeCompleto: "Unique",
    frase: "Moda • Estilo • Exclusividade",
    botao: "Ver peças",
    // Foto do topo (alta resolução, 903×1129, sem rosto). posicao = enquadramento (CSS object-position).
    foto: { src: "assets/loja/banner-tricot-detalhe.webp", alt: "Tricot Zara preto em detalhe, com a trama listrada", posicao: "center top", largura: 903, altura: 1129 },
    // No computador, duas peças ao lado da foto do topo: id da peça, ou { peca, foto } para outra foto dela.
    lookbook: [{ peca: "bomber-ralph-lauren", foto: "assets/loja/look-bomber-detalhe.webp" }, "calca-zara"],
  },

  // Faixa vermelha logo abaixo do topo. Para tirar, troque ativo para false.
  promocao: {
    ativo: true,
    titulo: "Compre 1, leve 2",
    texto: "Na compra de 1 peça, leve outra de igual ou menor valor.",
    nota: "Válido para toda a linha de vestuário.",
    pendencia: "se a promoção está vigente",
  },

  loja: {
    endereco: "Av. Itaberaba, 875",
    cidade: "São Paulo - SP",
    whatsapp: "5511926923426",
    whatsappTexto: "(11) 92692-3426",
    mensagem: "Olá! Vim pelo site e queria tirar uma dúvida.",
    // Fotos de dentro da loja (verticais 3:4). Lista vazia esconde o bloco.
    fotos: [
      { src: "assets/loja/fachada.webp", alt: "Fachada da Unique na Av. Itaberaba, com o letreiro da loja" },
      { src: "assets/loja/arara-1.webp", alt: "Arara de camisetas pretas na loja" },
    ],
    horario: {
      0: [],
      1: [["11:00", "20:00"]],
      2: [["11:00", "20:00"]],
      3: [["11:00", "20:00"]],
      4: [["11:00", "20:00"]],
      5: [["11:00", "20:00"]],
      6: [["10:30", "18:00"]],
    },
  },

  vitrine: {
    titulo: "Peças",
    // Mensagem do botão "Pedir no WhatsApp". {artigo} vem do tipo (na/no),
    // {nome} e {preco} vêm da peça.
    mensagem: "Olá! Tenho interesse {artigo} {nome} ({preco}). Qual tamanho tem disponível?",
    semTamanhos: "Consulte tamanhos",
  },

  // Faixa de peças em destaque (troque por estação). pecas = ids da lista de produtos.
  destaque: {
    titulo: "Para os dias frios",
    texto: "Estilo e conforto para os dias frios: a peça essencial para completar o visual.",
    pecas: ["puffer-preta", "bomber-ralph-lauren", "tricot-zara"],
  },

  // Os passos aparecem ao lado de um exemplo da mensagem que o botão escreve (exemplo = id da peça).
  comoPedir: {
    titulo: "Como pedir",
    passos: ["Escolha a peça", "Toque em Pedir no WhatsApp", "Combine o tamanho com a loja"],
    nota: "Sem cadastro e sem carrinho: a conversa é direto com a Unique.",
    exemplo: "tricot-zara",
  },

  // Marcas em texto grande (nunca logotipo). Aparecem as que têm peça na vitrine; tocar filtra.
  marcas: {
    titulo: "Marcas",
  },

  // Tipos de peça. A ordem aqui é a ordem da barra de categorias.
  // artigo: como a peça entra na mensagem ("na camiseta", "no suéter").
  // plural: nome na barra de categorias.
  tipos: {
    camiseta: { rotulo: "Camiseta", plural: "Camisetas", artigo: "na" },
    polo: { rotulo: "Polo", plural: "Polos", artigo: "na" },
    sueter: { rotulo: "Suéter", plural: "Suéteres", artigo: "no" },
    jaqueta: { rotulo: "Jaqueta", plural: "Jaquetas", artigo: "na" },
    calca: { rotulo: "Calça", plural: "Calças", artigo: "na" },
  },

  // Uma linha por peça. A ordem aqui é a ordem de "Destaques".
  // tamanhos: null mostra "Consulte tamanhos"; ou uma lista, ex.: ["P", "M", "G"].
  // marca: null = marca não informada (a peça aparece, mas fica fora do filtro de marca).
  // pendencia: o que falta confirmar na peça (só aparece na revisão).
  // Não acrescente peça sem nome, preço e fotos confirmados.
  produtos: [
    { id: "puffer-preta",        marca: null,                tipo: "jaqueta",  nome: "Jaqueta Puffer preta",        preco: 399, tamanhos: null, fotos: [PECAS + "puffer-preta-1.webp", PECAS + "puffer-preta-2.webp"], pendencia: "marca" },
    { id: "lacoste-vermelha",    marca: "Lacoste",           tipo: "camiseta", nome: "Camiseta Lacoste vermelha",   preco: 199, tamanhos: null, fotos: [PECAS + "lacoste-vermelha-1.webp", PECAS + "lacoste-vermelha-2.webp"], pendencia: "foto original" },
    { id: "bomber-ralph-lauren", marca: "Polo Ralph Lauren", tipo: "jaqueta",  nome: "Bomber Polo Ralph Lauren",    preco: 520, tamanhos: null, fotos: [PECAS + "bomber-ralph-lauren-1.webp", PECAS + "bomber-ralph-lauren-2.webp"] },
    { id: "diesel-caramelo",     marca: "Diesel",            tipo: "polo",     nome: "Polo Diesel caramelo",        preco: 299, tamanhos: null, fotos: [PECAS + "diesel-caramelo-1.webp", PECAS + "diesel-caramelo-2.webp"], pendencia: "foto original" },
    { id: "tricot-zara",         marca: "Zara",              tipo: "sueter",   nome: "Tricot Zara",                 preco: 460, tamanhos: null, fotos: [PECAS + "tricot-zara-1.webp", PECAS + "tricot-zara-2.webp"] },
    { id: "lacoste-azul-clara",  marca: "Lacoste",           tipo: "camiseta", nome: "Camiseta Lacoste azul-clara", preco: 199, tamanhos: null, fotos: [PECAS + "lacoste-azul-clara-1.webp", PECAS + "lacoste-azul-clara-2.webp"], pendencia: "foto original" },
    { id: "calca-zara",          marca: "Zara",              tipo: "calca",    nome: "Calça Zara",                  preco: 380, tamanhos: null, fotos: [PECAS + "calca-zara-1.webp", PECAS + "calca-zara-2.webp"] },
    { id: "diesel-branca",       marca: "Diesel",            tipo: "polo",     nome: "Polo Diesel branca",          preco: 299, tamanhos: null, fotos: [PECAS + "diesel-branca-1.webp", PECAS + "diesel-branca-2.webp"], pendencia: "foto original" },
  ],

  redes: {
    instagram: { usuario: "@uniqueoficial__", url: "https://instagram.com/uniqueoficial__" },
  },
};
