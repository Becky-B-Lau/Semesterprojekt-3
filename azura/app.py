from flask import Flask, jsonify
import azura.databaseMin as databaseMin
from flask_cors import CORS
from flasgger import Swagger, LazyJSONEncoder

app = Flask(__name__)
app.json_encoder = LazyJSONEncoder
CORS(app)
swagger = Swagger(app)


@app.route('/', methods=['GET'])
def step_index():
    """
    Hent de nyeste data fra databasen.
    ---
    responses:
      200:
        description: Returnerer de seneste data
        schema:
          type: object
          properties:
            step:
              type: integer
              description: Det nuværende trin
            phase:
              type: integer
              description: Den nuværende fase
            date:
              type: array
              items:
                type: string
              description: En liste over datoer
            counter_tree:
              type: integer
              description: Tællerværdi
            detailDate:
              type: array
              items:
                type: string
              description: Detaljerede datoer
      404:
        description: Ingen data fundet
    """
    step = databaseMin.read_last_step()
    phase = databaseMin.read_last_phase()
    date = databaseMin.read_last_date()
    counter_tree = databaseMin.read_last_counter_tree()
    detailDate = databaseMin.read_last_detailDate()
    first_counter_tree = databaseMin.read_first_counter_tree()

    # Sørg for, at `date` altid er en liste
    if not isinstance(date, list):
        date = [date]  # Pak `date` ind i en liste, hvis det ikke allerede er en liste

      # Tjek om det er en liste - detaildate  
    if not isinstance (detailDate, list):
        detailDate = [detailDate]

    if not isinstance (first_counter_tree, list):
      first_counter_tree = [first_counter_tree]
    
    # Debugging: Log data, der sendes tilbage
    print(f"Step: {step}, Phase: {phase}, Date: {date}")

    # Return JSON med alle data
    if step is not None and phase is not None and date is not None and counter_tree is not None and detailDate is not None and first_counter_tree is not None:
        return jsonify({
            "step": step,
            "phase": phase,
            "date": date,  # Return date som en liste
            "counter_tree": counter_tree,
            "detailDate" : detailDate,
            "first_counter_tree" : first_counter_tree,
        })
    else:
        return jsonify({"error": "No data found"}), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000)


