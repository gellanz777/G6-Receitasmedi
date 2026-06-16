---
config:
  layout: elk
---
erDiagram
    RECEITA ||--o{ RECEITA_ITEM : possui
    RECEITA ||--|| USUARIO : emite
    RECEITA {
        bigserial idreceita PK
        uuid codigo UK "UUID da receita (para validação na farmácia)"
        bigint prontuario_id "ref. G5 (sem FK física)"
        bigint paciente_id "ref. G1 (sem FK física)"
        varchar100 profissional "Nome do profissional que emitiu"
        varchar20 crm "CRM do profissional"
        text orientacoes "Orientações gerais da receita"
        varchar20 status "CHECK: ATIVA | SUBSTITUIDA | DISPENSADA"
        bigint substituida_por "ref. self (sem FK física) - ID da nova receita que substituiu esta"
        timestamp emitida_em "Data e hora da emissão"
    }
    RECEITA_ITEM {
        bigserial idreceitaitem PK
        bigint idreceita FK "ref. receita.idreceita"
        varchar100 medicamento "Nome do medicamento"
        varchar50 dosagem "Dosagem do medicamento"
        varchar100 posologia "Frequência / modo de uso"
        integer quantidade "Quantidade prescrita"
    }
    USUARIO {
        bigserial idusuario PK
        varchar100 nome "Nome do usuário"
        varchar120 email UK "E-mail de acesso"
        varchar255 senha "Senha (hash)"
        varchar500 token "Token de autenticação"
    }