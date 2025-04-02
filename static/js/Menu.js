// оставьлю пометку а то забуду как чмо

// const socket = io('https://dinel1337-tictactoe-227e.twc1.net', { transports: ['websocket'] });
const socket = io();
const domen = localStorage.getItem('domen'); 
const url_spisok = `${domen}api/spisok`;
const url_offer = `${domen}api/offer`;
const url_myUserAdd = `${domen}api/addMyUser`;
const url_checkoffer = `${domen}api/CheckOffer`;
const url_DelOffer = `${domen}api/DelOffer`;
const menuEL = document.querySelector(".menu"); // цельное меню
const menuElement = document.getElementById("menu-list"); // а это его элементы
const myUsername = document.querySelector(".head-profile").dataset.username;
const myId = document.querySelector(".head-profile").dataset.id;
const url_delgame = `${localStorage.getItem('domen')}api/DeleteUserSession`;
const blurs = document.querySelector(".blur-background"); // фон для приколов
const login = document.querySelector(".login");
const register = document.querySelector(".register");

window.MenuEl = menuEL;

let AllPlayButton = [];
let IdPlayButton = [];
let IdBtn = [];
let offerZ = true;
let offerAccept = true;
let move = undefined;

function getRandom() {
  return Math.round(Math.random());
}

setInterval(MaskOfMadness, 2000);

function MaskOfMadness() {
  const mom = document.querySelector(".menu");
  if (mom.classList.contains("menu-setting")) {
    Menus();
    checkOffer();
  }
}

blurs.addEventListener("click", function () {
  if (localStorage.getItem("blur") !== 'true'){
  menuEL.classList.remove("menu-setting");
  menuEL.classList.add("close-menu-anim");
  login.classList.add('close-menu-anim');
  register.classList.add('close-menu-anim');
  blurs.style.display = "none";
  DeleteGameSession();
  socket.emit("test-console");
  setTimeout(function () {
    menuEL.classList.remove("close-menu-anim");
    menuEL.style.display = "none";
    login.classList.remove("close-menu-anim");
    login.style.display = "none";
    register.classList.remove("close-menu-anim");
    register.style.display = "none";
  }, 200);}
});

function Menu() {
  const menu = document.querySelector(".menu");
  const blur = document.querySelector(".blur-background");
  blur.style.display = "block";
  blur.classList.add("blur-background-anim");
  menu.classList.add("menu-setting");
  menu.style.display = "flex";
}

function offer(MyId, EnemyId, move) {
  fetch(url_offer, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      myUserId: MyId,
      EnemyId: EnemyId,
      room: myUsername,
      move: move,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Успешно что-то сделалось"))
    .catch((error) => console.error("Error:", error));
}

function addMyUser(MyId) {
  fetch(url_myUserAdd, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ MyId: MyId }),
  })
    .then((response) => response.json())
    // .then((data) => console.log("Успешно сделалась сессия")) // заменить на фунцкию которая будет вызывать функцию play
    .catch((error) => console.error("Error:", error));
}

function updateAllPlayButton() {
  AllPlayButton = document.querySelectorAll(".menu-button");
  IdPlayButton = [];

  AllPlayButton.forEach((button) => {
    const buttonId = button.dataset.id;
    if (!IdPlayButton.includes(buttonId)) {
      IdPlayButton.push(buttonId);
    }
  });
}

function Menus() {
  fetch(url_spisok, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      menuElement.innerHTML = "";
      IdPlayButton = [];

      data.forEach((session) => {
        addPlayerInfo(session.id, session.username);
      });
      updateAllPlayButton();
    });
}

function DeleteGameSession() {
  fetch(url_delgame, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("zaebis");
    })
    .catch((error) => console.error("pezdec"));
}

