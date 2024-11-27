from socket import *
import Database  # Importér din eksisterende databaseforbindelse

# Opret en databaseforbindelse én gang
db_connection = Database.connect_to_database()
cursor = db_connection.cursor()

# Server setup
serverPort = 5000
serverSocket = socket(AF_INET, SOCK_DGRAM)
serverAddress = ('', serverPort)
serverSocket.bind(serverAddress)

print("The server is ready to receive")

try:
    while True:
        # Modtag data fra klienten
        message, clientAddress = serverSocket.recvfrom(2048)
        decoded_message = message.decode()
        
        try:
            # Konverter beskeden til integer (trin tælling)
            step_count = int(decoded_message)
            print(step_count)
            
            # Gem beskeden i tabellen "steps"
            Database.insert_data(step_count)
           

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
