DROP DATABASE IF EXISTS rpg;

CREATE DATABASE rpg;

-- Loja de RPG

\c rpg;

-- TABELAS

-- RANK DE AVENTUREIRO
CREATE TABLE identificacao (
    id SERIAL PRIMARY KEY,
        nome varchar (30)
);

-- TABELA DE CLIENTES
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    genero VARCHAR(30) NOT NULL,
    idade INT NOT NULL,
    raca VARCHAR(100),
    ouro int,
    identificacao_aventureiro REFERENCES identificacao(id)
);

-- TABELA DE CATEGORIAS
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
);

-- TABELA DE PRODUTOS
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    estoques INT NOT NULL DEFAULT 0,
    preco DECIMAL(10, 2) NOT NULL,
    id_categoria INT REFERENCES categorias(id_categoria)
);

-- TABELA DE PEDIDOS
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id) ON DELETE CASCADE,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'Pendente',
    valor_total DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

-- TABELA DE ITENS DO PEDIDO
CREATE TABLE pedido_itens (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INT REFERENCES produtos(id),
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10, 2) NOT NULL
);
