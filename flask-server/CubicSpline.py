import numpy as np
from numpy.polynomial import Polynomial
from numpy.polynomial.polynomial import polyval
from flask import jsonify
from sympy.parsing.sympy_parser import parse_expr
from Calculus import CalculusVisualizer
from sympy import *
import json

class CubicSpline:
    def __init__(self, i_functionStr, i_h, intervalCout, i_interval):
        newFunc = i_functionStr.replace("^", "**")
        self.func = parse_expr(newFunc)
        self.interval = i_interval
        self.iSize = i_h
        self.calcVis = CalculusVisualizer(i_functionStr)
        self.pointSet = self.generatePointSet()
        self.splineSet = []
        self.polyCount = 0

    def generatePointSet(self):
        xArry = np.linspace(self.interval[0], self.interval[1], self.iSize)
        polyCount = len(xArry) - 1
        pointArry = []
        for pt in xArry:
            newPt = (xArry, self.func.evalf(subs = {'x':pt}))
            pointArry.append(newPt)
        self.polyCount = polyCount
        return xArry

    def parseLinearEquation(self, func, equationNum):
        varCount = self.polyCount * 4
        startingPos = varCount/equationNum
        linearRow = np.zeros(1, varCount)
        index = 0
        for s in func.free_symbols:
            newCoeff = func.coeffs(s, 1)
            linearRow[startingPos + index] = newCoeff

        return linearRow

    # Solve a 4n by 4n system
    def calculateCubicSpline(self):
        splineSystem = np.zeros(4*self.polyCount, 4*self.polyCount)
        solutionVector = np.zeros(4 * self.polyCount)
        for i in range(len(self.pointSet) - 1):
            polyCount = i
            sp1 = "(x-", self.pointSet[i][0], ")"
            funcString1 = "a + b*" + str(sp1) + "+c*" + str(sp1) + "**2 + d" + str(sp1) + "**3"
            func = parse_expr(funcString1)

            m1 = func.subs('x', self.pointSet[i][0])
            m2 = func.subs('x', self.pointSet[i+1][0])

            row1 = self.parseLinearEquation(m1, polyCount)
            row2 = self.parseLinearEquations(m2, polyCount*2)














'''
k = parse_expr(functionString)
m = k.subs('x', 3)
print(m.free_symbols)
for i in m.free_symbols:'''











