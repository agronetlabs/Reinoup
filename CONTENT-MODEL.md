# Modelo de Conteúdo — ReinoUp

Como o conteúdo bíblico do ReinoUp é estruturado, escrito e adicionado.
Vale para Gênesis e para todo livro que vier depois.

---

## 1. Hierarquia

```
TEMPORADA (livro)  →  BLOCO (arco)  →  HISTÓRIA (fase)  →  CAPÍTULO (cena)
```

| Nível | Onde vive | Exemplo |
|---|---|---|
| Temporada | `content/seasons.ts` | Gênesis — "Deus estava lá" |
| Bloco | `content/seasons.ts` | `gn-b5` — "José: do Poço ao Palácio" |
| História | `content/seasons/<livro>/NN-slug.ts` | `gn-01-criacao` |
| Capítulo | dentro do arquivo da história | `gn-01-c1` |

O **bloco** define onde ficam os baús da trilha, as missões temáticas e as
medalhas de progresso. Toda temporada precisa de blocos.

---

## 2. Convenção de IDs

Trave isso. É o que impede colisão quando houver 250 histórias.

| Coisa | Padrão | Exemplo |
|---|---|---|
| Livro | abreviação bíblica | `gn`, `ex`, `js`, `1sm` |
| História | `<livro>-<ordem 2 dígitos>-<slug>` | `gn-27-jose-irmaos` |
| Capítulo | `<id da história>-c<n>` | `gn-27-c3` |
| Quiz | `<id da história>-q<n>` | `gn-27-q4` |
| Versículo da história | `v-<livro>-<ordem>` | `v-gn-01` |
| Versículo temático | `v-<valor>-<n>` | `v-amor-3` |
| Bloco | `<livro>-b<n>` | `gn-b2` |
| Medalha de bloco | `md-<livro>-bloco-<n>` | `md-gn-bloco-2` |

Ordem com zero à esquerda (`01`, não `1`) — assim a ordenação alfabética dos
arquivos já é a ordem correta da temporada.

**Nenhuma história pode ser criada com um id que não esteja no roadmap**
(`GENESIS_ROADMAP` em `content/seasons.ts`).

---

## 3. Onde o conteúdo mora

```
app/src/content/
├── types.ts               # schema
├── valores.ts             # os 11 valores
├── seasons.ts             # temporadas, blocos e o roadmap das 39
├── stories.ts             # barrel: catálogo, desbloqueio, leitura por idade
├── verses.ts
└── seasons/
    ├── genesis/
    │   ├── index.ts       # registra as aulas escritas
    │   └── 01-criacao.ts  # uma história por arquivo
    └── bonus/
        ├── index.ts       # adapta o conteúdo do MVP
        └── legacy.ts      # schema antigo, não editar
```

**Um arquivo por história.** Não existe arquivo com duas histórias.

O conteúdo é **estático, versionado no git** — nunca no banco. É o que faz o
app funcionar offline e carregar instantâneo. O Postgres guarda só progresso,
perfis e eventos.

---

## 4. Gramática de autoria

Regras fixas. É o que faz 39 histórias parecerem uma coisa só.

| Elemento | Regra |
|---|---|
| Capítulos | 4 a 5 por história |
| Páginas por capítulo | 2 a 3 |
| Página `5-7` | 25 a 45 palavras · frases curtas · uma ideia por frase |
| Página `8-10` | 50 a 90 palavras · pode ter diálogo e subordinada |
| Corte | Todo capítulo termina em gancho, exceto o último |
| Ponto de escolha | Exatamente 1, no **penúltimo** capítulo |
| Quiz | 8 perguntas: 3 fato · 3 compreensão · 1 versículo · 1 aplicação |
| Quiz ilustrado | Mínimo 2 perguntas com `optionIcons` (grade 2×2 com figura) |
| Feedback do erro | Sempre explica a resposta certa. **Nunca julga.** |
| `wordBank` | 6 a 8 palavras · MAIÚSCULAS · sem acento · 4 a 8 letras |
| `memoryPairs` | Exatamente 6 |
| `orderSteps` | Exatamente 5, já na ordem certa |
| Duração alvo | 5 a 7 minutos de leitura |

### As duas faixas etárias não são opcionais

`Chapter.pages` exige `'5-7'` e `'8-10'` escritos de verdade. Não duplique o
mesmo texto: o filho de 5 anos trava com o texto do de 10, e o de 10 acha
infantil o texto do de 5.

