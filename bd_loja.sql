-- ===========================================
-- 0) BANCO DE DADOS
-- ===========================================
CREATE DATABASE IF NOT EXISTS lojavirtual
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE lojavirtual;

-- ===========================================
-- 1) TABELAS
-- ===========================================

-- CATEGORIAS
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  descricao VARCHAR(255),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categorias_nome (nome)
) ENGINE=InnoDB;

-- MARCAS
CREATE TABLE marcas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_marcas_nome (nome)
) ENGINE=InnoDB;

-- PRODUTOS
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  slug VARCHAR(180) GENERATED ALWAYS AS (REPLACE(LOWER(nome), ' ', '-')) STORED,
  descricao TEXT,
  categoria_id INT NOT NULL,
  marca_id INT NOT NULL,
  preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
  estoque INT NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_produtos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  CONSTRAINT fk_produtos_marca     FOREIGN KEY (marca_id)     REFERENCES marcas(id),
  KEY idx_produtos_filtros (categoria_id, marca_id, ativo),
  KEY idx_produtos_preco (preco),
  KEY idx_produtos_criado (criado_em),
  FULLTEXT KEY ft_produtos (nome, descricao)
) ENGINE=InnoDB;

-- CLIENTES
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  cidade VARCHAR(100),
  uf CHAR(2),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_clientes_email (email)
) ENGINE=InnoDB;

-- PEDIDOS
CREATE TABLE pedidos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  status ENUM('PENDENTE','PAGO','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  KEY idx_pedidos_data (data_pedido),
  KEY idx_pedidos_status (status, data_pedido)
) ENGINE=InnoDB;

-- ITENS DO PEDIDO
CREATE TABLE itens_pedido (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pedido_id BIGINT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL CHECK (quantidade > 0),
  preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0),
  desconto DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (desconto >= 0),
  total_linha DECIMAL(12,2) AS (quantidade * (preco_unitario - desconto)) STORED,
  CONSTRAINT fk_itens_pedido_pedido  FOREIGN KEY (pedido_id)  REFERENCES pedidos(id),
  CONSTRAINT fk_itens_pedido_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
  KEY idx_itens_pedido (pedido_id),
  KEY idx_itens_produto (produto_id)
) ENGINE=InnoDB;

-- (Opcional) MOVIMENTOS DE ESTOQUE - útil para futuras aulas
CREATE TABLE movimentos_estoque (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  produto_id INT NOT NULL,
  pedido_id BIGINT NULL,
  quantidade_variacao INT NOT NULL, -- negativo para saída
  motivo ENUM('VENDA','AJUSTE') NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mov_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
  KEY idx_mov_produto (produto_id, criado_em)
) ENGINE=InnoDB;

-- ===========================================
-- 2) DADOS (SEEDS)
-- ===========================================

-- Categorias
INSERT INTO categorias (nome, descricao) VALUES
('Notebooks', 'Laptops e ultrabooks'),
('Periféricos', 'Acessórios e periféricos'),
('Monitores', 'Monitores de vídeo'),
('Armazenamento', 'HDD, SSD, NVMe'),
('Redes', 'Roteadores, switches e Wi-Fi'),
('Componentes', 'CPUs, GPUs, memórias'),
('Impressão', 'Impressoras e suprimentos'),
('Cadeiras', 'Cadeiras para escritório e gamer');

-- Marcas
INSERT INTO marcas (nome) VALUES
('Acer'), ('Dell'), ('Lenovo'), ('Logitech'),
('HP'), ('Kingston'), ('Samsung'), ('Asus'), ('TP-Link'), ('Seagate');

