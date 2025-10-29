
// User Validation
  fetch('session_check.php') // your existing session check script
    .then(res => res.json())
    .then(data => {
      if (!data.logged_in) {
        alert("You must log in to access this page.");
        window.location.href = "login.html";
      } else {
        document.getElementById("greeting").textContent = `Hello, ${data.user_name}!`;
      }
    })
    .catch(err => {
    console.error("User validation error:", err);
    window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addForm");
  const accountBody = document.getElementById("accountBody");
  const count = document.getElementById("accountCount");
  const filterCategory = document.getElementById("filterCategory");
  const filterExpiry = document.getElementById("filterExpiry");
  const searchBar = document.getElementById("searchBar");
  const logoutButton = document.getElementById("logoutBtn");
  


  // Load inventory from PHP
  function loadAccounts() {
  fetch('get_account_list.php')
    .then(res => {
      if (!res.ok) {
        throw new Error("HTTP error " + res.status);
      }
      return res.text();
    })
    .then(html => {
      console.log("PHP returned:", html); // Debug raw HTML
      accountBody.innerHTML = html.trim();
      // applyFilters(); // ✅ Apply filters after loading new data
      // attachDeleteListeners(); // Applys the deletebutton function
      // attachEditListeners(); // Applys the edit function

      // Count only rows that have real data (exclude the "No inventory found" row)
      const rows = accountBody.querySelectorAll("tr");
      if (rows.length === 1 && rows[0].textContent.includes("No inventory found")) {
        count.textContent = 0;
      } else {
        count.textContent = rows.length;
      }
    })
    .catch(err => {
      console.error("Error loading inventory:", err);
      accountBody.innerHTML = '<tr><td colspan="6">Error loading inventory</td></tr>';
      count.textContent = 0;
    });
}

  // Submit account form via AJAX
  addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(addForm);

    fetch('account_list.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(result => {

       console.log("Server returned:", JSON.stringify(result)); // see exact output

      if (result) {
        alert("Account added successfully!");
        addForm.reset();
        loadAccounts(); // Refresh table
      } else {
        alert("Failed to add account: " + result);
      }
    })
    .catch(err => {
      console.error("Add error:", err);
      alert("Failed to create.");
    });
  });


  // filters out the data from the table
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


// delete button function
function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".deleteBtn");

  deleteButtons.forEach(button => {

    button.addEventListener("click", function () {

      const id = this.getAttribute("data-id");
      
      if (confirm("Are you sure you want to delete this product?")) {
        fetch('delete_button.php', {

          method: "POST",
          headers: {
          "Content-Type": "application/x-www-form-urlencoded"  // this will let function know the id variable
          },
          body: "id=" + encodeURIComponent(id)

        })
          .then(response => response.text())
          .then(result => {

            const trimmed = result.trim(); // the response from the delete_button.php

            console.log("Server response:", trimmed); // for debugging

            if (trimmed === "success") {
              alert("Item deleted successfully: " + id);
              loadInventory(); // reload inventory after delete
              document.getElementById("editModal").style.display = "none";
            } else {
              alert("Error deleting item: " + id);
            }
          })
          .catch(error => {
            console.error("Delete error:", error);
            alert("Failed to delete item.");
          });
      }
    });
  });
}

// the edit feature function
function attachEditListeners() {
  const editButtons = document.querySelectorAll(".editBtn");

  editButtons.forEach(button => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const category = this.getAttribute("data-category");
      const expiry = this.getAttribute("data-expiry");
      const qty = this.getAttribute("data-qty");

      // Fill modal form
      document.getElementById("editName").value = name.trim();
      document.getElementById("editCategory").value = category.trim();
      document.getElementById("editExpiry").value = expiry.trim();
      document.getElementById("editQty").value = qty.trim();

      // Store the id on modal for saving
      document.getElementById("editModal").setAttribute("data-id", id);

      // Show modal
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('editModal').style.display = 'block';

      document.getElementById("editName").focus();
      console.log("Category to set:", `"${id}"`);
      console.log("Category to set:", `"${name}"`);
      console.log("Category to set:", `"${category}"`);
      console.log("Category to set:", `"${expiry}"`);
      console.log("Category to set:", `"${qty}"`);
      
    });
  });
}

// the save chnages button from th edit modal
document.getElementById("saveEdit").addEventListener("click", function () {

  const id = document.getElementById("editModal").getAttribute("data-id");
  const name = document.getElementById("editName").value;
  const category = document.getElementById("editCategory").value;
  const expiry = document.getElementById("editExpiry").value;
  const qty = document.getElementById("editQty").value;

  if (!name || !category || !expiry || !qty) {
        alert("Please fill in all fields before saving.");
        return; // stop here, don’t continue
  }

  fetch("edit_button.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `id=${id}&product_name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}
          &date=${encodeURIComponent(expiry)}&quantity=${encodeURIComponent(qty)}`
  })
    .then(response => response.text())
    .then(result => {
      const trimmed = result.trim(); // Clean response

      console.log("Server response:", trimmed); // Debugging

      if (trimmed === "success") {
        alert("Product updated!");
        document.getElementById('overlay').style.display = 'none';
        document.getElementById("editModal").style.display = "none";
        loadInventory(); // Reload the inventory list
      } else {
        alert("Failed to update product: " + trimmed);
      }
    })
    .catch(error => {
      console.error("Edit error:", error);
      alert("Error updating product.");
    })});


logoutButton.addEventListener("click", () => {

  const confirmLogout = confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    // Send logout request to PHP
    fetch("logout.php", { method: "POST" })
      .then(response => response.text())
      .then(result => {
        console.log("Logout response:", result.trim());
        // Redirect user to login page
        window.location.href = "login.html";
      })
      .catch(error => {
        console.error("Logout error:", error);
        alert("Logout failed. Please try again.");
      });
  } else {
    console.log("Logout canceled by user.");
  }
});


// Button to go back to dashboard
  document.getElementById("dashboardBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

// the cancel button from th edit modal
document.getElementById("cancelEdit").addEventListener("click", function () {
document.getElementById("editModal").style.display = "none";
document.getElementById('overlay').style.display = 'none';
});

  // Initial load
  loadAccounts();
  
  
  // filterCategory.addEventListener("change", applyFilters);
  filterExpiry.addEventListener("change", applyFilters);
  searchBar.addEventListener("input", applyFilters);
});