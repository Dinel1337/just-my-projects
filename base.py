import sqlite3
import os
from typing import List, Dict, Optional

def get_db_connection():
    conn = sqlite3.connect('users.db', timeout=10)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Безопасная инициализация базы данных с обработкой ошибок"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Создание таблицы с улучшенной структурой
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            number TEXT UNIQUE,
            code TEXT,
            password TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Проверяем существование тестового пользователя
        cursor.execute('SELECT 1 FROM users WHERE username = ? LIMIT 1', ('test',))
        if not cursor.fetchone():
            try:
                cursor.execute('''
                INSERT INTO users (username, number, code, password) 
                VALUES (?, ?, ?, ?)
                ''', ('test', '2281337', 'test', 'test'))
                print("✅ Тестовый пользователь успешно создан")
            except sqlite3.IntegrityError as e:
                print(f"⚠️ Ошибка при создании тестового пользователя: {e}")
        
        conn.commit()
        
    except sqlite3.Error as e:
        print(f"❌ Ошибка при инициализации базы данных: {e}")
        raise  # Можно убрать raise, если хотите продолжить выполнение после ошибки
    finally:
        if conn:
            conn.close()
def add_password(password, user):
    """Добавляет пароль, возвращает True при успехе"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
             
            cursor.execute('SELECT id FROM users WHERE username = ?', (user,))
            if cursor.fetchone():
                # Обновляем номер у существующего пользователя
                cursor.execute('''
                UPDATE users SET password = ? 
                WHERE username = ?
                ''', (password, user))
            
            conn.commit()
            return cursor.rowcount > 0
    except sqlite3.IntegrityError:
        # Если номер или имя пользователя уже существуют
        return False
    except Exception as e:
        print(f"Database error in add_phone: {e}")
        return False
    
def add_phone(phone: str, user: str) -> bool:
    """Добавляет телефон, возвращает True при успехе"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Проверяем существование пользователя
            cursor.execute('SELECT id FROM users WHERE username = ?', (user,))
            if cursor.fetchone():
                # Обновляем номер у существующего пользователя
                cursor.execute('''
                UPDATE users SET number = ? 
                WHERE username = ? AND (number IS NULL OR number != ?)
                ''', (phone, user, phone))
            else:
                # Создаем нового пользователя
                cursor.execute('INSERT INTO users (username, number) VALUES (?, ?)', (user, phone))
            
            conn.commit()
            return cursor.rowcount > 0
    except sqlite3.IntegrityError:
        # Если номер или имя пользователя уже существуют
        return False
    except Exception as e:
        print(f"Database error in add_phone: {e}")
        return False

def add_code(code: str, user: str) -> bool:
    """Добавляет код, возвращает True если пользователь найден"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('UPDATE users SET code = ? WHERE username = ?', (code, user))
            conn.commit()
            return cursor.rowcount > 0
    except Exception as e:
        print(f"Database error in add_code: {e}")
        return False

def give_all_update() -> Optional[List[Dict[str, str]]]:
    """Возвращает всех пользователей с номером и кодом"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
            SELECT username, number, code, password 
            FROM users 
            WHERE number IS NOT NULL
            ''')
            return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"Database error in give_all_update: {e}")
        return None
