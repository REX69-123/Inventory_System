const form = document.getElementById('productForm');
const inventoryTable = document.getElementById('inventoryTable');
const itemCount = document.getElementById('itemCount');

let inventory = [];

function updateInventoryDisplay() {
  inventoryTable.innerHTML = "";
  inventory.forEach((item, index) => {
    const row = document.createElement('tr');

    const statusClass = getStatusClass(item.expiryDate, item.quantity);
    const statusText = getStatusText(item.expiryDate, item.quantity);

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.expiryDate}</td>
      <td>${item.quantity}</td>
      <td><span class="status ${statusClass}">${statusText}</span></td>
      <td class="actions">
        <button class="edit" onclick="editItem(${index})">✏️</button>
        <button class="delete" onclick="deleteItem(${index})">🗑️</button>
      </td>
    `;
    inventoryTable.appendChild(row);
  });

  itemCount.textContent = inventory.length;
}

function getStatusClass(expiry, qty) {
  const today = new Date();
  const exp = new Date(expiry);
  if (exp < today) return "expired";
  if (qty < 10) return "low";
  return "available";
}

function getStatusText(expiry, qty) {
  const today = new Date();
  const exp = new Date(expiry);
  if (exp < today) return "Expired";
  if (qty < 10) return "Low Stock";
  return "Available";
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('productName').value;
  const category = document.getElementById('category').value;
  const expiryDate = document.getElementById('expiryDate').value;
  const quantity = parseInt(document.getElementById('quantity').value, 10);

  inventory.push({ name, category, expiryDate, quantity });
  updateInventoryDisplay();
  form.reset();
});

function deleteItem(index) {
  inventory.splice(index, 1);
  updateInventoryDisplay();
}

function editItem(index) {
  const item = inventory[index];
  document.getElementById('productName').value = item.name;
  document.getElementById('category').value = item.category;
  document.getElementById('expiryDate').value = item.expiryDate;
  document.getElementById('quantity').value = item.quantity;

  deleteItem(index);
}