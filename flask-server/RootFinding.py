import numpy as np
from numpy.polynomial import Polynomial
from numpy.polynomial.polynomial import polyval
from flask import jsonify
from sympy.parsing.sympy_parser import parse_expr
from sympy import *
import json

'''
JSON FORMAT: 
{
   Function : x^2
   InitialPoint : (x, y) 
   Type : fixed-point
   Iteration : 4
   Max Iterations : 10
   

}
'''


class FixedPointIteration:
    def __init__(self, i_function, i_initX, i_maxIterations, i_tolerance):
        self.functionStr = i_function.replace("^", "**")
        self.initX = i_initX
        self.maxIters = i_maxIterations
        self.func = parse_expr(self.functionStr)
        self.diffFunc1 = diff(self.func)
        self.sol = nsolve(parse_expr(self.functionStr + "-x"), self.initX)
        self.tolerance = i_tolerance

    # Returns a string of the first derivative

    def getDerivative(self):
        k = str(self.diffFunc1)
        k = k.replace("^", "**")
        return k

    # Returns 2 lists: 1 contains the fixed point results and the other contains
    # the difference from the other

    def FixedPointIteration(self):
        xIterants = []
        diffList = []
        state = "converged"
        x_1 = self.func.evalf(5, subs={'x': self.initX})
        xIterants.append(x_1)

        for i in range(1, self.maxIters):
            x_j = self.func.evalf(10, subs={'x': xIterants[i - 1]})
            diffList.append(abs(x_j - xIterants[i - 1]))
            xIterants.append(x_j)

        if diffList[len(diffList) - 1] > diffList[0]:
            state = "converged"
        else:
            state = "diverged"

        return xIterants, diffList, state

    # Returns the MVT Line that matches the secantLine interval

    def MVTLine(self, iterant):
        minPtX = 0
        maxPtX = 0

        if abs(self.initX - self.sol) > self.tolerance:
            # determine the maximum and minimum points.

            if self.initX > self.sol:
                minPtX = self.sol
                maxPtX = self.initX
            else:
                minPtX = self.initX
                maxPtX = self.sol

            # find the secant slope between the min and max points
            sec_slope = self.func.evalf(10, subs={'x': self.sol}) - self.func.evalf(10, subs={'x', iterant}) / (
                        self.sol - iterant)

            # Find where the first derivative equals the sec_slope in question
            diffEq = Eq(self.diffFunc1, sec_slope)
            MVTptSet = solve(diffEq)

            # Chose the MVT point in MVTptSet that is in the interval [minPtX, maxPtX]
            MVTpt = None
            for pt in MVTptSet:
                if minPtX < pt < maxPtX:
                    MVTpt = pt
                    break

            if MVTpt is not None:
                m = self.diffFunc1.evalf(10, subs={'x': MVTpt})
                b = self.func.evalf(10, subs={'x': MVTpt}) - m * MVTpt
                return [m, b]
            else:
                print("MVT Disproven? Something went wrong!")
        else:
            return "The current iterant is tolerably close!"





def GetDerivative(function):
    newFunc = function.replace("^", "**")
    s = parse_expr(newFunc)
    s_diff = diff(s, 'x')
    k = str(s_diff)
    k = k.replace("**", "^")
    return k


def getMVTLine(self, function, truePoint, iterant):
    # Determine the max and min point
    if truePoint > iterant:
        maxPt = truePoint
        minPt = iterant
    else:
        maxPt = iterant
        minPt = truePoint

    newFunc = function.replace("^", "**")
    s = parse_expr(newFunc)
    # Calculate the slope of secant line between the truePoint and iterant
    sec_slope = (s.evalf(10, subs={'x': truePoint}) - s.evalf(10, subs={'x': iterant})) / (truePoint - iterant)

    # Calculate the MVT using the derivative of the main function:
    s_diff = diff(s, 'x')
    diffEq = Eq(s_diff, sec_slope)

    MVTptSet = solve(diffEq)

    MVTpt = 0
    inInterval = True

    for pt in MVTptSet:
        if minPt < float(pt) < maxPt:
            inInterval = True
            MVTpt = pt
            break
        else:
            inInterval = False

    # If the MVT point is is in the interval, then get then construct the polynomial for the MVT line
    m = s.evalf(10, subs={'x': MVTpt})

    if inInterval:
        m = s_diff.evalf(10, subs={'x': MVTpt})
        b = s.evalf(10, subs={'x': MVTpt}) - m * MVTpt
        return [m, b]
    else:
        print("The MVT has been disproven!")


def FixedPointIteration(function, initialX, iterCount):
    xIterants = []
    newFunc = function.replace("^", "**")
    s = parse_expr(newFunc)
    x_1 = s.evalf(5, subs={'x': initialX})
    xIterants.append(x_1)

    # Get the actual solution
    k = parse_expr(newFunc + "-x")
    sol = nsolve(k, initialX)
    closestSol = sol

    for i in range(1, iterCount):
        x_j = s.evalf(10, subs={'x': xIterants[i - 1]})
        xIterants.append(x_j)

    return [xIterants, closestSol]


def buildFPstruct(function, initialX, iterCount):
    [xIterants, trueSol] = FixedPointIteration(function, initialX, iterCount)
    diffList = []
    tangentLines = []

    # Calculate the Error
    for i in xIterants:
        diffList.append(trueSol - i)
        tangentLines.append(getMVTLine(function, trueSol, i))

    return [xIterants, trueSol, tangentLines, diffList]


main = buildFPstruct("(1+3*x)^(1/2)", 6, 10)
print(main)
