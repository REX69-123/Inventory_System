document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addForm");
  const inventoryBody = document.getElementById("inventoryBody");
  const count = document.getElementById("count");
  const filterCategory = document.getElementById("filterCategory");
  const filterExpiry = document.getElementById("filterExpiry");
  const searchBar = document.getElementById("searchBar");

  // Load inventory from PHP
  function loadInventory() {
  fetch('get_inventory.php')
    .then(res => {
      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }
      return res.text();
    })
    .then(html => {
      console.log("PHP returned:", html); // Debug raw HTML
      inventoryBody.innerHTML = html.trim();
      applyFilters(); // ✅ Apply filters after loading new data

      // Count only rows that have real data (exclude the "No inventory found" row)
      const rows = inventoryBody.querySelectorAll("tr");
      if (rows.length === 1 && rows[0].textContent.includes("No inventory found")) {
        count.textContent = 0;
      } else {
        count.textContent = rows.length;
      }
    })
    .catch(err => {
      console.error("Error loading inventory:", err);
      inventoryBody.innerHTML = '<tr><td colspan="6">Error loading inventory</td></tr>';
      count.textContent = 0;
    });
}

  // Submit form via AJAX
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(addForm);

    fetch('dashboard.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(result => {

       console.log("Server returned:", JSON.stringify(result)); // see exact output

      if (result) {
        alert("Product added successfully!");
        addForm.reset();
        loadInventory(); // Refresh table
      } else {
        alert("Failed to add product: " + result);
      }
    })
    .catch(err => {
      console.error("Add error:", err);
      alert("Failed to submit.");
    });
  });

  function applyFilters() {
  const categoryFilter = filterCategory.value.toLowerCase();
  const expiryFilter = filterExpiry.value.toLowerCase();
  const searchTerm = searchBar.value.toLowerCase();

  let visibleCount = 0;

  const rows = inventoryBody.querySelectorAll("tr");
  rows.forEach(row => {
    const name = row.children[0]?.textContent.toLowerCase() || "";
    const category = row.children[1]?.textContent.toLowerCase() || "";
    const expiryStatus = row.children[4]?.textContent.toLowerCase() || "";

    const matchesCategory = (categoryFilter === "all" || category === categoryFilter);
    const matchesExpiry = (expiryFilter === "all" || expiryStatus === expiryFilter);
    const matchesSearch = name.includes(searchTerm);

    const shouldShow = matchesCategory && matchesExpiry && matchesSearch;

    row.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount++;
  });

  count.textContent = visibleCount;
}

  // Initial load
  loadInventory();
  
  filterCategory.addEventListener("change", applyFilters);
  filterExpiry.addEventListener("change", applyFilters);
  searchBar.addEventListener("input", applyFilters);
});