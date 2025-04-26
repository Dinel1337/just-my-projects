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
            username TEXT,
            number TEXT NOT NULL,
            code TEXT
        )
        ''')

        # cursor.execute("INSERT INTO users (username, number, code) VALUES (?, ?, ?)", ('andrey','222', 2352))
        # cursor.execute("INSERT INTO users (username, number, code) VALUES (?, ?, ?)", ('pidors','222', 2352))
        # cursor.execute("INSERT INTO users (username, number, code) VALUES (?, ?, ?)", ('suchka','222', 2352))
        
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
    
