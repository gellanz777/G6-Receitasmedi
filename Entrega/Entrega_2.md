**Entrega 2: Modelagem e Arquitetura**

**Modelos UML + Arquitetura**

**Módulo: 8.5 G6 – Receitas Médicas**

Stack: Node.js / Express · PostgreSQL / Sequelize · React (frontend)

Porta: 3006 · Integrações: G5 Prontuário e G8 Farmácia

# **1. Visão Geral da Modelagem**

**Objetivo da Entrega**

Esta entrega detalha a modelagem e a arquitetura do módulo G6 – Receitas
Médicas, tomando como base o documento de concepção, os casos de uso
enviados pelo grupo e os diagramas anexados. O objetivo é transformar os
requisitos em modelos compreensíveis para desenvolvimento, validação e
integração com os demais módulos do ecossistema de saúde.

**Escopo Modelado**

- Emissão de receita médica por médico autenticado, vinculada a
  prontuário existente no G5.

- Substituição de receitas mantendo a política de imutabilidade e
  histórico auditável.

- Validação de receita na farmácia pelo código UUID e registro de
  dispensação.

- Persistência dos dados em PostgreSQL, com entidades Usuario, Receita e
  ReceitaItem.

- Comunicação REST entre frontend React, API G6, G5 Prontuário e G8
  Farmácia.

**Premissas Arquiteturais**

| **Premissa**      | **Descrição**                                                                                          |
|-------------------|--------------------------------------------------------------------------------------------------------|
| Integração com G5 | A emissão de receita depende da validação do prontuário no G5 antes da persistência.                   |
| Integração com G8 | A farmácia valida e dispensa receitas consumindo endpoints do G6 por UUID.                             |
| Imutabilidade     | Receitas emitidas não são editadas nem removidas; correções geram nova receita e preservam a anterior. |
| Autenticação      | Rotas de negócio exigem token UUID validado pelo middleware validartoken.                              |

# **2. Diagrama de Casos de Uso (UML)**

O diagrama abaixo consolida os casos de uso recebidos no arquivo
Casos_de_Uso_G6.docx e os requisitos funcionais do módulo G6. O Médico
executa emissão e substituição; a Farmácia G8 executa validação e
dispensação; o G5 aparece como sistema externo consultado na emissão.

<img src="Entrega_2_media/image1.png"
style="width:6.75in;height:5.89286in" />

*Figura 1 – Diagrama de Casos de Uso atualizado do módulo G6.*

## **2.1 Mapeamento dos Casos de Uso**

| **UC** | **Nome**                        | **Ator Principal**     | **RFs Relacionados** | **Endpoint(s)**                                                           |
|--------|---------------------------------|------------------------|----------------------|---------------------------------------------------------------------------|
| UC01   | Emitir Receita Médica           | Médico                 | RF01, RF04           | POST /receita; GET G5 /prontuario/paciente/:id                            |
| UC02   | Substituir Receita Médica       | Médico                 | RF02, RF04           | POST /receita/:idreceita/substituir                                       |
| UC03   | Validar Receita na Farmácia     | Farmácia G8            | RF05, RF06           | GET /receita/validar/:codigo; POST /receita/dispensar/:codigo             |
| UC04   | Autenticar Usuário              | Médico / Administrador | RF04                 | PUT /usuario/login                                                        |
| UC05   | Consultar Histórico de Receitas | Médico / Auditor       | RF03, RF04           | GET /receita; GET /receita/:idreceita; GET /receita/paciente/:paciente_id |

# **3. Descrição Detalhada dos Casos de Uso Críticos**

Foram detalhados três casos de uso críticos, conforme o arquivo enviado
pelo grupo: emissão de receita, substituição de receita e
validação/dispensação na farmácia. Os fluxos abaixo complementam o
conteúdo recebido com exceções e regras de negócio da Entrega 1.

## **3.1 UC01 – Emitir Receita Médica**

| **Ator principal**     | Médico                                                                              |
|------------------------|-------------------------------------------------------------------------------------|
| **Atores secundários** | Sistema de Prontuário G5                                                            |
| **Objetivo**           | Permitir que o médico emita uma receita médica vinculada a um prontuário existente. |
| **Pré-condições**      | Médico autenticado; prontuário existente no G5.                                     |
| **Pós-condições**      | Receita criada com status ativa; UUID gerado; itens de medicamento persistidos.     |

