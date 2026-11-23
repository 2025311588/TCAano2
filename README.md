# ⚒️ Forja & Feitiço — Loja de RPG

Uma loja virtual fictícia de itens medievais e fantásticos, desenvolvida como projeto acadêmico. O sistema simula um comércio voltado para aventureiros, oferecendo armas, armaduras, poções, equipamentos e artefatos mágicos.

## 📖 Sobre o projeto

A **Forja & Feitiço** é uma loja temática de RPG na qual os usuários podem explorar um catálogo de produtos, pesquisar itens, filtrar categorias, ordenar preços e adicionar produtos ao carrinho.

O projeto utiliza um banco de dados relacional para armazenar informações sobre clientes, produtos, categorias, identificações de aventureiros e pedidos.

## ✨ Funcionalidades

- Visualização do catálogo de produtos.
- Pesquisa de produtos pelo nome.
- Filtro por categorias.
- Ordenação por preço e nome.
- Exibição de preços e estoque.
- Carrinho de compras.
- Adição e remoção de produtos.
- Controle de quantidade dos itens.
- Cálculo automático do valor total.
- Integração com banco de dados Supabase para consulta de produtos e categorias.

## 🛠️ Tecnologias utilizadas

- **HTML5:** estrutura da aplicação.
- **CSS3:** estilização e responsividade.
- **JavaScript:** funcionalidades e interatividade.
- **PostgreSQL:** banco de dados relacional.
- **Supabase:** integração e gerenciamento do banco de dados.

## 🗄️ Estrutura do banco de dados

O banco de dados possui seis tabelas principais:

| Tabela | Descrição |
|---|---|
| `identificacao` | Armazena os ranks dos aventureiros. |
| `clientes` | Armazena os dados dos clientes. |
| `categorias` | Organiza os produtos por categoria. |
| `produtos` | Armazena os produtos, preços e estoques. |
| `pedidos` | Registra os pedidos realizados. |
| `pedido_itens` | Armazena os produtos pertencentes a cada pedido. |

### Relacionamentos

- Uma identificação pode estar associada a vários clientes.
- Um cliente pode realizar vários pedidos.
- Uma categoria pode classificar vários produtos.
- Um pedido pode conter vários itens.
- Um produto pode aparecer em vários itens de pedidos.

## 📁 Organização dos arquivos

```text
Forja-e-Feitico/
│
├── index.html
├── style.css
├── script.js
│
├── loja_corrigido.sql
├── inserts_completos.sql
├── selects.sql
│
└── README.md
```

## 🚀 Como executar o projeto

1. Clone este repositório:

```bash
git clone URL_DO_REPOSITORIO
```

2. Abra o projeto no Visual Studio Code.

3. Configure o projeto no Supabase, utilizando as credenciais do seu banco.

4. Execute os arquivos SQL na seguinte ordem:

   - `loja_corrigido.sql`
   - `inserts_completos.sql`

5. Abra o arquivo `index.html` utilizando o Live Server ou outro servidor local.

## 🎨 Identidade visual

O projeto utiliza uma temática medieval e fantástica, com elementos visuais inspirados em jogos de RPG, criando uma experiência de navegação ambientada em uma loja de itens para aventureiros.

## 🎓 Objetivo acadêmico

Este projeto foi desenvolvido com o objetivo de aplicar conhecimentos de desenvolvimento web, lógica de programação, manipulação de dados e modelagem de banco de dados.

---

**Forja & Feitiço — Comércio de Itens Místicos**

*Prepare seus equipamentos. Sua próxima aventura começa aqui!*
