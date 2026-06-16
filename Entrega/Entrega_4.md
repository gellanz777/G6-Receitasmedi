# Entrega 4: Documentação Final e Defesa

**Encerramento + README + Retrospectiva**  
**Módulo:** 8.5 G6 - Receitas Médicas  
**Stack:** Node.js / Express · PostgreSQL / Sequelize · React (frontend)  
**Porta:** 3006  
**Integrações:** G5 Prontuário e G8 Farmácia  
**Projeto Integrador 2026 - Engenharia de Software**

Este documento consolida a Entrega 4 do módulo G6, reunindo a documentação final do sistema, o conteúdo-base do README.md, a retrospectiva final do projeto e o roteiro sugerido para a defesa oral.

| Campo | Informação para preencher antes da entrega |
|---|---|
| Link do repositório | [preencher com o link do GitHub/GitLab do grupo] |
| Link da documentação da API | [preencher com Swagger/OpenAPI, Postman ou README de rotas] |
| Link do deploy/produção | [preencher se houver ambiente publicado] |
| Integrantes | [preencher com nomes completos dos integrantes do G6] |
| Data da entrega | [preencher] |

---

# 1. Visão Geral do Encerramento

## Objetivo da Entrega

A Entrega 4 tem como finalidade encerrar a documentação de Engenharia de Software do módulo G6 - Receitas Médicas, demonstrando o que foi planejado, o que foi efetivamente construído, quais artefatos foram produzidos e quais aprendizados foram obtidos durante o Projeto Integrador.

O módulo G6 é responsável pela emissão, consulta, validação, substituição e dispensação de receitas médicas, consumindo o módulo G5 - Prontuário para validar informações clínicas e fornecendo dados para o módulo G8 - Farmácia realizar validação e dispensação.

Esta entrega reúne:

- README.md preparado para ser incluído no repositório do grupo;
- Retrospectiva final do projeto com pontos positivos, dificuldades, lições aprendidas e aprendizado individual;
- Roteiro de defesa oral entre 20 e 30 minutos, cobrindo os constructos avaliados em Engenharia de Software;
- Discussão transparente de divergências, pendências e ajustes entre o planejado e o entregue.

## 1.1 Síntese do Produto Final

| Aspecto | Descrição consolidada |
|---|---|
| Problema atendido | Reduzir erros de prescrição manual, garantir rastreabilidade e permitir validação da receita por farmácias. |
| Usuários principais | Médicos autenticados, farmácias integradas ao G8, administradores e auditores. |
| Entidades centrais | Usuario, Receita e ReceitaItem. |
| Identificador de validação | UUID único da receita, utilizado para validação externa e dispensação. |
| Regra crítica | Receitas emitidas não são editadas nem excluídas de forma destrutiva; correções ocorrem por substituição. |
| Integrações | Consome G5 Prontuário e fornece dados ao G8 Farmácia por APIs REST. |

---

# 2. README.md do Repositório

A seguir está o conteúdo recomendado para o README.md do repositório do G6. O grupo deve copiar este conteúdo para o repositório e substituir os campos entre colchetes pelos links reais antes da entrega final.

## 2.1 Conteúdo do README.md

