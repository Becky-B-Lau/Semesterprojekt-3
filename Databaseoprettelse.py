import mysql.connector
from mysql.connector import Error


# Forbind til databasen
def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host="mysql11.unoeuro.com",  # Erstat med IP eller URL til din database
            user="mariadybdahl_dk",          # Din MySQL-bruger
            password="zm6ge2yEbaH4BR5F3p9d", # Din MySQL-adgangskode
            database="mariadybdahl_dk_db_Steps"  # Navnet på din database
        )
        if connection.is_connected():
            print("Forbundet til databasen!")
        return connection
    except Error as e:
        print(f"Fejl: {e}")
        return None

def create_table(connection):
    try:
        cursor = connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS steps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                steps INT NOT NULL,
                phase INT NOT NULL,
                date Char(10) NOT NULL,
                counter_tree INT NOT NULL
            )
        ''')
        print("Tabellen 'steps' er oprettet!")
    except Error as e:
        print(f"Fejl ved oprettelse af tabel: {e}")
# Main program
if __name__ == "__main__":
    conn = connect_to_database()
    create_table(conn)  # Opret tabellen
    conn.close()