const game = document.querySelector(".game");
const gamesec = document.querySelector(".game-sec");
const darkBlur = document.getElementById("dark");
const url_leave = `${localStorage.getItem('domen')}api/leave`;
let hod = undefined; // нужно сделать эту переменную как определение что ставиться крестик или нолик
let this_room = undefined; // для сокетов
let statusGame = undefined; // Победа, поражение, ничья
const efir = document.querySelectorAll(".efir");
const WLD = document.querySelectorAll(".WLD");
const loading = document.querySelector('.waiting');
const EndClick = document.getElementById('EndClick');



const winningCombinations = [
  ["1", "2", "3"], // первая строка
  ["4", "5", "6"], // вторая строка
  ["7", "8", "9"], // третья строка
  ["1", "4", "7"], // первый столбец
  ["2", "5", "8"], // второй столбец
  ["3", "6", "9"], // третий столбец
  ["1", "5", "9"], // диагональ
  ["3", "5", "7"], // диагональ
];

efir.forEach((element) => {
  element.addEventListener("click", () => {
    const storedArrayString = localStorage.getItem("active");
    let storedArray = JSON.parse(storedArrayString) || [];
    const storedArrayStringEnemy = localStorage.getItem("Enemyactive");
    let storedArrayEnemy = JSON.parse(storedArrayStringEnemy) || [];
    if (
      !darkBlur.classList.contains("no-my-move") &&
      !storedArray.includes(element.dataset.gameid) &&
      !storedArrayEnemy.includes(element.dataset.gameid)
    ) {
      storedArray.push(element.dataset.gameid);

      if (hod == 1) {
        crest(element);
      } else {
        nolik(element);
      }

      localStorage.setItem("MyMotion", element.dataset.gameid);
      darkBlur.classList.add("no-my-move");
      loading.style.opacity = '1';
      
      localStorage.setItem("active", JSON.stringify(storedArray)); // Сохраняем обновленный массив обратно в localStorage
      localStorage.setItem("MyMove", "broad");
      socket.emit("CheckMove", {
        room: this_room,
        move: localStorage.getItem("MyMove"),
        motion: element.dataset.gameid,
      });
      WinLose();
    } else {
      console.log("Этот ход уже был сделан!");
    }
  });
});

function crest(element) {
  element.innerHTML = `
    <div class="crest">
        <div class="line horizontal"></div>
        <div class="line vertical"></div>
    </div>
`;
}

function nolik(element) {
  element.innerHTML = `
    <div class="nolik">
    </div>
`;
}

function start(room) {
  localStorage.setItem("blur", true);
  darkBlur.style.display = "flex";
  loading.style.display = 'flex';
  EndClick.style.display = 'flex';

  localStorage.removeItem("active");
  localStorage.removeItem("Enemyactive");
  this_room = room;
  menuEL.classList.remove("menu-setting");
  menuEL.classList.add("close-menu-anim");
  blurs.style.display = "none";
  DeleteGameSession();
  document.querySelector(".offer")
    ? document.querySelector(".offer").remove()
    : null;
  console.log("мой ход", localStorage.getItem("MyMove"));
  setTimeout(function () {
    menuEL.classList.remove("close-menu-anim");
    menuEL.style.display = "none";
    blurs.style.display = "flex";
    setTimeout(function () {
      game.style.display = "flex";
      game.classList.add("game-animation");
      gamesec.classList.add("game-sec-animation");
      efir.forEach((element) => {
        element.classList.add("efir-animation");
      });
    }, 100);
  }, 200);
  CheckMove();
}

function CheckMove() {
  if (
    localStorage.getItem("MyMove") == "0" ||
    localStorage.getItem("MyMove") == "broad"
  ) {
    hod = 0;
    darkBlur.classList.add("no-my-move");
    loading.style.opacity = '1';
  } else {
    hod = 1;
  }
}

socket.on("StartGame", (data) => {
  start(data.room);
});

socket.on("CheckMove", (data) => {
  if (data.move != localStorage.getItem("MyMove")) {
    darkBlur.classList.remove("no-my-move");
    loading.style.opacity = '0';
    const storedArrayString = localStorage.getItem("Enemyactive");
    let storedArray = JSON.parse(storedArrayString) || [];
    storedArray.push(data.motion);

    localStorage.setItem("Enemyactive", JSON.stringify(storedArray));
    const targetElement = document.querySelector(
      `[data-gameid="${data.motion}"]`
    );
    if (hod == 0) {
      crest(targetElement);
    } else {
      nolik(targetElement);
    }
    WinLose();
  }
  localStorage.setItem("MyMove", 0);
});

function WinLose() {
  const ArrayMe = localStorage.getItem("active"); // наши
  const Me = JSON.parse(ArrayMe) || [];

  const ArrayEnemy = localStorage.getItem("Enemyactive"); // не наши
  const Enemy = JSON.parse(ArrayEnemy) || [];

  function checkWin(playerMoves) {
    const winningCombination = winningCombinations.find((combination) =>
      combination.every((index) => playerMoves.includes(index))
    );

    // Вернуть найденную комбинацию или null, если не найдена
    return winningCombination || null;
  }
  const winningCombinationMe = checkWin(Me);
  const winningCombinationEnemy = checkWin(Enemy);
  const length = Me.length + Enemy.length;
  console.log("ходов сделано", length);

  if (winningCombinationMe) {
    statusGame = "win";
    leave();
  } else if (winningCombinationEnemy) {
    statusGame = "lose";
    leave();
  } else if (
    length === 9 &&
    !winningCombinationMe &&
    !winningCombinationEnemy
  ) {
    // проверка на ничью (winningCombinationMe && winningCombinationEnemy) !== 'undefined' )
    statusGame = "draw";
    leave();
  }
}

function leave() {
  localStorage.removeItem('blur');
  fetch(url_leave, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: statusGame }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
  const end = document.getElementById(statusGame);

  console.log(end);

  end.classList.add("WLD-start");
  end.parentElement.style.display = "flex";
  loading.style.display = 'none';
  loading.style.opacity = '0';
  EndClick.style.opacity = '0.8';
}

function handleClick() {
  const end = document.getElementById(statusGame);
  game.classList.remove("game-animation");
  gamesec.classList.remove("game-sec-animation");
  efir.forEach((e) => {
      e.classList.remove("efir-animation");
  });
  end.classList.remove("WLD-start");
  end.classList.add("WLD-end");
  darkBlur.classList.contains('no-my-move') ? darkBlur.classList.remove('no-my-move') : null;
  EndClick.style.opacity = '0';
  EndClick.style.display = 'none';

  setTimeout(function () {
      end.parentElement.style.display = "none";
      end.classList.remove("WLD-end");
      blurs.style.display = "none";
      game.classList.add("game-animation-end");
      gamesec.classList.add("game-sec-animation-end");
      efir.forEach((e) => {
          e.innerHTML = "";
          e.classList.add("efir-animation-end");
      });
      statusGame = undefined;
      setTimeout(function() {
          game.classList.remove("game-animation-end");
          gamesec.classList.remove("game-sec-animation-end");
          efir.forEach((e) => {
              e.innerHTML = "";
              e.classList.remove("efir-animation-end");
              game.style.display = 'none';
          });
      }, 500);
  }, 300);
}

// Добавляем обработчик клика для элементов WLD
WLD.forEach((e) => {
  e.addEventListener("click", handleClick);
});

// Добавляем обработчик клика для EndClick
EndClick.addEventListener("click", handleClick);