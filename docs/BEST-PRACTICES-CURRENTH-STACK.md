# Manual de boas práticas para uma LLM trabalhar nesta stack

## Como a LLM deve operar nesta codebase

Este app deve ser tratado como uma aplicação **full-stack React/Next com App Router, Server Components, cache em camadas, UI headless/composable e backend “database-first” via Supabase**. A regra geral para uma LLM é simples: **preferir código no servidor sempre que não houver necessidade real de interatividade**, abrir fronteiras `"use client"` apenas nos pontos em que houver estado local, efeitos, eventos, DnD, canvas, charts interativos ou acesso a APIs do navegador, e manter mutation paths explícitos com invalidação/revalidação bem definida. Em Next.js App Router, Server Components são o padrão; Client Components são necessários para interações e não podem ser usados indiscriminadamente sem aumentar bundle e complexidade. React também deixa claro que Server Components não suportam handlers de evento nem a maior parte dos Hooks, e que funções/efeitos devem continuar puros e focados no que realmente precisa rodar no cliente. citeturn0search4turn0search21turn17search6turn17search1

Antes de editar qualquer parte do sistema, a LLM deve responder mentalmente a quatro perguntas: **isto precisa rodar no cliente?**, **isto mexe com autenticação/autorização?**, **isto cruza uma fronteira de confiança e portanto exige validação com Zod?**, e **isto altera dados cacheados ou dependentes de RLS?**. Essa disciplina evita três classes comuns de erro nessa stack: mover lógica sensível para o browser, usar validação apenas de UI sem reforço no servidor, e quebrar consistência entre mutação e cache do App Router/Supabase. Next.js recomenda autenticar e autorizar dentro de cada Server Function, porque essas funções são acessíveis por POST direto e não apenas pela UI; Supabase, por sua vez, reforça RLS como camada de “defense in depth” e alerta que tabelas com grants e sem RLS podem ficar acessíveis pela Data API. citeturn9search15turn9search17turn1search0turn1search12turn15search7

Para efeitos de manutenção automatizada, este manual assume uma regra de ouro: **mudanças devem ser pequenas, locais, tipadas, reversíveis e com impacto observável por testes**. Isso conversa diretamente com a filosofia do Next.js para produção, com o modelo headless do TanStack Table, com a composição do shadcn/ui e com a necessidade de isolamento em Playwright/Vitest. citeturn26search9turn33view0turn0search3turn6search0turn6search11

## Arquitetura de aplicação com Next.js, React e TypeScript

No App Router, a arquitetura ideal desta stack é **layout e data orchestration no servidor; interação no cliente; fronteiras pequenas e explícitas**. Isso significa: páginas, layouts e loaders devem priorizar Server Components; formulários podem postar para Server Functions; Route Handlers ficam reservados para endpoints públicos, webhooks, uploads, callbacks externos e casos em que o navegador ou terceiros realmente precisam de uma URL HTTP dedicada. O próprio checklist de produção do Next recomenda usar Route Handlers para acessar recursos backend a partir de Client Components, mas **não chamar Route Handlers de dentro de Server Components**, porque isso adiciona um request de servidor desnecessário. citeturn18search15turn9search8turn9search13

A LLM deve assumir que `"use client"` é uma fronteira cara. Então, quando precisar de Recharts, `@dnd-kit`, `@xyflow/react`, Sonner, Vaul ou qualquer lógica baseada em DOM/eventos, o correto é empurrar essa fronteira para o componente folha, e não converter a página inteira em Client Component. Next.js documenta explicitamente a redução de bundle ao compor Server e Client Components, além de recomendar lazy loading para componentes ou bibliotecas que só precisam ser carregados sob demanda. Para componentes pesados e raramente usados — modal complexa, canvas, editor visual, gráfico avançado — a LLM deve preferir divisão de código e `Suspense`. citeturn0search4turn18search1turn18search4turn17search2

