create table usuario (
   idusuario bigserial not null,
   nome varchar(100) not null,
   email varchar(100) not null,
   senha varchar(255) null,
   token varchar(255) null,
   constraint pk_usuario primary key (idusuario),
   constraint uq_email unique (email)
);

insert into usuario (nome, email) values ('Admin', 'admin@g6.com');

create table receita (
   idreceita bigserial not null,
   codigo uuid not null default gen_random_uuid(),
   prontuario_id bigint not null,
   paciente_id bigint not null,
   profissional varchar(120) not null,
   crm varchar(20) not null,
   orientacoes text null,
   status varchar(20) not null default 'ativa',
   substituida_por bigint null,
   emitida_em timestamp not null default now(),
   constraint pk_receita primary key (idreceita),
   constraint uq_codigo unique (codigo),
   constraint fk_receita_substituta foreign key (substituida_por) references receita(idreceita),
   constraint ck_status check (status in ('ativa', 'substituida', 'dispensada'))
);

create table receita_item (
   idreceitaitem bigserial not null,
   idreceita bigint not null,
   medicamento varchar(160) not null,
   dosagem varchar(80) not null,
   posologia varchar(200) not null,
   quantidade integer not null,
   constraint pk_receita_item primary key (idreceitaitem),
   constraint fk_item_receita foreign key (idreceita) references receita(idreceita)
);

create or replace view vw_receitas_ativas as
select
    r.idreceita,
    r.codigo,
    r.paciente_id,
    r.profissional,
    r.crm,
    r.orientacoes,
    r.emitida_em,
    count(ri.idreceitaitem) as total_medicamentos
from receita r
left join receita_item ri on ri.idreceita = r.idreceita
where r.status = 'ativa'
group by
    r.idreceita,
    r.codigo,
    r.paciente_id,
    r.profissional,
    r.crm,
    r.orientacoes,
    r.emitida_em;

create or replace procedure sp_substituir_receita(
    p_idreceita_antiga bigint,
    p_profissional      varchar,
    p_crm               varchar,
    p_orientacoes       text,
    out p_idreceita_nova bigint
)
language plpgsql
as $$
declare
    v_receita receita%rowtype;
begin
    -- Busca e valida a receita antiga
    select * into v_receita
    from receita
    where idreceita = p_idreceita_antiga;

    if not found then
        raise exception 'Receita % não encontrada.', p_idreceita_antiga;
    end if;

    if v_receita.status <> 'ativa' then
        raise exception 'Apenas receitas ativas podem ser substituídas. Status atual: %', v_receita.status;
    end if;

    insert into receita (prontuario_id, paciente_id, profissional, crm, orientacoes)
    values (
        v_receita.prontuario_id,
        v_receita.paciente_id,
        coalesce(p_profissional, v_receita.profissional),
        coalesce(p_crm, v_receita.crm),
        p_orientacoes
    )
    returning idreceita into p_idreceita_nova;

    -- Marca a antiga como substituída
    update receita
    set status = 'substituida',
        substituida_por = p_idreceita_nova
    where idreceita = p_idreceita_antiga;
end;
$$;


create or replace function fn_impedir_edicao_receita()
returns trigger
language plpgsql
as $$
begin
    -- Permite apenas a atualização de status e substituida_por
    if (new.profissional  <> old.profissional  or
        new.crm           <> old.crm           or
        new.paciente_id   <> old.paciente_id   or
        new.prontuario_id <> old.prontuario_id or
        new.emitida_em    <> old.emitida_em)
    then
        raise exception
            'Receita imutável: não é permitido alterar dados clínicos após a emissão. Use a substituição.';
    end if;

    return new;
end;
$$;

create or replace trigger trg_impedir_edicao_receita
before update on receita
for each row
execute function fn_impedir_edicao_receita();
