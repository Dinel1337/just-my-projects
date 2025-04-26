const container = document.querySelector('.table');
const UPDATE = document.querySelector('.req');
const API = 'https://dinel1337-just-my-projects-0ed9.twc1.net'
let have = []
async function RequestSUKA(endpoint, method = 'GET', body = {}) {
    const response = await fetch(`${API}/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'GET' ? null : JSON.stringify(body) // Не добавляем тело для GET-запроса
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
} 

function createCumElement(username, number, code) {
    const cumDiv = document.createElement('div');
    cumDiv.className = 'cum';

    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'cum-username c';
    usernameDiv.textContent = username;

    const numberDiv = document.createElement('div');
    numberDiv.className = 'cum-number c';
    numberDiv.textContent = number;

    const codeDiv = document.createElement('div');
    codeDiv.className = 'cum-code c';
    codeDiv.textContent = code;

    cumDiv.appendChild(usernameDiv);
    cumDiv.appendChild(numberDiv);
    cumDiv.appendChild(codeDiv);
    container.appendChild(cumDiv);
}

UPDATE.addEventListener('click', async function() {
    try {
        const data = await RequestSUKA('update'); // Дожидаемся завершения запроса
        for (const num of data.update) {
            // Используем includes для проверки наличия username в массиве have
            if (!have.includes(num.username)) {
                createCumElement(num.username, num.number, num.code);
                have.push(num.username); // Добавляем username в массив have
            }
        }
        
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
});
