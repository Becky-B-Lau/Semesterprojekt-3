from flask import flask, jsonify, request

app=Flask(__name__)

@app.route('/calculate_percentage', methods=['POST'])


def calculate_percentage():
    data = request.json
    current=data.get('current',0)
    total=data.get('total',1)

    if total ==0:
        return jsonify({"error": "total kan ikke være 0"}),400
    percentage=(current/total)*100
    return jsonify({"percentage":round(percentage,2)})
if __name__=='__main__':
    app.run(debug=True) 

