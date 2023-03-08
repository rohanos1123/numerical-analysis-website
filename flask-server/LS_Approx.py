import numpy as np
from numpy.polynomial import Polynomial
from numpy.polynomial.polynomial import polyval
from flask import jsonify
from sympy.parsing.sympy_parser import parse_expr
import json
from sympy import *
import string


#Inputted JSON:

'''
    {
        data : [[x1, y1], [x2, y2], [x3, y3]...] 
        degree : n     
    }
'''
alph = list(string.ascii_lowercase)

#Dataset will be in the form of the data shown above

class LSInterpolant:
    def __init__(self, pDegree, dataset):
        self.polyDegree = pDegree
        self.data = dataset
        self.alph = list(string.ascii_lowercase)
        self.variables = []


    def createPolynomial(self):
        standardPoly = ""
        for i in range(self.polyDegree):
            if i < self.polyDegree - 1:
                standardPoly += alph[i] + "* (x" + "^" + str(i) + ")" + "+"
            else:
                standardPoly += alph[i] + "* (x" + "^" + str(i) + ")"
        newFunc = standardPoly.replace("^", "**")
        s = parse_expr(newFunc, locals())

        return s

    def getRSquaredFunction(self):
        # r_squared is a function of a and b (R^2(a, b))
        r_squared = parse_expr("0", locals())
        standardPoly = self.createPolynomial()
        for i in range(len(self.data)):
            r_squared += (self.data[i][1] - standardPoly.subs({'x' : self.data[i][0]}))**2

        return r_squared


    def solveSystem(self):
        r_squ = self.getRSquaredFunction()
        equationStrList = []

        for i in list(r_squ.free_symbols):
            lin1 = diff(r_squ, i)
            const = r_squ.func(*[term for term in r_squ.args if not term.free_symbols])
            equationStrList.append(str(lin1) + "=0")





k = LSInterpolant(3, [[1,2], [4,8]])
m = k.getRSquaredFunction()


print(m)
print(list((diff(m, 'a').free_symbols)))
print(diff(m, 'b'))
print(diff(m, 'c'))

















