# Diagrama ER — G6 Receitas Médicas

```mermaid
erDiagram
    USUARIO {
        bigserial idusuario PK
        varchar_100 nome
        varchar_100 email "UNIQUE"
        varchar_255 senha
        varchar_255 token
    }

    RECEITA {
        bigserial idreceita PK
        uuid codigo "UNIQUE"
        bigint prontuario_id
        bigint paciente_id
        varchar_120 profissional
        varchar_20 crm
        text orientacoes
        varchar_20 status "CHECK: ativa | substituida | dispensada"
        bigint substituida_por FK
        timestamp emitida_em
    }

    RECEITA_ITEM {
        bigserial idreceitaitem PK
        bigint idreceita FK
        varchar_160 medicamento
        varchar_80 dosagem
        varchar_200 posologia
        integer quantidade
    }

    RECEITA ||--o{ RECEITA_ITEM : "contém"
    RECEITA ||--o| RECEITA : "substituída por"
```

## Relacionamentos

| De | Para | Cardinalidade | Descrição |
|---|---|---|---|
| RECEITA | RECEITA_ITEM | 1:N | Uma receita contém um ou mais medicamentos |
| RECEITA | RECEITA | 0..1:1 | Auto-relacionamento: substituida_por aponta para outra receita |

## Constraints

| Tabela | Constraint | Tipo | Detalhe |
|---|---|---|---|
| usuario | pk_usuario | PRIMARY KEY | idusuario |
| usuario | uq_email | UNIQUE | email |
| receita | pk_receita | PRIMARY KEY | idreceita |
| receita | uq_codigo | UNIQUE | codigo (UUID) |
| receita | fk_receita_substituta | FOREIGN KEY | substituida_por → receita.idreceita |
| receita | ck_status | CHECK | status IN ('ativa', 'substituida', 'dispensada') |
| receita_item | pk_receita_item | PRIMARY KEY | idreceitaitem |
| receita_item | fk_item_receita | FOREIGN KEY | idreceita → receita.idreceita |

## Objetos adicionais do banco

| Objeto | Nome | Descrição |
|---|---|---|
| View | vw_receitas_ativas | Receitas ativas com contagem de medicamentos |
| Stored Procedure | sp_substituir_receita | Substitui receita de forma atômica |
| Trigger | trg_impedir_edicao_receita | Bloqueia edição de campos clínicos após emissão |
