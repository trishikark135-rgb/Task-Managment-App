const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const formTitle = document.getElementById("formTitle");
const switchText = document.getElementById("switchText");
const switchBtn = document.getElementById("switchBtn");
const message = document.getElementById("message");


// Switch Login/Register

switchBtn.addEventListener("click", () => {

    if (loginForm.style.display !== "none") {

        loginForm.style.display = "none";
        registerForm.style.display = "block";

        formTitle.textContent = "Register";

        switchText.textContent =
            "Already have an account?";

        switchBtn.textContent = "Login";

    } else {

        loginForm.style.display = "block";
        registerForm.style.display = "none";

        formTitle.textContent = "Login";

        switchText.textContent =
            "Don't have an account?";

        switchBtn.textContent = "Register";
    }

});


// Register

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value;

    const email =
        document.getElementById("registerEmail").value;

    const password =
        document.getElementById("registerPassword").value;


    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );


        const data = await response.json();

        message.textContent = data.message;


        if (response.ok) {

            message.style.color = "green";

            registerForm.reset();

        } else {

            message.style.color = "red";
        }

    } catch (error) {

        message.textContent =
            "Cannot connect to server.";

        message.style.color = "red";
    }

});


// Login

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;


    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );


        const data = await response.json();

        message.textContent = data.message;


        if (response.ok) {

            message.style.color = "green";

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 1000);

        } else {

            message.style.color = "red";
        }

    } catch (error) {

        message.textContent =
            "Cannot connect to server.";

        message.style.color = "red";
    }

});