> O conteúdo legado em `seasons/bonus/` duplica o texto nas duas faixas — é um
> andaime temporário, marcado no código. Conteúdo novo nunca faz isso.

---

## 5. Ilustração

As 21 telas de referência (`02. Reino UP/02. Telas/`) são construídas sobre pintura
raster. Fazer isso em toda cena de capítulo custaria ~300 imagens só em Gênesis.

Direção aprovada: ilustração original de animação familiar 3D, com expressões
legíveis, materiais táteis e iluminação que ajuda a contar a história. Referências
de estúdio indicam acabamento, não autorizam copiar personagens nem redefinir a marca.
O piloto raster é `gn-02`; não considerar o catálogo inteiro convertido.
**Afinamento visual confirmado em 2026-09-11:** do documento de direção
externo, aproveitar somente a linguagem visual DisneyClub3D. As aulas,
lições, capítulos, perguntas, faixas etárias e acontecimentos continuam sendo
os do app; o documento não altera o roadmap nem a identidade do mascote.
O objetivo é animação familiar 3D **estilizada**, não fotografia: volumes
arredondados, silhuetas legíveis, materiais macios/foscos, luz quente difusa,
poucos detalhes de superfície e fundo simples. Manter a emoção escrita no
capítulo, inclusive preocupação ou tristeza; suavizar o desenho não apaga
consequências nem transforma todas as cenas em momentos felizes.
O acabamento deve ser reconhecível em card pequeno, com um foco dominante.
Textura fotográfica, microdetalhes de casca/pedra/pão, reflexos excessivos e
fundos carregados não atendem ao afinamento. O formato WebP, o nome do modelo
ou um aviso de produção não comprovam conformidade visual.
`app/scripts/lib/story-art-style.mjs` concentra essa direção para os geradores;
a revisão `disneyclub3d-stylized-v2` é registrada em dry-runs e novas gerações,
sem reclassificar ou substituir imagens já produzidas.
A direção confirmada em 2026-09-11 é levar o mesmo acabamento 3D original
aos cards de todas as telas, começando pela jornada completa de Adão e Eva.
**Regra global, sem exceção de história ou tela:** toda imagem de card, capa
e cena de leitura deve seguir esse acabamento, chamado pelo responsável de
"Disney Club 3D". Inclui Criação, Caim e Abel, histórias bloqueadas, alternativas
de quiz/escolha e figuras de jogos, desafios e recompensas. O conteúdo visual
continua original e o mascote oficial não é redesenhado.
Enquanto a substituição 3D não estiver produzida e aprovada, preservar as
figuras distintas existentes como fallback transitório. Substituir todas por
avisos idênticos prejudica a leitura do quiz, a memória e o quebra-cabeça.
`data-art-status="legacy-fallback"` identifica essa pendência na inspeção
técnica, sem apresentá-la como arte 3D aprovada. Não considerar o fallback
uma exceção ao objetivo visual final.
Sombras, gradientes ou converter SVG para WebP não tornam uma arte plana uma
ilustração 3D. Não considerar uma tela visualmente concluída enquanto suas
imagens principais dependerem desses desenhos provisórios.
O alcance global da direção visual não amplia automaticamente o lote pago:
produção e publicação continuam sujeitas às autorizações específicas abaixo.

| Onde | Formato | Regra de produção |
|---|---|---|
| Capa da história | WebP raster + SVG de reserva | Título e referência em HTML, nunca embutidos na imagem |
| Figuras dos cards de quiz e escolha | WebP 3D aprovado; `MotifIcon` como fallback | Uma resposta legível por imagem; o texto continua em HTML |
| Cena de capítulo | WebP quando aprovado; SVG/motivos como fallback | Uma ação e uma emoção legíveis por cena |
| Mascote | arte oficial de boné, separada da cena | Não sobrepor às imagens durante a leitura; reservar para orientação e feedback. Não redesenhar nem gerar junto com os personagens bíblicos |

`MotifIcon` preserva figuras reconhecíveis durante a migração, inclusive em
memória, adesivos e quiz; não é a arte final. Cada motivo que ocupar uma área
de imagem precisa ganhar uma arte 3D aprovada no inventário correspondente.