Em React, a LLM deve tratar `useEffect` como **escape hatch**, não como ferramenta padrão para derivar estado. Se a lógica só transforma dados para renderização, computa valores derivados, responde a uma ação do usuário ou reorganiza props/state já presentes, a solução provavelmente deve ser cálculo em render, memoização quando realmente necessária, ou handler de evento — não um efeito. React é explícito ao dizer “you might not need an Effect”, e também exige pureza/idempotência de componentes e hooks. citeturn17search0turn17search1turn17search3turn17search6

No TypeScript, a LLM deve trabalhar com o compilador como primeira linha de defesa de modelagem, e com o lint tipado como segunda linha. Em projetos modernos, `typescript-eslint` recomenda `parserOptions.projectService: true` para lint com informação de tipos, em vez do antigo `project`, justamente por simplicidade e alinhamento com o serviço de tipos usado pelo editor. Para manutenção segura, vale manter habilitadas opções estritas de TS como `strict`, `exactOptionalPropertyTypes` e `noUncheckedIndexedAccess`, pois elas reduzem ambiguidades em payloads, formulários e respostas do banco. citeturn7search1turn7search6turn7search7turn8search0turn8search4

Em runtime, a LLM precisa distinguir os dois modelos de cache que coexistem na documentação do Next 16: o modelo de **Cache Components** e o modelo anterior de `fetch`/revalidate sem esse flag. Em outras palavras, **antes de mexer em estratégia de cache, a LLM deve inspecionar `next.config.ts` e verificar se `cacheComponents` está ligado**. Se estiver, use o modelo novo; se não estiver, siga o guia de caching/revalidating anterior. Isso é especialmente importante para evitar receitas documentais incompatíveis dentro do mesmo repositório. citeturn0search8turn0search20turn9search6turn9search19

Mutations devem preferir Server Functions/Server Actions quando a origem é um formulário ou ação do próprio app. Depois da mutação, a LLM deve revalidar o que ficou stale com `revalidateTag`, `revalidatePath` ou `updateTag`, dependendo do contexto e do modelo de cache usado. Next documenta que `updateTag` é exclusivo de Server Actions e que `revalidateTag`/`revalidatePath` cobrem invalidação on-demand em Server Functions e Route Handlers. citeturn0search16turn9search1turn9search3turn9search22

Para estados de loading, erro e 404, a LLM deve usar as convenções do App Router em vez de “inventar infraestrutura” por componente. `loading.tsx` injeta `Suspense` e habilita streaming; `error.tsx` cria boundary por segmento e precisa ser Client Component; `not-found.tsx` trata recursos ausentes por segmento. Esse modelo é preferível a spinners globais ou try/catch espalhado. citeturn18search2turn18search5turn18search0turn18search4

## Sistema de UI, design tokens e componentes interativos

Nesta stack, o papel do shadcn/ui não é o de uma library fechada, e sim o de **código-fonte de componentes que passa a pertencer ao projeto**. A própria documentação enfatiza que shadcn/ui “is not a component library” no sentido tradicional; ele é uma forma de construir a sua própria library interna. Para uma LLM, isso implica duas regras práticas: **não sobrescrever componentes locais com snippets genéricos da internet** e **tratar `components/ui/*` como código de produto, com convenções próprias da base**. citeturn0search3

Há ainda um detalhe importante de 2026: novos projetos do shadcn passaram a usar **Base UI como padrão**, embora Radix continue suportado. Como esta base foi descrita por vocês como **“shadcn base-nova style, Radix + CVA”**, a LLM não deve rodar `shadcn init` cegamente nem copiar examples recentes assumindo Base UI por default. O caminho seguro é **respeitar o `components.json`, os componentes já instalados e o estilo existente**, especialmente porque o próprio theming docs mostra `style: "base-nova"` e `tailwind.cssVariables: true` como configuração típica. citeturn0search7turn0search11turn10search1

