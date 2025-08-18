document.getElementById("addBtn").addEventListener("click", function () {
  let name = document.getElementById("pname").value.trim();
  let category = document.getElementById("pcategory").value;
  let expiry = document.getElementById("pexpiry").value;
  let qty = document.getElementById("pqty").value;

  if (!name || !category || !expiry || qty === "") {
    alert("⚠ Please fill all fields");
    return;
  }

  let today = new Date().toISOString().split("T")[0];
  let status = (expiry < today || qty <= 0) ? "Expired" : "Active";

  let tbody = document.getElementById("inventoryBody");
  let row = document.createElement("tr");

  row.innerHTML = `
    <td>${name}</td>
    <td>${category}</td>
    <td>${expiry}</td>
    <td>${qty}</td>
    <td><span class="status ${status === "Expired" ? "expired" : "active"}">${status}</span></td>
    <td>
      <button class="action-btn edit-btn">✏️ Edit</button>
      <button class="action-btn delete-btn">🗑 Delete</button>
    </td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", function () {
    row.remove();
    updateCount();
  });

  tbody.appendChild(row);
  updateCount();

  document.getElementById("pname").value = "";
  document.getElementById("pcategory").value = "";
  document.getElementById("pexpiry").value = "";
  document.getElementById("pqty").value = "";
});

function updateCount() {
  let count = document.querySelectorAll("#inventoryBody tr").length;
  document.getElementById("count").textContent = count;
}

document.getElementById("searchBar").addEventListener("keyup", function () {
  let filter = this.value.toLowerCase();
  let rows = document.querySelectorAll("#inventoryBody tr");

  rows.forEach(row => {
    let text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
});

let sidebar = document.getElementById("sidebar");
let profileBtn = document.getElementById("profileBtn");
let closeSidebar = document.getElementById("closeSidebar");

profileBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("open");
});