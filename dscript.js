document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addBtn");
  const pname = document.getElementById("pname");
  const pcategory = document.getElementById("pcategory");
  const pexpiry = document.getElementById("pexpiry");
  const pqty = document.getElementById("pqty");
  const inventoryBody = document.getElementById("inventoryBody");
  const count = document.getElementById("count");
  const searchBar = document.getElementById("searchBar");
  const filterCategory = document.createElement("select");
  const recentsList = document.createElement("ul");

  // Data storage
  let inventory = [];
  let recents = [];

  // --- Create Category Filter Dropdown ---
  filterCategory.innerHTML = `
    <option value="all">All Categories</option>
    <option value="Food">Food</option>
    <option value="Drinks">Drinks</option>
    <option value="Other">Other</option>
  `;
  filterCategory.id = "filterCategory";
  document.querySelector(".header-row").appendChild(filterCategory);

  // --- Create Recents Panel ---
  const recentsCard = document.createElement("div");
  recentsCard.classList.add("card");
  recentsCard.innerHTML = `<h3>RECENTS</h3>`;
  recentsCard.appendChild(recentsList);
  document.querySelector(".container").appendChild(recentsCard);

  // --- Functions ---

  function logRecent(action) {
    let time = new Date().toLocaleString();
    recents.unshift(`${time} - ${action}`);
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

    if (expiryDate < today) return "Expired";
    if (item.qty <= 0) return "Not Available";
    return "Available";
  }

  function renderInventory() {
    let searchText = searchBar.value.toLowerCase();
    let selectedCategory = filterCategory.value;

    inventoryBody.innerHTML = "";

    let filtered = inventory.filter(item => {
      let matchesSearch = item.name.toLowerCase().includes(searchText);
      let matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.forEach(item => {
      let row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.expiry}</td>
        <td>${item.qty}</td>
        <td>${getStatus(item)}</td>
        <td><button class="deleteBtn" data-id="${item.id}">❌</button></td>
      `;
      inventoryBody.appendChild(row);
    });

    count.textContent = filtered.length;

    // Delete button listeners
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        deleteItem(parseInt(btn.dataset.id));
      });
    });
  }

  function addItem() {
    if (!pname.value || !pcategory.value || !pexpiry.value || !pqty.value) {
      alert("Please fill all fields");
      return;
    }

    let newItem = {
      id: Date.now(),
      name: pname.value,
      category: pcategory.value,
      expiry: pexpiry.value,
      qty: parseInt(pqty.value)
    };

    inventory.push(newItem);
    logRecent(`Added product: ${newItem.name}`);
    renderInventory();

    pname.value = "";
    pcategory.value = "";
    pexpiry.value = "";
    pqty.value = "";
  }

  function deleteItem(id) {
    let index = inventory.findIndex(item => item.id === id);
    if (index !== -1) {
      logRecent(`Deleted product: ${inventory[index].name}`);
      inventory.splice(index, 1);
      renderInventory();
    }
  }

  // --- Event Listeners ---
  addBtn.addEventListener("click", addItem);
  searchBar.addEventListener("input", () => {
    renderInventory();
    logRecent(`Searched: "${searchBar.value}"`);
  });
  filterCategory.addEventListener("change", () => {
    renderInventory();
    logRecent(`Filtered by: ${filterCategory.value}`);
  });

  // Sidebar toggle
  profileBtn.addEventListener("click", () => sidebar.style.display = "block");
  closeSidebar.addEventListener("click", () => sidebar.style.display = "none");

  // Sidebar actions
  document.querySelector(".sidebar ul").addEventListener("click", e => {
    if (e.target.textContent.includes("Logout")) {
      logRecent("User logged out");
      alert("Logged out!");
    } else if (e.target.textContent.includes("Recents")) {
      recentsCard.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Initial render
  renderInventory();
  renderRecents();
});

// Logout button logic
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Clear any stored session/local data if needed
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to login page
  window.location.href = "login.html";
});