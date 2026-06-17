# Receitas Médicas - G6

Módulo de emissão e controle de receitas médicas eletrônicas para o ecossistema hospitalar. O sistema permite a prescrição de medicamentos, gestão de status (ativa, substituída, dispensada) e garante a imutabilidade dos dados médicos após a emissão.

---

### Sobre o projeto

Este é o módulo do Grupo 6 do Projeto Integrador do curso de Sistemas de Informação da UNOESC Chapecó. O projeto integra os conhecimentos de três disciplinas específicas do semestre:

| Disciplina             | Contribuição Técnica                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| Banco de Dados I       | Modelagem física, normalização, Views, Stored Procedures e Triggers       |
| Programação I          | Backend em Node.js/Express (Sequelize) e Frontend em React.js             |
| Engenharia de Software | Levantamento de requisitos, modelagem UML e documentação de processos     |

---

### Funcionalidades

| Código | Descrição                                      |
| ------ | ---------------------------------------------- |
| RF01   | Emissão de receitas vinculadas ao prontuário   |
| RF02   | Imutabilidade de receitas (Trigger de proteção)|
| RF03   | Substituição formal de receitas via Procedure  |
| RF04   | Consulta de status e histórico de prescrições  |
| RF05   | Relatórios consolidados via Views             |

---

### Tecnologias

- Node.js 18
- Express
- Sequelize (ORM)
- PostgreSQL
- React 18
- Axios
- React Router v6
- CSS3 (Vanilla)

---

### Estrutura do projeto

```text
g6receitas-medicas/
├── backend/                               API REST (porta 3006)
│   ├── controllers/
│   │   ├── ReceitaController.js           emissão, listagem e substituição
│   │   └── UsuarioController.js           autenticação e gestão de usuários
│   ├── models/
│   │   ├── Receita.js                     cabeçalho da prescrição
│   │   ├── ReceitaItem.js                 medicamentos e dosagens
│   │   └── Usuario.js                     médicos e profissionais
│   ├── Banco.js                           configuração Sequelize
│   ├── index.js                           rotas e inicialização
│   └── scripts.sql                        schema, view, procedure e trigger
└── frontend/
    └── src/
        ├── componentes/
        │   ├── Menu.js                    navegação superior
        │   ├── PaginaLogin.js             autenticação do profissional
        │   ├── PaginaReceitaCadastro.js   formulário de prescrição
        │   ├── PaginaReceitaLista.js      histórico de receitas
        │   ├── PaginaReceitaDetalhe.js    visualização e substituição
        │   └── PaginaRelatorio.js         relatório baseado na View
        ├── servicos/
        │   └── api.js                     comunicação com backend
        └── App.js                         gerenciamento de rotas
```

---

### Banco de dados

O banco de dados foi desenvolvido seguindo as regras de normalização para garantir a integridade das informações médicas.

Tabelas:

| Tabela       | Descrição                                      |
| ------------ | ---------------------------------------------- |
| usuario      | Profissionais de saúde autorizados             |
| receita      | Registro mestre da prescrição e status         |
| receita_item | Medicamentos, dosagens e quantidades           |

Objetos adicionais:

- View `vw_relatorio_receitas`: Consolida dados para o dashboard de relatórios.
- Stored Procedure `pr_substituir_receita`: Realiza a substituição atômica de prescrições.
- Trigger `tg_valida_dispensa`: Impede a alteração de receitas com status "dispensada".

---

### Como rodar

Pré-requisitos: Node.js 18+ e PostgreSQL instalado.

1. Banco de Dados: Execute o arquivo `scripts.sql` no PostgreSQL para criar a estrutura necessária.
2. Configuração: Verifique as credenciais de banco no arquivo `Banco.js`.
3. Backend: Em um terminal, execute:
```bash
npm install
node index.js
```
4. Frontend: Em outro terminal, execute o comando de inicialização do React (geralmente `npm start`).

---

### Endpoints da API

Base: `http://localhost:3006`

| Método | Rota                                | Descrição                                  |
| ------ | ----------------------------------- | ------------------------------------------ |
| POST   | /usuario/login                      | Autenticação do profissional               |
| GET    | /receita                            | Lista todas as receitas                    |
| GET    | /receita/:idreceita                 | Detalhes de uma receita específica         |
| POST   | /receita                            | Emite uma nova receita                     |
| POST   | /receita/:idreceita/substituir      | Executa procedure de substituição          |
| GET    | /relatorio                          | Consulta dados através da View             |
| POST   | /receita/dispensar/:codigo          | Altera status (validação via trigger)      |

---

### Integrações

O sistema atua de forma integrada no ecossistema hospitalar:

| Relação | Grupo              | Dado                                       |
| ------- | ------------------ | ------------------------------------------ |
| Consome | G5 (Prontuário)    | contexto clínico para emissão da receita   |
| Fornece | G8 (Farmácia)      | dados da receita para dispensação          |

---

### Integrantes

- [Inserir Nome]
- Luiz Henrique de Moura da Rosa
- [Inserir Nome]

---

### Repositório

https://github.com/gellanz777/G6-Receitasmedi
