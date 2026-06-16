# Entrega 3: Processo e Qualidade

**Backlog + Sprints + Testes + Versionamento**

**Módulo: 8.5 G6 – Receitas Médicas**

Stack: Node.js / Express · PostgreSQL / Sequelize · React (frontend)

Porta: 3006 · Integrações: G5 Prontuário (consome) \| G8 Farmácia (fornece)

---

# 1. Visão do Processo

A Entrega 3 registra como o Grupo 6 organizou o processo de desenvolvimento e os critérios mínimos de qualidade do módulo de Receitas Médicas. O foco desta entrega não é repetir os requisitos da Entrega 1, mas demonstrar que os requisitos RF01 a RF06 foram transformados em backlog, tarefas, sprints, evidências, testes e política de versionamento.

O módulo G6 mantém as regras centrais definidas para receitas médicas: emissão mediante validação do prontuário no G5, imutabilidade por substituição, consulta de histórico, autenticação por token, validação por UUID para farmácias e dispensação sem dupla utilização.

## Objetivo da Entrega 3

- Organizar o backlog em formato Épico → Histórias → Tarefas, vinculado aos RFs e critérios de aceitação.

- Planejar pelo menos 3 sprints, distribuindo as tarefas críticas de implementação, integração e testes.

- Registrar evidências reais de execução no board e documentar uma retrospectiva do processo.

- Definir estratégia de testes com pirâmide de testes e casos focados nos requisitos prioritários.

- Padronizar o fluxo de versionamento, branches, commits, pull requests e revisão de código.

> **Observação importante para a entrega final**
> Substituir os campos marcados como 'Inserir evidência real' pelos prints ou links reais do GitHub Projects/Trello/Jira.
> O processo deve demonstrar movimentação real do board e ao menos uma retrospectiva documentada antes do envio ao professor.

# 2. Backlog do Produto Versionado

O backlog foi estruturado para conectar cada requisito funcional do módulo G6 a histórias de usuário e tarefas verificáveis. A ferramenta sugerida para o grupo é GitHub Projects, pois ela permite vincular cards ao repositório G6-Receitasmedi, issues, pull requests e responsáveis.

## Configuração do Board

| **Campo**          | **Definição para o G6**                                                                   |
|--------------------|-------------------------------------------------------------------------------------------|
| Ferramenta         | GitHub Projects, Trello, Jira ou ferramenta equivalente de Kanban.                        |
| Nome do board      | G6 - Receitas Médicas \| Entrega 3 - Processo e Qualidade                                 |
| Repositório        | G6-Receitasmedi                                                                           |
| Colunas mínimas    | Backlog; A Fazer; Em andamento; Revisão/Testes; Concluído                                 |
| Link compartilhado | Inserir link real do board e confirmar compartilhamento com cidinei.cassol@unoesc.edu.br. |

## Backlog em Épicos, Histórias e Tarefas

| **Épico** | **Req.** | **Tema**                | **História**                                                                                           | **Tarefas principais**                                                                                         | **Critério de aceite**                                                                                    |
|-----------|----------|-------------------------|--------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| EP01      | RF01     | Emissão de Receita      | Como médico, quero emitir receita vinculada ao prontuário para garantir rastreabilidade clínica.       | Validar campos obrigatórios; chamar G5; gravar receita; gravar itens; retornar código UUID.                    | 400 para dados inválidos; 422 se prontuário inexistente; 502 se G5 indisponível; receita ativa com itens. |
| EP02      | RF02     | Imutabilidade           | Como médico, quero substituir uma receita sem editar a original para manter histórico auditável.       | Criar rota de substituição; bloquear substituição se status diferente de ativa; preencher substituida_por.     | Receita original permanece íntegra; nova receita ativa; original com status substituida.                  |
| EP03      | RF03     | Consulta de Histórico   | Como usuário autenticado, quero consultar receitas por paciente ou por ID para acompanhar prescrições. | Listar todas; buscar por paciente; detalhar receita com itens; ordenar por emitida_em desc.                    | Rotas protegidas por token; resposta inclui itens e status.                                               |
| EP04      | RF04     | Autenticação            | Como usuário do sistema, quero autenticar por email e senha para acessar rotas protegidas.             | Implementar login; bcrypt.compare; gerar token UUID; middleware validartoken; cookie no frontend.              | Login retorna token; rotas sem token retornam erro; frontend envia token no header.                       |
| EP05      | RF05     | Validação para Farmácia | Como farmácia, quero validar receita por UUID para confirmar autenticidade antes da dispensação.       | Buscar por codigo; retornar valida false para inexistente, substituida ou dispensada; retornar dados se ativa. | Receita ativa retorna valida true; demais status retornam motivo claro.                                   |
| EP06      | RF06     | Dispensação             | Como farmácia, quero registrar a dispensação para impedir reutilização indevida da receita.            | Criar rota dispensar por codigo; validar status ativa; atualizar status para dispensada.                       | 200 para sucesso; 400 se status diferente de ativa; 404 se inexistente.                                   |
| EP07      | RNFs     | Qualidade Técnica       | Como equipe, queremos validar desempenho, segurança, interoperabilidade e disponibilidade.             | Revisar respostas HTTP; testar integração G5/G8; documentar logs e dados sensíveis; validar rollback de erros. | Evidências de teste e critérios mensuráveis registrados.                                                  |