```markdown
# G6 - Receitas Médicas

## Visão Geral

O módulo G6 - Receitas Médicas faz parte do Projeto Integrador 2026 do curso de Sistemas de Informação. O sistema permite emitir, consultar, substituir, validar e dispensar receitas médicas de forma rastreável, integrada e segura.

O módulo consome dados do G5 - Prontuário para validar a existência do prontuário/paciente antes da emissão da receita, e fornece endpoints para o G8 - Farmácia validar a receita pelo código UUID e registrar a dispensação.

## Stack

- Backend: Node.js + Express
- Banco de Dados: PostgreSQL + Sequelize
- Frontend: React
- Autenticação: token UUID salvo no usuário autenticado
- Integrações: APIs REST com payload JSON

## Principais Funcionalidades

- Login de usuário por e-mail e senha
- Emissão de receita médica com um ou mais medicamentos
- Consulta geral de receitas
- Consulta de receita por paciente
- Detalhamento de receita com seus itens
- Substituição de receita preservando histórico e imutabilidade
- Validação de receita por UUID para farmácia
- Dispensação de receita e bloqueio de dupla dispensação

## Como Rodar Localmente

### Pré-requisitos

- Node.js instalado
- PostgreSQL instalado e em execução
- NPM ou Yarn
- Banco de dados criado conforme scripts.sql

### Backend

`cd backend`  
`npm install`  
`npm start`

Observação: configurar variáveis de ambiente, banco e porta 3006 antes de iniciar.

### Frontend

`cd frontend`  
`npm install`  
`npm run dev`

### Banco de Dados

Executar o script SQL do projeto:

`psql -U postgres -d [nome_do_banco] -f scripts.sql`

## Endpoints Principais

| Método | Endpoint | Descrição |
|---|---|---|
| PUT | /usuario/login | Autentica usuário e retorna token |
| POST | /receita | Emite uma nova receita |
| GET | /receita | Lista receitas |
| GET | /receita/:idreceita | Detalha uma receita com itens |
| GET | /receita/paciente/:paciente_id | Lista receitas por paciente |
| POST | /receita/:idreceita/substituir | Substitui uma receita ativa |
| GET | /receita/validar/:codigo | Valida receita por UUID |
| POST | /receita/dispensar/:codigo | Registra dispensação da receita |

## Documentação da API

Link da documentação: [preencher com Swagger, Postman Collection ou rota da documentação]

## Integrações

- Consome: G5 - Prontuário, porta 3005
- Fornece: G8 - Farmácia, porta 3008

## Contatos do Grupo

- [Nome 1] - [e-mail]
- [Nome 2] - [e-mail]
- [Nome 3] - [e-mail]
- [Nome 4] - [e-mail]

## Observações Finais

O sistema adota a política de imutabilidade das receitas: uma receita emitida não deve ser editada ou excluída de forma destrutiva. Quando houver correção, uma nova receita é criada e a anterior passa para o status substituída.
```

## 2.2 Validação do README

| Item exigido | Status no README | Observação |
|---|---|---|
| Visão geral | Atendido | Apresenta o módulo G6 e seu papel no ecossistema. |
| Stack | Atendido | Lista Node.js, Express, PostgreSQL, Sequelize e React. |
| Como rodar localmente | Atendido com ajustes | Requer substituição dos nomes reais de pasta, banco e comandos do projeto. |
| Link da documentação da API | Pendente de preenchimento | Inserir link real do Swagger, Postman ou rota de documentação. |
| Contatos do grupo | Pendente de preenchimento | Inserir nomes e e-mails dos integrantes. |

---

# 3. Documentação Final do Módulo

## 3.1 Funcionalidades Entregáveis

| ID | Funcionalidade | Resultado esperado no produto final |
|---|---|---|
| RF01 | Emitir Receita Médica | Usuário autenticado emite receita com dados do prontuário, paciente, profissional, CRM, orientações e itens de medicamento. |
| RF02 | Garantir Imutabilidade | Receita emitida não é editada nem excluída; correções são feitas por substituição e mantêm histórico. |
| RF03 | Consultar Histórico de Receitas | Sistema lista receitas, filtra por paciente e detalha receita com seus itens. |
| RF04 | Autenticar Usuários | Login com e-mail e senha gera token UUID; rotas protegidas exigem header token. |
| RF05 | Validar Receita para Farmácia | Farmácia consulta receita por UUID e recebe retorno de validação, status e itens prescritos. |
| RF06 | Dispensar Receita | Farmácia registra dispensação e o sistema bloqueia uso duplicado da mesma receita. |

## 3.2 Contratos de API Consolidados

| Método | Endpoint | Entrada principal | Saída esperada | Integração |
|---|---|---|---|---|
| PUT | /usuario/login | email, senha | token UUID e dados do usuário | Interna |
| POST | /receita | prontuario_id, paciente_id, profissional, crm, orientacoes, itens[] | receita criada com UUID e status ativa | Consome G5 |
| GET | /receita | header token | lista de receitas em ordem decrescente | Interna |
| GET | /receita/:idreceita | idreceita | receita detalhada com itens | Interna |
| GET | /receita/paciente/:paciente_id | paciente_id | receitas do paciente | Interna |
| POST | /receita/:idreceita/substituir | id da receita original + novos dados | nova receita ativa e original substituída | Interna |
| GET | /receita/validar/:codigo | codigo UUID | valida true/false, motivo e dados da receita | Fornece ao G8 |
| POST | /receita/dispensar/:codigo | codigo UUID | status atualizado para dispensada | Fornece ao G8 |

## 3.3 Regras de Negócio Consolidadas

