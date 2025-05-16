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
    //Autologin
    const loginTime = Date.now();
    localStorage.setItem('adminLoginTime', loginTime);

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
    div.classList.add('card', 'p-2', 'mb-2');
    
    div.innerHTML = `
      <p><strong>${order.address}</strong><br>
      ${order.items.map(i => `${i.name} x${i.count}`).join(', ')}</p>
      <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

// Graf produktů na skladě
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

//Smazání objednávek
async function deleteOrder(id) {
  if (!confirm('Are you sure you want to delete this order?')) return;

  const res = await fetch('/api/admin/orders', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  if (res.ok) {
    alert('Order deleted');
    loadOrders();
  } else {
    alert('Delete error');
  }
}

//Zkontroluje jestli je admin přihlášen
window.addEventListener('DOMContentLoaded', () => {
  const savedLoginTime = localStorage.getItem('adminLoginTime');
  const now = Date.now();

  if (savedLoginTime && now - savedLoginTime < 30000) {
    loggedIn = true;
    document.getElementById('adminPanel').style.display = 'block';
    loadOrders();
    loadProducts();
    loadProductChart();
  } else {
    localStorage.removeItem('adminLoginTime');
  }
});

let sessionCountdownInterval;

function startSessionTimer(seconds) {
  clearInterval(sessionCountdownInterval); //zastavi predchozi timer
  const timerEl = document.getElementById('sessionTimer');
  let remaining = seconds;

  timerEl.textContent = `Session time left: ${remaining}s`;

  sessionCountdownInterval = setInterval(() => {
    remaining--;
    if (remaining > 0) {
      timerEl.textContent = `Session time left: ${remaining}s`;
    } else {
      timerEl.textContent = `Session expired.`;
      clearInterval(sessionCountdownInterval);
    }
  }, 1000);
}
