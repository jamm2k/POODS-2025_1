DROP DATABASE IF EXISTS restaurantedb;
DROP ROLE IF EXISTS fred;

CREATE ROLE fred LOGIN PASSWORD '1234';

CREATE DATABASE restaurantedb OWNER fred;

\c restaurantedb fred

--
-- PostgreSQL database dump
--

\restrict bIwGEWNLq058yPsr1NV5Cana4ZXbn5NHJ4NW4Mi6lzLjBcegYnRZvi0T1fyuVLM

-- Dumped from database version 17.6 (Ubuntu 17.6-1.pgdg24.04+1)
-- Dumped by pg_dump version 17.6 (Ubuntu 17.6-1.pgdg24.04+1)

-- Started on 2025-09-25 15:16:57 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 32897)
-- Name: cardapios; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.cardapios (
    id integer NOT NULL,
    nome character varying(255) NOT NULL
);


ALTER TABLE public.cardapios OWNER TO fred;

--
-- TOC entry 226 (class 1259 OID 32896)
-- Name: cardapios_id_seq; Type: SEQUENCE; Schema: public; Owner: fred
--

CREATE SEQUENCE public.cardapios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cardapios_id_seq OWNER TO fred;

--
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 226
-- Name: cardapios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fred
--

ALTER SEQUENCE public.cardapios_id_seq OWNED BY public.cardapios.id;


--
-- TOC entry 224 (class 1259 OID 32865)
-- Name: comandas; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.comandas (
    id integer NOT NULL,
    id_mesa integer NOT NULL,
    id_garcom integer NOT NULL,
    status character varying(50) DEFAULT 'ABERTA'::character varying NOT NULL,
    nome character varying(50) NOT NULL,
    data_abertura timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    data_fechamento timestamp without time zone,
    taxaservico boolean DEFAULT true,
    valortotal numeric(10,2) NOT NULL
);


ALTER TABLE public.comandas OWNER TO fred;

--
-- TOC entry 223 (class 1259 OID 32864)
-- Name: comandas_id_seq; Type: SEQUENCE; Schema: public; Owner: fred
--

CREATE SEQUENCE public.comandas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comandas_id_seq OWNER TO fred;

--
-- TOC entry 3545 (class 0 OID 0)
-- Dependencies: 223
-- Name: comandas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fred
--

ALTER SEQUENCE public.comandas_id_seq OWNED BY public.comandas.id;


--
-- TOC entry 225 (class 1259 OID 32885)
-- Name: cozinheiro; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.cozinheiro (
    funcionario_id integer NOT NULL,
    status character varying(50) DEFAULT 'LIVRE'::character varying NOT NULL
);


ALTER TABLE public.cozinheiro OWNER TO fred;

--
-- TOC entry 219 (class 1259 OID 32832)
-- Name: funcionarios; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.funcionarios (
    usuario_id integer NOT NULL,
    matricula character varying(50) NOT NULL,
    data_admissao date NOT NULL,
    salario numeric(10,2)
);


ALTER TABLE public.funcionarios OWNER TO fred;

--
-- TOC entry 220 (class 1259 OID 32844)
-- Name: garcom; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.garcom (
    funcionario_id integer NOT NULL,
    bonus numeric(10,2) NOT NULL
);


ALTER TABLE public.garcom OWNER TO fred;

--
-- TOC entry 229 (class 1259 OID 32904)
-- Name: itens; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.itens (
    id integer NOT NULL,
    cardapio_id integer NOT NULL,
    nome character varying(50) NOT NULL,
    preco numeric(10,2) NOT NULL,
    categoria character varying(50) DEFAULT 'NORMAL'::character varying NOT NULL,
    CONSTRAINT itens_categoria_check CHECK (((categoria)::text = ANY ((ARRAY['NORMAL'::character varying, 'PREMIUM'::character varying])::text[])))
);


ALTER TABLE public.itens OWNER TO fred;

--
-- TOC entry 228 (class 1259 OID 32903)
-- Name: itens_id_seq; Type: SEQUENCE; Schema: public; Owner: fred
--

CREATE SEQUENCE public.itens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.itens_id_seq OWNER TO fred;

--
-- TOC entry 3546 (class 0 OID 0)
-- Dependencies: 228
-- Name: itens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fred
--

ALTER SEQUENCE public.itens_id_seq OWNED BY public.itens.id;


--
-- TOC entry 222 (class 1259 OID 32855)
-- Name: mesa; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.mesa (
    id integer NOT NULL,
    status character varying(30) DEFAULT 'LIVRE'::character varying NOT NULL,
    numero integer NOT NULL
);


ALTER TABLE public.mesa OWNER TO fred;

--
-- TOC entry 221 (class 1259 OID 32854)
-- Name: mesa_id_seq; Type: SEQUENCE; Schema: public; Owner: fred
--

CREATE SEQUENCE public.mesa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mesa_id_seq OWNER TO fred;

