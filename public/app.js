let cart = [];

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';

  products.forEach(p => {
    const item = document.createElement('div');
    item.className = 'card p-3 mb-3';

    item.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">${p.name}</h5>
          <p class="mb-1 text-muted">Skladem: <strong>${p.count}</strong></p>
          <p class="mb-0">Cena: <strong>$${p.price}</strong></p>
        </div>
        <div class="text-end">
          <input type="number" min="1" max="${p.count}" value="1" id="qty-${p.id}" class="form-control form-control-sm mb-2" style="width: 70px;">
          <button class="btn btn-sm btn-success" onclick='addToCart(${JSON.stringify(p)}, "qty-${p.id}")'>Add</button>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

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

  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';

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
    cartDiv.appendChild(item);
  });
}

function removeFromCart(index) {
  cart.splice(index, 1); // odstraní danou položku z pole
  updateCart(); // překreslí košík
}
function checkout() {
  if (cart.length === 0) {
    alert('Košík je prázdný.');
    return;
  }
  document.getElementById('addressForm').style.display = 'block';
}

async function submitOrder() {
  const address = document.getElementById('address').value.trim();

  if (!address) {
    alert('Zadej adresu.');
    return;
  }

  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, items: cart })
  });

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
}

loadProducts();
