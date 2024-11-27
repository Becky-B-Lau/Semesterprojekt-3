from flask import Flask, jsonify
import Database

app = Flask(__name__)


# Server index-siden
@app.route('/', methods=['GET'])
def index():
    step = Database.read_last_step()
    print(f"Step returned by database: {step}")  # Debug
    if step is not None:
        return jsonify({"step": step})  # Return JSON-data
    else:
        print("No data found in database.")  # Debug
        return jsonify({"error": "No data found"}), 404