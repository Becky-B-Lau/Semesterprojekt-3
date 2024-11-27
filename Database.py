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

# Indsæt data i databasen
#def insert_data(steps):
 #   try:
  #      cursor = connect_to_database().cursor()
   #     cursor.execute('''
    #        INSERT INTO steps (steps) VALUES (%s)
     #   ''', (steps))
      #  connect_to_database().commit()
      #  print(f"{cursor.rowcount} række(r) indsat.")
    #except Error as e:
     #   print(f"Fejl ved indsættelse af data: {e}")
def insert_data(step_count):
    try:
        # Opret en forbindelse og cursor
        connection = connect_to_database()
        cursor = connection.cursor()

        # Brug det rigtige kolonnenavn (tjek hvad din tabel bruger)
        sql_query = "INSERT INTO steps (steps) VALUES (%s)"
        cursor.execute(sql_query, (step_count,))  # Tuple med én værdi

        # Commit ændringerne
        connection.commit()
        print(f"{cursor.rowcount} række(r) indsat.")

    except Error as e:
        print(f"Fejl ved indsættelse af data: {e}")

    finally:
        # Luk cursor og forbindelse
        cursor.close()
        connection.close()


# Læs data fra databasen
def read_data(connection):
    try:
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM steps')
        rows = cursor.fetchall()
        print("Data i tabellen:")
        for row in rows:
            print(row)
    except Error as e:
        print(f"Fejl ved læsning af data: {e}")

# Læs data fra databasen
def read_step(connection):
    try:
        cursor = connection.cursor()
        cursor.execute('SELECT steps FROM steps')
        rows = cursor.fetchall()
        print("Data i tabellen:")
        for row in rows:
            print(row)
    except Error as e:
        print(f"Fejl ved læsning af data: {e}")

# Main program
if __name__ == "__main__":
    # Forbind til databasen
    conn = connect_to_database()
    if conn:
        # Indsæt eksempeldata
        insert_data(conn, "2024-11-26", 5000)  # Ændr dato og antal skridt efter behov

        # Læs data
        read_data(conn)

        # Luk forbindelsen
        conn.close()
        print("Forbindelsen til databasen er lukket.")
