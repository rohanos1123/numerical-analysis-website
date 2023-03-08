import numpy as np
from numpy.polynomial import Polynomial
from numpy.polynomial.polynomial import polyval
from flask import jsonify
from sympy.parsing.sympy_parser import parse_expr
import json


def FunctionEval(range, function):
    newFunc = function.replace("^", "**")
    s = parse_expr(newFunc)
    xArry = np.arange(range[0], range[1], 0.05)
    yArry = []
    for val in xArry:
        yArry.append(float(s.subs('x', val)))


    return {'x' : xArry.tolist(), 'y' : yArry}



#A, E, L are all real numbers function is a string

#Returns a dictionary:

'''
{
 A = 




}




'''

def deltaEpsilon(function, a, e, d, L):
    limit = a

    epsilon = e
    # delta must be a number that is small
    delta = d

    newFunc = function.replace("^", "**")
    s = parse_expr(newFunc)
    answerState = True

    # There is an x that satisfies the following conditions:

    # 0 < |x + a| < delta
    # |f(x) - L| < e

    # Lets say x equals delta:
    x = a + delta/2

    if abs(x - a) < delta:
        if abs(s.subs('x', x) - L) < e:
            answerState = True
            print("True")
        else:
            answerState = False
            print("fail")









deltaEpsilon("2*x+3", 2, 0.09, 0.01, 7.2)