-- Produtos (24 exemplos)
INSERT INTO produtos (nome, descricao, categoria_id, marca_id, preco, estoque, ativo) VALUES
('Notebook Acer Aspire 5 15"', 'i5, 8GB, 256GB SSD', 1, 1, 3599.90, 12, 1),
('Notebook Dell Inspiron 14', 'Ryzen 5, 8GB, 512GB SSD', 1, 2, 4299.00, 8, 1),
('Notebook Lenovo Ideapad 3', 'i3, 4GB, 128GB SSD', 1, 3, 2599.00, 15, 1),
('Mouse Logitech M170', 'Mouse sem fio 2.4G', 2, 4, 79.90, 200, 1),
('Teclado Logitech K380', 'Bluetooth multi-device', 2, 4, 249.90, 120, 1),
('Headset HP H100', 'Headset estéreo com microfone', 2, 5, 149.90, 90, 1),
('Monitor Samsung 24" IPS', '1920x1080, 75Hz, FreeSync', 3, 7, 899.90, 35, 1),
('Monitor Dell 27" IPS', 'QHD 2560x1440, 75Hz', 3, 2, 1899.00, 18, 1),
('SSD Kingston NV2 500GB', 'NVMe Gen4', 4, 6, 289.90, 150, 1),
('SSD Kingston NV2 1TB', 'NVMe Gen4', 4, 6, 469.90, 120, 1),
('HD Seagate 2TB', 'SATA 7200rpm', 4, 10, 399.90, 60, 1),
('Roteador Asus RT-AX55', 'Wi-Fi 6 AX1800', 5, 8, 699.90, 25, 1),
('Roteador TP-Link Archer C6', 'AC1200', 5, 9, 249.90, 50, 1),
('Memória Kingston Fury 16GB', 'DDR4 3200', 6, 6, 329.90, 80, 1),
('Placa-mãe Asus Prime B550M', 'AM4 mATX', 6, 8, 799.90, 20, 1),
('Processador AMD Ryzen 5 5600', '6c/12t 4.4GHz', 6, 8, 949.00, 15, 1),
('Impressora HP Ink Tank 416', 'Wi-Fi, tanque de tinta', 7, 5, 999.90, 10, 1),
('Toner HP 106A', 'Preto, 1000 páginas', 7, 5, 279.90, 40, 1),
('Cadeira Gamer Dell X', 'Ergonômica, reclinável', 8, 2, 1499.00, 5, 1),
('Cadeira Escritório Pro', 'Apoio lombar', 8, 2, 899.00, 12, 1),
('Teclado Mecânico HP GK400', 'Switch Blue', 2, 5, 329.90, 30, 1),
('Mouse Gamer Logitech G203', '8000 DPI', 2, 4, 169.90, 75, 1),
('Notebook Samsung Book', 'i5, 8GB, 256GB SSD', 1, 7, 3799.90, 9, 1),
('Monitor Acer 21.5"', 'Full HD 60Hz', 3, 1, 649.90, 40, 1);

-- Clientes
INSERT INTO clientes (nome, email, cidade, uf) VALUES
('Ana Souza', 'ana@email.com', 'Rio de Janeiro', 'RJ'),
('Bruno Lima', 'bruno@email.com', 'São Paulo', 'SP'),
('Carla Mota', 'carla@email.com', 'Belo Horizonte', 'MG'),
('Diego Alves', 'diego@email.com', 'Curitiba', 'PR'),
('Elisa Prado', 'elisa@email.com', 'Vitória', 'ES'),
('Fabio Nunes', 'fabio@email.com', 'Niterói', 'RJ'),
('Giulia Ramos', 'giulia@email.com', 'Campinas', 'SP'),
('Henrique Luz', 'henrique@email.com', 'Santos', 'SP'),
('Isabela Reis', 'isabela@email.com', 'Juiz de Fora', 'MG'),
('João Pedro', 'joao@email.com', 'Volta Redonda', 'RJ');

-- Pedidos (4 exemplos)
INSERT INTO pedidos (cliente_id, status, data_pedido) VALUES
(1, 'PAGO',       NOW() - INTERVAL 7 DAY),
(2, 'PENDENTE',   NOW() - INTERVAL 2 DAY),
(3, 'PAGO',       NOW() - INTERVAL 1 DAY),
(4, 'CANCELADO',  NOW() - INTERVAL 10 DAY);

-- Itens de pedido
-- Pedido 1 (PAGO)
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, desconto) VALUES
(1, 9,  2, 289.90, 0.00),   -- 2x SSD NV2 500GB
(1, 21, 1, 329.90, 20.00);  -- 1x Teclado Mecânico HP com desconto

-- Pedido 2 (PENDENTE)
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, desconto) VALUES
(2, 7,  1, 899.90, 0.00),   -- Monitor Samsung 24"
(2, 4,  1, 79.90,  0.00);   -- Mouse M170

-- Pedido 3 (PAGO)
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, desconto) VALUES
(3, 1,  1, 3599.90, 100.00), -- Notebook Aspire com desconto
(3, 10, 1, 469.90,  0.00),   -- SSD NV2 1TB
(3, 12, 1, 699.90,  0.00);   -- Roteador AX55

-- Pedido 4 (CANCELADO)
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, desconto) VALUES
(4, 8,  1, 1899.00, 0.00);

-- (Opcional) alguns movimentos de estoque de exemplo
INSERT INTO movimentos_estoque (produto_id, pedido_id, quantidade_variacao, motivo) VALUES
(9,  1, -2, 'VENDA'),
(21, 1, -1, 'VENDA'),
(7,  2, -1, 'VENDA'),
(4,  2, -1, 'VENDA'),
(1,  3, -1, 'VENDA'),
(10, 3, -1, 'VENDA'),
(12, 3, -1, 'VENDA'),
(8,  4, -1, 'VENDA');
