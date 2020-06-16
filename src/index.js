import "./styles/main.scss";
import "jquery";

// Buttons to change view
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

// Buttons submit form
const submitSingIn = document.getElementById("submitSignIn");
const submitSignUp = document.getElementById("submitSignUp");
var email = document.getElementById("signInEmail");
var pass = document.getElementById("signInPass");

const URL = "http://127.0.0.1/back-noteswebpack/public/index.php/api/";

const signIn = () => {
  $.ajax({
    type: "POST",
    url: URL + "login",
    data: {
      email: email.value,
      password: pass.value,
    },
    success: function (responseData) {
      console.log(responseData);
      localStorage.setItem("token", responseData["token"]);
      localStorage.setItem("user", responseData["email"]);
      window.location.href = "app.html";
    },
    error: function (err) {
      console.log(err);
    },
  });
};

const signUp = () => {
  $.ajax({
    type: "POST",
    url: url + "signup",
    data: {
      name: $("#singUpName").value,
      email: $("#signUpEmail").value,
      password: $("#signUpPass").value,
    },
    success: function (responseData) {
      console.log(responseData);
      localStorage.setItem("token", responseData["token"]);
      localStorage.setItem("user", responseData["email"]);
      if (localStorage.getItem("token") == responseData["token"]) {
        window.location.href = "app.html";
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
};

signUpButton.addEventListener("click", () =>
  container.classList.add("right-panel-active")
);

signInButton.addEventListener("click", () =>
  container.classList.remove("right-panel-active")
);

submitSignIn.addEventListener("click", signIn);
submitSignUp.addEventListener("click", signUp);
