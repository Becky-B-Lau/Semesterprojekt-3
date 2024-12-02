from socket import *
from sense_hat import SenseHat
import time

serverName =  "" #IP addresse på den server som din computer er på
serverPort = 5001
clientSocket = socket(AF_INET, SOCK_DGRAM)

print("The Client is ready to send")

# Initialiser Sense HAT
sense = SenseHat()

# Variabler til skridttæller
step_count = 0  # Holder styr på antal skridt
threshold = 1.5  # Accelerationsændringstærskel
previous_x, previous_y, previous_z = 0, 0, 0  # Tidligere acceleration

# Baggrundstråd til at tælle skridt og nulstille ved midnat

while True:
    # Læs accelerometerdata
    acceleration = sense.get_accelerometer_raw()
    x = acceleration['x']
    y = acceleration['y']
    z = acceleration['z']

        
    # Sammenlign med tidligere acceleration
    if abs(x - previous_x) > threshold or abs(y - previous_y) > threshold or abs(z - previous_z) > threshold:
        step_count = 1  # skridttælleren
        # Konverter step_count til string, før det sendes
        message = str(step_count)
        clientSocket.sendto(message.encode(), (serverName, serverPort))
        print(f"Skridt: {message}")
            


    time.sleep(0.1)  # Undgå unødig høj CPU-brug



