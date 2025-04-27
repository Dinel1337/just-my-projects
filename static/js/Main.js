const container = document.querySelector('.table');
const UPDATE = document.querySelector('.req');
const API = 'https://dinel1337-just-my-projects-0ed9.twc1.net';
let have = ['Dinelore'];

// Проверяем существование элементов DOM
if (!container || !UPDATE) {
  console.error('Не найдены необходимые DOM-элементы!');
  if (!container) console.error('Элемент .table не найден');
  if (!UPDATE) console.error('Элемент .req не найден');
}

async function RequestSUKA(endpoint, method = 'GET', body = {}) {
    try {
        const response = await fetch(`${API}/${endpoint}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: method === 'GET' ? null : JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка в RequestSUKA:', error);
        throw error;
    }
} 

function createCumElement(username, number, code) {
    if (!container) {
        console.error('Контейнер не найден при создании элемента');
        return;
    }

    const cumDiv = document.createElement('div');
    cumDiv.className = 'cum';
    cumDiv.dataset.username = username;
    cumDiv.dataset.number = number;
    cumDiv.dataset.code = code;

    // Создаем элементы с проверкой значений
    const fields = [
        { value: username, className: 'cum-username c', field: 'username' },
        { value: number, className: 'cum-number c', field: 'number' },
        { value: code, className: 'cum-code c', field: 'code' }
    ];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = field.className;
        div.textContent = field.value || ''; // Защита от undefined
        div.dataset[field.field] = field.value;
        div.dataset.fieldType = field.field;
        cumDiv.appendChild(div);
    });
    
    container.appendChild(cumDiv);
    return cumDiv; // Возвращаем созданный элемент для отладки
}

UPDATE.addEventListener('click', async function() {
    try {
        // Показываем индикатор загрузки
        UPDATE.disabled = true;
        UPDATE.textContent = 'Загрузка...';
        
        // Более надежное удаление элементов
        const existingElements = container.querySelectorAll('.cum');
        existingElements.forEach(el => el.remove());
        
        have = []; // Очищаем массив
        
        const response = await RequestSUKA('update');
        console.log('Получен ответ:', response); // Логируем ответ
        
        if (response && response.status === 'success' && Array.isArray(response.data)) {
            if (response.data.length === 0) {
                console.warn('Получен пустой массив данных');
                // Можно добавить сообщение в интерфейс
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'empty-message';
                emptyMsg.textContent = 'Нет данных для отображения';
                container.appendChild(emptyMsg);
            } else {
                response.data.forEach(user => {
                    if (user && user.username && !have.includes(user.username)) {
                        const createdElement = createCumElement(
                            user.username, 
                            user.number || 'N/A', 
                            user.code || 'N/A'
                        );
                        if (createdElement) {
                            have.push(user.username);
                        }
                    }
                });
            }
        } else {
            console.error('Неверный формат ответа:', response);
            alert('Ошибка: неверный формат данных от сервера');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Ошибка при загрузке данных: ${error.message}`);
    } finally {
        // Восстанавливаем кнопку
        UPDATE.disabled = false;
        UPDATE.textContent = 'Обновить';
    }
});

// Первоначальная загрузка данных при старте
document.addEventListener('DOMContentLoaded', () => {
    UPDATE.click(); // Автоматически загружаем данные
});