# 3. Plano de Sprints

O planejamento abaixo divide o desenvolvimento em três ciclos curtos. Cada sprint possui objetivo, tarefas alocadas e critério de pronto. A duração pode ser ajustada pelo grupo conforme o calendário da disciplina, mantendo a exigência de pelo menos três sprints planejadas.

| **Sprint** | **Objetivo**                        | **Escopo**       | **Tarefas alocadas**                                                                                             | **Critério de pronto**                                                                                            |
|------------|-------------------------------------|------------------|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Sprint 1   | Fundação do módulo                  | RF01, RF04, RNFs | Autenticação, models Sequelize, scripts.sql, emissão inicial, validação de prontuário no G5.                     | Login funcional; POST /receita com validação; receita + itens persistidos; primeiro conjunto de testes unitários. |
| Sprint 2   | Histórico e imutabilidade           | RF02, RF03       | Substituição de receita, consulta geral, consulta por paciente, detalhe com itens, bloqueio de PUT/PATCH/DELETE. | Fluxos de consulta e substituição funcionando; histórico preservado; teste de substituição coberto.               |
| Sprint 3   | Integração com farmácia e qualidade | RF05, RF06, RNFs | Validação por UUID, dispensação, testes de integração e E2E, revisão do board, retrospectiva e evidências.       | Endpoints para G8 documentados; testes mínimos executados; prints do board e retrospectiva anexados.              |

## Alocação Detalhada por Sprint

| **Sprint** | **Card** | **Descrição da tarefa**                                                       | **Área**       | **Status no board** |
|------------|----------|-------------------------------------------------------------------------------|----------------|---------------------|
| S1         | G6-S1-01 | Configurar banco, models Receita, ReceitaItem e Usuario conforme scripts.sql. | Banco/Back-end | A Fazer             |
| S1         | G6-S1-02 | Implementar autenticação PUT /usuario/login e middleware validartoken.        | Back-end       | A Fazer             |
| S1         | G6-S1-03 | Implementar POST /receita com validação do G5 e gravação de itens.            | Back-end       | A Fazer             |
| S1         | G6-S1-04 | Criar tela de Nova Receita e envio do token via axios/cookie.                 | Front-end      | A Fazer             |
| S2         | G6-S2-01 | Implementar GET /receita, GET /receita/:id e GET /receita/paciente/:id.       | Back-end       | A Fazer             |
| S2         | G6-S2-02 | Implementar POST /receita/:id/substituir preservando histórico.               | Back-end       | A Fazer             |
| S2         | G6-S2-03 | Criar tela de listagem, detalhe e alerta de receita substituída.              | Front-end      | A Fazer             |
| S3         | G6-S3-01 | Implementar GET /receita/validar/:codigo para integração com G8.              | Integração     | A Fazer             |
| S3         | G6-S3-02 | Implementar POST /receita/dispensar/:codigo e bloquear dupla dispensação.     | Integração     | A Fazer             |
| S3         | G6-S3-03 | Executar plano de testes, registrar evidências e finalizar retrospectiva.     | Qualidade      | A Fazer             |

# 4. Evidências de Execução e Retrospectiva

A entrega exige evidências reais. Por isso, esta seção deve ser preenchida com printscreens ou exportações do board mostrando cards em diferentes colunas e uma retrospectiva com pontos positivos, negativos e ações de melhoria.

