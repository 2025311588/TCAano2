CREATE OR REPLACE FUNCTION public.registrar_pedido(
  p_nome TEXT,
  p_genero TEXT,
  p_idade INTEGER,
  p_raca TEXT,
  p_itens JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cliente_id INTEGER;
  v_pedido_id INTEGER;
  v_total NUMERIC(10,2) := 0;
  v_item JSONB;
  v_produto_id INTEGER;
  v_quantidade INTEGER;
  v_preco NUMERIC(10,2);
BEGIN
  IF COALESCE(trim(p_nome), '') = '' OR COALESCE(trim(p_genero), '') = '' THEN
    RAISE EXCEPTION 'Nome e gênero são obrigatórios.';
  END IF;

  IF p_idade IS NULL OR p_idade <= 0 THEN
    RAISE EXCEPTION 'Idade inválida.';
  END IF;

  IF p_itens IS NULL OR jsonb_typeof(p_itens) <> 'array'
     OR jsonb_array_length(p_itens) = 0 THEN
    RAISE EXCEPTION 'O pedido precisa ter pelo menos um produto.';
  END IF;

  -- Valida os produtos e calcula o total usando os preços do banco.
  FOR v_item IN SELECT value FROM jsonb_array_elements(p_itens)
  LOOP
    v_produto_id := (v_item->>'produto_id')::INTEGER;
    v_quantidade := (v_item->>'quantidade')::INTEGER;

    IF v_quantidade IS NULL OR v_quantidade <= 0 THEN
      RAISE EXCEPTION 'Quantidade inválida.';
    END IF;

    SELECT preco INTO v_preco
    FROM produtos
    WHERE id = v_produto_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produto % não encontrado.', v_produto_id;
    END IF;

    IF (SELECT estoques FROM produtos WHERE id = v_produto_id) < v_quantidade THEN
      RAISE EXCEPTION 'Estoque insuficiente para o produto %.', v_produto_id;
    END IF;

    v_total := v_total + (v_preco * v_quantidade);
  END LOOP;

  INSERT INTO clientes (nome, genero, idade, raca, ouro, identificacao_aventureiro)
  VALUES (trim(p_nome), trim(p_genero), p_idade, NULLIF(trim(p_raca), ''), 0, NULL)
  RETURNING id INTO v_cliente_id;

  INSERT INTO pedidos (cliente_id, status, valor_total)
  VALUES (v_cliente_id, 'Pendente', v_total)
  RETURNING id INTO v_pedido_id;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_itens)
  LOOP
    v_produto_id := (v_item->>'produto_id')::INTEGER;
    v_quantidade := (v_item->>'quantidade')::INTEGER;

    SELECT preco INTO v_preco FROM produtos WHERE id = v_produto_id;

    INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario)
    VALUES (v_pedido_id, v_produto_id, v_quantidade, v_preco);

    UPDATE produtos
    SET estoques = estoques - v_quantidade
    WHERE id = v_produto_id;
  END LOOP;

  RETURN v_pedido_id;
END;
$$;

-- Permite que o site (chave publicável/anon) chame a função.
GRANT EXECUTE ON FUNCTION public.registrar_pedido(TEXT, TEXT, INTEGER, TEXT, JSONB)
TO anon, authenticated;