**Fluxo Principal:**

> 1\. Médico acessa emissão.
>
> 2\. Informa os dados da receita.
>
> 3\. Sistema valida os campos.
>
> 4\. Sistema consulta o G5.
>
> 5\. Sistema cria a receita.
>
> 6\. Sistema registra os medicamentos.
>
> 7\. Sistema gera o UUID.
>
> 8\. Sistema retorna a receita emitida.

**Fluxos Alternativos e Exceções:**

- Campos obrigatórios ausentes: retornar HTTP 400 com mensagem
  descritiva e não persistir dados.

- Array de itens vazio ou ausente: retornar HTTP 400 com a mensagem 'A
  receita deve conter ao menos 1 medicamento.'.

- G5 retorna status diferente de 2xx: retornar HTTP 422 com 'Prontuário
  não encontrado no G5'.

- G5 inacessível, connection refused ou timeout: retornar HTTP 502 com
  'G5 indisponível', sem registro parcial.

## **3.2 UC02 – Substituir Receita Médica**

| **Ator principal** | Médico                                                                                            |
|--------------------|---------------------------------------------------------------------------------------------------|
| **Objetivo**       | Corrigir uma receita mantendo a imutabilidade.                                                    |
| **Pré-condições**  | Receita existente; receita ativa; médico autenticado.                                             |
| **Pós-condições**  | Nova receita criada; receita antiga marcada como substituída; relação substituida_por registrada. |

**Fluxo Principal:**

> 1\. Médico seleciona a receita.
>
> 2\. Sistema verifica existência.
>
> 3\. Sistema verifica status.
>
> 4\. Médico informa novos dados.
>
> 5\. Sistema valida medicamentos.
>
> 6\. Sistema cria nova receita.
>
> 7\. Sistema registra novos itens.
>
> 8\. Sistema marca a antiga como substituída.

**Fluxos Alternativos e Exceções:**

- Receita original inexistente: retornar HTTP 404.

- Receita original com status diferente de ativa: retornar HTTP 400 com
  'Apenas receitas ativas podem ser substituídas.'.

- Tentativas de PUT, PATCH ou DELETE sobre receitas não devem existir ou
  devem retornar método não permitido.

- Os dados originais da receita substituída permanecem intactos para
  rastreabilidade.

## **3.3 UC03 – Validar Receita na Farmácia**

| **Ator principal** | Farmácia G8                                                                                |
|--------------------|--------------------------------------------------------------------------------------------|
| **Objetivo**       | Validar uma receita antes da dispensação e registrar a entrega dos medicamentos.           |
| **Pré-condições**  | UUID da receita disponível; receita cadastrada no G6.                                      |
| **Pós-condições**  | Receita validada; status atualizado para dispensada quando a farmácia confirmar a entrega. |

**Fluxo Principal:**

> 1\. Farmácia envia UUID.
>
> 2\. Sistema busca a receita.
>
> 3\. Sistema verifica status.
>
> 4\. Sistema busca medicamentos.
>
> 5\. Sistema retorna validação.
>
> 6\. Farmácia solicita dispensação.
>
> 7\. Sistema altera status.
>
> 8\. Sistema confirma dispensação.

**Fluxos Alternativos e Exceções:**

