import numpy as np
from numpy.polynomial import Polynomial
from numpy.polynomial.polynomial import polyval
from flask import jsonify
from sympy.parsing.sympy_parser import parse_expr
import json


#Bary
'''
Outline for Polynomial Info JSON file: 
{
    
    nodes : {
        x : [,,,,,]
    }
    
    weights : {
    
    
    
    }
}
'''

#generats the first (n) chebyshev points given a pointCount, function and range
def getChebPoints(pointCount, rangep):
    a = rangep[0]
    b = rangep[1]
    n = int(pointCount)
    points = []
    for i in range(0, int(pointCount)):
        x_k = 0.5*(a + b) - 0.5*(b-a)*np.cos(((2*i + 1)/(n)) * (np.pi/2))
        points.append(x_k)

    return points

def getEquSpace(pointCount, rangep):
    a = rangep[0]
    b = rangep[1]
    n = pointCount
    return np.linspace(a, b, int(n))

#function is a string and nodes is a set of x points in an interval:
def getWeights(nodes):

    #Each entry in the weight is denoted by its index in the list:
    weightsList = []

    for i in range(len(nodes)):
        w_prod = 1
        for j in range(len(nodes)):
            if j != i:
                w_prod *= nodes[i] - nodes[j]
        weightsList.append(1/w_prod)


    return weightsList


def makeStruct(responseJson):

    retNodeList= []
    weightList = []

    if responseJson["nodeType"] == "Equally Spaced":
        retNodeList = getEquSpace(responseJson["count"], responseJson["range"]).tolist()
    elif responseJson["nodeType"] == "Chebyshev Nodes":
        retNodeList = getChebPoints(responseJson["count"], responseJson["range"])
    else:
        retNodeList = responseJson["nodeList"]


    weightList = getWeights(retNodeList)


    return{
        "NodeList" : retNodeList,
        "lagrangeWeights" :weightList
    }