O primeiro lote de amostras dos cards do piloto tem quatro imagens para
`gn-02-q2`: árvore com fruto, pão assado, água de rio e alimento dos animais.
As quatro amostras da primeira rodada foram produzidas em área privada;
permanecem sem aceite visual e sem integração. Afinar os prompts não regenera
esse lote nem autoriza ampliar a produção.
Não representar pão só por trigo nem alimento só pela figura do animal.
Todas as alternativas devem ter o mesmo acabamento e destaque, sem pistas
visuais de qual é a correta. Manter texto, controles e selo de acerto fora da arte.
Produzir amostras não autoriza publicá-las: `app/shared/quiz-card-art.ts`
separa o inventário do lote da lista de artes aprovadas, ainda vazia. O
componente de card confere a imagem e seu texto alternativo contra esse
registro. Estar em `story-art` ou terminar em WebP não equivale a aprovação.

### Continuidade dos personagens e da narrativa

Antes de gerar novas cenas, registrar personagem, roupa, expressão, enquadramento
e acontecimento que a imagem precisa mostrar. Comparar com a capa aprovada.
Uso do mesmo modelo ou prompt não garante identidade entre gerações.

Ficha textual de continuidade do piloto `gn-02`:

| Elemento | Referência a preservar |
|---|---|
| Adão | Adulto, pele morena, cabelo escuro cacheado, barba curta, túnica creme, faixa azul, sandálias |
| Eva | Adulta, pele morena, cabelo escuro longo e ondulado, vestido areia, faixa laranja, sandálias |
| Jardim | Natureza abundante, água e profundidade; detalhes não podem esconder a ação em telas pequenas |
| Serpente | Animal identificável, sem caricatura aterrorizante; não transformar engano em conselho confiável |
| Vestimentas | Adaptação artística familiar, não reconstituição histórica; não variar corte, faixa e acessórios entre cenas sem motivo |
| Mascote | Usar a arte oficial existente; novas poses exigem aprovação, sem alterar proporções ou símbolos |

Há variações de roupa nas imagens raster atuais; a ficha é o critério para as
próximas revisões, não uma declaração de consistência perfeita. Falta uma ficha
visual de personagens em múltiplos ângulos.

| Aula | Critério editorial para a direção visual |
|---|---|
| 01 — Criação | Seguir a ordem dos capítulos; distinguir primeira luz e luminares; incluir a criação das pessoas; sem figura humana representando Deus |
| 02 — Adão e Eva | Cuidado → dúvida → esconderijo → consequências e cuidado; não confundir árvore da vida e árvore do fruto proibido |
| 03 — Caim e Abel | Raiva, escolha, perda e cuidado; não representar a agressão graficamente |
| 04 — Enoque | Presença e caminhada com Deus; separar relato bíblico de exemplos contemporâneos |
| 05 — Noé | Construção, entrada, dilúvio e promessa; não antecipar o arco-íris nas cenas da tempestade |
| 06 — Babel | Orgulho, línguas e dispersão; arquitetura antiga estilizada, não castelo medieval; não caricaturar povos |

Abraão permanece nos slots 07 e seguintes do roadmap. Alegações como “aprende
3x mais rápido”, “primeiro app do mundo” e superioridade garantida de modelos
não constituem critérios editoriais nem podem virar promessas sem evidência.

### Interface, áudio e critérios de aceite

- Toda fala deve soar como português brasileiro nativo: pronúncia, ritmo,
  entonação e vocabulário. Texto em português ou modelo multilíngue não bastam.
  Rejeitar voz com sotaque estrangeiro ou português europeu. Avaliar por escuta,
  incluindo nomes bíblicos e frases completas, antes de aprovar novos lotes.
- O fallback do sistema só pode escolher vozes identificadas como `pt-BR`,
  preferindo as locais. Sem voz brasileira disponível, mostrar orientação e
  permitir leitura silenciosa; nunca recorrer ao idioma padrão do aparelho.
- A voz clonada “Leandro” pertence a outro projeto e foi explicitamente retirada
  pelo titular. Não pode ser usada no ReinoUp, nem como fallback ou padrão.
  Os 104 áudios anteriores foram retirados de `public` e do build e preservados
  apenas em quarentena local ignorada. A conversa remota está sem fala até que
  outra voz seja escolhida e aprovada. O modelo `eleven_multilingual_v2` não suporta
  `language_code`; não adicionar `pt-BR` nesse campo como suposta garantia.
- Novas vozes exigem aprovação explícita para este projeto, além de avaliação
  de português brasileiro nativo. Registrar o ID autorizado em
  `app/shared/voice-policy.ts`; não reutilizar uma voz pessoal pelo fato de ela
  estar disponível na conta. Não regenerar lote antes da aprovação da nova amostra.
