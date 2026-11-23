-- 1. Listar categorias
SELECT id_categoria, nome
FROM categorias
ORDER BY nome;

-- 2. Listar produtos com suas categorias (consulta usada pelo site)
SELECT
    p.id,
    p.nome,
    p.estoques,
    p.preco,
    c.nome AS categoria
FROM produtos AS p
LEFT JOIN categorias AS c
    ON c.id_categoria = p.id_categoria
ORDER BY p.id;

-- 3. Buscar produtos de uma categoria
SELECT p.id, p.nome, p.preco, p.estoques, c.nome AS categoria
FROM produtos AS p
JOIN categorias AS c ON c.id_categoria = p.id_categoria
WHERE c.nome = 'Armas'
ORDER BY p.nome;

-- 4. Buscar produtos pelo nome
SELECT p.id, p.nome, p.preco, p.estoques, c.nome AS categoria
FROM produtos AS p
JOIN categorias AS c ON c.id_categoria = p.id_categoria
WHERE p.nome ILIKE '%espada%'
ORDER BY p.nome;

-- 5. Produtos com estoque baixo
SELECT id, nome, estoques, preco
FROM produtos
WHERE estoques <= 5
ORDER BY estoques;

-- 6. Pedidos e seus clientes
SELECT pe.id AS pedido_id, cl.nome AS cliente, pe.data_pedido,
       pe.status, pe.valor_total
FROM pedidos AS pe
JOIN clientes AS cl ON cl.id = pe.cliente_id
ORDER BY pe.data_pedido DESC;

-- 7. Itens dos pedidos e subtotal
SELECT pi.pedido_id, pr.nome AS produto, pi.quantidade,
       pi.preco_unitario,
       pi.quantidade * pi.preco_unitario AS subtotal
FROM pedido_itens AS pi
JOIN produtos AS pr ON pr.id = pi.produto_id
ORDER BY pi.pedido_id;
