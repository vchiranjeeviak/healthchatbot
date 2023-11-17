import sqlite3


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


def create_user(username, hashed_password):
    conn = get_db_connection()
    conn.execute('INSERT INTO users (username, hashed_password) VALUES (?, ?)', (username, hashed_password))
    conn.commit()
    conn.close()


def get_hashed_password(username):
    conn = get_db_connection()
    hashed_password_row = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    if not hashed_password_row:
        return None
    hashed_password = hashed_password_row['hashed_password']
    return hashed_password
