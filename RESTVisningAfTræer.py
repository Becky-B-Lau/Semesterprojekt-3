from flask import Flask, jsonify
import Database
from flask_cors import CORS


appImage = Flask(__name__)
CORS(appImage)

# Server index-siden

@appImage.route('/', methods=['GET'])
def index():
    phase = Database.read_last_phase()
    if phase is not None:
        print(f"Phase returned by database: {phase}")  # Debug i Flask-konsollen
        return jsonify({"phase": phase})  # Returner JSON
    else:
        print("No data found in database.")  # Debug i Flask-konsollen
        return jsonify({"error": "No data found"}), 404
    
if __name__ == '__main__':
    appImage.run(debug=True, port=5002)