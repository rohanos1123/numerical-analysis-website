import numpy as np
from numpy.polynomial import Polynomial
from numpy.polynomial.polynomial import polyval
from flask import jsonify
from sympy.parsing.sympy_parser import parse_expr
from Calculus import CalculusVisualizer
from sympy import *
import json

'''
Request JSON Template For Newton's method (From frontend)

NMjson Request
{
    function : string
    Current Iteration : int
    maxIterations : int
    initialPoint (x) : float 
    tolerance : float
}

Response json method

NMjson Response
{
     Newton's points = []floats //Point at each iteration
     Newton's lines = [] -> [float, float]  //Polynomial for newton's line at Kth iterant
     Newton's Difference = [] 
    
} 

'''


class NewtonsMethod:
    def __init__(self, i_function, i_maxIterations, i_tolerance, i_initPt, zeroTolerance):
        x = Symbol('x')
        self.functionStr = i_function.replace("^", "**")  # original Function string
        self.initPt = i_initPt
        self.maxIters = i_maxIterations  # maximum iterations
        self.tolerance = i_tolerance
        self.func = parse_expr(self.functionStr)  # original function
        self.diffFunc1 = diff(self.func)  # first derivative of function
        self.diffFunc2 = diff(self.diffFunc1)  # second derivative of function
        self.newtonsFunction = x - self.func / self.diffFunc1
        self.solution = nsolve(self.func, self.initPt)  # approximate solution to the
        self.calcVis = CalculusVisualizer(self.functionStr)

    # zeroTolerance is a number really close to zero
    def SolNotZero(self, zeroTolerance):
        # Test if the abs function's derivative at the zero is less than the a perscribed tolerance
        if abs(self.diffFunc1.evalf(subs={'x': self.solution})) < zeroTolerance:
            return True
        else:
            return False

    def getDerivativeStr(self):
        k = str(self.diffFunc1)
        k = k.replace("^", "**")
        return k

    def ConvergenceProof(self, xIterant, k, delta1Lim, delta2Lim):
        state = " "
        inBound = True
        mvtLine = []

        # Verify that the given initial point in within the delta2 bound

        # Calculate the Distance from the point in question to the solution
        initDistance = abs(xIterant - self.solution)

        if self.SolNotZero(0.0001):

            # Show that newtonsFunc is differentiable in the chosenDelta interval
            delta1 = 0
            while delta1 < delta1Lim:
                delta1 += 0.01
                posSide = self.newtonsFunction.evalf(subs={self.solution + delta1})
                negSide = self.newtonsFunction.evalf(subs={self.solution - delta1})
                if abs(posSide) <= 0.0001 or abs(negSide) <= 0.0001:
                    break

            # Differentiate newton's function
            newtonsFuncDiff = diff(self.newtonsFunction)

            # Verify that the derivative of newton's function is 0 at the point
            delta2 = 0
            while delta2 < delta2Lim:
                delta2 += 0.01
                posSide = newtonsFuncDiff.evalf(subs={self.solution + delta2})
                negSide = newtonsFuncDiff.evalf(subs={self.solution - delta2})
                if abs(posSide) > k or abs(negSide) > k:
                    break

            if (self.solution - delta2) < xIterant < (self.solution + delta2):
                inBound = True
            else:
                inBound = False


            # verify that x is within the bounds of the 2nd delta:
            if inBound:
                mvtLine = self.calcVis.getMVTLine(xIterant, self.solution)
                m = mvtLine[0]
                if m < 1:
                    state = "converging"
                return mvtLine, delta1, delta2, state
            else:
                state = "X is not in delta2 bound (unsafe!)"
                return mvtLine, delta1, delta2, state
        else:
            state = "Too close to zero"
            return state


    def newtonMethodMaxIters(self):
        iterations = [self.initPt]
        differenceVector = []
        state = ""
        for i in range(1, self.maxIters):
            newSol = self.newtonsFunction.evalf(subs = {'x' : iterations[i - 1]})
            differenceVector.append(abs(newSol - iterations[i - 1]))
            iterations.append(newSol)
        finalDiff = iterations[len(iterations) - 1] - iterations[len(iterations) - 2]
        firstDiff = iterations[1] - iterations[0]

        if finalDiff < firstDiff:
            state = "Converged"
        else:
            state = "Diverged"

        return iterations, differenceVector

    def newtonsMethodStructProof(self, delta1Bound=5, delta2Bound=5, k=0.5):
        success = True
        [iterationVector, diffVector] = self.newtonMethodMaxIters()
        funcDiff = self.getDerivativeStr()
        resultant = ()

        for i in iterationVector:
            resultant = self.ConvergenceProof(i, k, delta1Bound, delta2Bound)
            if type(resultant) == tuple and len(resultant) == 4:
                success = True

            else:
                success = False


        if success:
             NMDict = {
                "State : Success"
                "Function" : self.functionStr,
                 "Derivative " : self.getDerivativeStr(),
                "MVT Lines" : resultant[0],
                "Delta1" : resultant[1],
                "Delta2" : resultant[2],
                "k" : resultant[3]
             }
        else:
            NMDict = {
                "State : Success"
                "Function": self.functionStr,
                "Derivative" : self.getDerivativeStr(),
                "MVT Lines": resultant[0],
                "Delta1": resultant[1],
                "Delta2": resultant[2],
                "k": resultant[3]
            }






omar = parse_expr("x**2 + 5")
x = Symbol('x')
newFunct = x * omar
print(newFunct.evalf(subs={'x': 5}))
