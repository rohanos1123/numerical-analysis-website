from flask import Flask, jsonify 
from flask import request
from flask_cors import CORS, cross_origin
import lagrangePolynomial



app = Flask(__name__)
CORS(app)
@app.route("/api/lagpoly", methods=["POST"])
def lagPoly():
    data = request.get_json()
    response = lagrangePolynomial.makeStruct(data)
    return jsonify(response)



@app.route("/api/fixpt", methods=["POST"])
def fixPt():
    print("To be completed")




@app.route("/api/newMeth", methods=["POST"])
def newtonsMethod():
    print("To be completed")



@app.route("/api/lsInterp", methods=["POST"])
def lsInterp():
    print("To be complted")


if __name__ == "__main__":
    app.run(debug=True)