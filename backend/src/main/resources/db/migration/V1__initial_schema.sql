-- V1: Initial Schema

-- CREATE DATABASE restaurantedb OWNER fred;

--
-- Table: cardapios
--

CREATE TABLE cardapios (
    id bigint NOT NULL,
    nome character varying(255) NOT NULL,
    CONSTRAINT cardapios_pkey PRIMARY KEY (id)
);

CREATE SEQUENCE cardapios_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE cardapios_id_seq OWNED BY cardapios.id;
ALTER TABLE ONLY cardapios ALTER COLUMN id SET DEFAULT nextval('cardapios_id_seq'::regclass);

--
-- Table: usuarios
--

CREATE TABLE usuarios (
    id bigint NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    cpf character varying(14) NOT NULL,
    tipo_usuario character varying(50) NOT NULL,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id),
    CONSTRAINT usuarios_cpf_key UNIQUE (cpf),
    CONSTRAINT usuarios_email_key UNIQUE (email),
    CONSTRAINT usuarios_tipo_usuario_check CHECK (((tipo_usuario)::text = ANY ((ARRAY['ADMIN'::character varying, 'GARCOM'::character varying, 'COZINHEIRO'::character varying, 'BARMAN'::character varying])::text[])))
);

CREATE SEQUENCE usuarios_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE usuarios_id_seq OWNED BY usuarios.id;
ALTER TABLE ONLY usuarios ALTER COLUMN id SET DEFAULT nextval('usuarios_id_seq'::regclass);

--
-- Table: mesas
--

CREATE TABLE mesas (
    id bigint NOT NULL,
    status character varying(30) DEFAULT 'LIVRE'::character varying NOT NULL,
    numero integer NOT NULL,
    capacidade integer DEFAULT 4 NOT NULL,
    CONSTRAINT mesas_pkey PRIMARY KEY (id),
    CONSTRAINT mesas_numero_key UNIQUE (numero)
);

CREATE SEQUENCE mesas_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE mesas_id_seq OWNED BY mesas.id;
ALTER TABLE ONLY mesas ALTER COLUMN id SET DEFAULT nextval('mesas_id_seq'::regclass);

--
-- Table: funcionarios
--

CREATE TABLE funcionarios (
    usuario_id bigint NOT NULL,
    matricula character varying(50) NOT NULL,
    data_admissao date NOT NULL,
    salario double precision,
    CONSTRAINT funcionarios_pkey PRIMARY KEY (usuario_id),
    CONSTRAINT funcionarios_matricula_key UNIQUE (matricula),
    CONSTRAINT funcionarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

--
-- Table: itens
--

CREATE TABLE itens (
    id bigint NOT NULL,
    cardapio_id bigint NOT NULL,
    nome character varying(50) NOT NULL,
    preco double precision NOT NULL,
    tipo character varying(50) DEFAULT 'NORMAL'::character varying NOT NULL,
    categoria character varying(50) DEFAULT 'COMIDA'::character varying NOT NULL,
    CONSTRAINT itens_pkey PRIMARY KEY (id),
    CONSTRAINT itens_nome_key UNIQUE (nome),
    CONSTRAINT itens_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['NORMAL'::character varying, 'PREMIUM'::character varying])::text[]))),
    CONSTRAINT itens_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['COMIDA'::character varying, 'BEBIDA'::character varying, 'DRINK'::character varying, 'SOBREMESA'::character varying])::text[]))),
    CONSTRAINT itens_cardapio_id_fkey FOREIGN KEY (cardapio_id) REFERENCES cardapios(id)
);

CREATE SEQUENCE itens_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE itens_id_seq OWNED BY itens.id;
ALTER TABLE ONLY itens ALTER COLUMN id SET DEFAULT nextval('itens_id_seq'::regclass);

--
-- Table: garcons
--

CREATE TABLE garcons (
    funcionario_id bigint NOT NULL,
    bonus double precision,
    CONSTRAINT garcons_pkey PRIMARY KEY (funcionario_id),
    CONSTRAINT garcons_funcionario_id_fkey FOREIGN KEY (funcionario_id) REFERENCES funcionarios(usuario_id) ON DELETE CASCADE
);

