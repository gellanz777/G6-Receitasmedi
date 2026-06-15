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
