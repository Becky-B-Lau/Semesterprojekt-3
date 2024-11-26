from sense_hat import SenseHat
from datetime import datetime
sense = SenseHat()



step_count = 0  # Variabel til at holde styr på antallet af skridt
threshold = 1.5  # Tærskel for accelerationsændring (juster efter behov)

# Husk den tidligere acceleration for at finde ændringer
previous_x, previous_y, previous_z = 0, 0, 0


while True:
    # Læs accelerometerdata
    acceleration = sense.get_accelerometer_raw()
    x = acceleration['x']
    y = acceleration['y']
    z = acceleration['z']
    
    # Sammenlign med den tidligere acceleration
    if abs(x - previous_x) > threshold or abs(y - previous_y) > threshold or abs(z - previous_z) > threshold:
        step_count += 1  # Øg skridttælleren
        print(f"Skridt: {step_count}")
    
    # Opdater tidligere acceleration
    previous_x, previous_y, previous_z = x, y, z
   # Hent det aktuelle tidspunkt
    current_time = datetime.now()
    
    # Tjek, om klokken er midnat
    if current_time.strftime("%H:%M:%S") == "09:18:00":
        step_count = 0
        print("Skridttæller nulstillet ved midnat.")
        continue