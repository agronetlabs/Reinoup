# ReinoUp

Web App (PWA) de histórias bíblicas gamificadas para crianças — React + TypeScript + Vite.

## Rodando localmente

Use **Bun 1.4.2**, fixado em `packageManager` e `engines.bun`.
Execute os comandos abaixo dentro de `app/`. Não use npm nem gere
`package-lock.json`. `check:bun` interrompe dev, check e builds se a versão
do runtime divergir, antes de instalar dependências ou compilar.

```bash
bun --version    # deve retornar 1.4.2
bun install --frozen-lockfile
bun run dev       # http://localhost:5173
```

## Build de produção

```bash
bun run build        # verifica Bun, instala pelo lockfile e compila
bun run build:fast   # gera dist/ (inclui manifest + service worker)
bun run preview      # serve o build de produção localmente
```

Depois de `bun run preview`, abra no navegador do celular (mesma rede) ou no Chrome desktop e use "Instalar app" — é um PWA instalável. Progresso é local-first; confirmação de assinatura exige conexão.

### Versão no Cloudflare Pages

No projeto `reinoup-app`, configure as variáveis de **build** em ambos os ambientes,
**Production** e **Preview**:

| Configuração | Valor |
|---|---|
| `BUN_VERSION` | `1.4.2` |
| `SKIP_DEPENDENCY_INSTALL` | `1` |
| Root directory | `app` |
| Build command | `bun run build` |
| Build output directory | `dist` |

