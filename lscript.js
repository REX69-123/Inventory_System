document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("pass");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let email = emailInput.value.trim();
        let password = passInput.value.trim();

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        if (email === "a" && password === "123") {
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password.");
        }
    });
});