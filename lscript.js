document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#loginForm");
  const usernameInput = document.getElementById("username");
  const passInput = document.getElementById("pass");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let username = usernameInput.value.trim();
    let password = passInput.value.trim();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    fetch("login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("user_name", data.user_name);
        window.location.href = "user_validation.php";
      } else {
        alert(data.message || "Invalid credentials.");
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Login request failed.");
    });
  });
});