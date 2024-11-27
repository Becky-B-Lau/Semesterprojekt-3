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

#@app.route('/', methods=['GET'])
#def index():
    # Eksempeldata (disse data skal normalt komme fra din database)
 #   steps = 7500  # Skridt taget
   #  goal = 10000  # Mål for skridt
    # percentage = (steps / goal) * 100  # Beregn procentdel af mål

  #   return jsonify({
    #     "steps": steps,
      #   "goal": goal,
       #  "percentage": percentage
   #  })

# @app.route('/', methods=['GET'])
# def index():
    # Hent skridt fra databasen
  #   step = Database.read_last_step()
   #  if step is not None:
     #    print(f"Step returned by database: {step}")  # Debug
   #  else:
    #     print("No data found in database.")  # Debug
      #   step = 0  # Standardværdi, hvis databasen ikke har data

    # Eksempeldata og beregninger
  #   goal = 10000  # Mål for skridt
    # percentage = (step / goal) * 100  # Beregn procentdel af målet

    # Returner samlet JSON-respons
   #  return jsonify({
   # #      "steps": step,
     #    "goal": goal,
       #  "percentage": percentage,
      #   "message": "No data found in database" if step == 0 else "Data retrieved successfully"
  #   })
if __name__ == '__main__':
    app.run(debug=True, port=5001)