No styling, Tailwind v4 trabalha com **theme variables/design tokens**, e o shadcn recomenda semantic tokens como `background`, `foreground`, `primary`, `muted`, `border`, `ring` e a paleta `chart-*`, todos mapeados para utilities. Para esta base, isso combina muito bem com os tokens em OKLCH. A orientação para a LLM é: **não hardcodar cores em classes utilitárias se já existir token semântico correspondente**; preferir `bg-background`, `text-foreground`, `border-border`, `ring-ring`, `bg-primary`, `text-muted-foreground` etc.; e, quando precisar adicionar um novo papel semântico, registrá-lo no tema em vez de espalhar hex/hsl/oklch arbitrário pelos componentes. citeturn0search2turn10search1turn22search0

Do ponto de vista de acessibilidade, a combinação shadcn + Radix é forte porque Radix já incorpora `aria`, `role`, gerenciamento de foco e navegação por teclado de acordo com WAI-ARIA. Mas isso **não elimina a obrigação de fornecer rótulos, descrições e semântica correta no nível do produto**. Em termos práticos, a LLM deve sempre completar `Label`, descrições de campo, textos de ajuda, estados de erro e nomes acessíveis de botões/ícones. citeturn10search0turn0search15

Para formulários, Zod deve ser usado em **toda fronteira de confiança**: entrada de form, query param, payload de webhook normalizado, body de Server Action/Route Handler, resposta de provider externo e dados vindos do banco quando o contrato exigir garantias extras. Zod 4 documenta `parse`, `safeParse`, `parseAsync` e `safeParseAsync`; a LLM deve preferir `safeParse` quando quiser devolver erro estruturado à UI e `parse` quando uma falha deve interromper o fluxo imediatamente. Se houver refinements assíncronos, use `parseAsync`. citeturn5search0turn5search3turn5search5turn5search17

Para feedback efêmero, Sonner é a escolha certa para notificações transitórias e estados de promise. A LLM deve usar toast para sucesso, erro, aviso e feedback de operação curta, mas evitar substituir erro estrutural de formulário por toast quando o usuário precisa corrigir campos na tela. Já para drawers mobile, Vaul continua útil, mas há um fato operacional relevante: o repositório oficial no GitHub está marcado como **unmaintained**. Em consequência, a LLM deve preferir encapsular Vaul em componentes internos estáveis e evitar acoplamento excessivo a APIs do upstream sem necessidade. citeturn12search0turn12search1turn5search1

Quanto a ícones, Lucide React expõe ícones como componentes React independentes e tree-shakable. Em termos de manutenção, a LLM deve importar apenas os ícones efetivamente usados, preferir Lucide como padrão visual consistente do produto e recorrer ao Tabler quando faltarem ícones específicos. Isso reduz bundle, mantém consistência e evita mapear strings dinâmicas para imports gigantes. citeturn30search0turn30search4turn30search1

Para tipografia, se a base usa SF Pro, o caminho técnico mais limpo em Next é `next/font/local`, preferencialmente com fonte variável e `display: "swap"`, porque `next/font` já faz self-hosting e otimização sem requisições externas. A própria Apple descreve SF Pro como a system font das plataformas Apple, e o Next recomenda variável/local font para performance e flexibilidade. citeturn19search0turn19search2turn19search1

## Charts, tabelas, drag and drop e canvas

Charts nessa stack devem seguir a composição do componente `chart` do shadcn sobre Recharts, e não abstrações paralelas. O `chart` do shadcn usa Recharts “por baixo” mas não o encapsula completamente; vocês continuam escrevendo o gráfico com componentes nativos do Recharts e usam helpers como `ChartContainer`, `ChartTooltip` e `ChartLegend` quando fizer sentido. Isso é ótimo para uma LLM, porque o contrato é simples: **Recharts para a estrutura, tokens do design system para cor, shadcn para acabamento e consistência visual**. citeturn22search0turn0search19

