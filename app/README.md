# ReinoUp

Web App (PWA) de histórias bíblicas gamificadas para crianças — React + TypeScript + Vite.

## Rodando localmente

```bash
bun install
bun run dev       # http://localhost:5173
```

## Build de produção

```bash
bun run build:fast   # gera dist/ (inclui manifest + service worker)
bun run preview      # serve o build de produção localmente
```

Depois de `bun run preview`, abra no navegador do celular (mesma rede) ou no Chrome desktop e use "Instalar app" — é um PWA instalável. Progresso é local-first; confirmação de assinatura exige conexão.

## Stack

- **React 19 + Vite + TypeScript**
- **Tailwind CSS v4** — paleta e tokens em `src/index.css` (`@theme`)
- **React Router v7** (`src/router.tsx`) — rotas de onboarding, app principal (`/app/*`) e Área dos Pais (`/pais/*`, protegida por PIN)
- **Zustand + persist** (`src/store/`) — progresso local-first em `localStorage`, com espelho no Supabase quando configurado
- **Framer Motion** — transições de tela e microanimações
- **vite-plugin-pwa** — manifest + service worker (offline-first)

## Estrutura

```
src/
  content/       # histórias, versículos, missões, medalhas, planos, itens de avatar (dados estáticos)
  store/         # authStore, progressStore, settingsStore, friendsStore
  lib/           # economia (moedas/XP), streak, medalhas, missões, gerador de caça-palavras, datas
  components/    # ui/ (botões, cards...), mascot/ (o cordeirinho em SVG), illustrations/ (cenas por história)
  screens/       # onboarding/, main/, story/, games/, parent/, subscription/
  hooks/         # narração por voz, gravação de áudio, cronômetro de uso, bloqueio por horário
```

## Limitações conhecidas

- Login social (Google/Apple) é simulado. Login do responsável por e-mail/senha, assinatura e sincronização usam Supabase quando configurado.
- Pagamentos usam Pages Functions, não o servidor Vite. Com provedores configurados, os botões podem gerar cobranças reais. Use somente sandbox/test mode durante testes.
- Ranking de amigos usa dados fictícios (não há servidor multiplayer).
- Notificações usam a Notification API do navegador (lembretes locais); não é push real em segundo plano.
- O PIN local da Área dos Pais é uma barreira de uso; autorização de pagamentos no backend depende de JWT do responsável e RLS.

## Pagamentos e preços

- Uma oferta ReinoUp com todos os recursos atuais, **por conta do responsável**, até **4 perfis infantis**.
- R$ **9,98/mês** ou **95,81/ano**, total anual fixo com desconto de 20% (arredondado em centavos). O equivalente aproximado de R$ 7,98/mês **não** é o valor cobrado no PIX anual.
- Fonte única: `shared/billing.ts`, importada pelo frontend e pelas Functions.
- Novas vendas usam o ID persistido `completo` e `priceVersion=2026-09`.
  `essencial` e `familia` continuam reconhecidos como contratos legados vigentes e incluem todos os recursos; não são vendidos.
- Não há mudança automática de valor nas assinaturas Stripe já existentes. Alteração de contratos/preços antigos exige decisão e operação separadas; não recadastrar clientes à força.
- Cartão: assinatura Stripe com renovação automática. PIX: pedido avulso PagBank, sem recorrência; após expirar o período pago, é necessário outro pagamento. Não há acúmulo de meses por múltiplos PIX simultâneos.
- A rota de planos pede PIN. APIs validam o Bearer no Supabase Auth e usam o ID da sessão, nunca uma família arbitrária do corpo. O PIN local é uma barreira de uso, não a autorização de backend.
- `?status=success` só mostra espera. Acesso vem de `subscriptions` sob RLS; localStorage e querystring não ativam plano. Sem conexão a confirmação falha de modo fechado, sem apagar progresso.

### Preparação operacional