- Toda emissão deve estar vinculada a um prontuário validado no módulo G5.
- Toda receita deve conter pelo menos um item de medicamento.
- Cada receita recebe um UUID único para validação por farmácia.
- Receitas possuem cadeia de estados controlada: ativa, substituída ou dispensada.
- A substituição cria uma nova receita e atualiza a anterior, preservando dados históricos.
- A dispensação só é permitida quando a receita está ativa.
- A autenticação é obrigatória nas rotas protegidas por meio do header token.

## 3.4 Estrutura Recomendada do Repositório

```text
g6-receitas-medicas/
├── backend/
│   ├── controllers/
│   │   └── ReceitaController.js
│   ├── models/
│   │   ├── Receita.js
│   │   ├── ReceitaItem.js
│   │   └── Usuario.js
│   ├── database/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
├── scripts.sql
├── README.md
└── docs/
    ├── Entrega_1_G6.docx
    ├── Entrega_2_G6.docx
    ├── Entrega_3_G6.docx
    └── Entrega_4_G6.docx
```

## 3.5 Evidências Recomendadas para Anexar ou Apresentar

| Evidência | Finalidade | Status |
|---|---|---|
| Print do README no repositório | Comprovar documentação final publicada. | [anexar ou mostrar na defesa] |
| Print do sistema rodando | Comprovar execução do frontend/backend. | [anexar ou mostrar na defesa] |
| Teste de POST /receita | Comprovar emissão integrada ao G5. | [anexar ou mostrar na defesa] |
| Teste de GET /receita/validar/:codigo | Comprovar validação para G8 Farmácia. | [anexar ou mostrar na defesa] |
| Teste de POST /receita/dispensar/:codigo | Comprovar alteração de status e bloqueio de dupla dispensação. | [anexar ou mostrar na defesa] |
| Prints do board e testes | Relacionar com Entrega 3: processo, qualidade e execução. | [anexar ou mostrar na defesa] |

---

# 4. Retrospectiva Final do Projeto

Esta seção deve ter entre 2 e 4 páginas no documento final. O texto abaixo foi estruturado para servir como retrospectiva completa do G6, devendo ser revisado pelo grupo com base nas evidências reais do projeto.

## 4.1 O que funcionou bem

O principal ponto positivo do projeto foi a definição clara do papel do módulo G6 dentro do ecossistema de saúde integrado. Desde as primeiras entregas, o grupo delimitou que o sistema de Receitas Médicas deveria consumir dados do Prontuário G5 e fornecer validação para a Farmácia G8. Essa delimitação reduziu ambiguidades e ajudou a transformar o problema de emissão manual de receitas em funcionalidades específicas, como emissão, consulta, substituição, validação por UUID e dispensação.

Outro ponto que funcionou foi a adoção da regra de imutabilidade das receitas. Em vez de permitir edição ou exclusão direta de prescrições já emitidas, o sistema passou a trabalhar com estados e substituição controlada. Essa decisão melhorou a rastreabilidade e tornou o módulo mais adequado ao domínio de saúde, no qual alterações destrutivas podem gerar riscos jurídicos, sanitários e de auditoria.

A divisão entre Receita e ReceitaItem também contribuiu para uma modelagem mais coerente. A entidade Receita concentra os dados gerais, como paciente, prontuário, profissional, CRM, status, código UUID e data de emissão, enquanto ReceitaItem representa os medicamentos prescritos com dosagem, posologia e quantidade. Essa separação evita repetição desnecessária de dados e permite que uma mesma receita possua vários medicamentos.

A documentação produzida nas entregas anteriores também ajudou na evolução do trabalho. A Entrega 1 definiu os requisitos funcionais e não funcionais, a Entrega 2 formalizou os casos de uso, classes e sequências, e a Entrega 3 organizou processo, backlog, testes, riscos e versionamento. Com isso, a Entrega 4 pôde consolidar o projeto de forma mais consistente.

## 4.2 O que não funcionou tão bem

A maior dificuldade do projeto foi a dependência entre módulos. Como o G6 precisa validar prontuários no G5 antes de emitir receitas e precisa fornecer dados para o G8 validar e dispensar medicamentos, qualquer indefinição de contrato entre equipes impacta diretamente o fluxo do sistema. Em alguns momentos, foi necessário ajustar endpoints, payloads e regras de retorno para manter a integração coerente.