Há três cuidados particularmente importantes para a LLM quando editar gráficos. Primeiro, **o container precisa ter tamanho definido**: Recharts e o wrapper do shadcn dependem de dimensões reais do pai, e o docs do shadcn pede `min-h-*`, `h-*` ou `aspect-*` em `ChartContainer`; o Recharts também deixa claro que `ResponsiveContainer` precisa de parent dimensionado. Segundo, em Recharts 3.3+ existe a prop `responsive`, mas o wrapper do shadcn ainda orienta em muitos exemplos o uso com container/`ResponsiveContainer`; então a LLM deve seguir o padrão que já existe no projeto em vez de misturar estilos. Terceiro, sempre que possível, habilite o `accessibilityLayer` documentado pelo shadcn para suporte de teclado e leitor de tela. citeturn22search0turn35search1turn35search3turn35search6

Para tabelas, o princípio é que **TanStack Table é um engine headless**. Ele não deve “mandar” na UI: a marcação, semântica, vazios, densidade, ações de linha e estados são do app. O melhor uso dessa stack é manter o engine responsável por row models, sorting, filtering, selection e pagination, enquanto o render usa componentes do design system local. Quando o estado realmente importa para produto — URL, filtros persistidos, preferência do usuário, queries server-side — a LLM deve levantar o state (`sorting`, `pagination`, `rowSelection`, `columnVisibility`) para o escopo da tela ou da URL. citeturn33view0

Em definição de colunas, a LLM deve preferir `createColumnHelper<T>()` com tipos concretos da linha, usar **accessor columns** para dados realmente ordenáveis/filtráveis e **display columns** para ações, checkboxes e affordances visuais. Também é importante garantir que accessors retornem valores primitivos quando o objetivo for sort/filter padrão; se o accessor devolve objeto/array, vai ser preciso fornecer lógica adicional. citeturn34search1

Na seleção de linhas, a recomendação crítica é usar `getRowId` com o identificador estável do banco, e não o índice da linha. Isso é especialmente importante com paginação manual, porque a documentação do TanStack avisa que `getSelectedRowModel()` só consegue materializar as linhas presentes na página atual quando `manualPagination` está ativo, embora o estado de seleção possa conter IDs de outras páginas normalmente. Em tabelas alimentadas por Supabase/Postgres, o `id` real deve ser a fonte da verdade. citeturn34search0

Sobre paginação, a melhor prática para a LLM é **não presumir server-side por default**. O próprio TanStack diz que client-side pagination pode funcionar bem até alguns milhares — e às vezes dezenas de milhares — de linhas, dependendo de colunas, payload e memória. Portanto, a decisão correta é empírica: se a tela é analítica, barata e pequena, não “complicar” com paginação manual; se há custo real, filtros pesados, total count caro ou necessidade de URL/API persistente, levantar para o servidor. citeturn4search0

Para drag and drop, `@dnd-kit` deve ser tratado como infraestrutura sensível de UX. A LLM deve configurar `sensors` explicitamente com `useSensor`/`useSensors`, incluir Keyboard Sensor em experiências ordenáveis, usar `sortableKeyboardCoordinates` quando estiver com sortable lists e manter as instruções de acessibilidade que o próprio kit recomenda. Em listas ordenáveis, a ordem do array `items` precisa corresponder à ordem renderizada; se isso quebrar, o comportamento fica inconsistente. Para listas simples, `closestCenter` costuma ser mais tolerante; em kanbans ou estruturas empilhadas, `closestCorners` frequentemente produz resultados mais naturais. Handles visuais devem receber os `listeners`; o item pai recebe o `setNodeRef`. citeturn2search0turn24search5turn24search8turn2search1turn2search7

No canvas de fluxo, a LLM deve assumir que `@xyflow/react` recompensa obsessivamente a memoização. A documentação do React Flow destaca que performance degrada com re-renders desnecessários e recomenda memoizar custom nodes/edges com `React.memo`, callbacks com `useCallback` e objetos/arrays como `defaultEdgeOptions` e `snapGrid` com `useMemo`. Também recomenda evitar que painéis auxiliares dependam do array completo de `nodes`/`edges`, porque eles mudam com muita frequência durante drag/pan/zoom. Quando precisar acessar estado fora do `<ReactFlow />`, use `ReactFlowProvider`. E, em acessibilidade, mantenha `nodesFocusable`, `edgesFocusable` e `disableKeyboardA11y={false}` salvo motivo forte em contrário. citeturn36search0turn3search7turn36search1turn36search2turn3search0