--
-- TOC entry 3547 (class 0 OID 0)
-- Dependencies: 221
-- Name: mesa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fred
--

ALTER SEQUENCE public.mesa_id_seq OWNED BY public.mesa.id;


--
-- TOC entry 231 (class 1259 OID 32920)
-- Name: pedidos; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.pedidos (
    id integer NOT NULL,
    id_garcom integer NOT NULL,
    id_comanda integer NOT NULL,
    id_item integer NOT NULL,
    id_cozinheiro integer,
    quantidade integer NOT NULL,
    obs character varying(50)
);


ALTER TABLE public.pedidos OWNER TO fred;

--
-- TOC entry 230 (class 1259 OID 32919)
-- Name: pedidos_id_seq; Type: SEQUENCE; Schema: public; Owner: fred
--

CREATE SEQUENCE public.pedidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedidos_id_seq OWNER TO fred;

--
-- TOC entry 3548 (class 0 OID 0)
-- Dependencies: 230
-- Name: pedidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fred
--

ALTER SEQUENCE public.pedidos_id_seq OWNED BY public.pedidos.id;


--
-- TOC entry 218 (class 1259 OID 32819)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: fred
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    cpf character varying(14) NOT NULL,
    tipo_usuario character varying(50) NOT NULL,
    CONSTRAINT usuarios_tipo_usuario_check CHECK (((tipo_usuario)::text = ANY ((ARRAY['ADMIN'::character varying, 'GARCOM'::character varying, 'COZINHEIRO'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO fred;

--
-- TOC entry 217 (class 1259 OID 32818)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: fred
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO fred;

--
-- TOC entry 3549 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fred
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 3335 (class 2604 OID 32900)
-- Name: cardapios id; Type: DEFAULT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.cardapios ALTER COLUMN id SET DEFAULT nextval('public.cardapios_id_seq'::regclass);


--
-- TOC entry 3330 (class 2604 OID 32868)
-- Name: comandas id; Type: DEFAULT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.comandas ALTER COLUMN id SET DEFAULT nextval('public.comandas_id_seq'::regclass);


--
-- TOC entry 3336 (class 2604 OID 32907)
-- Name: itens id; Type: DEFAULT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.itens ALTER COLUMN id SET DEFAULT nextval('public.itens_id_seq'::regclass);


--
-- TOC entry 3328 (class 2604 OID 32858)
-- Name: mesa id; Type: DEFAULT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.mesa ALTER COLUMN id SET DEFAULT nextval('public.mesa_id_seq'::regclass);


--
-- TOC entry 3338 (class 2604 OID 32923)
-- Name: pedidos id; Type: DEFAULT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id SET DEFAULT nextval('public.pedidos_id_seq'::regclass);


--
-- TOC entry 3327 (class 2604 OID 32822)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 3534 (class 0 OID 32897)
-- Dependencies: 227
-- Data for Name: cardapios; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.cardapios (id, nome) FROM stdin;
\.


--
-- TOC entry 3531 (class 0 OID 32865)
-- Dependencies: 224
-- Data for Name: comandas; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.comandas (id, id_mesa, id_garcom, status, nome, data_abertura, data_fechamento, taxaservico, valortotal) FROM stdin;
\.


--
-- TOC entry 3532 (class 0 OID 32885)
-- Dependencies: 225
-- Data for Name: cozinheiro; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.cozinheiro (funcionario_id, status) FROM stdin;
\.


--
-- TOC entry 3526 (class 0 OID 32832)
-- Dependencies: 219
-- Data for Name: funcionarios; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.funcionarios (usuario_id, matricula, data_admissao, salario) FROM stdin;
\.


--
-- TOC entry 3527 (class 0 OID 32844)
-- Dependencies: 220
-- Data for Name: garcom; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.garcom (funcionario_id, bonus) FROM stdin;
\.


--
-- TOC entry 3536 (class 0 OID 32904)
-- Dependencies: 229
-- Data for Name: itens; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.itens (id, cardapio_id, nome, preco, categoria) FROM stdin;
\.


--
-- TOC entry 3529 (class 0 OID 32855)
-- Dependencies: 222
-- Data for Name: mesa; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.mesa (id, status, numero) FROM stdin;
\.


--
-- TOC entry 3538 (class 0 OID 32920)
-- Dependencies: 231
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.pedidos (id, id_garcom, id_comanda, id_item, id_cozinheiro, quantidade, obs) FROM stdin;
\.


--
-- TOC entry 3525 (class 0 OID 32819)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: fred
--

COPY public.usuarios (id, nome, email, senha, cpf, tipo_usuario) FROM stdin;
\.


--
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 226
-- Name: cardapios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fred
--

SELECT pg_catalog.setval('public.cardapios_id_seq', 1, false);


--
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 223
-- Name: comandas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fred
--

SELECT pg_catalog.setval('public.comandas_id_seq', 1, false);


--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 228
-- Name: itens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fred
--

SELECT pg_catalog.setval('public.itens_id_seq', 1, false);


--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 221
-- Name: mesa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fred
--

SELECT pg_catalog.setval('public.mesa_id_seq', 1, false);


--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 230
-- Name: pedidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fred
--

SELECT pg_catalog.setval('public.pedidos_id_seq', 1, false);


--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: fred
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- TOC entry 3362 (class 2606 OID 32902)
-- Name: cardapios cardapios_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.cardapios
    ADD CONSTRAINT cardapios_pkey PRIMARY KEY (id);


--
-- TOC entry 3358 (class 2606 OID 32873)
-- Name: comandas comandas_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT comandas_pkey PRIMARY KEY (id);


--
-- TOC entry 3360 (class 2606 OID 32890)
-- Name: cozinheiro cozinheiro_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.cozinheiro
    ADD CONSTRAINT cozinheiro_pkey PRIMARY KEY (funcionario_id);


--
-- TOC entry 3348 (class 2606 OID 32838)
-- Name: funcionarios funcionarios_matricula_key; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_matricula_key UNIQUE (matricula);


--
-- TOC entry 3350 (class 2606 OID 32836)
-- Name: funcionarios funcionarios_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 3352 (class 2606 OID 32848)
-- Name: garcom garcom_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.garcom
    ADD CONSTRAINT garcom_pkey PRIMARY KEY (funcionario_id);


--
-- TOC entry 3364 (class 2606 OID 32913)
-- Name: itens itens_nome_key; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.itens
    ADD CONSTRAINT itens_nome_key UNIQUE (nome);


--
-- TOC entry 3366 (class 2606 OID 32911)
-- Name: itens itens_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.itens
    ADD CONSTRAINT itens_pkey PRIMARY KEY (id);


--
-- TOC entry 3354 (class 2606 OID 32863)
-- Name: mesa mesa_numero_key; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_numero_key UNIQUE (numero);


--
-- TOC entry 3356 (class 2606 OID 32861)
-- Name: mesa mesa_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_pkey PRIMARY KEY (id);


--
-- TOC entry 3368 (class 2606 OID 32925)
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id);


--
-- TOC entry 3342 (class 2606 OID 32831)
-- Name: usuarios usuarios_cpf_key; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_cpf_key UNIQUE (cpf);


--
-- TOC entry 3344 (class 2606 OID 32829)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 3346 (class 2606 OID 32827)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 3371 (class 2606 OID 32879)
-- Name: comandas comandas_id_garcom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT comandas_id_garcom_fkey FOREIGN KEY (id_garcom) REFERENCES public.usuarios(id);


--
-- TOC entry 3372 (class 2606 OID 32874)
-- Name: comandas comandas_id_mesa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.comandas
    ADD CONSTRAINT comandas_id_mesa_fkey FOREIGN KEY (id_mesa) REFERENCES public.mesa(id);


--
-- TOC entry 3373 (class 2606 OID 32891)
-- Name: cozinheiro cozinheiro_funcionario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.cozinheiro
    ADD CONSTRAINT cozinheiro_funcionario_id_fkey FOREIGN KEY (funcionario_id) REFERENCES public.funcionarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 3369 (class 2606 OID 32839)
-- Name: funcionarios funcionarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.funcionarios
    ADD CONSTRAINT funcionarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3370 (class 2606 OID 32849)
-- Name: garcom garcom_funcionario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.garcom
    ADD CONSTRAINT garcom_funcionario_id_fkey FOREIGN KEY (funcionario_id) REFERENCES public.funcionarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 3374 (class 2606 OID 32914)
-- Name: itens itens_cardapio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.itens
    ADD CONSTRAINT itens_cardapio_id_fkey FOREIGN KEY (cardapio_id) REFERENCES public.cardapios(id);


--
-- TOC entry 3375 (class 2606 OID 32931)
-- Name: pedidos pedidos_id_comanda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_id_comanda_fkey FOREIGN KEY (id_comanda) REFERENCES public.comandas(id);


--
-- TOC entry 3376 (class 2606 OID 32941)
-- Name: pedidos pedidos_id_cozinheiro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_id_cozinheiro_fkey FOREIGN KEY (id_cozinheiro) REFERENCES public.usuarios(id);


--
-- TOC entry 3377 (class 2606 OID 32926)
-- Name: pedidos pedidos_id_garcom_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_id_garcom_fkey FOREIGN KEY (id_garcom) REFERENCES public.usuarios(id);


--
-- TOC entry 3378 (class 2606 OID 32936)
-- Name: pedidos pedidos_id_item_fkey; Type: FK CONSTRAINT; Schema: public; Owner: fred
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_id_item_fkey FOREIGN KEY (id_item) REFERENCES public.itens(id);


-- Completed on 2025-09-25 15:16:57 -03

--
-- PostgreSQL database dump complete
--

\unrestrict bIwGEWNLq058yPsr1NV5Cana4ZXbn5NHJ4NW4Mi6lzLjBcegYnRZvi0T1fyuVLM

