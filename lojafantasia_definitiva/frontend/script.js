
const SUPABASE_URL = `https://eitfqzwixymoezmabawt.supabase.co`;
const SUPABASE_ANON_KEY = `sb_publishable_quuKMjkbfjkLXE2zw2660A_rruQjIU7`;

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let products = [];
let categories = [];

const cart = new Map();
const money = value => `${value.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})} PO`;
const grid = document.querySelector("#productGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const pills = document.querySelector("#categoryPills");

function renderCategoryControls(){
  categoryFilter.innerHTML = '<option value="Todas">Todas as categorias</option>';
  pills.innerHTML = "";

  categories.forEach(c => {
    categoryFilter.add(new Option(c, c));

    const button = document.createElement("button");
    button.className = "pill";
    button.textContent = c;
    button.addEventListener("click", () => {
      categoryFilter.value = c;
      document.querySelectorAll(".pill").forEach(p =>
        p.classList.toggle("active", p === button)
      );
      renderProducts();
    });
    pills.append(button);
  });

  const allButton = document.createElement("button");
  allButton.className = "pill active";
  allButton.textContent = "Todas";
  allButton.addEventListener("click", () => {
    categoryFilter.value = "Todas";
    document.querySelectorAll(".pill").forEach(p =>
      p.classList.toggle("active", p === allButton)
    );
    renderProducts();
  });
  pills.prepend(allButton);
}

async function loadStoreData(){
  grid.innerHTML = '<p>Carregando produtos...</p>';

  const { data, error } = await supabaseClient
    .from("produtos")
    .select(`
      id,
      nome,
      estoques,
      preco,
      categorias (
        nome
      )
    `)
    .order("id", { ascending: true });

  if(error){
    console.error("Erro ao buscar produtos:", error);
    grid.innerHTML = '<p class="empty-state">Não foi possível carregar os produtos. Confira a URL, a chave e as políticas do Supabase.</p>';
    return;
  }

  products = data.map(p => ({
    id: p.id,
    name: p.nome,
    category: p.categorias ? p.categorias.nome : "Sem categoria",
    price: Number(p.preco),
    stock: p.estoques,
    icon: "✦"
  }));

  const { data: categoryData, error: categoryError } = await supabaseClient
    .from("categorias")
    .select("nome")
    .order("nome", { ascending: true });

  if(categoryError){
    console.error("Erro ao buscar categorias:", categoryError);
    categories = [...new Set(products.map(p => p.category))].filter(c => c !== "Sem categoria");
  } else {
    categories = categoryData.map(c => c.nome);
  }

  renderCategoryControls();
  renderProducts();
  renderCart();
}

function renderProducts(){
  const term=document.querySelector("#searchInput").value.trim().toLocaleLowerCase("pt-BR");
  const category=categoryFilter.value;
  let list=products.filter(p=>(category==="Todas"||p.category===category)&&p.name.toLocaleLowerCase("pt-BR").includes(term));
  const sort=document.querySelector("#sortFilter").value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
  grid.innerHTML=list.map(p=>`<article class="product-card">
    <div class="product-art"><small>${p.category}</small><span class="symbol">${p.icon}</span></div>
    <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3>
      <div class="product-bottom"><span class="price">${money(p.price)}<small> / unidade</small></span><button class="add-button" data-add="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">+</button></div>
      <div class="stock ${p.stock<=5?"low":""}">${p.stock<=5?"Últimas unidades":"Em estoque"} · ${p.stock} un.</div>
    </div></article>`).join("");
  document.querySelector("#emptyState").hidden=list.length>0;
}

function renderCart(){
  const items=[...cart.entries()];
  document.querySelector("#cartCount").textContent=items.reduce((s,[,q])=>s+q,0);
  document.querySelector("#cartItems").innerHTML=items.length?items.map(([id,q])=>{
    const p=products.find(x=>x.id===id);
    return `<div class="cart-row"><div><strong>${p.name}</strong><small>${money(p.price)} cada · ${money(p.price*q)}</small></div><div class="quantity"><button data-change="${id}" data-delta="-1" aria-label="Diminuir">−</button><b>${q}</b><button data-change="${id}" data-delta="1" aria-label="Aumentar">+</button></div></div>`;
  }).join(""):`<div class="cart-empty">Sua mochila ainda está vazia.<br>Escolha alguns itens para sua jornada!</div>`;
  const total=items.reduce((s,[id,q])=>s+products.find(p=>p.id===id).price*q,0);
  document.querySelector("#cartTotal").textContent=money(total);
}

function toast(message){
  const el=document.querySelector("#toast");
  el.textContent=message;
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),2100);
}