## Dados, autenticação, banco e billing

No backend, a regra central desta stack é: **Supabase não é “só um backend BaaS”; ele é o Postgres da aplicação**. Cada projeto Supabase tem banco Postgres completo, e a Data API é gerada automaticamente a partir do schema. Isso torna muito rápido construir features, mas também reforça a importância de modelagem, migrations, RLS e políticas bem testadas. A LLM deve preferir mudanças no schema via migration versionada, jamais “ajustes manuais invisíveis” no dashboard como substituto definitivo da infraestrutura declarativa. citeturn15search5turn15search7turn14search0

Em autenticação SSR com Next.js, a orientação atual do Supabase é usar `@supabase/ssr`, com `createBrowserClient` no cliente e `createServerClient` no servidor. Como Server Components não conseguem escrever cookies, a documentação atual recomenda um **Proxy** para refresh de token. Mais importante: ao proteger páginas e dados no servidor, **não confiar em `supabase.auth.getSession()`**; o guia do Supabase manda usar `supabase.auth.getClaims()` no código de proteção, porque a sessão lida do cookie pode ser spoofada e `getSession()` não garante revalidação do token da mesma forma. citeturn28search0turn15search1turn28search8

A LLM também deve respeitar a mudança de chaves do Supabase. A documentação recente indica migração gradual para **publishable keys** no cliente e **secret keys** no servidor, com depreciação futura das legacy keys (`anon` e `service_role`) até o fim de 2026. Em termos operacionais: chaves secret nunca vão para o browser; chaves publicáveis podem ir ao cliente quando RLS estiver corretamente configurado. citeturn15search1turn15search7

RLS deve ser considerado obrigatório em qualquer tabela exposta ao app. Supabase enfatiza que RLS é um primitivo do Postgres e fornece defesa em profundidade; também alerta que qualquer tabela com grants compatíveis e **sem RLS habilitado** pode ser acessível por roles como `anon`. Para views, há um cuidado extra: por padrão views podem operar com privilégios do criador; se a intenção é obedecer RLS do chamador, a view deve usar `security_invoker = true`. citeturn1search0turn1search12turn1search15

Como esta base já tem dezenas de migrations e RLS ativo, a LLM deve tratar performance de política como tópico de primeira classe. A própria documentação de troubleshooting do Supabase recomenda: colocar índice nas colunas usadas nas políticas, encapsular chamadas estáveis como `auth.uid()`/`auth.jwt()` em `select` quando o valor não depende da linha, **não usar RLS como substituto de filtro de consulta** e adicionar filtros explícitos também no client/query, além de considerar funções `security definer` para evitar joins caros em outras tabelas — com o cuidado de proteger essas funções em outro schema se elas expuserem informação sensível. citeturn32view0

Isso leva a uma regra prática muito importante para a LLM: se a política é `auth.uid() = user_id`, a query de produto ainda deve ser algo como `.eq("user_id", userId)` quando apropriado. RLS continua sendo a barreira de segurança; o filtro explícito reduz custo e melhora o plano de execução. E, ao alterar ou criar política, a LLM deve pensar em **índice, cardinalidade, join direction e explain analyze**, não apenas em corretude lógica. citeturn32view0

No pipeline de qualidade do banco, vale explorar `supabase test db` e testes SQL com pgTAP. O Supabase documenta suporte oficial para testes na pasta `supabase/tests/database`, onde dá para validar consultas, RLS e invariantes do schema em CI. Para uma base com 45 migrations, isso é uma proteção valiosa contra regressões silenciosas. citeturn13search2turn14search0