Outro desafio foi transformar requisitos gerais em critérios realmente testáveis. Termos como "seguro", "rápido" ou "fácil de usar" precisaram ser substituídos por métricas verificáveis, como tempo máximo de resposta, obrigatoriedade de token e número máximo de cliques para emissão. Esse refinamento exigiu mais tempo, mas tornou a documentação mais objetiva.

Também houve dificuldade em equilibrar implementação e documentação. Como o Projeto Integrador envolve Programação Web, Banco de Dados e Engenharia de Software, o grupo precisou manter coerência entre código, banco, diagramas, requisitos e testes. Quando uma regra de negócio mudava no código, os artefatos de Engenharia de Software também precisavam ser atualizados.

Por fim, algumas exigências de qualidade, como criptografia em repouso, logs de auditoria e validação completa de disponibilidade, exigem mais maturidade técnica e evidências específicas. Caso esses itens não estejam totalmente implementados no momento da defesa, devem ser apresentados de forma transparente como limitações ou melhorias futuras, sem ocultar divergências entre o planejado e o entregue.

## 4.3 Lições aprendidas pelo grupo

A primeira lição aprendida foi que integração deve ser tratada como parte central do projeto, e não como detalhe final. Em um ecossistema com múltiplos grupos, cada módulo precisa conhecer exatamente quais dados consome, quais dados fornece e quais erros podem ocorrer quando outro serviço está indisponível.

A segunda lição foi a importância de escrever requisitos verificáveis. Quando um requisito possui endpoint, critério de aceitação, retorno esperado e regra de erro, ele se torna mais fácil de implementar, testar e explicar na defesa.

A terceira lição foi que modelagem e implementação precisam caminhar juntas. Diagramas de classe, sequência e casos de uso não devem ser apenas desenhos para cumprir checklist, mas representações do funcionamento real do sistema. Quando os diagramas foram alinhados com as entidades Usuario, Receita e ReceitaItem, a documentação ficou mais próxima do código.

A quarta lição foi a necessidade de documentar decisões arquiteturais. A escolha de usar UUID para validação, status controlado para receitas e bloqueio de exclusão destrutiva são decisões que justificam a qualidade e a segurança do módulo.

## 4.4 Aprendizado individual

| Integrante | Aprendizado individual sugerido para revisar pelo grupo |
|---|---|
| [Nome do integrante 1] | Aprendeu a transformar regras de negócio em requisitos funcionais, critérios de aceitação e endpoints REST verificáveis. |
| [Nome do integrante 2] | Aprendeu a relacionar modelagem UML com implementação real, mantendo coerência entre classes, banco de dados e fluxos do sistema. |
| [Nome do integrante 3] | Aprendeu a estruturar testes e validações para fluxos críticos, principalmente emissão, substituição e dispensação de receitas. |
| [Nome do integrante 4] | Aprendeu a organizar documentação final, retrospectiva, README e apresentação, conectando as entregas anteriores ao produto final. |
| [Adicionar se necessário] | Inserir aprendizado específico de outro integrante do G6. |

## 4.5 Ações de melhoria para projetos futuros

| Problema identificado | Ação de melhoria |
|---|---|
| Contratos entre módulos mudam durante o desenvolvimento | Definir OpenAPI/Postman Collection no início e versionar alterações. |
| Testes integrados dependem de outros grupos | Criar mocks dos módulos externos para testar fluxos mesmo sem todos os serviços ativos. |
| Documentação fica atrasada quando o código muda | Atualizar documentação a cada alteração relevante de endpoint ou regra de negócio. |
| Evidências ficam dispersas | Criar pasta docs/evidencias com prints, exports do board e resultados de testes. |
| Requisitos de segurança são complexos | Separar backlog técnico para criptografia, auditoria e controle de autorização por perfil. |

---

# 5. Divergências entre Planejado e Entregue

A Entrega 4 deve apresentar com transparência eventuais diferenças entre o que foi planejado nas entregas anteriores e o que foi efetivamente implementado. A tabela abaixo pode ser ajustada pelo grupo após validar o estado real do código e do deploy.

