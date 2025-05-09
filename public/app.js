let cart = [];

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
<<<<<<< HEAD
  products.forEach(p => {
    const item = document.createElement('div');
    item.innerHTML = `${p.name} - $${p.price} <button onclick='addToCart(${JSON.stringify(p)})'>Add</button>`;
=======

  products.forEach(p => {
    const item = document.createElement('div');
    item.innerHTML = `
      <div class="mb-2">
        ${p.name} – skladem: ${p.count} – $${p.price} 
        <input type="number" min="1" max="${p.count}" value="1" id="qty-${p.id}" style="width: 60px; margin-left:10px;">
        <button onclick='addToCart(${JSON.stringify(p)}, "qty-${p.id}")'>Add</button>
      </div>
    `;
>>>>>>> 1b82b36 (update)
    container.appendChild(item);
  });
}

<<<<<<< HEAD
function addToCart(product) {
  cart.push(product);
=======
function addToCart(product, inputId) {
  const qtyInput = document.getElementById(inputId);
  const count = parseInt(qtyInput.value);

  if (isNaN(count) || count <= 0) {
    alert('Zadej platné množství.');
    return;
  }

  // Pokud už produkt v košíku je, aktualizuj počet
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.count += count;
  } else {
    cart.push({ ...product, count });
  }

>>>>>>> 1b82b36 (update)
  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
<<<<<<< HEAD
  cart.forEach(p => {
    const item = document.createElement('div');
    item.textContent = p.name + ' - $' + p.price;
=======

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Košík je prázdný.</p>';
    return;
  }

  cart.forEach((p, index) => {
    const item = document.createElement('div');
    item.innerHTML = `
      ${p.name} – ks: ${p.count} – celkem: $${(p.count * p.price).toFixed(2)}
      <button onclick="removeFromCart(${index})" style="margin-left: 10px;">🗑️</button>
    `;
>>>>>>> 1b82b36 (update)
    cartDiv.appendChild(item);
  });
}

<<<<<<< HEAD
function checkout() {
=======
function removeFromCart(index) {
  cart.splice(index, 1); // odstraní danou položku z pole
  updateCart(); // překreslí košík
}
function checkout() {
  if (cart.length === 0) {
    alert('Košík je prázdný.');
    return;
  }
>>>>>>> 1b82b36 (update)
  document.getElementById('addressForm').style.display = 'block';
}

async function submitOrder() {
<<<<<<< HEAD
  const address = document.getElementById('address').value;
=======
  const address = document.getElementById('address').value.trim();

  if (!address) {
    alert('Zadej adresu.');
    return;
  }

>>>>>>> 1b82b36 (update)
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, items: cart })
  });
<<<<<<< HEAD
  const data = await res.json();
  if (data.success) alert('Order placed!');
=======

  const data = await res.json();

  if (data.success) {
    alert('Objednávka byla úspěšně odeslána!');
    cart = [];
    updateCart();
    document.getElementById('addressForm').style.display = 'none';
    document.getElementById('address').value = '';
    loadProducts(); // obnov zásoby
  } else {
    alert('Chyba při odesílání objednávky: ' + (data.error || 'Neznámá chyba'));
  }
>>>>>>> 1b82b36 (update)
}

loadProducts();
