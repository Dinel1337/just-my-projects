const animation = {
  settingModal: document.querySelector(".setting"),
  animation: document.getElementById("animation"),
  loginFORM: document.querySelector(".login"),
  registerFORM: document.querySelector(".register"),
  menuEL: document.querySelector(".menu"),
  game: document.querySelector(".game"),
  gamesec: document.querySelector(".game-sec"),
  efir: document.querySelectorAll(".efir"), // NodeList
  WLD: document.querySelectorAll(".WLD"),
};

const Blur = document.querySelector(".blur-background");

const settings = ["animation"];
const animationElement = [
  animation.settingModal,
  animation.loginFORM,
  animation.registerFORM,
  animation.menuEL,
  animation.game,
  animation.gamesec,
  ...animation.efir,
  ...animation.WLD,
];

function CheckboxSetting() {
  for (let i = 0; i < settings.length; i++) {
    const settingKey = settings[i];
    const checkbox = document.getElementById(settingKey);

    if (checkbox && localStorage.getItem(settingKey) === "true") {
      checkbox.checked = true;
    }
    ActiveSetting(settingKey);
  }
}

function ActiveSetting(s) {
  if (s === "animation") {
    const NoAnim = "no-animation";
    const isAnimationEnabled = localStorage.getItem(s) === "true"; // проверка на true/false

    animationElement.forEach(element => {
      if (element) { // Проверяем, что элемент существует
        if (isAnimationEnabled) {
          element.classList.add(NoAnim);
        } else {
          element.classList.remove(NoAnim);
        }
      }
    });
  }
}

function openSettings() {
  Blur.style.display = "block";
  Blur.classList.add("blur-background-anim");
  animation.settingModal.style.display = "flex";
  animation.settingModal.classList.add("animation-setting");

  setTimeout(function () {
    Blur.classList.remove("blur-background-anim");
    animation.settingModal.classList.remove("animation-setting");
  }, 1000);
  CheckboxSetting();
}

function closeSettings() {
  Blur.classList.add("blur-background-anim-close");
  animation.settingModal.classList.add("animation-setting-close");

  setTimeout(function () {
    animation.settingModal.style.display = "none";
    Blur.classList.remove("blur-background-anim-close");
    Blur.style.display = "none";
    animation.settingModal.classList.remove("animation-setting-close");
  }, 700);
}

document.getElementById("setting").addEventListener("click", openSettings);
document
  .getElementById("setting-close")
  .addEventListener("click", closeSettings);

Blur.addEventListener("click", function () {
  if (
    localStorage.getItem("blur") !== "true" &&
    animation.settingModal.style.display === "flex"
  ) {
    closeSettings();
  }
});


animation.animation.addEventListener("change", function () {
  localStorage.setItem("animation", this.checked); // Сохраняем состояние чекбокса
  CheckboxSetting();
});

CheckboxSetting();