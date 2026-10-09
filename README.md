# Prévia: Unique

Prévia de demonstração criada por Crociatti Digital. **Não é o site oficial.**
A página tem `noindex, nofollow` e não deve aparecer no Google.

Uma vitrine que substitui o catálogo em PDF: o cliente filtra por marca e tipo,
ordena por preço, abre a peça e pede pelo WhatsApp em um toque. Sem carrinho e
sem pagamento.

HTML, CSS e JavaScript puros: não precisa instalar nada nem rodar build.

## Estrutura

```
index.html        estrutura das seções (não precisa mexer)
config.js         TODOS os dados da loja e das peças: troque só este arquivo
css/styles.css    visual
js/app.js         monta a página a partir do config.js
assets/produtos/  fotos das peças (2 por peça)
```

## Acrescentar uma peça

1. Salve as duas fotos em `assets/produtos/` (verticais 3:4, ex.: 900×1200,
   WebP ou JPG até ~120 KB). A primeira é a de frente; a segunda, detalhe ou costas.
2. Copie uma linha de `produtos` no `config.js` e troque os dados:

```js
{ id: "boss-branca", marca: "Boss", tipo: "camiseta", nome: "Camiseta Boss branca", preco: 199, tamanhos: null, fotos: [PECAS + "boss-branca-1.webp", PECAS + "boss-branca-2.webp"] },
```

- `id`: único, sem espaço nem acento. Vira o link direto da peça (`#peca=boss-branca`).
- `tipo`: uma chave de `tipos` (`camiseta`, `polo`). Para um tipo novo, acrescente
  em `tipos`, ex.: `moletom: { rotulo: "Moletom", artigo: "no" }`.
- `tamanhos`: `null` mostra "Consulte tamanhos"; ou uma lista, ex.: `["P", "M", "G"]`.
- Os filtros de marca e tipo se montam sozinhos a partir das peças.
- Não acrescente peça sem nome, preço e fotos confirmados.

## Pendências

Valor `null` é uma **pendência**. Com `mostrarPendencias: false` (padrão) ela some
da página. Com `true`, aparece como **[CONFIRMAR]** para revisão. Para revisar sem
mexer no arquivo, acrescente `?pendencias=1` ao endereço.

`pendencia: "texto"` marca algo que está na página mas ainda precisa de
confirmação (hoje: a promoção e as fotos). Não esconde nada; só mostra a etiqueta
na revisão.

Pendências atuais:

- **Fotos**: recortadas dos prints do catálogo, em baixa resolução (255×340).
  Troque pelos arquivos originais com o mesmo nome e apague `pendenciaFotos`.
- **Promoção** "Compre 1, leve 2": está no post fixado do Instagram em 09/10/2026.
  Confirmar se está vigente; para tirar, `promocao.ativo: false`.
- **Tamanhos**: não informados ("Consulte tamanhos").
- **Nomes**: o catálogo chama as Diesel de "Camiseta Diesel"; aqui são "Polo Diesel"
  conforme o briefing, com a cor para distinguir as peças de mesmo preço.

## Tema

`tema: "claro"` ou `"escuro"`, com as cores em `cores`. Vermelho (`cores.destaque`)
só na faixa de promoção; preto (`cores.marca`) no topo e no rodapé. Para comparar
sem publicar, use `?tema=escuro` no endereço.

## Testar no computador

```bash
python -m http.server 5174
```

e abra `http://localhost:5174`.

### Simular horário (selo Aberto/Fechado)

Acrescente `?agora=dia-HH:MM` ao endereço. Exemplos:

- `?agora=sab-17:30` → aberto, fecha às 18h
- `?agora=dom-14:00` → fechado, abre amanhã às 11h

Dias: `dom seg ter qua qui sex sab`. Feriados não são considerados.

## Publicar no GitHub Pages

1. No GitHub: **Settings → Pages → Build and deployment**.
2. Em *Source* escolha **Deploy from a branch**, branch **main**, pasta **/(root)**, e salve.
3. Em 1 a 2 minutos o site fica em `https://fcrociatti.github.io/demoLandingPageUnique/`.

Para um site oficial (não prévia), troque `previa.ativo` para `false` e remova as
duas linhas `robots`/`googlebot` do `index.html`.
