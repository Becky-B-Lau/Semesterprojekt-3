from socket import *
import Database  # Importér din eksisterende databaseforbindelse
from datetime import datetime, timedelta

# Opret en databaseforbindelse én gang
db_connection = Database.connect_to_database()
cursor = db_connection.cursor()

# Server setup
serverPort = 5001
serverSocket = socket(AF_INET, SOCK_DGRAM)
serverAddress = ('', serverPort)
serverSocket.bind(serverAddress)

print("The server is ready to receive")
# Definer tid for nulstilling (f.eks. kl. 00)
reset_time = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
if reset_time < datetime.now():
    # Hvis tidspunktet allerede er passeret i dag, sæt det til næste dag
    reset_time += timedelta(days=1)

# Definer en margin på 1 minut
margin = timedelta(seconds=30)

phase = Database.read_last_phase()
stepFromDatabase = Database.read_last_step()
if phase is None:
    phase=0

try:
    while True:
        now = datetime.now()
        # Modtag data fra klienten
        message, clientAddress = serverSocket.recvfrom(2048)
        decoded_message = message.decode()
        
            # Tjek om det er midnat
        if reset_time - margin <= now <= reset_time + margin:
            print(f"Nulstillingstidspunkt nået eller inden for margin: {reset_time}")
            stepFromDatabase = 0  # Nulstil skridttælleren
            print("Skridttæller nulstillet.")
            
            # Sæt reset_time til næste dag
            reset_time += timedelta(days=1)
        try:
            # Konverter beskeden til integer (trin tælling)
            step_count = int(decoded_message)
            print(step_count)
         
            stepFromDatabase += step_count
            #Her skal den se om den er over 10000 og Dato
            if (stepFromDatabase==10000):
                phase+=1
                if (phase>5):
                    phase=0
            # Gem beskeden i tabellen "steps"
            Database.insert_data(stepFromDatabase,phase, datetime.now())
           

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
