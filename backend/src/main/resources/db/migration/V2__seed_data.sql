-- V2: Seed Data
-- Insere dados iniciais: usuários padrão (um de cada tipo), itens do cardápio e mesas

-- ============================================================================
-- CARDÁPIO
-- ============================================================================

INSERT INTO cardapios (id, nome) VALUES (1, 'Cardápio Principal');

SELECT setval('cardapios_id_seq', (SELECT MAX(id) FROM cardapios));

-- ============================================================================
-- USUÁRIOS PADRÃO
-- ============================================================================

-- 1. Garçom Padrão
INSERT INTO usuarios (id, nome, email, senha, cpf, tipo_usuario) VALUES 
(1, 'João Luiz', 'garcom@restaurante.com', '$2a$12$M4l91Rdn8/4eJ9xbvvjLT.dv9MKUWvFKX9F8Bj/zSjKUPyXbWSPsO', '111.111.111-11', 'GARCOM');

INSERT INTO funcionarios (usuario_id, matricula, data_admissao, salario) VALUES 
(1, 'GARC001', CURRENT_DATE, 2500.00);

INSERT INTO garcons (funcionario_id, bonus) VALUES 
(1, 0.00);

-- 2. Cozinheiro Padrão
INSERT INTO usuarios (id, nome, email, senha, cpf, tipo_usuario) VALUES 
(2, 'Maria Santos', 'cozinheiro@restaurante.com', '$2a$12$M4l91Rdn8/4eJ9xbvvjLT.dv9MKUWvFKX9F8Bj/zSjKUPyXbWSPsO', '222.222.222-22', 'COZINHEIRO');

INSERT INTO funcionarios (usuario_id, matricula, data_admissao, salario) VALUES 
(2, 'COZI001', CURRENT_DATE, 3000.00);

INSERT INTO cozinheiros (funcionario_id, status) VALUES 
(2, 'LIVRE');

-- 3. Barman Padrão
INSERT INTO usuarios (id, nome, email, senha, cpf, tipo_usuario) VALUES 
(3, 'Carlos Oliveira', 'barman@restaurante.com', '$2a$12$M4l91Rdn8/4eJ9xbvvjLT.dv9MKUWvFKX9F8Bj/zSjKUPyXbWSPsO', '333.333.333-33', 'BARMAN');

INSERT INTO funcionarios (usuario_id, matricula, data_admissao, salario) VALUES 
(3, 'BARM001', CURRENT_DATE, 2800.00);

INSERT INTO barmen (funcionario_id, status) VALUES 
(3, 'LIVRE');

-- 4. Admin Padrão
INSERT INTO usuarios (id, nome, email, senha, cpf, tipo_usuario) VALUES 
(4, 'Administrador', 'admin@restaurante.com', '$2a$12$d5L8aW3V/bLNz51pUbIHLe7Y.q.BrfUh.sloyU9pjr3JQmPfdzIya', '000.000.000-00', 'ADMIN');

INSERT INTO funcionarios (usuario_id, matricula, data_admissao, salario) VALUES 
(4, 'ADMIN001', CURRENT_DATE, 5000.00);

INSERT INTO admins (funcionario_id, nivel_acesso) VALUES 
(4, 1);

SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios));

-- ============================================================================
-- ITENS DO CARDÁPIO
-- ============================================================================

INSERT INTO itens (id, cardapio_id, nome, preco, tipo, categoria) VALUES
-- Comidas
(1, 1, 'Filé Mignon ao Molho Madeira', 89.90, 'PREMIUM', 'COMIDA'),
(2, 1, 'Picanha na Chapa', 75.00, 'PREMIUM', 'COMIDA'),
(3, 1, 'Frango Grelhado', 35.00, 'NORMAL', 'COMIDA'),
(4, 1, 'Lasanha à Bolonhesa', 42.00, 'NORMAL', 'COMIDA'),

-- Bebidas
(5, 1, 'Suco Natural de Laranja', 12.00, 'NORMAL', 'BEBIDA'),
(6, 1, 'Refrigerante Lata', 8.00, 'NORMAL', 'BEBIDA'),

-- Drinks
(7, 1, 'Caipirinha Premium', 28.00, 'PREMIUM', 'DRINK'),
(8, 1, 'Mojito', 32.00, 'PREMIUM', 'DRINK'),

-- Sobremesas
(9, 1, 'Petit Gateau', 25.00, 'PREMIUM', 'SOBREMESA'),
(10, 1, 'Pudim de Leite', 15.00, 'NORMAL', 'SOBREMESA');

SELECT setval('itens_id_seq', (SELECT MAX(id) FROM itens));

-- ============================================================================
-- MESAS
-- ============================================================================

INSERT INTO mesas (numero, status, capacidade) VALUES
(1, 'LIVRE', 4),
(2, 'LIVRE', 4),
(3, 'LIVRE', 4),
(4, 'LIVRE', 4),
(5, 'LIVRE', 4),
(6, 'LIVRE', 4),
(7, 'LIVRE', 4),
(8, 'LIVRE', 4),
(9, 'LIVRE', 4);

SELECT setval('mesas_id_seq', (SELECT MAX(id) FROM mesas));