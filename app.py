from flask import Flask, request, render_template, redirect, url_for, session, make_response, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from base import *
import shutil

terminal_width = shutil.get_terminal_size().columns
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app, cors_allowed_origins="https://dinel1337-tictactoe-227e.twc1.net")

rooms = {
    'game': [
        { 'username': 'User', 'message': 'Hi, there! from MAIN room', 'room': 'game'},
    ],
}

def check_session():
    username = session.get('username')
    if username:
        is_registered = check_user_register(username)
        return username
    return False

@socketio.on('move')
def move(data):
    room = data['room']
    move = data['move']
    emit('get-move', {move : move},  room=room)

@socketio.on('join-game')
def join_game(data):
    username = data['username']
    room = data['room']
    join_room(room)

@socketio.on('StartGame')
def StartGame(data):
    username = data['username']
    room = data['room']
    join_room(room)
    emit('StartGame', {'message': 'This is a response', "room" : room}, room=room)

@socketio.on('CheckMove')
def CheckMove(data):
    # username = data['username']
    room = data['room']
    move = data['move']
    motion = data['motion']
    emit('CheckMove', {"move": move, "room" : room, "motion" : motion}, room=room)

@app.route('/api/leave', methods=['POST'])
def leave():
    data = request.get_json()
    status = data.get('status')
    username = check_session()
    MyId = check_id(username)
    
    if status and username:
        sc = add_status(status, MyId)
        if sc:
            return jsonify({'message': 'status updated'}), 200
        else:
            return jsonify({'message': 'status not updated'}), 400

@app.route('/api/CheckOffer', methods=['GET'])
def checkoffer():
    username = check_session()
    MyId = check_id(username)
    
    if MyId:
        offer, room, move, win, lose, username = check_offer(MyId)
        if offer and room:
            # text = str(move)
            # padded_text = text.ljust(terminal_width)
            # print("\033[2m\033[32m\033[42m{}\033[0m".format(padded_text))
            return jsonify({'status': 'success', 'offer': offer, 'room': room, 'EnemyMove': move, 'win': win, 'lose': lose, 'username': username}), 200
    
    return jsonify({'status': 'None', 'message': 'Offer not found'}), 201

@app.route('/api/DelOffer', methods=['GET'])
def deloffer():
    username = check_session()
    MyId = check_id(username)
    
    if MyId:
        del_offer(MyId)
        return jsonify({'status': 'success'}), 200
    
    return jsonify({'status': 'None', 'message': 'Offer not found'}), 201

    
@app.route('/api/offer', methods=['POST'])
def offer():
    data = request.get_json()
    MyId = data.get('myUserId')
    EnemyId = data.get('EnemyId')
    room = data.get('room')
    move = data.get('move')
    # print(room, MyId, EnemyId)
    if not MyId or not EnemyId or not room:
        return jsonify({'status': 'error', 'message': 'Missing data'}), 400

    add_offer(MyId, EnemyId, room, move)

    if room not in rooms:
        rooms[room] = []
        # print(rooms)

    return jsonify({'status': 'ok'})

@app.route('/api/DeleteUserSession', methods=['GET'])
def delete_user_session():
    username = check_session()
    if username:
        UserId = check_id(username)
        if UserId:
            del_session_game(UserId)
            return jsonify({'message': 'ZAEBIS'}), 200
    else:
        return jsonify({'message': 'NO'}), 401

@app.route('/api/addMyUser', methods=['POST'])
def addMyUser():
    data = request.get_json()
    MyId = data['MyId']
    if MyId:
        add_session_game(MyId)
        return jsonify({'message': 'Все заибись' }), 200
    else:
        return jsonify({'message': 'Неправильный логин или пароль' }), 401
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username and password:
        user = check_user_login(username, password)
        if user:
            session['username'] = username
            return jsonify({'message': 'Все заибись' }), 200
        else:
            return jsonify({'message': 'Неправильный логин или пароль' }), 401

@app.route('/api/spisok', methods=['GET'])
def spisok():
    username = check_session()
    UserId = check_id(username)
    data = check_session_game(UserId)
    return jsonify(data)
          
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username and password:
        user = check_user(username)
        if not user:
            add_user(username, password)
            return jsonify({'message': 'Все заибись' }), 200
        else:
            return jsonify({'message': 'Неправильный логин или пароль' }), 401
# -----------
# -----------
# ----------- 
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for("main"))

@app.route('/', methods=['GET'])
def main():
    html = 'index.html'
    username = check_session()
    UserId = None
    if username:
        UserId = check_id(username)
    return render_template(html, username=username, UserId=UserId)

if __name__ == '__main__':
    socketio.run(app, debug=False)