Edge Functions devem ser usadas para lógica de integração externa, especialmente Stripe, webhooks e operações que precisam de segredo. O Supabase descreve Edge Functions como funções TypeScript distribuídas globalmente, rodando em Deno, e destaca integração com Stripe como um caso típico. A configuração por função também importa: Stripe webhooks precisam ser publicamente acessíveis, e o Supabase documenta ajustes específicos em `supabase/config.toml` para comportamentos por função. citeturn1search1turn1search16

Para Stripe, a LLM deve seguir duas regras invariáveis. A primeira é **verificar assinatura de webhook** com a biblioteca oficial e o `Stripe-Signature` header; o próprio Stripe recomenda isso, e o Supabase explica que provedores externos não enviam credenciais Supabase, então a função precisa aceitar `auth: 'none'`/`verify_jwt = false` e validar a assinatura do provedor manualmente. A segunda é **usar idempotency keys em POSTs de criação/atualização** para suportar retries sem duplicidade. Em billing por assinatura, os eventos `customer.subscription.*` e relacionados a invoice são os mais importantes para sincronizar estado interno. citeturn16search0turn1search10turn16search7turn16search11turn16search1turn16search8

## Camada de IA com OpenRouter

Como a stack já usa **OpenRouter por proxy**, a LLM deve tratar a camada de IA como uma infraestrutura de backend sensível, e não como uma chamada direta do browser para um provedor de modelo. OpenRouter autentica por Bearer token, expõe um endpoint compatível com a API da OpenAI e centraliza centenas de modelos, roteamento entre providers, streaming e metadados padronizados. Na prática, isso significa que a chave do OpenRouter representa gasto e acesso; portanto, o padrão seguro é **chamar OpenRouter a partir do servidor/Edge Function/Route Handler confiável**, nunca expor a key no cliente. citeturn25search9turn25search1turn25search3turn16search13

Para esta base, a política recomendada para uma LLM é manter a integração no modo **OpenAI-compatible Chat Completions**, a menos que o repositório já tenha padronizado a Responses API beta. O Chat Completions continua sendo o caminho mais estável e amplamente compatível; a Responses API do OpenRouter é útil quando vocês quiserem padronizar recursos mais avançados, mas a própria documentação a marca como beta. Para manutenção de produto, consistência de contrato é mais importante do que “novidade da API”. citeturn25search1turn25search3turn25search5

Em privacidade, o OpenRouter documenta de forma explícita que diferentes providers têm políticas diferentes de retenção/logging e treino. A LLM deve, portanto, assumir como padrão de produto: **negar data collection quando houver sensibilidade**, **preferir ZDR quando o caso exigir**, e **restringir providers/modelos com guardrails ou allowlists**. Isso é particularmente importante se o app lida com dados de usuários, prompts contendo material proprietário ou qualquer payload que não deva trafegar para providers com retenção mais permissiva. citeturn25search0turn25search2turn25search8turn25search10turn25search18

Também vale separar claramente três coisas no código: **roteamento de modelo**, **política de privacidade** e **observabilidade**. O OpenRouter oferece provider routing configurável e guardrails por chave/organização, mas também possui recursos opcionais de input/output logging com retenção própria quando o usuário opta por isso. Uma LLM responsável não deve ativar logging de prompts/respostas por conveniência sem uma decisão intencional do produto. citeturn25search16turn25search4turn25search6

No lado de UX, se a IA for exibida em chat ou geração incremental, a escolha natural é **streaming SSE**. O OpenRouter suporta `stream: true`, mas a LLM deve projetar o consumidor levando em conta falhas mid-stream, porque o próprio docs descreve overload, timeout, token limit e content filters como categorias de falha que podem ocorrer depois do começo da resposta. Em outras palavras: **stream precisa de tratamento de erro no meio do fluxo, e não só no início**. citeturn25search11turn5search6

## Qualidade, testes, lint e checklist operacional

