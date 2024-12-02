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
def insert_data(steps, phase, date, counter_tree):
    try:
        # Opret en forbindelse og cursor
        connection = connect_to_database()
        cursor = connection.cursor()

        # Brug det rigtige kolonnenavn (tjek hvad din tabel bruger)
        sql_query =  "INSERT INTO steps (steps, phase, date, counter_tree) VALUES (%s, %s, %s,%s)"
        #"INSERT INTO steps (steps) VALUES (%s)"
        cursor.execute(sql_query, (steps, phase, date, counter_tree))  # Tuple med én værdi

        # Commit ændringerne
        connection.commit()
        print(f"{cursor.rowcount} række(r) indsat.")

    except Error as e:
        print(f"Fejl ved indsættelse af data: {e}")

    finally:
        # Luk cursor og forbindelse
        cursor.close()
        connection.close()
def insert_daily_quote(date, quote, author):
    """
    Indsætter en ny række i 'daily_quote'-tabellen med de givne værdier.

    Args:
        date (str): Datoen i formatet YYYY-MM-DD.
        quote (str): Citatet, der skal indsættes.
        author (str): Forfatteren af citatet.

    Returns:
        None
    """
    try:
        # Opret en forbindelse og cursor
        connection = connect_to_database()
        cursor = connection.cursor()

        # SQL-spørgsmål til indsættelse af data
        sql_query = """
            INSERT INTO daily_quote (date, quote, author)
            VALUES (%s, %s, %s)
        """
        # Udfør forespørgslen med de leverede data
        cursor.execute(sql_query, (date, quote, author))

        # Gem ændringerne i databasen
        connection.commit()
        print(f"Data indsat: {cursor.rowcount} række(r) tilføjet.")

    except Error as e:
        # Håndter fejl under databasenedsættelse
        print(f"Fejl ved indsættelse af data: {e}")
    
    finally:
        # Sørg for altid at lukke cursor og forbindelse
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
#def read_step(connection):
 #   try:
  #      cursor = connection.cursor()
   #     cursor.execute('SELECT steps FROM steps')
    #    rows = cursor.fetchall()
     #   print("Data i tabellen:")
      #  for row in rows:
       #     print(row)
    #except Error as e:
     #   print(f"Fejl ved læsning af data: {e}")
def read_last_step():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT steps FROM steps ORDER BY id DESC LIMIT 1')  # Sorter efter id og hent sidste række
        row = cursor.fetchone()
        connection.close()
        return row[0] if row else None  # Returner værdien af "steps"
    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return None

def read_last_phase():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT phase FROM steps ORDER BY id DESC LIMIT 1')  # Sorter efter id og hent sidste række
        row = cursor.fetchone()
        connection.close()
        return row[0] if row else None  # Returner værdien af "steps"
    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return None
    
def read_last_counter_tree():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT counter_tree FROM steps ORDER BY id DESC LIMIT 1')  # Sorter efter id og hent sidste række
        row = cursor.fetchone()
        connection.close()
        return row[0] if row else None  # Returner værdien af "steps"
    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return None
def read_last_date():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT date FROM steps WHERE steps >= 10000 ORDER BY date DESC')
        
        # Hent alle rækker i stedet for kun én
        rows = cursor.fetchall()
        
        # Luk forbindelsen
        connection.close()
        
        # Ekstraher datoer fra rækkerne
        return [row[0] for row in rows] if rows else []  # Returner en liste med datoer
    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return []
def read_last_date_quote():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT date FROM daily_quote ORDER BY id DESC LIMIT 1')  # Sorter efter id og hent sidste række
        row = cursor.fetchone()
        connection.close()
        return row[0] if row else None  # Returner værdien af "steps"
    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return None
    
def read_last_quote():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT quote FROM daily_quote ORDER BY id DESC LIMIT 1')  # Sorter efter id og hent sidste række
        row = cursor.fetchone()
        connection.close()
        return row[0] if row else None  # Returner værdien af "steps"
    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return None
def read_last_author():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT author FROM daily_quote ORDER BY id DESC LIMIT 1')  # Sorter efter id og hent sidste række
        row = cursor.fetchone()
        connection.close()
        return row[0] if row else None  # Returner værdien af "steps"
    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return None

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
