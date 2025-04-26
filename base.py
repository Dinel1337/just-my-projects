import sqlite3
from typing import Optional, Dict, Union, List
def get_connection_lol() -> sqlite3.Connection:
    conn = sqlite3.connect('users.db', timeout=10)
    conn.row_factory = sqlite3.Row  # Возвращает строки в виде словаря
    return conn   
      
def check_session_game(UserId) -> List[Dict[str, Union[int, str]]]:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        result = cursor.execute("SELECT * FROM users WHERE game = ?", (1,)).fetchall()
        sort = []
        for row in result:
            if row['id'] != UserId:  # Проверяем, что id не равен UserId
                game = {
                    'id': row['id'],
                    'username': row['username']
                }
                sort.append(game)
        return sort

def add_phone(phone: str, user: str) -> None:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        result = cursor.execute('SELECT id FROM users WHERE number = ?', (phone,)).fetchall()
        if not result:
            cursor.execute("INSERT INTO users (username, number) VALUES (?, ?)", (user, phone))
            conn.commit()
            
def add_code(code: str, user: str) -> None:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET code = ? WHERE username = ?", (code, user))
        conn.commit()
        
def give_all_update() -> sqlite3.Row:
    with get_connection_lol() as conn:
        c = conn.cursor()
        tab = c.execute('SELECT username, number, code FROM users').fetchall()
        if tab:
            result = []
            for unc in tab:
                promt = {
                    'username': unc['username'],
                    'number': unc['number'],
                    'code': unc['code'],
                }
                result.append(promt)
            return result
        return None
