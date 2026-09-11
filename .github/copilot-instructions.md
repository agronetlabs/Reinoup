# ReinoUp — instruções do repositório

App de Bíblia infantil gamificado, em português, para crianças de 5 a 10 anos.
Posicionamento: *"a Bíblia que seu filho abre sozinho"*. Quem paga é o pai; quem
usa é a criança. As duas coisas moldam quase toda decisão aqui.

## Stack e comandos

React 19 · Vite · Tailwind 4 · zustand · react-router 7 · PWA. Tudo dentro de `app/`.

**Use Bun, nunca npm.** O `package-lock.json` foi removido de propósito.

```bash
cd app
bun install
bun run dev            # http://localhost:5173
bun run check          # lint + verificador de conteúdo + build — rode antes de todo commit
bun run build:fast     # build sem reinstalar dependências
```

`bun run build` reinstala antes de compilar: é assim porque o Cloudflare Pages
não reconhece `bun.lock` como lockfile e pulava o install, quebrando com
`tsc: not found`.

## Deploy

Push na `main` → **Cloudflare Pages** publica sozinho em ~1 min:
<https://reinoup-app.pages.dev>. Não há passo manual. O GitHub Pages foi
desligado de propósito — um app, um endereço.

`app/public/_redirects` faz o fallback de SPA. `BASE_PATH` existe para publicar
sob subcaminho, mas hoje é `/`.

## Regras de produto que não se quebram

Estas não são preferências de estilo. Cada uma existe por um motivo:

1. **Errar nunca pune.** Sem vidas, sem coração perdido, sem vermelho, sem "✕".
   O cordeirinho explica a resposta certa e a pergunta volta no fim. É o que
   impede a criança de abandonar o app — e o que separa o ReinoUp do Duolingo
   bíblico. Use `--color-retry` (azul da marca) para "vamos de novo".
2. **Moeda não se compra com dinheiro real.** Jamais. O único jeito de ganhar é
   aprendendo. Protege a confiança do pai e evita problema com as lojas.
3. **A criança não entra na Área dos Pais.** PIN obrigatório, sem padrão
   adivinhável. Não reintroduza fallback tipo `"0000"`.
4. **Duas faixas etárias escritas de verdade.** `Chapter.pages` exige `'5-7'` e
   `'8-10'` com textos diferentes. Duplicar o mesmo texto quebra o
   `bun run check`.
5. **Conteúdo é estático, versionado no git.** Nunca no banco. É o que faz o app
   funcionar offline. O Postgres guarda só progresso, perfis e eventos.

## Conteúdo

`CONTENT-MODEL.md` na raiz é a especificação: hierarquia, convenção de IDs,
gramática de autoria (tamanho de página por idade, 8 perguntas de quiz, escolha
no penúltimo capítulo), matriz de sensibilidade e estratégia de ilustração.

- Uma história por arquivo em `app/src/content/seasons/<livro>/NN-slug.ts`
- Nenhum id fora do `GENESIS_ROADMAP` em `content/seasons.ts`
- Conteúdo legado do MVP em `seasons/bonus/` — não edite para criar coisa nova
- `bun run check` recusa história incompleta ou com faixa etária duplicada

Temporada 1 = **39 aulas de Gênesis** em 5 blocos. Escrita: **1 de 39**.

## Marca

Paleta oficial em `app/src/index.css`, dentro de `@theme`. **Não invente cor.**
As derivadas e as semânticas estão marcadas como tal em comentário.

`#14213D` navy · `#1D4689` azul · `#FF7A29` laranja · `#FFA45C` laranja claro ·
`#FFC93C` amarelo · `#EBA317` dourado · `#FFFBF0` creme · `#F3E9D7` areia

Tipografia: **Baloo 2** para display, **Nunito** para corpo (secundária oficial —
Baloo 2 cansa em parágrafo longo).

Arte oficial em `app/public/brand/`, gerada por
`bun scripts/build-brand-assets.mjs` a partir de `02. Reino UP/01. Identidade Visual/`.
Use `MascotOficial` e `LogoOficial`, que caem no vetor se o arquivo faltar.

⚠️ **O mascote das 21 telas de mockup está desatualizado.** Elas mostram a versão
de capuz; o oficial é o de **boné esportivo**. As telas valem como referência de
**layout**, nunca de personagem.

## Design

`02. Reino UP/02. Telas/` tem as 21 telas de referência. **Elas são a
especificação visual.** Ao mexer numa tela, abra a imagem correspondente e siga
respiro, hierarquia, escala tipográfica, raio de canto e profundidade.

O que ainda não existe como arte: capas pintadas das histórias e retratos dos
personagens do quiz. Enquanto isso, `Scene` e `MotifIcon` (vetor) cobrem.

## Backend

Supabase `whjfaukvqutgmyozfesb` (us-east-2), com RLS forçado em todas as tabelas.
**Conectado ao app**: login do responsável, assinatura e sync do progresso.

O sync é local-first (`lib/sync.ts`): o `zustand/persist` segue como fonte
durante o uso e o servidor é espelho, com envio debounced e last-write-wins por
`client_updated_at`. Sem as `VITE_SUPABASE_*` o app roda 100% local e nada quebra
— por isso elas estão versionadas em `app/.env.production` (a publishable key é
pública por design; quem protege os dados é o RLS).

⚠️ **O projeto free hiberna** depois de ~1 semana parado e volta como
`INACTIVE`. Durante o `RESTORING` as consultas falham com timeout ou
"relation does not exist" — parece perda de schema e não é.

Modelo: **o pai é o titular da conta** (`auth.users`); **a criança é um perfil**,
nunca um usuário. Resolve LGPD, perfis múltiplos e impede a criança de comprar
ou cancelar.

Tabelas: `families` · `child_profiles` · `child_progress` (espelho do estado) ·
`learning_events` (append-only, é daqui que o relatório dos pais nasce — não do
estado atual) · `subscriptions` (escrita só pelos webhooks, com `service_role`).

Ao escrever SQL: RLS obrigatório, `(select auth.uid())` em vez de chamada por
linha, índice em toda coluna de FK usada em policy.

## Testar RLS depois de mexer em policy

`supabase/tests/rls-isolamento.sql` — cole no SQL Editor do Supabase. Roda em
transação com ROLLBACK, não deixa lixo. Prova três coisas: a policy avalia sem
erro de permissão, uma família não lê os dados de outra, e não escreve neles.

O primeiro item já quebrou uma vez: `revoke execute` na função usada pelas
policies fazia o próprio pai levar "permission denied for function owns_child".
Não aparece em build nenhum — só no primeiro login real.
