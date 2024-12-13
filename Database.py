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
#til skoven - for at hente datoen, når man klikker på en træ i skoven
#vi vil gerne have en tabel med den ældste counter_tree værdi for at vise datoen på skov-siden
#retrieve the rows where each counter_tree value is paired with the the earliest date
def read_first_counter_tree():
    try:
        connection = connect_to_database()
        cursor = connection.cursor()
        # Corrected SQL query
        cursor.execute("""
            SELECT counter_tree, date 
            FROM steps s1 
            WHERE date = (
                SELECT MIN(s2.date) 
                FROM steps s2 
                WHERE s1.counter_tree = s2.counter_tree
            )
            ORDER BY counter_tree
        """)
        rows = cursor.fetchall() 
        connection.close()
        return [row for row in rows] if rows else [] 

    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return None

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

def read_last_step():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT steps, date FROM steps ORDER BY id DESC LIMIT 1')  # Sorter efter id og hent sidste række
        row = cursor.fetchone()
        connection.close()
        if row:
            steps, date = row  # Hent både steps og dato

            # Hvis `date` er i strengformat, konverter den til datetime
            if isinstance(date, str):
                from datetime import datetime
                date = datetime.strptime(date, '%Y-%m-%d')  # Tilpas formatet til din database

            # Sammenlign kun dato-delen
            if date.date() == datetime.now().date():
                return steps
            else:
                return 0
        else:
            return 0  # Ingen rækker i databasen
    except Exception as e:
        print(f"Fejl ved læsning af data: {e}")
        return None
#til skoven - for at hente datoen, når man klikker på en træ i skoven
#vi vil gerne have en tabel med den ældste counter_tree værdi for at vise datoen på skov-siden
#retrieve the rows where each counter_tree value is paired with the the earliest date
def read_first_counter_tree():
    try:
        connection = connect_to_database()
        cursor = connection.cursor()
        # Corrected SQL query
        cursor.execute("""
            SELECT counter_tree, date 
            FROM steps s1 
            WHERE date = (
                SELECT MIN(s2.date) 
                FROM steps s2 
                WHERE s1.counter_tree = s2.counter_tree
            )
            ORDER BY counter_tree
        """)
        rows = cursor.fetchall() 
        connection.close()
        return [row for row in rows] if rows else [] 

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


def read_last_detailDate():
    try:
        connection = connect_to_database()  # Funktion til at oprette forbindelse
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM steps s1 WHERE id = (SELECT MAX(s2.id) FROM steps s2 WHERE s1.date = s2.date ORDER BY id DESC)')
 # Sorter efter id og hent sidste række
        rows = cursor.fetchall()
        connection.close()
        return [row for row in rows] if rows else []
    
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
