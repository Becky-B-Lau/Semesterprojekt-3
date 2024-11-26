from flask import Flask, jsonify
from sense_hat import SenseHat
from datetime import datetime, timedelta
import threading
import time

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

    # Find tid til næste midnat
    now = datetime.now()
    next_midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)

    while True:
        # Læs accelerometerdata
        acceleration = sense.get_accelerometer_raw()
        x = acceleration['x']
        y = acceleration['y']
        z = acceleration['z']

        # Sammenlign med tidligere acceleration
        if abs(x - previous_x) > threshold or abs(y - previous_y) > threshold or abs(z - previous_z) > threshold:
            step_count += 1  # Øg skridttælleren
            print(f"Skridt: {step_count}")

        # Opdater tidligere acceleration
        previous_x, previous_y, previous_z = x, y, z

        # Tjek om det er midnat
        if datetime.now() >= next_midnight:
            step_count = 0  # Nulstil skridttælleren
            print("Skridttæller nulstillet ved midnat.")
            # Beregn næste midnat
            next_midnight += timedelta(days=1)

        time.sleep(0.1)  # Undgå unødig høj CPU-brug


# Flask-route til at levere skridttællingsdata
@app.route('/steps', methods=['GET'])
def get_steps():
    global step_count, goal
    # Beregn procentdelen
    percentage = (step_count / goal) * 100 if goal > 0 else 0
    return jsonify({
        "steps": step_count,
        "goal": goal,
        "percentage": round(percentage, 2)
    })


# Start skridttæller i en separat tråd
if __name__ == '__main__':
    threading.Thread(target=step_counter, daemon=True).start()
    app.run(debug=True, host='0.0.0.0')
