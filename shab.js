const number = 7.5;
const progress = number / 10;
const circle = document.getElementById('progress-circle');
const text = document.getElementById('progress-text')
circle.setAttribute('stroke-dashoffset', 283 - (283 * progress));
text.textContent = number.toFixed(1);





const productData = document.getElementById('product-data');
const product = {
    id: productData.dataset.id,
    name: productData.dataset.name,
    price: productData.dataset.price,
    description: productData.dataset.description,
    garant: productData.dataset.garant,
    contry: productData.dataset.contry,
    type: productData.dataset.type,
    mass: productData.dataset.mass,
    model: productData.dataset.model,
    vkus: productData.dataset.vkus,
    username: productData.dataset.username
};
console.log (product.id)

console.table(product);
const productId = productData.dataset.id;
const userId = productData.dataset.username
const url = 'http://127.0.0.1:5000/json'
const url_like = 'http://127.0.0.1:5000/like'
const data = product.id;

function updateLikeButton(like){
    const likeButton = document.getElementById('like');
    if (like){
        likeButton.classList.add('js-like')
    }
    else (
        likeButton.classList.remove('js-like')
    )
}


function fetchLikeStatus() {
    fetch(url_like, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId, username: userId }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Статус лайка:', data.like);
            updateLikeButton(data.like);
        })
        .catch(error => console.error('Ошибка:', error));
}






const like = document.getElementById('like');
like.addEventListener('click', function() {
    const isLiked = like.classList.contains('js-like');
    console.log(isLiked);

    fetch(url, {
        method: "POST",
        body: JSON.stringify({ id: productId, username: userId, like: isLiked }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (response.status === 401) {
            window.location.href = "http://127.0.0.1:5000/login";
            return;
        }
        
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        }
        
        return response.json();
    })
    .then(data => {
        console.log('Успех:', data);
        fetchLikeStatus(); // Обновляем статус лайка после успешного запроса
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
});

document.addEventListener('DOMContentLoaded', fetchLikeStatus);



// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================

if (window.cartData) {
    console.log('Данные корзины:', window.cartData[0].id);}

    
const productData = document.getElementById('product-data');
const userId = productData.dataset.username
let status = true
function updateLikeButton(button, id){
    if (button.classList.contains('js-like')) {
        button.classList.remove('js-like')
        const url_like = 'http://127.0.0.1:5000/like-dell'
        json_like(id, url_like)
    }
    else { 
        button.classList.add('js-like')
        const url_like = 'http://127.0.0.1:5000/like-add'
        json_like(id, url_like)
    }}

const like_button = document.querySelectorAll('.like')
console.log (like_button)
like_button.forEach(button => {
    button.addEventListener('click', function() {
        const id = button.dataset.index
        console.log(id)
        updateLikeButton(button, id)
    })      
})


function json_like(product, url_like) {
    fetch(url_like, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ like: product, user: userId }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        return response.json();
    })
    .then(data => {
        console.log('Ответ сервера:', data);
    })
    .catch(error => console.error('Ошибка:', error));
}