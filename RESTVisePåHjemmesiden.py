from flask import Flask, jsonify
import Database
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Server index-siden

@app.route('/', methods=['GET'])
def index():
    step = Database.read_last_step()
    if step is not None:
        print(f"Step returned by database: {step}")  # Debug i Flask-konsollen
        return jsonify({"step": step})  # Returner JSON
    else:
        print("No data found in database.")  # Debug i Flask-konsollen
        return jsonify({"error": "No data found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5001)