- Receita inexistente: retornar { valida: false, motivo: 'Receita
  inexistente.' }.

- Receita substituída: retornar { valida: false, motivo: 'Receita
  substituída por outra.' }.

- Receita já dispensada: retornar { valida: false, motivo: 'Receita já
  utilizada.' }.

- Tentativa de dispensar receita com status diferente de ativa: retornar
  HTTP 400 com 'Receita não está ativa.'.

# **4. Diagrama de Classes**

O diagrama de classes abaixo representa os principais elementos de
software do módulo G6. Ele foi ajustado para manter coerência com os
casos de uso enviados e com as tabelas reais de persistência: usuario,
receita e receita_item. O modelo diferencia classes de domínio,
controllers, middleware e sistemas externos.

<img src="Entrega_2_media/image2.png"
style="width:6.9in;height:3.33893in" />

*Figura 2 – Diagrama de Classes atualizado do módulo G6.*

## **4.1 Responsabilidades das Classes**

| **Classe / Componente** | **Responsabilidade**                                                                  |
|-------------------------|---------------------------------------------------------------------------------------|
| Usuario                 | Armazena dados de autenticação e token da sessão.                                     |
| UsuarioController       | Executa login, valida email/senha e gera token UUID.                                  |
| validartoken            | Middleware responsável por proteger rotas por meio do header token.                   |
| ReceitaController       | Orquestra emissão, consulta, substituição, validação e dispensação de receitas.       |
| Receita                 | Representa o cabeçalho da prescrição, status, UUID e vínculo com paciente/prontuário. |
| ReceitaItem             | Representa medicamentos, dosagem, posologia e quantidade prescrita.                   |
| ProntuarioGateway G5    | Representa a dependência externa usada para validar o prontuário antes da emissão.    |
| Farmácia G8             | Sistema consumidor dos endpoints de validação e dispensação.                          |

## **4.2 Coerência com a Persistência**

O diagrama recebido com as tabelas receita, receita_item e usuario foi
incorporado como modelo de apoio para demonstrar a coerência entre a
modelagem UML e a persistência em PostgreSQL. Ele evidencia o UUID de
validação, a relação 1:N entre Receita e ReceitaItem, a relação
reflexiva de substituição e a associação entre Usuario e Receita.

<img src="Entrega_2_media/image3.png"
style="width:6.7in;height:5.36191in" />

*Figura 3 – Modelo de dados recebido para apoio à modelagem do módulo
G6.*

- Receita possui composição 1..\* com ReceitaItem: uma receita válida
  precisa conter ao menos um medicamento.

- O campo codigo é UUID único para validação pela farmácia.

- O campo substituida_por representa a substituição sem excluir ou
  alterar destrutivamente o registro original.

- O campo status restringe o ciclo de vida: ativa → substituida ou ativa
  → dispensada.

# **5. Diagramas de Sequência**

Os diagramas de sequência foram atualizados com as imagens enviadas pelo
grupo. Eles representam fluxos com comunicação entre módulos, conforme
exigido na Entrega 2: emissão com consulta ao G5 e validação/dispensação
pela Farmácia G8.

## **5.1 Emissão de Receita com Validação no G5**

Neste fluxo, o médico preenche a receita no frontend. A API G6 valida a
requisição, consulta o prontuário no G5, cria a receita e grava os itens
vinculados.

<img src="Entrega_2_media/image4.png"
style="width:6.85in;height:3.85313in" />

*Figura 4 – Diagrama de Sequência enviado: Emissão de Receita.*

## **5.2 Validação e Dispensação pela Farmácia G8**

Neste fluxo, a Farmácia G8 envia o UUID da receita ao G6, recebe a
validação, solicita a dispensação e o sistema atualiza o status para
dispensada.

<img src="Entrega_2_media/image5.png"
style="width:6.85in;height:3.85313in" />

*Figura 5 – Diagrama de Sequência enviado: Validação na Farmácia.*

# **6. Arquitetura e Contratos de API**

A arquitetura mantém a separação entre interface, API, middleware,
controllers, integração externa e persistência. O frontend React consome
a API G6 com JSON e token no header. A API G6 consome o G5 para
validação clínica e fornece endpoints para o G8 validar e dispensar
receitas.

<img src="Entrega_2_media/image6.png"
style="width:6.75in;height:0.91621in" />

*Figura 6 – Arquitetura de integração do módulo G6.*

## **6.1 Contratos REST do Módulo G6**

| **Método** | **Endpoint**                   | **Responsável**   | **Objetivo**                                  | **Resposta Esperada**                                  |
|------------|--------------------------------|-------------------|-----------------------------------------------|--------------------------------------------------------|
| PUT        | /usuario/login                 | UsuarioController | Autenticar usuário e gerar token UUID.        | 200 com token ou 404 se credenciais inválidas.         |
| POST       | /receita                       | ReceitaController | Emitir receita após validar prontuário no G5. | 201/200 com receita criada; 400, 422 ou 502 em falhas. |
| POST       | /receita/:idreceita/substituir | ReceitaController | Criar nova receita e substituir a anterior.   | 200 com nova receita; 400/404 em falhas.               |
| GET        | /receita                       | ReceitaController | Listar receitas emitidas.                     | 200 com array ordenado por emitida_em desc.            |
| GET        | /receita/:idreceita            | ReceitaController | Detalhar receita e seus itens.                | 200 com receita e itens; 404 se não existir.           |
| GET        | /receita/paciente/:paciente_id | ReceitaController | Listar receitas por paciente.                 | 200 com array filtrado por paciente.                   |
| GET        | /receita/validar/:codigo       | ReceitaController | Validar receita para a farmácia.              | Objeto com valida true/false e motivo quando inválida. |
| POST       | /receita/dispensar/:codigo     | ReceitaController | Registrar dispensação pela farmácia.          | 200 com status dispensada; 400/404 em falhas.          |

## **6.2 Decisões Arquiteturais**

| **Decisão**                       | **Justificativa**                                                                            |
|-----------------------------------|----------------------------------------------------------------------------------------------|
| Node.js + Express                 | Adequado para API REST simples e integração com múltiplos módulos.                           |
| Sequelize + PostgreSQL            | Permite mapeamento dos modelos e uso de banco relacional com integridade referencial.        |
| UUID da receita                   | Permite validação externa pela farmácia sem expor o id interno como identificador principal. |
| Sem PUT/PATCH/DELETE para receita | Garante imutabilidade e preserva histórico clínico e legal.                                  |
| Middleware validartoken           | Centraliza a proteção das rotas de negócio.                                                  |

# **7. Rastreabilidade da Entrega 2**

A matriz abaixo conecta requisitos funcionais, casos de uso, diagramas e
endpoints. Isso permite rastrear cada funcionalidade desde a Entrega 1
até os artefatos de modelagem.

| **RF** | **Caso de Uso**                    | **Diagrama(s)**                                   | **Endpoint(s)**                                           | **Integração**  |
|--------|------------------------------------|---------------------------------------------------|-----------------------------------------------------------|-----------------|
| RF01   | UC01 – Emitir Receita Médica       | Casos de Uso; Classes; Sequência de Emissão       | POST /receita                                             | Consome G5      |
| RF02   | UC02 – Substituir Receita Médica   | Casos de Uso; Classes; Modelo de Dados            | POST /receita/:idreceita/substituir                       | Interna G6      |
| RF03   | Consultar Histórico de Receitas    | Casos de Uso; Classes                             | GET /receita; GET /receita/:id; GET /receita/paciente/:id | Interna G6      |
| RF04   | Autenticar Usuários                | Casos de Uso; Classes; Arquitetura                | PUT /usuario/login                                        | Interna G6      |
| RF05   | UC03 – Validar Receita na Farmácia | Casos de Uso; Sequência Farmácia; Arquitetura     | GET /receita/validar/:codigo                              | Fornece para G8 |
| RF06   | UC03 – Dispensar Receita           | Casos de Uso; Sequência Farmácia; Modelo de Dados | POST /receita/dispensar/:codigo                           | Fornece para G8 |

# **8. Checklist da Entrega 2**

| **Item exigido**                                       | **Atendimento no documento**                          |
|--------------------------------------------------------|-------------------------------------------------------|
| Diagrama de Casos de Uso cobrindo RFs                  | Atendido na Seção 2.                                  |
| Descrição detalhada de ao menos 3 casos críticos       | Atendido na Seção 3: UC01, UC02 e UC03.               |
| Diagrama de Classes coerente com o domínio             | Atendido na Seção 4.                                  |
| Coerência entre classes e persistência                 | Atendido na Seção 4.2 com o modelo de dados recebido. |
| 2 Diagramas de Sequência com comunicação entre módulos | Atendido na Seção 5: G5 e G8.                         |
| Arquitetura e contratos de API                         | Atendido na Seção 6.                                  |
| Rastreabilidade entre RFs e artefatos                  | Atendido na Seção 7.                                  |

# **Apêndice: Declaração de Uso de IA**

**Ferramentas Utilizadas:** ChatGPT.

Forma de Uso: A Inteligência Artificial foi utilizada como ferramenta de
apoio à atualização da Entrega 2, organização textual, padronização
visual e integração dos documentos anexados pelo grupo. O conteúdo foi
estruturado com base no documento de concepção do G6, no arquivo
Casos_de_Uso_G6.docx e nos diagramas enviados, cabendo aos integrantes
do grupo revisar e validar a aderência final ao código-fonte real do
projeto.
