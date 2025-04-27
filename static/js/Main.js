const container = document.querySelector('.table');
const UPDATE = document.querySelector('.req');
const API = 'https://dinel1337-just-my-projects-0ed9.twc1.net';
let have = ['Dinelore'];

async function RequestSUKA(endpoint, method = 'GET', body = {}) {
    const response = await fetch(`${API}/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'GET' ? null : JSON.stringify(body)
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
    cumDiv.dataset.username = username;
    cumDiv.dataset.number = number;
    cumDiv.dataset.code = code;

    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'cum-username c';
    usernameDiv.textContent = username;
    usernameDiv.dataset.username = username;
    usernameDiv.dataset.fieldType = 'username';

    const numberDiv = document.createElement('div');
    numberDiv.className = 'cum-number c';
    numberDiv.textContent = number;
    numberDiv.dataset.number = number;
    numberDiv.dataset.fieldType = 'number';

    const codeDiv = document.createElement('div');
    codeDiv.className = 'cum-code c';
    codeDiv.textContent = code;
    codeDiv.dataset.code = code;
    codeDiv.dataset.fieldType = 'code';

    cumDiv.appendChild(usernameDiv);
    cumDiv.appendChild(numberDiv);
    cumDiv.appendChild(codeDiv);
    
    container.appendChild(cumDiv);
}

UPDATE.addEventListener('click', async function() {
    try {
        // Удаляем только элементы с классом 'cum', оставляя 'atribute'
        const cumElements = document.querySelectorAll('.table .cum');
        cumElements.forEach(element => element.remove());
        
        // Очищаем массив
        have = [];
        
        const data = await RequestSUKA('update');
        
        // Добавляем все элементы заново
        for (const num of data.update) {
            createCumElement(num.username, num.number, num.code);
            have.push(num.username);
        }
        
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
});
