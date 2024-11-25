# Importerer nødvendige moduler fra Flask
from flask import Flask, jsonify, request

# Initialiserer en Flask-applikation
app = Flask(__name__)

# Definerer en route (URL-endpoint) til beregning af procentdelen
@app.route('/calculate_percentage', methods=['POST'])
def calculate_percentage():
    # Henter JSON-data fra den indgående POST-anmodning
    data = request.json

    # Henter værdierne 'current' og 'total' fra JSON-dataene
    # Hvis de ikke findes, bruges standardværdierne 0 og 1
    current = data.get('current', 0)
    total = data.get('total', 1)

    # Tjekker, om 'total' er 0, for at undgå division med 0
    if total == 0:
        # Returnerer en fejlbesked som JSON og statuskode 400 (Bad Request)
        return jsonify({"error": "total kan ikke være 0"}), 400

    # Beregner procentdelen (current / total * 100)
    percentage = (current / total) * 100

    # Returnerer procentdelen som JSON, afrundet til 2 decimaler
    return jsonify({"percentage": round(percentage, 2)})

# Kontrollerer, om scriptet køres direkte
if __name__ == '__main__':
    # Starter Flask-serveren i debug-tilstand (for nem fejlfinding)
    app.run(debug=True)