--
-- Table: cozinheiros
--

CREATE TABLE cozinheiros (
    funcionario_id bigint NOT NULL,
    status character varying(50) DEFAULT 'LIVRE'::character varying NOT NULL,
    CONSTRAINT cozinheiros_pkey PRIMARY KEY (funcionario_id),
    CONSTRAINT cozinheiros_funcionario_id_fkey FOREIGN KEY (funcionario_id) REFERENCES funcionarios(usuario_id) ON DELETE CASCADE
);

--
-- Table: barmen
--

CREATE TABLE barmen (
    funcionario_id bigint NOT NULL,
    status character varying(50) DEFAULT 'LIVRE'::character varying NOT NULL,
    CONSTRAINT barmen_pkey PRIMARY KEY (funcionario_id),
    CONSTRAINT barmen_funcionario_id_fkey FOREIGN KEY (funcionario_id) REFERENCES funcionarios(usuario_id) ON DELETE CASCADE
);

--
-- Table: admins
--

CREATE TABLE admins (
    funcionario_id bigint NOT NULL,
    nivel_acesso integer DEFAULT 1 NOT NULL,
    CONSTRAINT admins_pkey PRIMARY KEY (funcionario_id),
    CONSTRAINT admins_funcionario_id_fkey FOREIGN KEY (funcionario_id) REFERENCES funcionarios(usuario_id) ON DELETE CASCADE
);

--
-- Table: comandas
--

CREATE TABLE comandas (
    id bigint NOT NULL,
    mesa_id bigint NOT NULL,
    garcom_id bigint NOT NULL,
    status character varying(50) DEFAULT 'ABERTA'::character varying NOT NULL,
    nome character varying(50) NOT NULL,
    data_abertura timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    data_fechamento timestamp without time zone,
    taxaservico boolean DEFAULT true,
    valortotal double precision NOT NULL,
    CONSTRAINT comandas_pkey PRIMARY KEY (id),
    CONSTRAINT comandas_mesa_id_fkey FOREIGN KEY (mesa_id) REFERENCES mesas(id),
    CONSTRAINT comandas_garcom_id_fkey FOREIGN KEY (garcom_id) REFERENCES garcons(funcionario_id)
);

CREATE SEQUENCE comandas_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE comandas_id_seq OWNED BY comandas.id;
ALTER TABLE ONLY comandas ALTER COLUMN id SET DEFAULT nextval('comandas_id_seq'::regclass);

--
-- Table: pedidos
--

CREATE TABLE pedidos (
    id bigint NOT NULL,
    garcom_id bigint,
    comanda_id bigint NOT NULL,
    item_id bigint NOT NULL,
    cozinheiro_id bigint,
    barman_id bigint,
    quantidade integer NOT NULL,
    obs character varying(255),
    status character varying(50) NOT NULL,
    CONSTRAINT pedidos_pkey PRIMARY KEY (id),
    CONSTRAINT pedidos_comanda_id_fkey FOREIGN KEY (comanda_id) REFERENCES comandas(id),
    CONSTRAINT pedidos_cozinheiro_id_fkey FOREIGN KEY (cozinheiro_id) REFERENCES cozinheiros(funcionario_id),
    CONSTRAINT pedidos_barman_id_fkey FOREIGN KEY (barman_id) REFERENCES barmen(funcionario_id),
    CONSTRAINT pedidos_garcom_id_fkey FOREIGN KEY (garcom_id) REFERENCES garcons(funcionario_id),
    CONSTRAINT pedidos_item_id_fkey FOREIGN KEY (item_id) REFERENCES itens(id)
);

CREATE SEQUENCE pedidos_id_seq
    AS bigint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE pedidos_id_seq OWNED BY pedidos.id;
ALTER TABLE ONLY pedidos ALTER COLUMN id SET DEFAULT nextval('pedidos_id_seq'::regclass);