## Evidências do Board

| **ID** | **Evidência**                            | **O que comprova**                     | **Status**             |
|--------|------------------------------------------|----------------------------------------|------------------------|
| EVD01  | Print do board no início da Sprint 1     | Cards priorizados no Backlog/A Fazer   | Inserir evidência real |
| EVD02  | Print de movimentação durante a Sprint 2 | Cards em Em andamento e Revisão/Testes | Inserir evidência real |
| EVD03  | Print de finalização da Sprint 3         | Cards concluídos e testes revisados    | Inserir evidência real |
| EVD04  | Link do board compartilhado              | Acesso enviado ao professor            | Inserir link real      |

> **INSERIR PRINT 1 - Board / Sprint 1**
> Cole aqui o print real do GitHub Projects/Trello/Jira com cards no Backlog e A Fazer.

> **INSERIR PRINT 2 - Movimentação de Cards**
> Cole aqui o print real mostrando cards em Em andamento e Revisão/Testes.

> **INSERIR PRINT 3 - Encerramento / Sprint 3**
> Cole aqui o print real com cards concluídos e evidência de testes/retrospectiva.

## Retrospectiva Documentada

Data da retrospectiva: \_\_\_\_/\_\_\_\_/2026. Participantes: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_.

| **Aspecto**       | **Registro da retrospectiva**                                                                                                                                                             |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| O que foi bem     | Requisitos principais do módulo estavam claros desde a Entrega 1; a divisão por RF facilitou transformar funcionalidades em cards; a integração com G5/G8 ficou explícita nos testes.     |
| O que foi mal     | Dependência de outros grupos pode atrasar testes de integração; ausência de prints reais no início dificulta comprovar evolução; tarefas grandes precisam ser quebradas em cards menores. |
| Ações de melhoria | Criar mock do G5 para testes locais; registrar prints ao fim de cada sprint; usar pull requests curtos; atualizar status do board sempre que uma tarefa mudar de fase.                    |
| Responsáveis      | Cada responsável do card deve atualizar status, comentar impedimentos e anexar evidências antes de mover para Concluído.                                                                  |

# 5. Plano de Testes

O plano de testes usa a pirâmide de testes para equilibrar testes unitários, testes de integração entre APIs e testes ponta a ponta dos fluxos principais do usuário. A prioridade é validar regras críticas: autenticação, emissão com dependência do G5, imutabilidade, consulta, validação e dispensação por UUID.

## Estratégia da Pirâmide de Testes

| **Nível**     | **Foco**                                     | **Ferramenta sugerida**                         | **Critério**                                                        |
|---------------|----------------------------------------------|-------------------------------------------------|---------------------------------------------------------------------|
| Unitário      | Controllers, validações e regras de status   | Jest ou equivalente                             | Alta quantidade; rápido; sem depender de API externa.               |
| Integração    | API G6 + PostgreSQL + mock/serviço do G5     | Jest + Supertest + banco de teste               | Valida endpoints, persistência, status HTTP e transações.           |
| Ponta a ponta | Fluxo no frontend React até API              | Cypress, Playwright ou teste manual roteirizado | Valida login, emissão, listagem, substituição e validação por UUID. |
| Contrato      | Endpoints consumidos/fornecidos para G5 e G8 | Coleção Postman/Insomnia ou OpenAPI             | Confirma payloads, códigos de erro e campos obrigatórios.           |

## Casos de Teste Prioritários