grid.addEventListener("click",e=>{
  const button=e.target.closest("[data-add]");
  if(!button)return;
  const id=Number(button.dataset.add);
  const p=products.find(x=>x.id===id);
  if(!p || p.stock <= 0){
    toast("Produto sem estoque.");
    return;
  }
  const current = cart.get(id) || 0;
  if(current >= p.stock){
    toast("Quantidade máxima em estoque atingida.");
    return;
  }
  cart.set(id, current + 1);
  renderCart();
  toast(`${p.name} adicionado à mochila!`);
});

document.querySelector("#cartItems").addEventListener("click",e=>{
  const b=e.target.closest("[data-change]");
  if(!b)return;
  const id=Number(b.dataset.change);
  const next=(cart.get(id)||0)+Number(b.dataset.delta);
  const p=products.find(x=>x.id===id);
  if(next<=0)cart.delete(id);
  else cart.set(id,Math.min(p.stock,next));
  renderCart();
});

function toggleCart(open){
  document.querySelector("#cartDrawer").classList.toggle("open",open);
  document.querySelector("#overlay").classList.toggle("open",open);
  document.querySelector("#cartDrawer").setAttribute("aria-hidden",String(!open));
}

document.querySelector("#openCart").addEventListener("click",()=>toggleCart(true));
document.querySelector("#closeCart").addEventListener("click",()=>toggleCart(false));
document.querySelector("#overlay").addEventListener("click",()=>toggleCart(false));
document.querySelector("#searchInput").addEventListener("input",renderProducts);

categoryFilter.addEventListener("change",()=>{
  document.querySelectorAll(".pill").forEach(p=>p.classList.toggle("active",p.textContent===categoryFilter.value));
  renderProducts();
});

document.querySelector("#sortFilter").addEventListener("change",renderProducts);


async function finalizarPedido(){
  if(!cart.size){
    toast("Adicione algum item antes de finalizar.");
    return;
  }

  const nome = prompt("Nome do aventureiro:");
  if(!nome || !nome.trim()){
    toast("Informe o nome do cliente.");
    return;
  }

  const genero = prompt("Gênero do aventureiro:");
  if(!genero || !genero.trim()){
    toast("Informe o gênero do cliente.");
    return;
  }

  const idadeTexto = prompt("Idade do aventureiro:");
  const idade = Number(idadeTexto);
  if(!idadeTexto || !Number.isInteger(idade) || idade <= 0){
    toast("Informe uma idade válida.");
    return;
  }

  const raca = prompt("Raça do aventureiro (opcional):") || "";

  const itens = [...cart.entries()].map(([produto_id, quantidade]) => ({
    produto_id,
    quantidade
  }));

  const { data, error } = await supabaseClient.rpc("registrar_pedido", {
    p_nome: nome.trim(),
    p_genero: genero.trim(),
    p_idade: idade,
    p_raca: raca.trim() || null,
    p_itens: itens
  });

  if(error){
    console.error("Erro ao gravar pedido:", error);
    toast("Não foi possível gravar. Confira a função SQL e as permissões.");
    return;
  }

  toast(`Pedido #${data} gravado com sucesso!`);
  cart.clear();
  await loadStoreData();
  renderCart();
  toggleCart(false);
}

document.querySelector("#checkoutButton").addEventListener("click", finalizarPedido);

loadStoreData();
