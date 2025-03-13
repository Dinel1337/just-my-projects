from flask import Flask, request, render_template, redirect, url_for, session, make_response, jsonify
import base
from base import *

html_global = None
 
app = Flask(__name__)
app.secret_key = 'your_secret_key'
user_manager = base.UserManager(db_path='lol.db')
def check_session(session):
    username = session.get('username')
    if username:
        is_registered = user_manager.check_user_register(username)
        return is_registered, username
    return False, None










@app.route('/like', methods=['POST'])
def likes():
    data = request.get_json()
    product_id = data.get('id')
    user_id = data.get('username')
    like = get_status_like(user_id, product_id)
    like_dict = dict(like) if like else None
    return jsonify({'message': 'Product received', 'like': like_dict }), 200
    
@app.route('/json', methods=['POST'])
def handle_product():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    like = data.get('like')
    product_id = data.get('id')
    user_id = data.get('username')
    if like:
        base.dell_tovar(user_id, product_id)
        return jsonify({'message': 'Удален', 'product': data}), 200
    if user_id:
        base.add_tovar(user_id, product_id)
        return jsonify({'message': 'Добавлен', 'product': data}), 200
    else:
        return jsonify({'error': 'User  not authenticated'}), 401
    
@app.route('/like-dell', methods=['POST'])
def like_dell():
    data = request.get_json()
    if not data or 'like' not in data:
        return jsonify({'error': 'Ты накосячил'}), 400
    like = data['like']
    user = data['user']
    base.dell_tovar(user, like)
    return jsonify({'status': 'Удален', 'like': like}), 200

@app.route('/like-add', methods=['POST'])
def like_add():
    data = request.get_json()
    if not data or 'like' not in data:
        return jsonify({'error': 'Invalid data: "like" is required'}), 400
    like = data['like']
    user = data['user']
    base.add_tovar(user, like)
    return jsonify({'status': 'Добавлен', 'like': like}), 200
    
        
    
    
    
    
    
    
    
    
    
    
    


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['password_ez']
        user_len = len(username)
        user = user_manager.check_user_register(username)
        error = None
        
        if user_len < 6 or user_len > 20:
            error = "Ник должен быть 6-20 символов"
        elif password != confirm_password:
            error = "Пароли не совпадают"
        elif user is not None:
            error = "Такой пользователь уже существует"
        
        if error:
            return render_template('register.html', error=error)
        else:
            user_manager.add_user(username, password) 
            return redirect(url_for('login'))
    else:
        return render_template('register.html')
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    html = 'main'
    # global html_global
    # if html_global:
    #     html = html_global[:-5]
    #     print(html)
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = user_manager.check_user_login(username, password)
        if user:
            session['username'] = username  
            return redirect(url_for(html))
        else:
            return 'Неправильный логин или пароль'
    else:
        return render_template('login.html') 

@app.route('/logout')
def logout():

    session.pop('username', None)
    return redirect(url_for(''))
        
@app.route('/main', methods=['GET', 'POST'])
def main():
    html = 'index.html'
    global html_global
    html_global = html
    result, session_username = check_session(session)
    if not result:
        return render_template(html)

    return render_template(html, username=session_username)

@app.route('/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    html = 'profiel.html'
    global html_global
    html_global = html
    result, session_username = check_session(session)
    if not result or session_username != username:
        return redirect(url_for('main'))
    else:
        user_info = user_manager.check_user_register(session_username)
        description = user_manager.get_user_description(session_username)
        
        return render_template(html, username=session_username, description=description) 

@app.route('/profile/<username>/edit', methods=['GET', 'POST'])
def profile_edit(username):
    html = 'market.html'
    global html_global
    html_global = html
    result, session_username = check_session(session)
    if not result or session_username != username:
        return redirect(url_for('main'))  # Перенаправляем на главную страницу, если пользователь не аутентифицирован
    if request.method == 'POST':
        description = request.form.get("description", "").strip()  # Убираем лишние пробелы
        if description:
            user_manager.update_user_description(username, description)
            return redirect(url_for('profile', username=username))
        else:
            return render_template(html, username=username, error="Описание не может быть пустым")
    else:
        return render_template('edit_profile.html', username=username) 
    
@app.route('/market', methods=['GET'])
def market():
    html = 'market.html'
    global html_global
   
    html_global = html

    id = None
    cardsex = base.market_base(id)
    html = 'market.html'
    result, username = check_session(session)
    if result:
        return render_template(html, username=username, cardsex=cardsex)  # Передаем имя пользователя в шаблон
    else:
        return render_template(html, cardsex=cardsex)


@app.route('/market/product/<int:id>', methods=['GET', 'POST'])
def market_product(id):
    html = 'product.html'
    global html_global
    html_global = html
    result, username = check_session(session)
    product = base.market_base(id)
    
    
    if not result:
        return render_template(html, product=product)

    return render_template(html, username=username, product=product)

@app.route('/market/cart', methods=['GET', 'POST'])
def cart():
    html = 'cart.html'
    global html_global
    html_global = html
    result, username = check_session(session)
    
    if not result:
        return render_template(html)
    
    cart = select_tovar_cart(username)
    return render_template(html, baby = cart, username = username )
    


# @app.route('/main/market/add', methods=['GET'])
# def market():
#     return render_template('market.html')
    
if __name__ == '__main__':
    app.run(debug=True)