| **ID** | **RF**    | **Nível**    | **Cenário**                                | **Entrada/Pré-condição**                                      | **Resultado esperado**                                                                             |
|--------|-----------|--------------|--------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| CT01   | RF01      | Integração   | Emitir receita com prontuário válido no G5 | POST /receita com token, paciente_id válido e ao menos 1 item | HTTP 201/200; receita ativa; UUID gerado; itens persistidos.                                       |
| CT02   | RF01      | Integração   | Emitir receita sem itens                   | POST /receita com itens vazio ou ausente                      | HTTP 400; mensagem 'A receita deve conter ao menos 1 medicamento.'; nenhum dado salvo.             |
| CT03   | RF01      | Integração   | G5 indisponível no momento da emissão      | Mock do G5 fora do ar ou timeout                              | HTTP 502 com mensagem clara; sem registro parcial no banco.                                        |
| CT04   | RF02      | Integração   | Substituir receita ativa                   | Receita original com status ativa                             | Nova receita ativa; original substituida; substituida_por preenchido; dados originais preservados. |
| CT05   | RF02/RF06 | Integração   | Tentar substituir receita já dispensada    | Receita com status dispensada                                 | HTTP 400; mensagem de bloqueio; nenhuma nova receita criada.                                       |
| CT06   | RF03/RF04 | API          | Consultar receitas sem token               | GET /receita sem header token                                 | HTTP 404/erro de token inválido conforme middleware validartoken.                                  |
| CT07   | RF05      | Contrato/API | Validar receita dispensada por UUID        | GET /receita/validar/:codigo com receita dispensada           | Resposta valida:false e motivo 'Receita já utilizada.'                                             |
| CT08   | RF06      | Contrato/API | Dispensar receita ativa                    | POST /receita/dispensar/:codigo para receita ativa            | HTTP 200; status atualizado para dispensada; dupla dispensação bloqueada depois.                   |

## Critérios de Aprovação dos Testes

| **Área**   | **Critério de aprovação**                                                                                   |
|------------|-------------------------------------------------------------------------------------------------------------|
| API        | Todos os endpoints prioritários retornam status HTTP esperado e mensagem compreensível.                     |
| Banco      | Receita e receita_item são persistidos de forma consistente; falhas não deixam registros parciais.          |
| Segurança  | Rotas protegidas exigem token válido; login gera token UUID e frontend o envia no header.                   |
| Integração | Fluxo G6 -\> G5 trata prontuário inexistente e indisponibilidade; fluxo G8 -\> G6 valida/dispensa por UUID. |
| Regressão  | Substituição e dispensação não quebram consulta de histórico nem validação por status.                      |

# 6. Política de Versionamento e Branching

A política abaixo busca manter o repositório rastreável e coerente com o backlog. Todo card relevante deve gerar branch, commit e, quando possível, pull request associado.

| **Branch**                   | **Finalidade**                                                 | **Regra de uso**                                    |
|------------------------------|----------------------------------------------------------------|-----------------------------------------------------|
| main                         | Código estável e pronto para demonstração/entrega.             | Recebe merge apenas de develop ou release aprovado. |
| develop                      | Integração das funcionalidades aceitas durante as sprints.     | Recebe merges de feature/fix após revisão.          |
| feature/rf01-emissao-receita | Implementação de funcionalidade ligada a RF ou card.           | Criada a partir de develop; removida após merge.    |
| fix/g5-indisponivel-502      | Correção de erro identificado em teste ou revisão.             | Deve referenciar card, teste ou issue.              |
| docs/entrega3-processo       | Ajustes em documentação, plano de testes, README ou artefatos. | Sem alterar regra de negócio diretamente.           |

## Padrão de Commits

| **Tipo** | **Uso**                                    | **Exemplo**                                               |
|----------|--------------------------------------------|-----------------------------------------------------------|
| feat     | Nova funcionalidade                        | feat(receita): implementar emissao com validacao do G5    |
| fix      | Correção de defeito                        | fix(receita): retornar 502 quando G5 estiver indisponivel |
| test     | Adição ou ajuste de testes                 | test(receita): cobrir substituicao de receita ativa       |
| docs     | Documentação                               | docs(entrega3): atualizar plano de sprints e evidencias   |
| refactor | Melhoria interna sem alterar comportamento | refactor(auth): isolar validacao de token                 |

**Regra de merge:** nenhuma alteração deve ir diretamente para main. O fluxo recomendado é: criar branch a partir de develop, implementar, executar testes, abrir pull request, revisar, corrigir conflitos e só então fazer merge.

**Tag de entrega:** ao finalizar a Entrega 3, criar uma tag de versão, por exemplo v0.3-entrega3, apontando para o commit validado pelo grupo.

# 7. Gestão de Riscos do Processo

