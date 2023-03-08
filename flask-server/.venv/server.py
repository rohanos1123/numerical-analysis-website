from flask import Flask, jsonify 
from flask import request
from flask_cors import CORS, cross_origin



app = Flask(__name__)
CORS(app)

@app.route("/api/lagpoly", methods=["POST"])
def members():
    data = request.get_json()
    print("Count: ",  int(data['count']))
    print("function: ", data['function'])
    print("nodeType: ", data['nodeType'])
    print("nodes ", data['nodes'])
    print("range ", data['range'])


    
    return data



if __name__ == "__main__":
    app.run(debug=True)