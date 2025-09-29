document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addBtn");
  const pname = document.getElementById("pname");
  const pcategory = document.getElementById("pcategory");
  const pexpiry = document.getElementById("pexpiry");
  const pqty = document.getElementById("pqty");
  const inventoryBody = document.getElementById("inventoryBody");
  const count = document.getElementById("count");
  const searchBar = document.getElementById("searchBar");
  const filterCategory = document.getElementById("filterCategory");
  const filterExpiry = document.getElementById("filterExpiry");
  const recentsList = document.getElementById("recentsList");


  // Data storage
  let inventory = [];
  let recents = [];

  // --- Functions ---

  function logRecent(action) {
    recents.unshift(action);
    if (recents.length > 10) recents.pop();
    renderRecents();
  }

  function renderRecents() {
    recentsList.innerHTML = "";
    recents.forEach(item => {
      let li = document.createElement("li");
      li.textContent = item;
      recentsList.appendChild(li);
    });
  }

  function getStatus(item) {
    let today = new Date();
    let expiryDate = new Date(item.expiry);
    let soonDate = new Date();
    soonDate.setDate(today.getDate() + 7);

    if (expiryDate < today) return "Expired";
    if (expiryDate >= today && expiryDate <= soonDate) {
      if (item.qty <= 0) return "Not Available";
      return "Available (Near Expiration)";
    }
    if (item.qty <= 0) return "Not Available";
    return "Available";
  }

  function renderInventory() {
    let searchText = searchBar.value.toLowerCase();
    let selectedCategory = filterCategory.value;
    let selectedExpiry = filterExpiry.value;
    let today = new Date();
    let soonDate = new Date();
    soonDate.setDate(today.getDate() + 7);

    inventoryBody.innerHTML = "";

    let filtered = inventory.filter(item => {
      let matchesSearch = item.name.toLowerCase().includes(searchText);
      let matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

      let expiryDate = new Date(item.expiry);
      let isExpired = expiryDate < today;
      let isSoon = expiryDate >= today && expiryDate <= soonDate;

      let matchesExpiry =
        selectedExpiry === "all" ||
        (selectedExpiry === "expired" && isExpired) ||
        (selectedExpiry === "soon" && isSoon) ||
        (selectedExpiry === "valid" && !isExpired && !isSoon);

      return matchesSearch && matchesCategory && matchesExpiry;
    });

    filtered.forEach(item => {
      let row = document.createElement("tr");
      let expiryDate = new Date(item.expiry);

      // highlight expired or soon rows
      if (expiryDate < today) {
        row.style.backgroundColor = "#fee2e2"; // light red expired
      } else if (expiryDate >= today && expiryDate <= soonDate) {
        row.style.backgroundColor = "#fef9c3"; // light yellow soon
      }

      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.expiry}</td>
        <td>${item.qty}</td>
        <td>${getStatus(item)}</td>
        <td><button class="delete-btn" data-id="${item.id}">❌</button></td>
      `;
      inventoryBody.appendChild(row);
    });

    count.textContent = filtered.length;

    // Delete button listeners
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        deleteItem(parseInt(btn.dataset.id));
      });
    });
  }

  function addItem() {
    if (!pname.value || !pcategory.value || !pexpiry.value || !pqty.value) {
      alert("Please fill all fields");
      return false ;
    };

    let newItem = {
      id: Date.now(),
      name: pname.value,
      category: pcategory.value,
      expiry: pexpiry.value,
      qty: parseInt(pqty.value)
    };

    

    inventory.push(newItem);
    renderInventory();
    logRecent(`Added: ${newItem.name}`);

    // reset fields
    pname.value = "";
    pcategory.value = "";
    pexpiry.value = "";
    pqty.value = "";

  }

  function deleteItem(id) {
    let index = inventory.findIndex(item => item.id === id);
    if (index !== -1) {
      logRecent(`Deleted: ${inventory[index].name}`);
      inventory.splice(index, 1);
      renderInventory();
    }
  }

  // --- Event Listeners ---
  addBtn.addEventListener("click", addItem);

  // Live filtering (no logs)
  searchBar.addEventListener("input", () => {
    renderInventory();
  });

  // Log search only when pressing Enter
  searchBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && searchBar.value.trim() !== "") {
      logRecent(`Searched: ${searchBar.value}`);
    }
  });

  filterCategory.addEventListener("change", () => {
    renderInventory();
    logRecent(`Filtered by Category: ${filterCategory.value}`);
  });

  filterExpiry.addEventListener("change", () => {
    renderInventory();
    logRecent(`Filtered by Expiry: ${filterExpiry.value}`);
  });

  // All Items button resets filters & search
  const allBtn = document.querySelector(".all-btn");
  if (allBtn) {
    allBtn.addEventListener("click", () => {
      searchBar.value = "";
      filterCategory.value = "all";
      filterExpiry.value = "all";
      renderInventory();
      logRecent("Viewed all items");
      document.querySelector(".inventory-card").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Initial render
  renderInventory();
  renderRecents();
});

// --- Edit Feature Additions ---
let editId = null;

function openEditModal(item) {
  document.getElementById("editModal").style.display = "block";
  document.getElementById("editName").value = item.name;
  document.getElementById("editCategory").value = item.category;
  document.getElementById("editExpiry").value = item.expiry;
  document.getElementById("editQty").value = item.qty;
  editId = item.id;
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
  editId = null;
}

// Save button
document.getElementById("saveEdit").addEventListener("click", () => {
  if (editId !== null) {
    let index = inventory.findIndex(i => i.id === editId);
    if (index !== -1) {
      inventory[index].name = document.getElementById("editName").value;
      inventory[index].category = document.getElementById("editCategory").value;
      inventory[index].expiry = document.getElementById("editExpiry").value;
      inventory[index].qty = parseInt(document.getElementById("editQty").value);

      renderInventory();
      logRecent(`Edited: ${inventory[index].name}`);
      closeEditModal();
    }
  }
});

// Cancel button
document.getElementById("cancelEdit").addEventListener("click", closeEditModal);

// Add Edit buttons dynamically
function addEditButtons() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      let id = parseInt(btn.dataset.id);
      let item = inventory.find(i => i.id === id);
      if (item) openEditModal(item);
    });
  });
}

// Modify renderInventory to add edit button without changing old code
const oldRenderInventory = renderInventory;
renderInventory = function () {
  oldRenderInventory();
  document.querySelectorAll("#inventoryBody tr").forEach((row, index) => {
    let item = inventory[index];
    if (item) {
      let actionsCell = row.querySelector("td:last-child");
      if (!actionsCell.querySelector(".edit-btn")) {
        let editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.className = "edit-btn";
        editBtn.dataset.id = item.id;
        actionsCell.prepend(editBtn);
      }
    }
  });
  addEditButtons();
};

// Logout button logic
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "index.html";
  });
}