| **ID** | **Risco**                                             | **Impacto** | **Tratamento**                                                                             |
|--------|-------------------------------------------------------|-------------|--------------------------------------------------------------------------------------------|
| R01    | Indisponibilidade ou atraso no contrato do G5         | Alto        | Criar mock do G5 para testes locais; validar contrato mínimo GET /prontuario/paciente/:id. |
| R02    | Contrato com G8 incompleto para validação/dispensação | Médio       | Documentar payloads de GET /receita/validar/:codigo e POST /receita/dispensar/:codigo.     |
| R03    | Falta de evidência real do Kanban                     | Alto        | Registrar prints ao início, meio e fim das sprints; anexar link do board compartilhado.    |
| R04    | Testes executados somente no fim                      | Médio       | Associar casos de teste aos cards e exigir teste mínimo antes de mover para Concluído.     |
| R05    | Dados sensíveis expostos em logs ou prints            | Alto        | Evitar dados reais; mascarar pacientes, CRM e medicamentos em prints públicos.             |
| R06    | Falha parcial ao salvar receita e itens               | Alto        | Usar transação/rollback e testar erro no meio da gravação.                                 |

# 8. Matriz de Rastreabilidade da Entrega 3

A matriz abaixo conecta requisitos, histórias, sprints, casos de teste e evidências. Ela serve para demonstrar que o processo está ligado diretamente às funcionalidades do G6, evitando backlog genérico sem aderência ao domínio de receitas médicas.

| **Req.** | **Épico/História**                | **Sprint**   | **Teste relacionado** | **Evidência** |
|----------|-----------------------------------|--------------|-----------------------|---------------|
| RF01     | EP01 - Emissão de Receita         | Sprint 1     | CT01, CT02, CT03      | EVD01, EVD02  |
| RF02     | EP02 - Imutabilidade/Substituição | Sprint 2     | CT04, CT05            | EVD02         |
| RF03     | EP03 - Consulta de Histórico      | Sprint 2     | CT06                  | EVD02         |
| RF04     | EP04 - Autenticação               | Sprint 1     | CT06                  | EVD01         |
| RF05     | EP05 - Validação para Farmácia    | Sprint 3     | CT07                  | EVD03         |
| RF06     | EP06 - Dispensação                | Sprint 3     | CT08                  | EVD03         |
| RNFs     | EP07 - Qualidade Técnica          | Sprint 1 a 3 | Todos os CTs          | EVD01 a EVD04 |

# Apêndice: Declaração de Uso de IA

**Ferramentas Utilizadas:** \_(Preencha aqui quais IAs seu grupo utilizou, por exemplo: ChatGPT, Claude, Copilot, etc.)\_

**Forma de Uso:** A Inteligência Artificial foi utilizada como ferramenta de apoio para estruturar a Entrega 3, organizar backlog, plano de sprints, política de versionamento, matriz de testes e revisão textual. O conteúdo foi baseado nos requisitos e integrações do módulo G6 - Receitas Médicas, devendo ser revisado manualmente pelo grupo antes da submissão.

**Responsabilidade do grupo:** revisar, validar e ajustar todos os itens antes da entrega, especialmente link real do board, prints de evidência, datas, responsáveis, participantes da retrospectiva e resultados reais dos testes.

# Checklist de Atendimento da Entrega 3

| **Item exigido**        | **Situação**       | **Observação**                                                                        |
|-------------------------|--------------------|---------------------------------------------------------------------------------------|
| Backlog versionado      | Estruturado        | Backlog em Épico → Histórias → Tarefas vinculado aos RFs. Inserir link real do board. |
| Board compartilhado     | Pendente evidência | Compartilhar com cidinei.cassol@unoesc.edu.br e registrar link no documento.          |
| Plano de 3 sprints      | Atendido           | Sprint 1, Sprint 2 e Sprint 3 com objetivos, tarefas e critérios de pronto.           |
| Evidências de execução  | Pendente anexos    | Foram deixados espaços para prints reais do board.                                    |
| Retrospectiva           | Estruturada        | Tabela de retrospectiva incluída; preencher data, participantes e decisões reais.     |
| Plano de testes         | Atendido           | Pirâmide de testes e 8 casos de teste prioritários definidos.                         |
| Versionamento/branching | Atendido           | Fluxo main/develop/feature/fix/docs, PRs, commits e tag de entrega definidos.         |
| Uso de IA declarado     | Atendido           | Apêndice incluído no padrão da entrega.                                               |

# Referências

- PROJETO INTEGRADOR 2026. Componente da Disciplina de Engenharia de Software. Curso de Sistemas de Informação. Documento oficial fornecido para o trabalho integrador.

- Módulo G6 – Receitas Médicas. Entrega 1: Documento de Concepção (Escopo + Requisitos).

- Checklist Geral do Projeto Integrador: G6 - Receitas Médicas.
