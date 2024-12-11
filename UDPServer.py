from socket import *
import Database  # Importér din eksisterende databaseforbindelse
from datetime import datetime, timedelta

# Server setup
serverPort = 5001
serverSocket = socket(AF_INET, SOCK_DGRAM)
serverAddress = ('', serverPort)
serverSocket.bind(serverAddress)

print("The server is ready to receive")

stepFromDatabase = Database.read_last_step()
if stepFromDatabase is None:
    stepFromDatabase = 0  # Standardværdi for stepFromDatabase

phase = Database.read_last_phase()
stepFromDatabase = Database.read_last_step()
if stepFromDatabase is None:
    stepFromDatabase = 0
if phase is None:
    phase = 0  # Standardværdi for phase

Coutner_tree = Database.read_last_counter_tree()
if Coutner_tree is None:
    Coutner_tree = 0  # Standardværdi for counter_tree

try:
    while True:
        # Modtag data fra klienten
        message, clientAddress = serverSocket.recvfrom(2048)
        decoded_message = message.decode()

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
                    
            if (phase==5):
                    last_phase = Database.read_last_phase()
                    if last_phase != 5:  # Tjek om fasen netop er blevet 5
                        Coutner_tree += 1
                        
            # Gem beskeden i tabellen "steps"
            Database.insert_data(stepFromDatabase,phase, datetime.now(),Coutner_tree)
           
        except ValueError:
            print(f"Invalid data received: {decoded_message}. Skipping...")
            serverSocket.sendto(b"Invalid data format.", clientAddress)
finally:
    # Ryd op ved afslutning
    serverSocket.close()
