**Entrega 1: Documento de Concepção**

Escopo + Requisitos

**Módulo: 8.5 G6 – Receitas Médicas**

Stack: Node.js / Express · PostgreSQL / Sequelize · React (frontend)

Porta: 3006 · Referência Técnica: CFM 1.821/2007 \| RDC ANVISA 471/2021

**1. Visão do Produto**

**Problema**

A emissão manual de receitas médicas em ambientes hospitalares é
suscetível a erros críticos: prescrições duplicadas, ausência de
verificação de vínculo com o histórico clínico do paciente, receitas sem
rastreabilidade legal e impossibilidade de validação por farmácias em
tempo real.

Além disso, a edição ou exclusão destrutiva de receitas já emitidas
representa risco jurídico e sanitário. A ausência de um código único de
validação (UUID) impede que farmácias verifiquem a autenticidade e o
status da receita antes da dispensação dos medicamentos.

**Público-Alvo**

- Profissionais de saúde autenticados (médicos): únicos autorizados a
  emitir e substituir receitas.

- Farmácias credenciadas (integração G8): consomem os endpoints de
  validação e dispensação via código UUID.

- Auditores e administradores do sistema: acesso de leitura ao histórico
  completo de receitas.

**O Módulo no Ecossistema**

O módulo G6 – Receitas Médicas opera na porta 3006 e depende diretamente
do módulo G5 (Prontuário, porta 3005): toda emissão de receita consome a
API do G5 para validar a existência do prontuário do paciente antes de
persistir qualquer dado. Em caso de indisponibilidade do G5, a emissão é
bloqueada com retorno HTTP 502.

O G6 expõe dois endpoints específicos de integração para farmácias
externas (G8): validação da receita pelo UUID impresso no documento e
confirmação de dispensação, que atualiza o status da receita no banco.
Não há fluxo de exclusão física: toda a cadeia de estados (ativa →
substituída ou dispensada) é imutável e auditável.

**2. Requisitos Funcionais (RFs)**

**RF01: Emitir Receita Médica**

**Descrição:** O sistema deve permitir que usuários autenticados emitam
receitas médicas contendo cabeçalho (prontuario_id, paciente_id,
profissional, crm, orientacoes) e um ou mais itens de medicamento
(medicamento, dosagem, posologia, quantidade), após validação do
prontuário no módulo G5.

**Prioridade:** Alta (Crítica)

**Critério de Aceitação 1:** Dado que o usuário tenta emitir uma receita
via POST /receita, se qualquer um dos campos obrigatórios
(prontuario_id, paciente_id, profissional, crm) estiver ausente, o
sistema deve retornar 400 com mensagem de erro descritiva e não
persistir nenhum dado.

**Critério de Aceitação 2:** Se o array de itens estiver vazio ou
ausente, o sistema deve retornar 400 com a mensagem 'A receita deve
conter ao menos 1 medicamento.'

**Critério de Aceitação 3:** O sistema deve consumir GET
http://localhost:3005/prontuario/paciente/:paciente_id antes de gravar.
Se o G5 retornar status diferente de 2xx, o sistema deve retornar 422
('Prontuário não encontrado no G5'). Se o G5 estiver inacessível
(connection refused ou timeout), retornar 502 ('G5 indisponível').

**Critério de Aceitação 4:** A receita salva deve conter: idreceita
(BIGSERIAL), codigo (UUID v4 gerado automaticamente), prontuario_id,
paciente_id, profissional, crm, orientacoes, status='ativa', emitida_em
(timestamp do servidor em America/Sao_Paulo). Os itens devem ser
gravados na tabela receita_item com FK para idreceita.

**RF02: Garantir Imutabilidade dos Registros**

**Descrição:** O sistema deve garantir que nenhuma receita emitida seja
editada ou excluída de forma destrutiva. Correções devem ser feitas via
substituição, que cria uma nova receita e invalida a anterior.

**Prioridade:** Alta (Crítica)

**Critério de Aceitação 1:** Não devem existir rotas PUT, PATCH ou
DELETE sobre registros de receita. A tentativa de acessar tais métodos
deve resultar em 404 (rota inexistente) ou 405 (método não permitido),
conforme comportamento padrão do Express.

