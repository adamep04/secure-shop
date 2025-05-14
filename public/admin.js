let loggedIn = false;
let productChart;

// Přihlášení
async function login() {
  const username = document.getElementById('user').value;
  const password = document.getElementById('pass').value;

  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    loggedIn = true;
    document.getElementById('adminPanel').style.display = 'block';
    loadOrders();
    loadProducts();
    loadProductChart();
  } else {
    alert('Login failed');
  }
}

// Přidání produktu
async function addProduct() {
  const name = document.getElementById('pname').value.trim();
  const price = parseFloat(document.getElementById('pprice').value);
  const count = parseInt(document.getElementById('pcount').value);

  if (!name || isNaN(price) || isNaN(count)) {
    alert("Please fill all fields correctly.");
    return;
  }

  const res = await fetch('/api/admin/add-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, count })
  });

  const data = await res.json();
  alert(data.success ? 'Product added' : 'Failed to add');
  if (data.success) {
    loadProducts();
    loadProductChart();
  }
}

// Načtení všech produktů
async function loadProducts() {
  const res = await fetch('/api/admin/add-product');
  const data = await res.json();

  const container = document.getElementById('productList');
  container.innerHTML = '';

  Object.entries(data).forEach(([id, product]) => {
    const row = document.createElement('div');
    row.className = 'card mb-2 p-2';

    row.innerHTML = `
      <input class="form-control mb-1" value="${product.name}" id="name-${id}">
      <input class="form-control mb-1" value="${product.price}" type="number" id="price-${id}">
      <input class="form-control mb-2" value="${product.count}" type="number" id="count-${id}">
      <div class="d-flex justify-content-between">
        <button class="btn btn-sm btn-warning" onclick="updateProduct('${id}')">Update</button>
        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${id}')">Delete</button>
      </div>
    `;
    container.appendChild(row);
  });
}

// Aktualizace produktu
async function updateProduct(id) {
  const name = document.getElementById(`name-${id}`).value.trim();
  const price = parseFloat(document.getElementById(`price-${id}`).value);
  const count = parseInt(document.getElementById(`count-${id}`).value);

  const res = await fetch('/api/admin/add-product', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, price, count })
  });

  const data = await res.json();
  alert(data.success ? 'Updated' : 'Update failed');
  if (data.success) loadProductChart();
}

// Smazání produktu
async function deleteProduct(id) {
  const confirmed = confirm("Are you sure you want to delete this product?");
  if (!confirmed) return;

  const res = await fetch('/api/admin/add-product', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  const data = await res.json();
  alert(data.success ? 'Deleted' : 'Delete failed');
  if (data.success) {
    loadProducts();
    loadProductChart();
  }
}

// Načtení objednávek
async function loadOrders() {
  const res = await fetch('/api/admin/orders');
  const orders = await res.json();
  const container = document.getElementById('orders');
  container.innerHTML = '';

  orders.forEach(order => {
    const div = document.createElement('div');
    div.textContent = `📦 ${order.address} — ${order.items.map(i => `${i.name} x${i.count}`).join(', ')}`;
    container.appendChild(div);
  });
}

// Graf produktů (koláč)
async function loadProductChart() {
  const res = await fetch('/api/admin/add-product');
  const data = await res.json();

  const labels = [];
  const counts = [];

  for (const [id, product] of Object.entries(data)) {
    labels.push(product.name);
    counts.push(product.count);
  }

  if (productChart) productChart.destroy();

  const ctx = document.getElementById('productChart').getContext('2d');
  productChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Počet ks',
        data: counts,
        backgroundColor: [
          '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#2ecc71'
        ]
      }]
    }
  });
}

//smazani orders
async function loadOrders() {
  const res = await fetch('/api/admin/orders'); // tato route by měla vracet všechna orders
  const data = await res.json();

  const ordersDiv = document.getElementById('orders');
  ordersDiv.innerHTML = '';

  Object.entries(data).forEach(([id, order]) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${order.address}</strong> – ${order.date || ''}</p>
      <button onclick="deleteOrder('${id}')">Smazat</button>
      <hr/>
    `;
    ordersDiv.appendChild(div);
  });
}

async function deleteOrder(id) {
  if (!confirm('Opravdu chcete tuto objednávku smazat?')) return;

  const res = await fetch('/api/admin/orders', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (res.ok) {
    alert('Objednávka smazána');
    loadOrders();
  } else {
    alert('Chyba při mazání');
  }
}

