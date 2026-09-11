# ReinoUp — estado e caminho

Atualizado em 23/08/2026. Handoff para continuidade no GitHub Copilot Pro.

---

## ✅ Feito

**Conteúdo**
- Modelo por temporadas e blocos, uma história por arquivo, IDs padronizados
- Taxonomia de 11 valores substituindo `theme` — alimenta a Trilha de Valores
- Narração separada por faixa etária (`5-7` / `8-10`) com verificador que quebra o build se vier duplicada
- Aula 01 de Gênesis completa, servindo de régua editorial
- Roteiro das 39 aulas encodado em `GENESIS_ROADMAP`
- Trilha sequencial com cadeados

**Marca e design**
- Paleta oficial exata, `theme-color`, manifest e ícone do app corrigidos
- Cores semânticas definidas (acerto, "vamos de novo", perigo adulto) com contraste AA
- Mascote 3D e logo oficiais em WebP com fallback PNG; o mascote usa a mesma arte oficial embutida se ambos falharem, nunca o vetor antigo
- Iconografia da marca (9 ícones SVG) no lugar de emoji
- Telas reconstruídas contra o mockup: **Home · Desafios Diários · Lista de Histórias · Perfil · Quiz · Splash · Seleção de Perfil**

**Pagamento e assinatura**
- Stripe (cartão) e PagBank (PIX) como Cloudflare Pages Functions
- Webhooks com assinatura verificada e upsert idempotente
- Tabela `subscriptions` com RLS; `plano_ativo()` respeita `vigente_ate`
- Login do responsável no Supabase, convivendo com o modo local
- Paywall real: 3 fases livres em Gênesis, bônus só para assinante — travado
  também na rota, não só na lista

**Correções de produto**
- Quiz ilustrado em grade 2×2 (essencial para quem ainda não lê)
- Removido o "✕" vermelho da resposta errada
- Removido o PIN padrão `0000` que abria a Área dos Pais
- Versículo do dia passou a respeitar a faixa etária

**Infra**
- Bun no lugar do npm, local e no CI
- Build do Cloudflare corrigido; GitHub Pages desligado
- Schema Supabase aplicado com RLS forçado e zero alertas

---

## 🔜 Caminho

### 1. Conteúdo — aulas 02 a 39 de Gênesis
O app está estruturalmente pronto e vazio. Cada aula segue `CONTENT-MODEL.md`.
Ordem por bloco; **Caim e Abel (03) é o primeiro teste da matriz de
sensibilidade**. Recomendado: lotes de 5, com teste na Sala Zero entre eles.

### 2. Backend — sync do progresso

⚠️ **O projeto pausa sozinho.** No plano free o Supabase hiberna depois de ~1
semana sem uso e volta com `status: INACTIVE`. Consultas falham com timeout ou
"relation does not exist" enquanto ele restaura. Antes de concluir que algo
sumiu, cheque o status do projeto.
Assinatura e login já estão no banco. **Falta o progresso da criança**: hoje
quem limpa o navegador perde tudo.
- Seleção de perfil da criança (o login do responsável já existe)
- Camada de sync local-first com fila offline
- Migrar `learning_events` do log local para o banco
- Ranking real com convite por código e aprovação dos dois pais

### 3. Telas restantes contra o mockup
Capa da História · Leitura · Jogos · Missões · Baú · Avatar · Ranking ·
Versículo · Álbum · Planos · e as 6 da Área dos Pais.

### 4. Relatório dos pais — inverter a hierarquia
A tela 16 do mockup põe **"Tempo no app"** como métrica principal. Isso dá culpa
ao pai. O schema `learning_events` foi feito para a versão certa: o que ele
aprendeu, onde teve dificuldade, qual valor apareceu mais. **Decisão pendente do
Ramon** — a mudança contraria o design explicitamente.

### 5. Árvore da Palavra
Substituir o álbum de adesivos. Cada aula planta uma semente (a frase ⭐ do
material); as 39 formam a árvore com as 8 palavras e "SOMOS IGREJA" no centro.
É o melhor gancho de retenção do material e ainda não existe no app.

### 6. Modo Professor
O REINOUP KIDS é plano de aula de 45–60 min. Os campos (`salaDeAula`,
`perguntasConversa`) já são gravados em cada história, dormentes. Um professor
traz vinte famílias — é canal de aquisição, não só feature.

---

## 🚧 Bloqueios reais

| O quê | Por quê |
|---|---|
| Capas pintadas (39) | Não existem. Precisa de gerador de imagem ou ilustrador |
| Retratos do quiz | Idem. Hoje em vetor (`MotifIcon`) |
| Medalhas | Ainda emoji; no design são peças douradas com relevo |

## ⚠️ Débito conhecido

- As 6 histórias do MVP em `seasons/bonus/` têm avisos no `bun run check`:
  quiz fora do padrão de posição da escolha, `wordBank` com palavras longas.
  Intencional — elas serão substituídas pelas aulas de Gênesis.
- `arca-de-noe` e `jose-e-seus-irmaos` são de Gênesis e vivem no bônus por ora.
  Devem sair quando `gn-05` e o arco `gn-27..39` forem escritos.
- Bundle acima de 500 kB: falta code splitting por rota.

---

## 🔑 Chaves pendentes (bloqueiam produção)

Sem elas o código roda, mas as Functions respondem 503 e o pagamento não sai.
Cloudflare Pages → `reinoup-app` → Settings → Environment variables:

| Variável | Onde pegar |
|---|---|
| `PAGBANK_TOKEN` | Portal do Desenvolvedor → aba Tokens |
| `PAGBANK_ENV` | `sandbox` ou `production` |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks (após criar o endpoint) |
| `SUPABASE_URL` | `https://whjfaukvqutgmyozfesb.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role |

⚠️ `SUPABASE_SERVICE_ROLE_KEY` passa por cima do RLS. Nunca no cliente, nunca
no repositório.

## ⚖️ Decisão pendente do Ramon

Com **1 aula de Gênesis escrita**, o paywall bloqueia quase tudo. Para os
primeiros pais testarem, talvez valha `exigePlano: false` no bônus
(`content/seasons.ts`) até Gênesis ter ~10 aulas.