**Registro de 2026-09-10:** a migração `202609100001_payment_confirmation.sql` foi aplicada
permanentemente no projeto Supabase `whjfaukvqutgmyozfesb`. O ensaio SQL da confirmação
de pagamentos passou com `service_role`, RLS e `ROLLBACK`; a coluna `webhook_event_at`
foi confirmada pela API remota. Isso não substitui repetir as verificações em outro ambiente.

1. Revisar/aplicar `../supabase/migrations/202609100001_payment_confirmation.sql` **antes** das Functions.
   Ela pressupõe a tabela existente `subscriptions` e o índice único `(provedor, referencia)`.
   Adiciona ordenação de eventos e RPCs restritos a `service_role`; uma pequena tabela RLS guarda cancelamentos que chegam antes do pagamento.
2. Executar `../supabase/tests/payment-confirmation.sql` e `../supabase/tests/rls-isolamento.sql` em banco de teste. Os scripts fazem ROLLBACK.
3. Configurar apenas segredos do servidor (nomes em `.dev.vars.example`). Nunca usar `VITE_` para service role, token PagBank ou segredo Stripe.
4. Stripe: endpoint `/api/stripe-webhook`, eventos `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   Requisições ao Stripe fixam a API `2025-06-30.basil`; assinatura HMAC tem tolerância de cinco minutos e suporta rotação de segredo.
5. PagBank: `notification_urls` é enviado na criação. O webhook verifica SHA-256 do corpo cru e consulta o pedido atual antes de confirmar ou revogar um PIX estornado.
6. Testar sandbox ponta a ponta (pagamento, retorno, renovação, falha, cancelamento/estorno) **antes de ativar produção**. Não há portal de cancelamento no app nesta implementação: o responsável deve pedir cancelamento ao atendimento e a operação executá-lo no Stripe.

Webhooks com banco/provedor indisponível devolvem erro para permitir reenvio.
Stripe reconcilia a fatura paga mais recente e sua validade real; renovação falha não inventa prazo.
Cancelamento ao fim do período mantém o acesso até esse fim. Cancelamento imediato encerra a validade; o fence de eventos impede notificações antigas de reativar acesso.
Reembolsos/disputas de cartão ainda exigem cancelamento/reconciliação operacional no Stripe (não há automação de `charge.refunded`/disputas).
Contratos legados sem metadata na assinatura são resolvidos pela linha existente ou pela sessão antiga assinada.
Contratos antigos sem família precisam de reconciliação manual — não existe fallback anônimo.

### Validação local

```bash
bun run test:payments   # bun:test nativo: handlers, preços, assinatura, estado, replay e retorno; fetch mockado
bun run check          # lint + conteúdo + typecheck Functions + testes pagamentos + build
```

Mocks **não comprovam** pagamento real, credenciais, entrega de webhook, implantação de Functions ou RLS/SQL remoto.
Os comandos acima não realizam cobrança, deploy ou migração.

### Integração real Stripe sandbox (opt-in)

```powershell
# Em outro terminal; não abra frontend nem rotas administrativas neste túnel.
cloudflared tunnel --url http://127.0.0.1:8789

