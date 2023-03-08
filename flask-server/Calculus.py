import numpy as np
from numpy.polynomial import Polynomial
from numpy.polynomial.polynomial import polyval
from flask import jsonify
from sympy.parsing.sympy_parser import parse_expr
from sympy import *
import json

class CalculusVisualizer:
    def __init__(self, i_functionStr):
        self.functionStr = i_functionStr
        self.func = parse_expr(self.functionStr)
        self.funcDiff = diff(self.func)

    def getMVTLine(self, point1, point2):
        minPtX = 0
        maxPtX = 0

        if point1 > point2:
            minPtX = point2
            maxPtX = point1
        else:
            minPtX = point1
            maxPtX = point2

        # secant line:
        secantSlope = (self.func.evalf(subs = {'x':point1}) - self.func.evalf(subs = {'x':point2}))/(point1 - point2)

        # Solve for the MVT point
        diffEq = Eq(self.funcDiff, secantSlope)
        MVTptSet = solve(diffEq)
        MVTpt = 0

        for pt in MVTptSet:
            if minPtX < float(pt) < maxPtX:
                inInterval = True
                MVTpt = pt
                break
            else:
                inInterval = False

        if inInterval:
            m = self.funcDiff.evalf(10, subs={'x': MVTpt})
            b = self.func.evalf(10, subs={'x': MVTpt}) - (m * MVTpt)
            return [m, b]
        else:
            print("The MVT has been disproven!")
            return [0, 0]