**Critério de Aceitação 2:** O endpoint POST
/receita/:idreceita/substituir deve verificar se a receita original
existe (404 caso contrário) e se seu status é 'ativa' (400 caso
contrário, com mensagem 'Apenas receitas ativas podem ser
substituídas.').

**Critério de Aceitação 3:** Após substituição bem-sucedida: a nova
receita é criada com status='ativa'; a receita original tem status
atualizado para 'substituida' e o campo substituida_por preenchido com o
idreceita da nova. Os dados originais (medicamentos, profissional, crm)
são preservados intactos.

**Critério de Aceitação 4:** Na tela de detalhe da receita substituída,
o frontend deve exibir alerta informando o ID da receita substituta com
link direto para ela.

**RF03: Consultar Histórico de Receitas**

**Descrição:** O sistema deve fornecer endpoints de consulta que
permitam listar todas as receitas, filtrar por paciente e detalhar uma
receita específica com seus itens.

**Prioridade:** Alta

**Critério de Aceitação 1:** GET /receita deve retornar todas as
receitas em ordem cronológica decrescente (ORDER BY emitida_em DESC),
exigindo header token válido (404 sem token).

**Critério de Aceitação 2:** GET /receita/paciente/:paciente_id deve
retornar apenas as receitas do paciente informado, também em ordem DESC.

**Critério de Aceitação 3:** GET /receita/:idreceita deve retornar o
objeto receita acrescido do array itens com todos os medicamentos
prescritos. Se o idreceita não existir, retornar 404 com mensagem
'Receita não encontrada.'

**Critério de Aceitação 4:** A listagem deve exibir para cada receita:
idreceita, codigo (UUID abreviado no frontend), profissional, crm,
paciente_id, emitida_em (formatado pt-BR) e status com badge visual
colorido (verde=ativa, amarelo=substituida, cinza=dispensada).

**RF04: Autenticar Usuários**

**Descrição:** O sistema deve oferecer autenticação baseada em token
UUID, protegendo todas as rotas de receitas e usuários. O login é o
único endpoint público.

**Prioridade:** Alta

**Critério de Aceitação 1:** PUT /usuario/login deve receber email e
senha, localizar o usuário pelo email (404 se não encontrado), comparar
a senha com bcrypt.compare (404 se incorreta) e, em caso de sucesso,
gerar um UUID v4 como token, salvá-lo no banco e retorná-lo com HTTP
200.

**Critério de Aceitação 2:** Todas as rotas de receitas (POST /receita,
GET /receita, GET /receita/:id, GET /receita/paciente/:id, POST
/receita/:id/substituir, GET /receita/validar/:codigo, POST
/receita/dispensar/:codigo) devem passar pelo middleware validartoken,
que lê o header 'token', busca no banco e retorna 404 se inválido ou
ausente.

**Critério de Aceitação 3:** O frontend deve armazenar o token em cookie
(js-cookie) e enviá-lo automaticamente em cada requisição via axios no
header 'token'.

**RF05: Validar Receita para Farmácia**

**Descrição:** O sistema deve disponibilizar um endpoint para que
farmácias verifiquem a autenticidade e o status de uma receita pelo seu
código UUID, antes de realizar a dispensação.

**Prioridade:** Média

**Critério de Aceitação 1:** GET /receita/validar/:codigo deve buscar a
receita pelo campo codigo (UUID). Se não encontrada, retornar { valida:
false, motivo: 'Receita inexistente.' }.

**Critério de Aceitação 2:** Se o status for 'substituida', retornar {
valida: false, motivo: 'Receita substituída por outra.' }. Se for
'dispensada', retornar { valida: false, motivo: 'Receita já utilizada.'
}.

**Critério de Aceitação 3:** Se válida (status='ativa'), retornar {
valida: true, receita: { codigo, paciente_id, profissional, crm,
emitida_em, itens\[\] } } com todos os medicamentos prescritos.

**RF06: Dispensar Receita**

**Descrição:** O sistema deve permitir que farmácias registrem a
dispensação de uma receita, atualizando seu status para 'dispensada' e
impedindo dupla dispensação.

**Prioridade:** Média

**Critério de Aceitação 1:** POST /receita/dispensar/:codigo deve buscar
a receita pelo campo codigo. Se não encontrada, retornar 404.

**Critério de Aceitação 2:** Se o status da receita for diferente de
'ativa' (já dispensada ou substituída), retornar 400 com mensagem
'Receita não está ativa.'

**Critério de Aceitação 3:** Em caso de sucesso, atualizar status para
'dispensada' e retornar { erro: false, mensagem: 'Receita dispensada com
sucesso.', receita: {...} } com HTTP 200.

**3. Requisitos Não Funcionais (RNFs)**

| **ID**    | **Categoria**       | **Descrição Métrica e Testável**                                                                                                                                                                                                                                           |
|-----------|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **RNF01** | Desempenho          | A operação de emissão de receita (POST /receita) deve retornar resposta em até 500 ms no P95, sob carga concorrente de 100 requisições simultâneas, medida em ambiente de staging com banco PostgreSQL.                                                                    |
| **RNF02** | Segurança           | 100% das rotas protegidas devem exigir o header token válido (UUID gerado no login via bcrypt). Rotas sem token retornam 404. Somente usuários autenticados e com sessão ativa podem emitir, consultar ou substituir receitas.                                             |
| **RNF03** | Usabilidade         | O profissional deve conseguir emitir uma receita completa (com N medicamentos) com no máximo 2 cliques a partir da tela de listagem: (1) botão 'Nova Receita' → (2) botão 'Emitir Receita'. Validado por teste de usabilidade com 5 usuários.                              |
| **RNF04** | Interoperabilidade  | Toda comunicação de entrada e saída do módulo G6 com o G5 (Prontuário) e com farmácias deve ocorrer via APIs RESTful, payload application/json, porta 3006, aderente à especificação OpenAPI 3.0.                                                                          |
| **RNF05** | Conformidade (LGPD) | Os campos orientacoes, medicamento, dosagem e posologia, que contêm dados de saúde sensíveis, devem ser criptografados em repouso (AES-256) no PostgreSQL. Toda emissão e leitura deve gerar log de auditoria imutável com: user_id, receita_id, timestamp e IP de origem. |
| **RNF06** | Disponibilidade     | O módulo G6 deve garantir SLA de 99,9% de uptime mensal (tolerância máxima de 43 min 49 s de inatividade/mês). Em caso de indisponibilidade do G5, o endpoint POST /receita deve retornar 502 com mensagem clara, sem deixar registros parciais.                           |

**4. Matriz de Rastreabilidade Inicial**

A tabela abaixo cruza cada requisito funcional com o Caso de Uso
exercitado, o método HTTP, o endpoint implementado no código (index.js)
e as integrações envolvidas.

| **ID RF** | **Caso de Uso (UC)**               | **Método HTTP** | **Endpoint (API REST)**                                                 | **Observações e Integrações**                                                                                                                                                                        |
|-----------|------------------------------------|-----------------|-------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **RF01**  | UC01 – Emitir Receita Médica       | POST            | POST /receita                                                           | Valida token no header. Consome G5 em GET http://localhost:3005/prontuario/paciente/:id. Retorna 422 se G5 rejeitar, 502 se G5 indisponível. Grava em receita + receita_item (PostgreSQL).           |
| **RF02**  | UC02 – Garantir Imutabilidade      | POST            | POST /receita/:idreceita/substituir                                     | Não existe PUT nem DELETE em receitas. Para correção, cria nova receita e atualiza status da anterior para 'substituida', gravando substituida_por. Apenas receitas 'ativas' podem ser substituídas. |
| **RF03**  | UC03 – Consultar Receitas          | GET             | GET /receita GET /receita/:idreceita GET /receita/paciente/:paciente_id | Listagem geral em ordem DESC por emitida_em. Detalhe inclui itens (medicamentos). Filtro por paciente disponível. Todas as rotas exigem token.                                                       |
| **RF04**  | UC04 – Autenticar Usuário          | PUT             | PUT /usuario/login                                                      | Login via email + senha (bcrypt). Retorna UUID token. Token salvo no banco e enviado em cookie no frontend. Única rota pública do sistema.                                                           |
| **RF05**  | UC05 – Validar Receita p/ Farmácia | GET             | GET /receita/validar/:codigo                                            | Farmácia informa o UUID impresso na receita. Retorna { valida: true/false, motivo } + dados completos se válida. Bloqueia receitas 'substituida' ou 'dispensada'.                                    |
| **RF06**  | UC06 – Dispensar Receita           | POST            | POST /receita/dispensar/:codigo                                         | Chamado pela farmácia após entregar medicamentos. Atualiza status para 'dispensada'. Bloqueia dupla dispensação (retorna 400 se status ≠ 'ativa').                                                   |

**Apêndice: Declaração de Uso de IA**

**Ferramentas Utilizadas:** \_(Preencha aqui quais IAs seu grupo
utilizou, por exemplo: Claude, ChatGPT, etc.)\_

**Forma de Uso:** A Inteligência Artificial foi utilizada como
ferramenta de apoio à formatação, revisão ortográfica e padronização
técnica dos requisitos levantados pelo grupo, com base no código-fonte
real do projeto (Node.js / Express / PostgreSQL / React). Todo o
contexto clínico, regras de negócio e critérios de aceitação foram
extraídos diretamente dos arquivos ReceitaController.js,
models/Receita.js, models/ReceitaItem.js, index.js e scripts.sql, e
revisados manualmente pelos integrantes do grupo.
