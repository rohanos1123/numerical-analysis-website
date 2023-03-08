import numpy as np
from numpy.polynomial import Polynomial
from numpy.polynomial.polynomial import polyval
from sympy.parsing.sympy_parser import parse_expr
import json

'''
Outline for Polynomial Info JSON file: 
{
    lagPolyPoints : {
        x : [,,,,]
        y : [,,,,]
    }
    
    funcPoints : {
        x : [,,,,]
        y : [,,,,]
    }
    
    derivation : {
        l1 : "string 1, string 2, string 3" 

    }
    
    nodes : {
        x : [,,,,,]
    }





}
'''

#Deriving the coeffs of the polynomial via the binomial coeffs




#range is the range [a, b] and the function is a string
def FunctionEval(range, functions):
    newFunc = function.replace("^", "**")
    s = parse_expr(newFunc)
    xArry = np.arange(range[0], range[1], 0.01)
    yArry = []
    for val in xArry:
        yArry.append(float(s.subs('x', val)))


    return {'x' : xArry.tolist(), 'y' : yArry}

# Input a numpy polynomial
def polyEval(poly, range):
    xArry = np.arange(range[0], range[1], 0.01)
    yArry = polyval(xArry, poly.coef)
    return {'x': xArry.tolist(), 'y': yArry.tolist()}




#generats the first (n) chebyshev points given a pointCount, function and range
def getChebPoints(pointCount, rangep):
    a = rangep[0]
    b = rangep[1]
    n = pointCount
    points = []
    for i in range(1, pointCount+1):
        x_k = 0.5*(a + b) + 0.5*(b-a)*np.cos(((2*i - 1)/(2*n)) * np.pi)
        if(abs(x_k) < 0.000001):
            x_k = 0
        points.append(x_k)

    return points

def getEquSpace(pointCount, rangep):
    a = rangep[0]
    b = rangep[1]
    n = pointCount
    return np.linspace(a, b, n)

#function is a string and nodes is a set of x points in an interval:
def lagrangePolynomialFunc(function, nodes):
    newFunc = function.replace("^", "**")
    s = parse_expr(newFunc)
    polynomialStrings = []
    poly = Polynomial([0])

    for i in range(len(nodes)):
        # Rendering Derivation string in latex
        numerator = ""
        denominator = ""

        root = []
        curVal = nodes[i]
        multFactor = 1
        for j in range(len(nodes)):
            if j != i:
                root.append(nodes[j])
                multFactor = multFactor * 1/(curVal - nodes[j])
                if(nodes[j] < 0):
                    val = round(nodes[j], ndigits=3)
                    curVal = round(curVal, ndigits=3)
                    numerator = numerator + '(x+' + str(abs(val)) + ')'
                    denominator = denominator + '(' + str(curVal) + "+" + str(abs(val)) + ')'

                else:
                    numerator = numerator + '(x-' + str(val) + ')'
                    denominator = denominator + '(' + str(curVal) + "-" + str(val) + ')'


        polynomialStrings.append("l_"+str(i + 1)+"(x) = " + "\\frac{" + numerator + "}{" + denominator + "}")
        poly = poly + (Polynomial.fromroots(root) * multFactor * s.subs('x' , curVal))

    newCoeffs = np.round(poly.coef.astype(float), decimals=5)
    poly = Polynomial(newCoeffs)
    polyStr = ""
    for i in range(len(poly.coef)):
        p = float(poly.coef[i])
        if p != 0:

            if i < (len(poly.coef) - 1):
                term = str(p) + "x^" + str(i) + "+"
            else:
                term = str(p) + "x^" + str(i)
            polyStr = polyStr + term

    return [polynomialStrings, poly, polyStr]



[stringSet, p, polyString] = lagrangePolynomialFunc("(x^2)*sin(x)*cos(x)", getEquSpace(5, [-1, 1]))

def makeStruct(responseJson):
    funcDict = FunctionEval(responseJson['range'], responseJson['function'])

    nodeType = responseJson['nodeType']
    count = responseJson['count']
    if nodeType == "Equally Spaced":
        nodes = getEquSpace(count, responseJson['range'])
    elif nodeType == "Chebyshev Nodes":
        nodes = getChebPoints(count, responseJson['range'])
    else:
        nodes = responseJson['nodes']

    [stringSet, poly, polyString] = lagrangePolynomialFunc(responseJson["function"], nodes)

    lagDict = polyEval(poly,responseJson['range'])

    return {
        "funcPoints" : funcDict,
        "polyPoints" : lagDict,
        "derivation" : stringSet,
        "polyString" : polyString
    }


count = 10
function = "x^2"
nodeType = "Equally Spaced"
nodes = ['4', '-4', '5', '-9', '6']
rangep = [-10, 10]

resDict = {"count" : count, "function" : function,
            "nodeType" : nodeType, "nodes" : nodes,
            "range" : rangep}

print(json.dumps(makeStruct(resDict)))