| Item planejado | Situação esperada | Status para revisar | Como apresentar na defesa |
|---|---|---|---|
| Emissão de receita integrada ao G5 | POST /receita valida prontuário antes de persistir. | [confirmar com teste] | Mostrar teste de emissão e retorno de erro caso G5 esteja indisponível. |
| Imutabilidade | Sem PUT/PATCH/DELETE destrutivo em receitas; substituição cria nova receita. | [confirmar no código] | Explicar que a correção ocorre por cadeia de substituição. |
| Consulta de histórico | GET /receita, GET /receita/:id e GET /receita/paciente/:id. | [confirmar com Postman/sistema] | Demonstrar listagem e detalhe com itens. |
| Autenticação por token | Login gera token e rotas protegidas exigem header token. | [confirmar com teste] | Mostrar requisição sem token e com token válido. |
| Validação para farmácia | GET /receita/validar/:codigo retorna validade, motivo e itens. | [confirmar com teste] | Mostrar receita ativa e receita dispensada/substituída. |
| Dispensação | POST /receita/dispensar/:codigo atualiza status e impede dupla dispensação. | [confirmar com teste] | Mostrar primeira dispensação e tentativa repetida. |
| LGPD: criptografia e auditoria | Criptografia de dados sensíveis e log imutável. | [verificar implementação] | Caso esteja parcial, declarar como melhoria futura e não ocultar. |

---

# 6. Roteiro para Defesa Oral

A apresentação oral deve durar entre 20 e 30 minutos. A sugestão abaixo organiza a defesa para cobrir os constructos de Engenharia de Software: escopo, requisitos, modelagem, arquitetura, processo, qualidade, retrospectiva e produto final.

| Tempo | Parte da apresentação | Conteúdo sugerido | Responsável |
|---|---|---|---|
| 2 min | Abertura e contexto | Apresentar o G6, o problema das receitas médicas e o papel no ecossistema. | [preencher] |
| 4 min | Escopo e requisitos | Explicar RF01 a RF06, RNFs e principais critérios de aceitação. | [preencher] |
| 4 min | Modelagem UML | Mostrar casos de uso, classes e sequências de emissão e validação na farmácia. | [preencher] |
| 4 min | Arquitetura e integrações | Explicar React, API Node/Express, PostgreSQL, Sequelize, G5 e G8. | [preencher] |
| 4 min | Processo e qualidade | Apresentar backlog, sprints, testes, riscos e política de versionamento. | [preencher] |
| 5 min | Demonstração do sistema | Demonstrar login, emissão, consulta, validação e dispensação. | [preencher] |
| 3 min | Retrospectiva final | Apresentar o que funcionou, dificuldades, aprendizados e melhorias futuras. | [preencher] |
| 2-4 min | Perguntas | Responder dúvidas e justificar decisões técnicas. | Grupo todo |

## 6.1 Pontos que o grupo deve saber explicar

- Por que o G6 depende do G5 antes de emitir uma receita.
- Por que a receita usa UUID para validação pela farmácia.
- Por que a imutabilidade é importante em dados de saúde.
- Como funciona o status ativa, substituída e dispensada.
- Quais endpoints são internos e quais são usados por integração com o G8.
- Quais RNFs foram atendidos, quais ainda precisam de evidência e quais ficam como melhoria futura.

---

# 7. Checklist Final da Entrega 4

| Critério | Como comprovar | Status |
|---|---|---|
| README.md no repositório | Link do repositório com README atualizado. | [preencher] |
| Visão geral e stack documentadas | README e documento final. | Atendido |
| Como rodar localmente | README com passos de backend, frontend e banco. | Atendido com ajustes |
| Documentação da API | Link Swagger/Postman ou tabela de endpoints. | [preencher link] |
| Contatos do grupo | README com nomes e e-mails. | [preencher] |
| Retrospectiva 2 a 4 páginas | Seção 4 deste documento. | Atendido |
| O que funcionou e não funcionou | Seções 4.1 e 4.2. | Atendido |
| Lições aprendidas | Seção 4.3. | Atendido |
| Aprendizado individual | Seção 4.4. | [preencher nomes] |
| Roteiro da defesa 20-30 min | Seção 6. | Atendido |
| Divergências discutidas com transparência | Seção 5. | [revisar após validar código] |

---

# Apêndice: Declaração de Uso de IA

**Ferramentas utilizadas:** ChatGPT.

**Forma de uso:** A Inteligência Artificial foi utilizada como ferramenta de apoio à estruturação, formatação e revisão textual da Entrega 4, com base nos documentos já produzidos pelo grupo G6, nos requisitos do Projeto Integrador e nos artefatos de casos de uso, modelagem e arquitetura. O conteúdo deve ser revisado pelos integrantes do grupo antes da entrega final, especialmente os campos de links, contatos, integrantes, evidências e status real de implementação.
