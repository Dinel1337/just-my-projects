import sqlite3
import os
import shutil

terminal_width = shutil.get_terminal_size().columns
def delbase():
    try:
        os.remove("users.db")
    except:
        print("pohuy")
    
def image(filename):
    with open(filename, 'rb') as file:
        data = file.read()
    return data

def get_connection():
    return sqlite3.connect('users.db', timeout=10)  # Увеличьте время ожидания

def table_exists(cursor, table_name):
    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
    return cursor.fetchone() is not None

try:
    delbase()
    with get_connection() as base:
        cursor = base.cursor()
        
        cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT,
            game INT DEFAULT 0,
            offer INT DEFAULT false,
            offerEnemyId INT,
            room TEXT,
            move INT,
            win INT DEFAULT 0,
            lose INT DEFAULT 0,
            draw INT DEFAULT 0
        )
        ''')
        game = 1
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('Dinel','123'))
        
        cursor.execute("INSERT INTO users (username, password, game) VALUES (?, ?, ?)", ('andrey','123', 0))
        cursor.execute("INSERT INTO users (username, password, game) VALUES (?, ?, ?)", ('pidors','123', 0))
        cursor.execute("INSERT INTO users (username, password, game) VALUES (?, ?, ?)", ('suchka','123', 0))
        
        os.system('cls')
        text = "База успешно создана!!!"
        padded_text = text.ljust(terminal_width)
        print("\033[2m\033[32m\033[42m{}\033[0m".format(padded_text))

except sqlite3.Error as e:
    os.system('cls')
    text = f"Ошибка при работе с базой данных: {e}"
    padded_text = text.ljust(terminal_width)
    print("\033[3m\033[33m\033[41m{}\033[0m".format(padded_text))

except Exception as e:
    os.system('cls')
    text = f"Произошла непредвиденная ошибка: {e}"
    padded_text = text.ljust(terminal_width)
    print("\033[3m\033[33m\033[41m{}\033[0m".format(padded_text))
    
