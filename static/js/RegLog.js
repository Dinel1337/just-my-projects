
function LoginUp() {
  const login = document.querySelector(".login");
  const blur = document.querySelector(".blur-background");
  blur.style.display = "block";
  blur.classList.add("blur-background-anim");
  login.style.display = "flex";
  login.classList.add("animation-login-up");
}

window.LoginUp = LoginUp;

document.getElementById("reg-btn").addEventListener("click", function () {
  const register = document.querySelector(".register");
  const login = document.querySelector(".login");
  const blur = document.querySelector(".blur-background");
  login.classList.remove("animation-login-up");
  login.classList.add("animation-login-left");
  register.style.display = "flex";
  register.classList.add("animation-register-start");

  setTimeout(function () {
    login.style.display = "none";
    login.classList.remove("animation-login-left");
  }, 500);
});

document
  .getElementById("reg-btn-remove")
  .addEventListener("click", function () {
    const register = document.querySelector(".register");
    const login = document.querySelector(".login");
    register.classList.remove("animation-register-start");
    login.classList.add("animation-login-right");
    register.classList.add("animation-register-end");
    login.style.display = "flex";

    setTimeout(function () {
      register.style.display = "none";
      register.classList.remove("animation-register-end");
      login.classList.remove("animation-login-right");
    }, 500);
  });



// // Выбор элемента, за которым нужно следить
// const targetNode = document.getElementById("menu");

// // Определение функции обратного вызова
// const callback = function (mutationsList, observer) {
//   for (let mutation of mutationsList) {
//     if (mutation.type === "attributes" && mutation.attributeName === "class") {
//       console.log("Класс изменен:", targetNode.className);

//       // Здесь вы можете добавить логику для обработки изменения класса
//       if (targetNode.classList.contains("menu-setting")) {
//         console.log('Класс "menu-setting" добавлен');
//         // Выполните действия, когда класс добавлен
//       } else {
//         console.log('Класс "menu-setting" удален');
//         // Выполните действия, когда класс удален
//       }
//     }
//   }
// };

// const observer = new MutationObserver(callback);
// const config = { attributes: true };
// observer.observe(targetNode, config);

// // targetNode.classList.remove('menu-setting'); // Это вызовет функцию обратного вызова и удалит класс
