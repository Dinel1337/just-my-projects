localStorage.setItem('domen', 'https://dinel1337-tictactoe-227e.twc1.net/')
localStorage.removeItem('MyMove');
localStorage.removeItem('blur');
// localStorage.removeItem('active');
// localStorage.removeItem('Enemyactive');


const selector = {
  username: document.querySelector(".head-profile").dataset.username,
  play: document.getElementById('play'),
  loginInputName: document.getElementById("nickname-login"),
  loginInputPassword: document.getElementById("password-login"),
  registerInputName: document.getElementById("nickname-register"),
  registerInputPassword: document.getElementById("password-register"),
  url_login: `${localStorage.getItem('domen')}login`,
  url_register: `${localStorage.getItem('domen')}api/register`,
};

document.addEventListener('DOMContentLoaded', function() {
  window.DeleteGameSession();
});


function login_check(username, password) {
  fetch(selector.url_login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      location.reload();
    })
    .catch((error) => console.error("Ошибка:", error));
}
function register_check(username, password) {
  fetch(selector.url_register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      location.reload();
    })
    .catch((error) => console.error("Ошибка:", error));
}

const loginInputButton = document.getElementById("submit-login");
loginInputButton.addEventListener("click", function (event) {
  event.preventDefault();
  const name = selector.loginInputName.value;
  const pass = selector.loginInputPassword.value;
//   Логика проверки пароля но мне похуй ведь ее изи сделать
  login_check(name, pass);
});

const RegisterInputButton = document.getElementById("submit-register");
RegisterInputButton.addEventListener("click", function (event) {
  event.preventDefault();
  const name = selector.RegisterInputName.value;
  const pass = selector.RegisterInputPassword.value;
  //   Логика проверки пароля но мне похуй ведь ее изи сделать
  register_check(name, pass);
});

document.getElementById("play").addEventListener("click", function () {
  const username = document.querySelector(".head-profile").dataset.username;
  const myId = document.querySelector(".head-profile").dataset.id;
  if (username != "False") {
    window.addMyUser(myId);
    window.Menu();
    
  } else {
    window.LoginUp();
  }
});

const menu = document.querySelector('.menu-sort');