Na camada de testes, Playwright deve ser o oráculo de comportamento de ponta a ponta. A documentação oficial é clara em três pontos que a LLM deve tratar como lei: **isolamento entre testes**, **uso de locators estáveis** e **zero waits manuais desnecessários**. Cada teste deve ser independente, sem depender de cookies/localStorage/estado residual de outro; os locators preferidos são por role, label e texto acessível; e o runner já faz auto-wait/actionability checks, então `waitForTimeout` tende a indicar teste frágil. Retries servem para tolerar flake temporário, mas não substituem correção da causa raiz. citeturn6search0turn6search2turn6search6turn6search12turn6search4

Vitest deve cobrir unidade e integração leve, incluindo DOM via `jsdom` ou `happy-dom` quando necessário. A LLM deve usar `vi.fn`, `vi.spyOn` e `vi.mock` com disciplina, e **limpar/restaurar mocks entre testes**. Coverage pode ser v8 ou Istanbul; para componentes React, Browser Mode e component testing podem ser úteis, mas o padrão mais simples continua sendo separar bem testes de UI leve de Playwright E2E. citeturn6search1turn6search5turn6search7turn6search19turn6search11

No lint, a base ideal para essa stack é **ESLint flat config + typescript-eslint com typed linting**. A documentação do ESLint descreve o formato flat em `eslint.config.*`, e o `typescript-eslint` recomenda `projectService: true` para lint com tipos. Para uma LLM, isso se traduz em uma regra operacional: **não “desligar regra para passar” sem entender o motivo**, e tratar avisos tipados como sinais de contrato quebrado entre UI, domínio e dados. citeturn7search0turn7search1turn7search4turn7search6

Em assets e SEO, a LLM deve usar `next/image` e metadata do App Router sempre que possível. `next/image` fornece otimização automática, lazy loading e prevenção de layout shift; para imagens remotas, `remotePatterns` devem ser específicos; e em componentes com `fill`, `sizes` precisa refletir o layout real. Para metadata, o App Router aceita `metadata` estático e `generateMetadata`, com streaming metadata em cenários compatíveis. citeturn31search0turn31search3turn31search6

Em variáveis de ambiente, o padrão é `.env*` carregado pelo Next; **somente variáveis `NEXT_PUBLIC_*` podem ser expostas ao browser**. A API `env` de `next.config.js` é legada e não é a escolha recomendada. Se a LLM precisar carregar env fora do runtime do Next, como em config de ORM ou runner de testes, a docs aponta `@next/env`. citeturn26search0turn26search1turn26search4

Se houver automação em Python, `uv` deve ser o orquestrador padrão. A docs do `uv` deixa claro que ele consegue instalar Python 3.12, criar ambientes virtuais e executar tools/scripts em ambientes isolados com `uv tool` ou `uv run`. Para uma LLM, isso significa evitar instruções de `pip install` global e preferir comandos reproduzíveis através do próprio `uv`. citeturn20search0turn20search1turn20search5turn20search9

### Checklist que a LLM deve seguir antes de concluir uma tarefa

Antes de encerrar qualquer alteração, o agente deve verificar se fez o seguinte:

- manteve componentes no servidor por padrão e limitou `"use client"` ao menor escopo possível; citeturn0search4turn18search15
- validou toda entrada externa com Zod no servidor; citeturn5search0turn5search5
- autenticou/autorizou dentro de cada Server Function ou endpoint sensível; citeturn9search15turn9search17
- respeitou tokens semânticos do tema em vez de hardcodes visuais; citeturn10search1turn0search2
- usou IDs estáveis de banco em tabelas, listas ordenáveis e seleções; citeturn34search0turn24search5
- considerou revalidação de cache após mutação; citeturn9search1turn9search3turn9search22
- não expôs segredos no cliente; citeturn15search1turn25search9turn26search4
- atualizou ou criou teste proporcional ao risco da mudança. citeturn6search0turn6search11turn13search2

### Prompt-base recomendado para agentes que vão editar esta base

O texto abaixo é uma síntese operacional do manual e pode ser usado como prompt persistente para um agente de código:

