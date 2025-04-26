import sqlite3
from typing import Optional, Dict, Union, List
def get_connection_lol() -> sqlite3.Connection:
    conn = sqlite3.connect('users.db', timeout=10)
    conn.row_factory = sqlite3.Row  # Возвращает строки в виде словаря
    return conn


def check_user_register(user: str) -> bool:
    with get_connection_lol() as base:
        cursor = base.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (user,))
        return cursor.fetchone() is not None
    
    
def check_user_login(user: str, password: str) -> bool:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (user, password))
        return cursor.fetchone() is not None
    
def check_user(user:str) -> bool:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (user,))
        return cursor.fetchone() is not None
    
      
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
    
def add_session_game(id: int) -> None:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET game = ? WHERE id = ?", (1, id))
        conn.commit()

def del_session_game(id: int) -> None:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET game = ? WHERE id = ?", (0, id))
        
def check_id(username: str) -> Optional[int]:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        a = cursor.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()
        return a[0] if a is not None else None

def add_offer(My: int, Enemy: int, room: int, move: int) -> None:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET offer = ?, offerEnemyId = ?, room = ?, move = ? WHERE id = ?", (1, My, room, move, Enemy)) 
        conn.commit()

from typing import Tuple, Optional

def check_offer(id: int) -> Tuple[Optional[int], Optional[str], Optional[int], Optional[int], Optional[int], Optional[str]]:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT offerEnemyId, room, move, win, lose 
            FROM users 
            WHERE id = ?
        """, (id,))
        result = cursor.fetchone()
        
        if result:
            offerEnemyId, room, move, win, lose = result
            username_row = cursor.execute("SELECT username FROM users WHERE id = ?", (offerEnemyId,)).fetchone()
            username = username_row[0] if username_row else None

            return offerEnemyId, room, move, win, lose, username
        
    return None, None, None, None, None, None
    
def del_offer(id: int) -> None:
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE users SET offerEnemyId = ?, room = ?, move = ? WHERE id = ?', (None, None, None, id))
        conn.commit()
        
def add_status(WLD : str, id: int) -> bool:
    valid_statuses = ['win', 'lose', 'draw']
    if WLD not in valid_statuses:
        return False
    
    with get_connection_lol() as conn:
        cursor = conn.cursor()
        cursor.execute(f'UPDATE users SET {WLD} = {WLD} + 1 WHERE id = ?', (id,))
        conn.commit()
        return True

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