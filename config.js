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
    // As fotos atuais foram recortadas dos prints do catálogo (baixa resolução).
    // Troque pelos arquivos originais com o mesmo nome e apague esta linha.
    pendenciaFotos: "foto original",
  },

  // Tipos de peça. A ordem aqui é a ordem do filtro.
  // artigo: como a peça entra na mensagem ("na camiseta", "no moletom").
  tipos: {
    camiseta: { rotulo: "Camiseta", artigo: "na" },
    polo: { rotulo: "Polo", artigo: "na" },
  },

  // Uma linha por peça. A ordem aqui é a ordem de "Destaques".
  // tamanhos: null mostra "Consulte tamanhos"; ou uma lista, ex.: ["P", "M", "G"].
  // Não acrescente peça sem nome, preço e fotos confirmados.
  produtos: [
    { id: "lacoste-vermelha",   marca: "Lacoste", tipo: "camiseta", nome: "Camiseta Lacoste vermelha",   preco: 199, tamanhos: null, fotos: [PECAS + "lacoste-vermelha-1.webp", PECAS + "lacoste-vermelha-2.webp"] },
    { id: "diesel-caramelo",    marca: "Diesel",  tipo: "polo",     nome: "Polo Diesel caramelo",        preco: 299, tamanhos: null, fotos: [PECAS + "diesel-caramelo-1.webp", PECAS + "diesel-caramelo-2.webp"] },
    { id: "lacoste-azul-clara", marca: "Lacoste", tipo: "camiseta", nome: "Camiseta Lacoste azul-clara", preco: 199, tamanhos: null, fotos: [PECAS + "lacoste-azul-clara-1.webp", PECAS + "lacoste-azul-clara-2.webp"] },
    { id: "diesel-branca",      marca: "Diesel",  tipo: "polo",     nome: "Polo Diesel branca",          preco: 299, tamanhos: null, fotos: [PECAS + "diesel-branca-1.webp", PECAS + "diesel-branca-2.webp"] },
  ],

  redes: {
    instagram: { usuario: "@uniqueoficial__", url: "https://instagram.com/uniqueoficial__" },
  },
};
