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

function createCumElement(username, number, code, password) {
    const cumDiv = document.createElement('div');
    cumDiv.className = 'cum';
    cumDiv.dataset.username = username;
    cumDiv.dataset.number = number;
    cumDiv.dataset.code = code;
    cumDiv.dataset.password = password;

    // Создаём массив данных для отображения
    const fields = [
        { value: username, type: 'username', class: 'cum-username' },
        { value: number, type: 'number', class: 'cum-number' },
        { value: code, type: 'code', class: 'cum-code' },
        { value: password, type: 'password', class: 'cum-password' }, // Добавляем пароль
        { value: '-', type: 'delete', class: 'delete' } // Добавляем пароль

    ];

    fields.forEach((field) => {
        const div = document.createElement('div');
        div.className = `${field.class} c`;
        div.textContent = field.value;
        div.dataset[field.type] = field.value;
        div.dataset.fieldType = field.type;
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
                    createCumElement(user.username, user.number, user.code, user.password);
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

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete')) {
        const cumElement = event.target.closest('.cum');
        if (cumElement) {
            deleteUser(cumElement);
        }
    }
});

async function deleteUser(cumElement) {
    const username = cumElement.dataset.username; // Получаем только ник
    
    try {
        const response = await fetch(`${API}/delete_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }) // Отправляем только username
        });

        const result = await response.json();
        
        if (response.ok) {
            cumElement.remove();
            console.log('Пользователь удален:', result);
        } else {
            console.error('Ошибка при удалении:', result.error || 'Неизвестная ошибка');
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
    }
}
