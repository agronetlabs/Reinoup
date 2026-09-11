# Assets oficiais da marca

Coloque aqui os dois arquivos, com estes nomes exatos:

| Arquivo | O que e | Formato |
|---|---|---|
| mascote.png | Cordeirinho de bone esportivo, corpo inteiro, polegar pra cima | PNG com fundo TRANSPARENTE, altura >= 1000px |
| logo.png | Biblia aberta com cruz dourada + wordmark ReinoUp | PNG com fundo TRANSPARENTE, altura >= 400px |

A ovelha antiga não pode aparecer em nenhuma tela, inclusive em falhas de rede.
`MascotOficial` tenta WebP, depois PNG e, se ambos falharem, a mesma arte oficial
embutida no JavaScript. O PWA inclui WebP e PNG no cache offline.

Gere os arquivos a partir dos originais do repositório com
`bun scripts/build-brand-assets.mjs` dentro de `app/`. Para atualizar apenas as
cópias embutidas, use `bun scripts/build-mascot-fallbacks.mjs`.
Essas cópias ficam em `app/src/assets/brand/` e devem ser versionadas.

Home, Perfil e Avatar também usam a arte oficial. Roupas e acessórios do avatar
aguardam artes compatíveis: não são vendidos nem aplicados ao personagem enquanto
isso. Itens e seleções já salvos são preservados; fundos continuam disponíveis.

Mascote oficial: o de BONE ESPORTIVO do brandbook.
As 21 telas em '02. Telas/' usam o mascote antigo de capuz --
servem de referencia de layout, nunca de personagem.
