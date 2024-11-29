from socket import *
from flask import Flask, jsonify
from sense_hat import SenseHat
from datetime import datetime, timedelta
import threading
import time

serverName = "" #IP addresse på den server som din computer er på
serverPort = 5001
clientSocket = socket(AF_INET, SOCK_DGRAM)

print("The Client is ready to send")

# Initialiser Flask-app og Sense HAT
app = Flask(__name__)
sense = SenseHat()

# Variabler til skridttæller
step_count = 0  # Holder styr på antal skridt
goal = 10000  # Dagligt mål for skridt
threshold = 1.5  # Accelerationsændringstærskel
previous_x, previous_y, previous_z = 0, 0, 0  # Tidligere acceleration

# Baggrundstråd til at tælle skridt og nulstille ved midnat
def step_counter():
    global step_count, previous_x, previous_y, previous_z


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
            
    
            

        # Opdater tidligere acceleration
        previous_x, previous_y, previous_z = x, y, z



        time.sleep(0.1)  # Undgå unødig høj CPU-brug


# Start skridttæller i en separat tråd
if __name__ == '__main__':
    threading.Thread(target=step_counter, daemon=True).start()
    app.run(debug=True, host='0.0.0.0')
