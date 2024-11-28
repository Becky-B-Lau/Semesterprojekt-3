from socket import *
import Database  # Importér din eksisterende databaseforbindelse
import datetime

# Opret en databaseforbindelse én gang
db_connection = Database.connect_to_database()
cursor = db_connection.cursor()

# Server setup
serverPort = 5001
serverSocket = socket(AF_INET, SOCK_DGRAM)
serverAddress = ('', serverPort)
serverSocket.bind(serverAddress)

print("The server is ready to receive")
phase = Database.read_last_phase()
if phase is None:
    phase=0
try:
    while True:
        # Modtag data fra klienten
        message, clientAddress = serverSocket.recvfrom(2048)
        decoded_message = message.decode()
        
        try:
            # Konverter beskeden til integer (trin tælling)
            step_count = int(decoded_message)
            print(step_count)
          
            #Her skal den se om den er over 10000 og Dato
            if (step_count==10001):
                phase+=1
                if (phase>5):
                    phase=0
            # Gem beskeden i tabellen "steps"
            Database.insert_data(step_count,phase, datetime.datetime.now())
           

        except ValueError:
            print(f"Invalid data received: {decoded_message}. Skipping...")
            serverSocket.sendto(b"Invalid data format.", clientAddress)

except KeyboardInterrupt:
    print("\nServer shutting down...")
finally:
    # Ryd op ved afslutning
    serverSocket.close()
    cursor.close()
    db_connection.close()
