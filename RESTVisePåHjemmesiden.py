from flask import Flask, jsonify
import Database
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def step_index():
    step = Database.read_last_step()
    phase = Database.read_last_phase()
    date = Database.read_last_date()
    if step is not None and phase is not None:
        print(f"Step returned by database: {step}")  # Debug i Flask-konsollen
        print(f"Phase returned by database: {phase}")  # Debug i Flask-konsollen
        return jsonify({"step": step, "phase": phase, "date": date})  # Returner JSON
        
    else:
        print("No data found in database.")  # Debug i Flask-konsollen
        return jsonify({"error": "No data found"}), 404



if __name__ == '__main__':
    app.run(debug=True, port=5001)
