from flask import Flask, jsonify
import Database
import requests
import datetime
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
            Database.insert_daily_quote(datetime.datetime.now(),quote, author)
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
    counter_tree = Database.read_last_counter_tree()
    
    # Gem værdien fra read_last_date_quote i en variabel
    last_date_quote = Database.read_last_date_quote()

    if last_date_quote is None:
        print("Databasen er tom.")
        fetch_motivational_quote()
    else:
        # Konverter kun, hvis last_date_quote ikke er None
        quotedate = datetime.datetime.strptime(last_date_quote, "%Y-%m-%d").date()
        if quotedate != datetime.datetime.today().date():
            # Hent det motiverende citat
            fetch_motivational_quote()
            print("Datoerne er forskellige.")

    quote = Database.read_last_quote()
    author = Database.read_last_author()

    if quote is None or author is None:
        fetch_motivational_quote()
        print("Databasen er tom.")

    # Sørg for, at `date` altid er en liste
    if not isinstance(date, list):
        date = [date]  # Pak `date` ind i en liste, hvis det ikke allerede er en liste

    # Debugging: Log data, der sendes tilbage
    print(f"Step: {step}, Phase: {phase}, Date: {date}")

    # Return JSON med alle data
    if step is not None and phase is not None and date is not None and counter_tree is not None:
        return jsonify({
            "step": step,
            "phase": phase,
            "date": date,  # Return `date` som en liste
            "author": author,
            "quote": quote,
            "counter_tree": counter_tree,
        })
    else:
        return jsonify({"error": "No data found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5001)