# Com as variáveis abaixo injetadas com segurança no processo:
bun run test:stripe:sandbox
```

- Exige `SANDBOX_RUN=1`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `SANDBOX_CONFIRM_SUPABASE_URL` exatamente igual à URL confirmada e
  `SANDBOX_WEBHOOK_BASE_URL` com a origem HTTPS do túnel.
- `STRIPE_SECRET_KEY` pode vir do ambiente ou do campo correspondente em `.dev.vars`.
  O script recusa chaves fora de `sk_test_` e exige `balance.livemode === false`.
  Nunca coloque chaves, JWTs ou segredos de webhook no relatório ou no git.
- Usa Stripe CLI no PATH, ou `SANDBOX_STRIPE_CLI` apontando para seu executável,
  para reenviar eventos reais. Não usa fixtures, eventos fabricados ou assinaturas locais.
- O servidor Bun escuta somente `127.0.0.1:8789` (`SANDBOX_PORT` permite alterar).
  Expõe apenas os handlers POST de Checkout/webhook e uma rota GET `/health`.
  O endpoint Stripe temporário é criado pela API; seu segredo fica somente em memória.
- Cria um responsável QA fictício, autentica por senha e chama o handler real de
  Checkout com seu JWT. Confere mensal de 998 centavos e anual de 9581 centavos.
- Por padrão, cria e expira os Checkouts sem pagá-los; pagamentos reais de teste são
  feitos separadamente pela API de assinaturas. **Checkout criado não significa Checkout pago.**
  Com `SANDBOX_CHECKOUT_WAIT_SECONDS=600`, escreve links locais em `.local` e aguarda
  a conclusão no navegador com cartão de teste antes de cancelar/limpar.
- Confere valores e períodos no Supabase após webhooks reais, recusa, expiração,
  cancelamento e replay antes/depois do cancelamento.
- Grava métricas sem segredos em `..\.local\reinoup-qa-*.json` (gitignored).
  Na limpeza, encerra assinaturas QA, expira sessões abertas, remove clientes e
  endpoint, arquiva recursos de catálogo e exclui somente o usuário QA criado.
  Histórico Stripe, snapshots inline imutáveis e registros de cancelamento sem
  direito de acesso são preservados.
- `bun run test:stripe:sandbox --stripe-only` é uma alternativa explicitamente
  **sem** autenticação do app, webhook, Supabase ou replay; não comprova integração.

Para conferir login real, PIN e plano ativo **na UI**, use `SANDBOX_UI_MODE=1` com
um build existente em `dist`, `SANDBOX_QA_EMAIL` fictício no formato
`reinoup-qa-...@example.com` e `SANDBOX_QA_PASSWORD` de 16–72 bytes escolhidos pelo
operador e injetados sem logging. Esse modo cria somente essa conta QA nova;
não reutiliza nem apaga uma conta preexistente. Abra `http://127.0.0.1:8789`,
entre pela UI, configure o PIN e inicie o Checkout pelo app. O harness permite o
JWT renovado dessa mesma família e mantém a assinatura ativa para o polling da UI.
Depois de conferir o estado ativo, escreva `ui-verified` no arquivo de conclusão
anunciado pelo harness: só então ocorre o cancelamento/limpeza. Cada espera tem
limite de 20 minutos. A conferência visual é registrada como atestado do operador,
não como asserção automatizada.

Os arquivos de `dist` e a rota de criação de Checkout ficam acessíveis somente
por requisições diretas com Host de loopback e sem cabeçalhos de proxy. Pelo túnel,
permanecem apenas webhook, health check mínimo e retorno textual benigno; não são
publicados frontend, credenciais ou endpoints administrativos. Esse modo opcional
de UI é separado das evidências de sandbox já registradas abaixo.

**Evidência real de 2026-09-10:** os Checkouts mensal e anual foram pagos no
navegador sandbox, e os respectivos valores/períodos foram confirmados no Supabase.
A rodada automatizada final passou em 14 verificações, recebeu 12 webhooks HTTP 200
e executou quatro reenvios reais via Stripe CLI sem duplicação nem reativação após
cancelamento. Os pagamentos no navegador estão registrados na rodada anterior;
a rodada final não repetiu essa etapa. A verificação independente da limpeza
confirmou três usuários QA excluídos, seis assinaturas encerradas e nenhuma linha
de assinatura QA restante.

Artefatos locais: `reinoup-qa-1789087221023-9d71cc5f.json` (evidências de navegador;
essa rodada também registrou uma expectativa incorreta do harness sobre encerramento
de assinatura incompleta, posteriormente corrigida),
`reinoup-qa-1789087558867-aeb46cce.json` (rodada final aprovada) e
`stripe-sandbox-cleanup-verification.json`, todos em `..\.local`.
Esses resultados não comprovam deploy das Functions, cobrança em produção,
renovação futura, estorno/disputa ou integração real PagBank.
