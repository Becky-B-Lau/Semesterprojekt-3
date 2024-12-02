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
        print(f"Fejl ved forbindelse til databasen: {e}")
        return None


def create_tables_if_not_exist(connection):
    try:
        cursor = connection.cursor()

        # Funktion til at tjekke, om en tabel eksisterer
        def table_exists(table_name):
            cursor.execute(f"SHOW TABLES LIKE '{table_name}'")
            result = cursor.fetchone()
            return result is not None

        # Tjek og opret 'steps'-tabellen, hvis den ikke findes
        if not table_exists('steps'):
            cursor.execute('''
                CREATE TABLE steps (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    steps INT NOT NULL,
                    phase INT NOT NULL,
                    date CHAR(10) NOT NULL,
                    counter_tree INT NOT NULL
                )
            ''')
            print("Tabellen 'steps' blev oprettet!")
        else:
            print("Tabellen 'steps' findes allerede. Ingen handling udført.")

        # Tjek og opret 'daily_quote'-tabellen, hvis den ikke findes
        if not table_exists('daily_quote'):
            cursor.execute('''
                CREATE TABLE daily_quote (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    date CHAR(10) NOT NULL,
                    quote TEXT NOT NULL,
                    author TEXT NOT NULL
                )
            ''')
            print("Tabellen 'daily_quote' blev oprettet!")
        else:
            print("Tabellen 'daily_quote' findes allerede. Ingen handling udført.")
    except Error as e:
        print(f"Fejl ved oprettelse af tabeller: {e}")
    finally:
        cursor.close()  # Sørg for at lukke cursoren


# Main program
if __name__ == "__main__":
    conn = connect_to_database()
    if conn:  # Kun fortsæt, hvis forbindelsen er etableret
        create_tables_if_not_exist(conn)  # Kald den rette funktion
        conn.close()  # Luk forbindelsen, når vi er færdige
        print("Forbindelsen til databasen er lukket.")
    else:
        print("Kunne ikke oprette forbindelse til databasen.")
