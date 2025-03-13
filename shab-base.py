import sqlite3 
import base64
            
class UserManager:
    def __init__(self, db_path):
        self.db_path = db_path

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def add_user(self, user, pas, description=None):
        with self.get_connection() as base:
            cursor = base.cursor()
            cursor.execute("INSERT INTO users (username, password, description) VALUES (?, ?, ?)", (user, pas, description))
            base.commit()

    def check_user_register(self, user):
        with self.get_connection() as base:
            cursor = base.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ?", (user,))
            return cursor.fetchone()

    def check_user_login(self, user, pas):
        with self.get_connection() as base:
            cursor = base.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (user, pas))
            return cursor.fetchone()

    def get_user_description(self, username):
        with self.get_connection() as base:
            cursor = base.cursor()
            cursor.execute("SELECT description FROM users WHERE username = ?", (username,))
            result = cursor.fetchone()  # Получаем кортеж
            return result[0] if result else None  # Возвращаем первый элемент или None

    def update_user_description(self, username, description):
        with self.get_connection() as base:
            cursor = base.cursor()
            cursor.execute("UPDATE users SET description = ? WHERE username = ?", (description, username))
            base.commit()
            

def get_connection_lol():
    conn = sqlite3.connect('lol.db', timeout=10)
    conn.row_factory = sqlite3.Row  # Возвращает строки в виде словаря
    return conn

def get_connection_market():
    conn = sqlite3.connect('market.db')
    conn.row_factory = sqlite3.Row  # Возвращает строки в виде словаря
    return conn

def get_connection_cart():
    conn = sqlite3.connect('cart.db')
    conn.row_factory = sqlite3.Row  # Возвращает строки в виде словаря
    return conn

        
def get_status_like(username, product_id):
    with get_connection_cart() as conn:
        id = get_id_user(username)
        
        cursor = conn.cursor()
        result = cursor.execute('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', (id, product_id)).fetchone()
        return result


def get_id_user(username):
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        result = cursor.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
        return result['id'] if result else None

def add_image(image):
    with open(image, 'rb') as file:
        with get_connection_lol() as base:
            cursor = base.cursor()
            img_data = file.read()
            cursor.execute('INSERT INTO images (image) VALUES (?)', (img_data,))
           
def market_base(id):
    with get_connection_market() as conn:
        cursor = conn.cursor()
        if id:
            result = cursor.execute('SELECT * FROM market WHERE id = ?', (id,)).fetchone()
            if result:
                card = {
                    'id': result['id'],
                    'description': result['description_promo'],
                    'price': result['price'],
                    'name': result['name'], 
                    'logo': result['description_icon'],
                    'photo': base64.b64encode(result['photo']).decode('utf-8') if result['photo'] else None
                }
                return card
        else:
            result = cursor.execute('SELECT * FROM market').fetchall()
            cards = []
            for row in result:
                card = {
                    'id': row['id'],
                    'description_icon': row['description_icon'],
                    'photo': base64.b64encode(row['photo']).decode('utf-8') if row['photo'] else None
                }
                cards.append(card)
            return cards

def add_tovar(username, product_id):
    quantity = 1
    id = get_id_user(username)
    if id is None:
        return
    with get_connection_cart() as conn:
        cursor = conn.cursor()
        result = cursor.execute('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', (id, product_id)).fetchone()

        if result:
            return
        else:
            cursor.execute('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', (id, product_id, quantity))

            # Не забываем сохранить изменения
        conn.commit()

def dell_tovar(u, p):
    id = get_id_user(u)
    with get_connection_cart() as conn:
        cursor = conn.cursor()    
        cursor.execute('DELETE FROM cart WHERE user_id = ? AND product_id = ?', (id, p))
        
def select_tovar_cart(u):
    id = get_id_user(u)
    with get_connection_cart() as conn:
        cursor = conn.cursor()
        result = cursor.execute('SELECT * FROM cart WHERE user_id = ?', (id,)).fetchall()
        carts = []
        with get_connection_market() as zet:
            for row in result:
                zet_cursor = zet.cursor()
                id = row['product_id']
                market = zet_cursor.execute('SELECT * FROM market WHERE id = ?', (id,)).fetchone()
                if market:
                    cart = {
                    'id': market['id'],
                    'description': market['description_promo'],
                    'price': market['price'],
                    'name': market['name'], 
                    'logo': market['description_icon'],
                    'photo': base64.b64encode(market['photo']).decode('utf-8') if market['photo'] else None
                    }
                    carts.append(cart)
            return carts
            
            
        
        