from flask import Flask, jsonify
import Database
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def fetch_motivational_quote():
    """Hent et motiverende citat fra ZenQuotes API."""
    try:
        response = requests.get('https://zenquotes.io/api/random')
        response.raise_for_status()
        data = response.json()
        if data and len(data) > 0:
            quote = data[0].get('q', 'No quote found')
            author = data[0].get('a', 'Unknown')
            return {"quote": quote, "author": author}
        else:
            return {"quote": "No motivational quotes found", "author": "Unknown"}
    except Exception as e:
        print(f"Error fetching motivational quote: {e}")
        return {"quote": "Error fetching quote", "author": "Unknown"}

@app.route('/', methods=['GET'])
def step_index():
    step = Database.read_last_step()
    phase = Database.read_last_phase()
    date = Database.read_last_date()

    # Sørg for, at `date` altid er en liste
    if not isinstance(date, list):
        date = [date]  # Pak `date` ind i en liste, hvis det ikke allerede er en liste

    # Hent det motiverende citat
    motivational_quote = fetch_motivational_quote()

    # Debugging: Log data, der sendes tilbage
    print(f"Step: {step}, Phase: {phase}, Date: {date}, Quote: {motivational_quote}")

    # Return JSON med alle data
    if step is not None and phase is not None and date is not None:
        return jsonify({
            "step": step,
            "phase": phase,
            "date": date,  # Return `date` som en liste
            "quote": motivational_quote  # Tilføj det motiverende citat
        })
    else:
        return jsonify({"error": "No data found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5001)