```text
Você está trabalhando em um app Next.js App Router com React, TypeScript, Tailwind v4, shadcn base-nova, Supabase, Stripe via Edge Functions e OpenRouter via proxy.

Regras obrigatórias:
- Prefira Server Components por padrão. Use "use client" só no menor escopo possível.
- Não mova lógica sensível, auth, billing, segredos ou validação crítica para o cliente.
- Toda entrada externa deve ser validada com Zod no servidor.
- Em mutations, autentique e autorize dentro da Server Function/Route Handler.
- Se alterar dados lidos por páginas ou componentes cacheados, faça a revalidação apropriada.
- Respeite o design system existente: tokens semânticos, componentes locais em components/ui e convenções do projeto.
- Não rode init/reinstall de shadcn sem necessidade. Preserve a variante e o estilo já usados na base.
- Em tabelas, use IDs estáveis do banco; em paginação manual, não assuma que a seleção materializa linhas fora da página atual.
- Em gráficos, mantenha container com dimensões explícitas e siga o padrão shadcn + Recharts já usado.
- Em dnd/canvas, preserve acessibilidade de teclado e memoização de callbacks/componentes.
- Em Supabase, trate RLS como obrigatório; não confie em ausência de erro no cliente como prova de segurança.
- Para Stripe, verifique assinatura de webhook e preserve idempotência.
- Para OpenRouter, mantenha a chave no servidor e aplique política explícita de modelos/provedores/privacidade.
- Antes de finalizar, proponha ou atualize testes apropriados (Vitest, Playwright ou pgTAP) conforme o risco da mudança.
- Nunca faça refactors amplos sem necessidade direta da tarefa.
- Sempre explique brevemente o impacto arquitetural da mudança.
```

Esse prompt não substitui o contexto local do repositório, mas reduz bastante a chance de o agente aplicar receitas genéricas incompatíveis com App Router, shadcn customizado, RLS ou integrações sensíveis. Ele está alinhado com as recomendações oficiais de Next.js, React, Supabase, Stripe, OpenRouter, TanStack Table, React Flow, dnd-kit, Playwright e Vitest reunidas acima. citeturn0search4turn10search1turn1search0turn16search0turn25search1turn33view0turn36search0turn6search0

## Padrão de decisão para mudanças futuras

Se a LLM precisar decidir “como implementar” algo novo nesta stack, use este padrão de prioridade.

**Se a feature é principalmente leitura de dados**, renderize no servidor, busque dados em Server Components, use `Suspense`/`loading.tsx` para streaming e só leve para Client Component o mínimo necessário para interação. citeturn0search0turn18search4turn18search2

**Se a feature é mutação iniciada pela UI**, prefira Server Function/Server Action, valide com Zod, autentique no servidor e revalide caches após sucesso. Route Handler só entra se o caso realmente pede URL HTTP. citeturn0search16turn9search15turn9search17turn18search15

**Se a feature envolve dados sensíveis ou multi-tenant**, a fonte de verdade deve ser o banco com RLS; a UI apenas reflete o que o servidor e o Postgres autorizam. A query do cliente não substitui política, e a política não substitui filtro eficiente. citeturn1search0turn1search12turn32view0

**Se a feature é altamente visual e interativa**, encapsule-a: charts, canvas, DnD e drawers devem ser pequenas ilhas client-side, bem memoizadas e conectadas ao resto por props simples e contratos tipados. citeturn18search1turn22search0turn36search0turn2search0

**Se a feature toca integrações externas**, execute no servidor/Edge Function, valide assinatura/autenticidade quando houver webhook, use idempotência quando houver cobrança ou criação remota, e trate logs/privacidade explicitamente. citeturn1search1turn16search0turn16search11turn25search0turn25search8

Seguindo esse padrão, a LLM tende a produzir mudanças compatíveis com a filosofia real desta stack: **App Router orientado a servidor, UI composable, dados protegidos por Postgres/RLS, e integrações operadas por código tipado e testável**. citeturn26search9turn15search5turn1search0turn0search3