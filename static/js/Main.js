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
    return await response.json();
} 

function createCumElement(username, number, code) {
    const cumDiv = document.createElement('div');
    cumDiv.className = 'cum';
    cumDiv.dataset.username = username;
    cumDiv.dataset.number = number;
    cumDiv.dataset.code = code;

    [username, number, code].forEach((value, i) => {
        const div = document.createElement('div');
        div.className = i === 0 ? 'cum-username c' : 
                        i === 1 ? 'cum-number c' : 'cum-code c';
        div.textContent = value;
        div.dataset[`${i === 0 ? 'username' : i === 1 ? 'number' : 'code'}`] = value;
        div.dataset.fieldType = i === 0 ? 'username' : i === 1 ? 'number' : 'code';
        cumDiv.appendChild(div);
    });
    
    container.appendChild(cumDiv);
}

UPDATE.addEventListener('click', async function() {
    try {
        document.querySelectorAll('.table > .cum').forEach(el => el.remove());
        have = [];
        
        const response = await RequestSUKA('update');
        
        if (response.status === 'success' && Array.isArray(response.data)) {
            response.data.forEach(user => {
                if (!have.includes(user.username)) {
                    createCumElement(user.username, user.number, user.code);
                    have.push(user.username);
                }
            });
        } else {
            console.warn('Неверный формат данных:', response);
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
});