function addPlayerInfo(id, username) {
  if (!IdPlayButton.includes(id) && id !== myId) {
    const menuSortContainer = document.createElement("div");
    menuSortContainer.classList.add("menu-sort");

    const playerNameElement = document.createElement("span");
    playerNameElement.dataset.username = username;
    playerNameElement.classList.add("name-player");
    playerNameElement.textContent = username;

    const playButton = document.createElement("button");
    playButton.dataset.id = id;
    playButton.classList.add("menu-button");
    playButton.textContent = "Play";

    menuSortContainer.appendChild(playerNameElement);
    menuSortContainer.appendChild(playButton);
    menuElement.appendChild(menuSortContainer);

    // Добавляем id в массив IdPlayButton
    IdPlayButton.push(id);
  }
}

function checkOffer() {
  fetch(url_checkoffer, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (offerZ && data.offer) {
        start_offfer(data.offer, data.room, data.EnemyMove, data.win, data.lose, data.username);
        console.log(data.EnemyMove);
        offerZ = false;
      }
    });
}

function DeleteOffer() {
  fetch(url_DelOffer, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log("Сообщение удалено");
      offerZ = true; // Сброс offerZ после удаления
    });
}

function start_offfer(id, room, move, win, lose, username) {
  const offerDiv = document.createElement("div");
  offerDiv.className = "offer offer-setting";

  const offerName = document.createElement("span");
  offerName.className = "offer-name";
  offerName.textContent = "Сообщение";
  offerDiv.appendChild(offerName);

  const offerProfileDiv = document.createElement("div");
  offerProfileDiv.className = "offer-profile";

  const offerPlayer = document.createElement("span");
  offerPlayer.className = "offer-player";
  offerPlayer.textContent = `Игрок : ${username}`;
  offerProfileDiv.appendChild(offerPlayer);

  const offerWin = document.createElement("span");
  offerWin.className = "offer-win";
  offerWin.textContent = `Поражений - ${lose}`;
  offerProfileDiv.appendChild(offerWin);

  const offerLose = document.createElement("span");
  offerLose.className = "offer-lose";
  offerLose.textContent = `Побед - ${win}`;
  offerProfileDiv.appendChild(offerLose);

  offerDiv.appendChild(offerProfileDiv);

  const offerButtonDiv = document.createElement("div");
  offerButtonDiv.className = "offer-button-div";
  offerButtonDiv.dataset.id = id;
  offerButtonDiv.dataset.room = room;
  offerButtonDiv.dataset.EnemyMove = move;

  const offerButton = document.createElement("button");
  offerButton.className = "offer-button";
  offerButton.textContent = "Play";
  offerButtonDiv.appendChild(offerButton);

  offerDiv.appendChild(offerButtonDiv);

  document.body.appendChild(offerDiv); // Например, добавляем в body
  setTimeout(function () {
    DeleteOffer();
    offerDiv.remove();
  }, 5000);
}

menuElement.addEventListener("click", function (event) {
  if (event.target.classList.contains("menu-button")) {
    const buttonId = event.target.dataset.id;
    if (!IdBtn.includes(buttonId)) {
      IdBtn.push(buttonId);
      setTimeout(function () {
        const index = IdBtn.indexOf(buttonId);
        if (index !== -1) {
          IdBtn.splice(index, 1);
        }
      }, 5000);
      move = getRandom();
      localStorage.setItem("MyMove", move);
      offer(myId, buttonId, move);
      socket.emit("join-game", { username: myUsername, room: myUsername });
    }
  }
});


document.body.addEventListener("click", function (event) {
  if (event.target.classList.contains("offer-button") && offerAccept == true) {
    offerAccept = false;
    const offerId = event.target.parentElement.dataset.id;
    const room = event.target.parentElement.dataset.room;
    let EnemyMove = event.target.parentElement.dataset.EnemyMove;
    EnemyMove == 1 ? (EnemyMove = 0) : (EnemyMove = 1);
    localStorage.setItem("MyMove", EnemyMove);
    accept(room);
    setTimeout((e) => {
      offerAccept = true;
    }, 5000);
  }
});

function accept(room) {
  socket.emit("StartGame", { room: room, username: myUsername });
}

window.DeleteGameSession = DeleteGameSession;
window.Menu = Menu;
window.addMyUser = addMyUser;