O install automático fica desativado porque `build` já executa
`bun install --frozen-lockfile`. O Pages não seleciona Bun por `engines`:
use `BUN_VERSION` no painel, não em `.env.production` nem apenas como binding
de runtime no `wrangler.toml`. Consulte a
[documentação do build image](https://developers.cloudflare.com/pages/configuration/build-image/).
Ao atualizar Bun, mantenha os dois campos do pacote e os dois ambientes alinhados.
Confirme a versão no log do próximo build; esta documentação não confirma que o
painel remoto já foi atualizado.

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

## Narração das histórias

**Narração de estúdio suspensa:** a voz clonada “Leandro” foi retirada pelo titular
por pertencer a outro projeto. Os 104 MP3 e seis manifestos foram movidos para
`.local/withdrawn-leandro-audio`, fora de `public`, `dist` e do Git. A voz na
ElevenLabs não foi excluída nem modificada.

`shared/voice-policy.ts` mantém autorizações por função, atualmente vazias,
e bloqueia a voz retirada em todas elas. Cada autorização exige referências
não sensíveis da permissão de uso no ReinoUp e do aceite humano da amostra.
`APPROVED_VOICE_IDS` é a projeção das vozes aprovadas para narração; aprovar
mascote ou explicações não autoriza usá-los como narrador.
O gerador não possui mais voz padrão: exige
`ELEVENLABS_VOICE_ID` aprovado antes de qualquer chamada paga. O leitor rejeita
manifestos de vozes não autorizadas, inclusive em cache, e não tenta URLs MP3
legadas sem manifesto aprovado. Usa somente a voz `pt-BR` do aparelho ou leitura
silenciosa com mensagem. A nova versão do service worker limpa
`story-narration-v1` na ativação; clientes antigos precisam atualizar o app.

O áudio é estático, separado por história, faixa etária e entrada narrável.
A geração usa o endpoint ElevenLabs **with timestamps**, grava os MP3s em
`public/audio/stories/` e cria um `manifest.json` por história. O formato v2
guarda voz/função, modelo, parâmetros, duração, hash e cues por entrada;
manifestos v1 das páginas continuam aceitos somente com voz autorizada e
conteúdo válido. O app só usa uma entrada cujo hash corresponda ao texto
atual; ausência ou invalidação mantém a alternativa pt-BR do aparelho.

**Idioma obrigatório: português brasileiro nativo.** O fallback só usa uma voz
identificada como `pt-BR` (preferencialmente local), nunca `pt-PT`, `pt` genérico
ou o idioma padrão do aparelho. Se não houver uma voz brasileira disponível,
o leitor explica a indisponibilidade e continua permitindo a leitura silenciosa.
O rótulo de idioma não certifica sotaque; a narração ElevenLabs exige aprovação
de pronúncia, entonação e nomes bíblicos por escuta.

### Cobertura audiovisual preparada para Adão e Eva

Somente `gn-02-adao-eva` ganhou os controles adicionais de escuta para escolha,
perguntas/opções/feedback do quiz e resumo (lição, frase e oração).
Feedback só fica disponível após responder. A criança inicia cada reprodução;
não há avanço automático. Trocar de trecho encerra o anterior, inclusive entre
os blocos do resumo. Os controles usam o mesmo player das páginas, sem sobreposição.

Inventário atual nas duas idades: **130 entradas = 16 páginas + 114 segmentos**,
com **7.928 caracteres de texto**, não uma estimativa de créditos. Por faixa:
8 páginas, 5 segmentos da escolha, 49 do quiz e 3 do resumo.
`shared/story-audio-segments.ts` deriva os textos do conteúdo versionado.
As páginas mantêm suas versões distintas por idade; textos interativos seguem
a autoria compartilhada já existente. Isso é suporte local, não um lote gerado:
a narração de estúdio permanece suspensa até aprovação e produção autorizada.

### Avaliação das sugestões de voz — 2026-09-11

O CSV do responsável sugere seis funções, não seis autorizações.
Na [biblioteca pública oficial](https://elevenlabs.io/voice-library), os nomes
abaixo correspondem a estas entradas. As descrições e o idioma principal
foram conferidos nos metadados públicos da página; nomes homônimos podem
identificar outras vozes. Nenhuma prévia foi regenerada ou incorporada ao app.

| Função sugerida | Candidata / ID identificado | Resultado da triagem |
|---|---|---|
| Narração bíblica | Bell / ID não confirmado | Identidade, origem brasileira e direitos pendentes |
| Narração bíblica | Sara Martin / `KHCvMklQZZo0O30ERnVn` | Descrita como espanhola castelhana (`es`); esta entrada não atende ao requisito nativo brasileiro |
| Mascote | Peter — Youthful / `TumdjBNWanlT3ysvclWh` | Descrito como húngaro (`hu`); esta entrada não atende ao requisito. Há outros Peter no catálogo |
| Explicações | Otani / `3JDquces8E8bkmvbh6Bc` | Descrito como japonês (`ja`); esta entrada não atende ao requisito |
| Telas hero | Heart / ID não confirmado | Identidade, origem brasileira e direitos pendentes |
| Desafios | Amelia / `ZF6FPAbjXT4488VcRRnw` | Descrita como britânica (`en`); esta entrada não atende ao requisito |
| Momentos premium | Heart / ID não confirmado | Mesma pendência; avaliar voz não cria oferta, tela ou mudança de pagamento |

**Alternativas para escuta, ainda não aprovadas:** a
[página oficial de português](https://elevenlabs.io/text-to-speech/portuguese)
oferece prévias existentes de
[Yasmin Alves](https://elevenlabs.io/app/voice-library?voiceId=lWq4KDY8znfkV0DrK8Vb)
(`lWq4KDY8znfkV0DrK8Vb`, descrita como artista vocal brasileira, suave e
acolhedora) e
[Will — Deep, Smooth and Affectionate](https://elevenlabs.io/app/voice-library?voiceId=CstacWqMhJQlnfLPxRG4)
(`CstacWqMhJQlnfLPxRG4`, descrito para narração infantil brasileira).
Ouvir as prévias existentes, sem acionar “Generate”, permite comparar antes
de produzir uma amostra com o texto real. Descrição de catálogo não comprova
sozinha sotaque, qualidade, exclusividade ou autorização para o ReinoUp.

O responsável informou disponibilidade de **300 mil créditos diários** para
produção. Essa informação não foi verificada na conta e não equivale a aprovação
de uma voz ou amostra. Não presumir que créditos são exatamente caracteres:
o custo depende do modelo e da voz. Registrar inventário e consumo real, sem
tratar orçamento como bloqueio artificial.

Segundo a [regra oficial de uso comercial](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform),
o plano gratuito não concede licença comercial; planos pagos concedem licença
para conteúdo gerado durante a assinatura, sujeita a direitos, termos e
restrições do serviço, excluindo serviços beta. Confirmar a licença aplicável
à voz escolhida e a autorização do responsável para este projeto.
Uma prévia pública serve para escuta, não para redistribuição no app.

Antes do lote: confirmar ID/função e autorização de uso, produzir amostra
isolada somente quando autorizada, obter aceite humano explícito para
pronúncia brasileira, nomes bíblicos, tom e ritmo, e só então cadastrar a
autorização de produção. Nenhum nome desta seção deve entrar automaticamente
em `APPROVED_VOICES`. Não reutilizar a voz pessoal retirada.
Para a audição inicial, o operador pode gerar a amostra no painel do provedor
e guardá-la fora de `public`/`dist` e do Git. Não contornar a política do
gerador de lotes cadastrando uma voz ainda não aprovada só para obter a amostra.
Configurar credenciais apenas no ambiente local apropriado, nunca na conversa.

### Reprodução e geração

No leitor, **Pausar** mantém o MP3, o tempo e a palavra destacada; **Retomar**
continua a mesma reprodução. O fallback usa `speechSynthesis.pause/resume`,
sujeito ao suporte do navegador. Navegar, mudar de faixa etária, ocultar a página
ou bloquear o app encerra a reprodução, sem retomada automática.

Os dois comandos aceitam `--story`, `--season`, `--through-order` (com temporada),
`--age`, `--chapter`, `--page` (com capítulo), `--scope all|pages|segments` e
`--dry-run`. Seleções inválidas ou vazias falham explicitamente.

```powershell
# Dentro de app/. Sem credenciais, rede ou escrita de arquivos:
bun run audio:stories -- --dry-run --story gn-02-adao-eva
bun run audio:validate -- --dry-run --story gn-02-adao-eva

# Após geração autorizada, validar somente o piloto:
bun run audio:validate -- --story gn-02-adao-eva
```

A geração real exige `ELEVENLABS_API_KEY` e IDs explicitamente aprovados por
função: `ELEVENLABS_VOICE_ID` (narração), `ELEVENLABS_CHALLENGE_VOICE_ID`,
`ELEVENLABS_EXPLANATION_VOICE_ID` e `ELEVENLABS_MASCOT_VOICE_ID`, conforme as
entradas selecionadas. Uma voz pode exercer mais de uma função somente se cada
uso tiver sido aprovado. Hero/premium estão na avaliação, não no lote do piloto.
O gerador verifica as autorizações necessárias antes de qualquer chamada paga.

`ELEVENLABS_MODEL_ID` é opcional (padrão `eleven_multilingual_v2`). Não usar
`language_code` como suposta garantia de sotaque nesse modelo.
O gerador aceita `--force`, mas não deve ser usado para regenerar narrador já
aprovado só porque foi acrescentado um guia. `--scope segments` preserva páginas
válidas/autorizadas e atualiza a estrutura de manifesto sem regenerá-las.
Entradas com hash, voz, modelo e parâmetros atuais são reutilizadas.
Sem `--dry-run`, o comando de geração consome créditos: executá-lo somente
após os aceites; não ampliar para outras histórias nesta etapa.

## Limitações conhecidas

### Cards 3D do piloto

A direção visual é completar os cards da jornada Adão e Eva com ilustração
3D original no acabamento da capa Sunburst, antes de expandir para as demais
telas. O padrão é obrigatório para **todas** as imagens de cards, capas e cenas
de leitura, sem exceção: inclui Criação, Caim e Abel, histórias bloqueadas,
quiz, escolha, jogos, desafios e recompensas. Os desenhos planos ainda exibidos
são pendências de migração, não versões finais aprovadas; aplicar sombras ou
converter o arquivo não substitui produzir a ilustração 3D.
Rasters novos exigem aprovação por registro, não somente extensão WebP.
Enquanto faltam as substituições, as figuras legíveis existentes continuam como
fallback transitório: o quiz e a memória não podem exibir todas as alternativas
com o mesmo aviso, nem o quebra-cabeça perder a cena de referência.
As áreas de arte usam `data-art-status` para distinguir `approved-3d` de
`legacy-fallback`, sem declarar concluída a migração visual.
O primeiro lote autorizado para **amostras** contém apenas as quatro
alternativas de `gn-02-q2`: árvore com fruto, pão, água de rio e alimento animal.
O mascote oficial de boné, a capa, as cenas existentes e os SVGs de fallback
permanecem preservados. As quatro amostras da primeira rodada foram geradas
em área privada, mas ainda não estão aprovadas nem integradas ao app.

O afinamento DisneyClub3D aproveita somente o estilo do documento externo:
formas arredondadas, materiais macios/foscos, luz difusa e fundos simples,
com menos textura fotográfica. Não modifica as aulas, textos, perguntas,
roadmap ou mascote. `scripts/lib/story-art-style.mjs` compartilha a direção
entre os três geradores de arte; dry-runs e novos registros de geração
identificam a revisão `disneyclub3d-stylized-v2`. Os arquivos e recibos da
primeira rodada permanecem intactos, sem receber retroativamente essa revisão.
WebP e filtragem de URL não certificam estilo: o aceite exige olhar as imagens
em tamanho de card, conferir legibilidade e comparar o conjunto.

`shared/quiz-card-art.ts` registra os quatro temas e as aprovações visuais
separadamente. `getApprovedQuizCardArt` só fornece uma imagem ao card após uma
aprovação explícita com referência; sem isso, mantém a apresentação existente
sem solicitar URLs de arquivos ainda inexistentes. `ChoiceCard` aceita imagem
grande acima do texto; se um arquivo aprovado falhar, informa a indisponibilidade
e mantém texto e figura de fallback, sem bloquear a resposta da criança.

O gerador usa o **mesmo provedor e modelo do piloto** (`gpt-image-2.5-sunburst`),
com a capa WebP versionada como referência de acabamento. Não exige os originais
privados de outra sessão e não acessa a quarentena de áudio.

```bash
# Dentro de app/. Não consome créditos nem escreve imagens:
bun scripts/generate-gn02-quiz-art.mjs --dry-run

# Somente após autorização do lote e configuração segura de OPENAI_API_KEY:
bun scripts/generate-gn02-quiz-art.mjs --generate --asset gn-02-q2-pao
```

Sem `--asset`, `--generate` solicita as quatro imagens do lote. O script
guarda originais, WebPs e registros em `../.local/gn02-quiz-art/`, ignorado pelo
Git. Nunca publica em `public` nem aprova uma imagem automaticamente.
Não repete pedidos registrados, inclusive após interrupção, pois já podem ter
sido cobrados. Inspecionar o pedido no provedor antes de decidir qualquer repetição.
Não há troca automática de modelo em caso de indisponibilidade.
Uma mudança de prompt também não libera repetição: não remover os registros
da primeira rodada para forçar outra cobrança.

Depois da aprovação visual humana, copiar somente os WebPs aceitos para
`public/story-art/genesis/gn-02/quiz/` e registrar seus IDs/referências em
`APPROVED_QUIZ_CARD_ART`; só então validar o card em tela pequena e publicar
em uma etapa autorizada. Créditos da ElevenLabs não cobrem geração OpenAI.

### Configuração do Cordeirinho na ElevenLabs

`elevenlabs/cordeirinho.pt-BR.json` registra o patch aplicado ao agente existente
em 2026-09-11, com autorização do responsável pelo projeto. A configuração remota
foi relida: idioma `pt-br`, saudação brasileira e instruções do guia infantil.
Após a retirada da voz pelo titular, outra atualização desabilitou a fala
(`text_only=true`) e proibiu o cliente de sobrescrever esse modo. O app mantém
`LIVE_CONVERSATION_ENABLED=false`: não monta o provedor de conversa e também
bloqueia o início da sessão, independentemente das vozes estáticas aprovadas.
Cadastrar um narrador não libera microfone nem conversa. O limite de 300 segundos foi
preservado. Antes de reativar, substituir a voz no agente remoto e conferir o ID
contra a política do projeto; não basta habilitar o botão.

O arquivo não é aplicado automaticamente pelo frontend nem pelo build. Alterações
futuras exigem revisão e aplicação explícita na ElevenLabs. A atualização não
iniciou conversas nem regenerou áudios. Backups completos do antes/depois ficam
em `.local`, fora do Git.

Essas instruções não equivalem a proteção independente: consentimento do responsável,
retenção de voz, controles de custo, guardrails da plataforma e testes de conversação
continuam exigindo validação antes do lançamento. O português configurado não
certifica sotaque nativo; isso depende de escuta. O lote anterior não está
autorizado para uso. Uma nova voz requer aprovação e posterior regeneração.

### Demais limitações

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

## Arte cinematográfica de Adão e Eva

A capa aprovada e os quatro capítulos de `gn-02` usam WebP de 1200×800,
otimizados para menos de 400 KB por imagem. `Scene` tenta o WebP, depois o SVG
da mesma cena e, por fim, os motivos vetoriais. Os arquivos WebP e SVG entram
no precache do PWA; nenhuma API de imagem é chamada pelo navegador.

O lote foi gerado com `gpt-image-2.5-sunburst`, em qualidade média. O endpoint
de edição com referência foi recusado pelo provedor. As quatro cenas foram
geradas por descrição textual consistente; isso não garante identidade perfeita:
pequenas diferenças nas vestimentas permanecem. As roupas e paisagens são uma
adaptação artística infantil, não uma reconstituição histórica.

`bun scripts/generate-gn02-art.mjs --scene=01-jardim-cuidado --generate --text-only`
gera **uma** cena e requer `OPENAI_API_KEY` no processo. Não executa retries
automáticos nem sobrescreve um original existente. Nomes válidos estão no script.
Originais PNG, prompts enviados e métricas ficam em `..\.local\gn02-raster`;
a referência aprovada é `cover-pilot-sunburst.png` nesse diretório. Apenas WebP
otimizado deve ser publicado. Chaves nunca devem usar prefixo `VITE_`.
