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
    counter_tree = Database.read_last_counter_tree()
    detailDate = Database.read_last_detailDate()

    # Sørg for, at `date` altid er en liste
    if not isinstance(date, list):
        date = [date]  # Pak `date` ind i en liste, hvis det ikke allerede er en liste

      # Tjek om det er en liste - detaildate  
    if not isinstance (detailDate, list):
        detailDate = [detailDate]
    
    # Debugging: Log data, der sendes tilbage
    print(f"Step: {step}, Phase: {phase}, Date: {date}")

    # Return JSON med alle data
    if step is not None and phase is not None and date is not None and counter_tree is not None and detailDate is not None:
        return jsonify({
            "step": step,
            "phase": phase,
            "date": date,  # Return `date` som en liste
            "counter_tree": counter_tree,
            "detailDate" : detailDate,
        })
    else:
        return jsonify({"error": "No data found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5001)