- A autorização é por função: narração, mascote, explicações, hero, desafios
  e momentos premium. Registrar referências não sensíveis da permissão de uso
  no ReinoUp e do aceite humano da amostra. Avaliar as seis funções não obriga
  usar seis vozes, criar telas ou alterar ofertas. Aprovação de narração estática
  nunca libera conversa ao vivo; essa permissão permanece independente e desligada.
- Preservar Baloo 2 nos títulos e Nunito na leitura; usar os tokens da interface,
  sem tentar limitar toda a natureza às cores dos botões.
- Conferir rostos e ações em capa, card e leitor; não aprovar só pela imagem ampliada.
- Narrador e mascote têm funções distintas. Não regenerar a voz já aprovada
  para introduzir uma voz de guia.
- Narração estática usa o texto versionado e marcações por palavra. Alterar o
  texto exige revalidar/regenerar o áudio correspondente.
- No piloto `gn-02`, escolha, quiz e resumo também são entradas narráveis,
  com IDs estáveis derivados do conteúdo em `app/shared/story-audio-segments.ts`.
  Manifestos v2 registram voz e função por entrada; perguntas e alternativas
  nunca antecipam a narração do feedback. Todas as falas dependem de toque,
  compartilham o ciclo de pausa/interrupção e não se sobrepõem.
- Troca de imagem por capítulo e destaque de palavras não são animação facial.
  Movimento deve servir à compreensão, respeitar movimento reduzido e não
  avançar páginas automaticamente.
- Celebrar marcos de aprendizagem, não apenas responder a cada toque.
  Concluir uma aula, terminar um desafio ou conquistar uma medalha deve ter
  mais destaque que navegar ou selecionar uma opção. Manter feedback cotidiano
  discreto e acolhedor; sons e animações de celebração respeitam as configurações
  de som e movimento reduzido. Não criar recompensa por toque nem punição por erro.
- Sons ambientais, download completo de histórias, poses articuladas e gravações
  persistentes são etapas próprias, não funcionalidades prontas por existir um SDK.
- Aprovar em conjunto leitura, narração, pausa/retomada, escolha, quiz e resumo.
  Testar silêncio, saída da tela, mudança de faixa etária e interrupção de conexão.

---

## 6. Segurança editorial

Marque `sensibilidade` e adapte a narração de `5-7`.

Evitar terror e humilhação não significa eliminar tristeza, dúvida ou consequências.
Tratar essas emoções com acolhimento, sem atribuir culpa à criança pelo desempenho.
Conversa aberta por voz requer avaliação própria de consentimento do responsável,
conteúdo, duração, custo e tratamento dos dados; não herda aprovação da narração estática.

| Tag | Aparece em | Regra para `5-7` |
|---|---|---|
| `violencia` | Caim e Abel | "machucou o irmão" — foco na raiva e na escolha |
| `morte` | Caim, morte de Sara, morte de Jacó | nomear sem descrever; ir para o consolo |
| `destruicao` | Sodoma e Gomorra | "a cidade ia acabar"; sem detalhe |
| `engano` | Jacó e Isaque, Esaú | foco na consequência |
| `arranjo-familiar` | Agar, Raquel e Lia | "formou uma grande família"; sem explicar |

---

## 7. Os valores

`content/valores.ts` — a taxonomia oficial de caráter. Cada história tem **um**
`valor` primário; secundários são opcionais.

Ela alimenta três coisas: a Trilha de Valores no relatório dos pais, as missões
temáticas e a Árvore da Palavra (cada valor mapeia numa das 8 palavras da
árvore via `palavraArvore`).

Não invente valor novo por história. Se nenhum servir, o problema é o recorte
da lição, não a taxonomia.

---

## 8. Como adicionar uma história

1. Confirme o slot no `GENESIS_ROADMAP` (id, ordem, valor, sensibilidade).
2. Crie `content/seasons/<livro>/NN-slug.ts` exportando um `Story`.
3. Registre no `index.ts` da temporada.
4. Adicione o versículo `v-<livro>-NN` em `verses.ts`.
5. Se a cena pedir um motivo visual novo, adicione em `types.ts` **e** desenhe
   o SVG em `components/illustrations/MotifIcon.tsx`.
6. `bun run check` — TypeScript e verificador recusam história incompleta.
7. Teste na Sala Zero antes de considerar pronta.

---

## 9. Desbloqueio

Temporada sequencial (`sequencial: true`): a fase N+1 abre quando a N é
concluída. A trilha mostra as fases travadas com cadeado desde o primeiro dia —
ver o que falta é o que puxa a criança.

Lógica em `stories.ts`: `isStoryUnlocked()` e `proximaHistoria()`.
