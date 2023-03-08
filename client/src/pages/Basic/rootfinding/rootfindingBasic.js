import React, { Component, useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'
import { MathComponent } from "mathjax-react";
//import Plot from 'react-plotly.js';
import {Mafs, Coordinates, Plot, Theme, useMovablePoint, MovablePoint, vec, Text, Point} from "mafs"
import 'mafs/core.css'
import {
  atan2, chain, derivative, e, evaluate, expression, log, map, pi, pow, round, sqrt
} from 'mathjs'
//import {Mafs, Coordinates, Plot, Theme, useMovablePoint, MovablePoint, vec, Text} from "mafs"

function Plotter({function_str, pointArray, iterantMode, iterant}){
  
  
  const Parser = require('expr-eval').Parser;
  const parser = new Parser();
  let expr = parser.parse(function_str);
  let showAll = false

  if(iterantMode == "Active"){
    showAll = true
  }
  else{
    showAll = false 
  }


  return ( 
    <div> 
      <Mafs zoom = {true}>
        <Coordinates.Cartesian/>
        <Plot.OfX y ={(x) => expr.evaluate({x : x})} color = {Theme.blue}/>
        {showAll ? (pointArray.map((xPos, k) => <Point x={xPos} y={expr.evaluate({x:xPos})} color = "Magenta" key = {k+1}/>)):
        iterant <= pointArray.length ? <Point x={pointArray[iterant-1]} y={expr.evaluate({x:pointArray[iterant-1]})} color = "Magenta"/> : null}

        {showAll ? (pointArray.map((xPos, k) => <Text x={xPos} y={expr.evaluate({x:xPos})} attach='e' attachDistance= {10} size={15}>{"P"+ (k + 1)}</Text>)):
        iterant <= pointArray.length ? <Text x={pointArray[iterant-1]} y={expr.evaluate({x:pointArray[iterant-1]})} attach='e' attachDistance= {10} size = {15}>{"P"+iterant}</Text> : null}

      </Mafs>
    </div>
  )
}




class FunctionBox extends Component{
  constructor(props){
    super(props); 
    this.state = {
      InputInfo : ""
    }
  }

  handleChange(e){
    this.setState({InputInfo : e.target.value})
  }

  handleSubmit(e){
    e.preventDefault() 
    this.props.GetFunction(this.state.InputInfo)
  }

  render(){
    return(
      <div> 
        <form onSubmit = {(e) => this.handleSubmit(e)}>
          <label for = "textbox">{this.props.nameLabel}</label>
          <input type = "text" id = "textbox" placeholder = {this.props.placeholder} onChange = {(e) => this.handleChange(e)}/>
          <input type = "submit"/> 
        </form> 
      </div> 
    )
  }
}

class RadioButton extends Component{
  constructor(props){
    super(props); 
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(){
    this.props.GetName(this.props.label)
  }

  render(){
    return(
      <div>
        <label for="rButt">{this.props.label}</label>
        <input id = "rButt" type="radio" name = {this.props.name} onChange = {this.handleChange} value={this.props.i_value} />
      </div>
    )
  }
}

//Radio system has a props for name
class RadioSystem extends Component{
  constructor(props){
    super(props); 
    this.state = {
      MethodType : "Default"
    }
    this.handleRadio = this.handleRadio.bind(this)
  }

  handleRadio(val){
    this.setState({MethodType : val}, this.props.GetMethod(val))
  }

  render(){
    return(
      <div>
      {this.props.rbArray.map((methodName, val) => <RadioButton name = {this.props.SystemName} label = {methodName} GetName = {this.handleRadio} key={val}/>)}
      </div>

    )
  }
}

class CheckBox extends Component{
  constructor(props){
    super(props)
    this.state = {
      CurrentState : "Inactive"
    }
    this.handleChange = this.handleChange.bind(this)

  }

  handleChange(){
    if(this.state.CurrentState == "Active"){
      this.setState({CurrentState : "Inactive"})
      this.props.GetState("Inactive")
    
    }else{
      this.setState({CurrentState : "Active"})
      this.props.GetState("Active")
    }
  }

  render(){
    return(
      <div> 
        <label for="cb">{this.props.i_label}</label>
        <input id="cb" type="checkbox" onChange = {this.handleChange} name = {this.props.i_name} />
      </div>
    )
  }

}

class Slider extends Component{
  constructor(props){
    super(props); 
    this.state = {
      sliderVal : 4
    }

  }

  handleChange(e){
    this.setState({sliderVal : e.target.value})
    this.props.GetSliderVal(e.target.value)
  }
  
  render(){
    return(
      <div> 
        <input type="range" min = {1} max = {this.props.max} onChange = {(e) => this.handleChange(e)} value = {this.state.sliderVal}/>
        <p>{this.state.sliderVal}</p>
      </div>


    )
  }



  
}


class MainForm extends Component{
  constructor(props){
    super(props)
    this.state = {MethodType : "FixedPoint",
    IterationMode : "All", 
    MaxIterations : "1", 
    Iteration : "1",
    InitialGuess : "0",
    Function : "0"}
  }

  // Parent Function space: 

  //Sets the value of the function var in the main form: 
  setFunction(value){
    this.setState({Function : value})
  }


  //Sets the value of the initalGuess
  setInitialGuess(val){
    this.setState({InitialGuess : val})
  }

  //Sets the value of the MaxIterations 
  setIterationCount(val){
    this.setState({MaxIterations : val})
  }

  //Sets the val of the method

  setMethodType(mType){
    this.setState({MethodType : mType})
  }

  //Set the type of Iteration Display 

  setDisplayMode(dispMode){
    this.setState({IterationMode : dispMode})
  }

  //Set the current Iteration

  setIteration(currIter){
    this.setState({Iteration : currIter})
  }


  


  render(){
    return(
      <div> 
        <FunctionBox nameLabel = {"Function: "} placeholder = {"Function"} GetFunction = {(e) => this.setFunction(e)}/>
        <FunctionBox nameLabel = {"Initial Guess: "} placeholder = {"Inital Guess"} GetFunction = {(e) => this.setInitialGuess(e)}/>
        <FunctionBox nameLabel = "Iteration Count: " placeHolder = "Max Iterants" GetFunction = {(e) => this.setIterationCount(e)}/>
        <div className = "MethodSelection">
        <RadioSystem GetMethod = {(val) => this.setMethodType(val)} SystemName = "MethodSelection" rbArray = {["Fixed Point", "Newton's Method", "Halley's Method"]}/>
        </div> 
        <div className = "IterationDisplay">
          <CheckBox GetState = {(e) => this.setDisplayMode(e)} name = "DispMode" i_label = "Show all Iterants?"/>
        </div>
        <div className = "IterationSlider">
          <p>Iteration Slider</p>
          <Slider max = {this.state.MaxIterations} GetSliderVal = {(val) => this.setIteration(val)} />
        </div>
        <div className = "Plotter">
          <Plotter function_str = "cos(x)" pointArray = {[0.52, 1.134, 3.14, 9.82, 4.1]} iterantMode = {this.state.IterationMode} iterant = {this.state.Iteration}/>
        </div>

        <p>{this.state.MethodType}</p>
        <p>{this.state.Function}</p>
        <p>{this.state.InitialGuess}</p>
        <p>{this.state.IterationMode}</p>
        <p>{this.state.MaxIterations}</p>
      </div>
    )
  }
}



class App extends Component {
  render() {
    return (
      <div> 
      <h1 id = "title">Root Finding Methods</h1>  
      <MainForm />
      </div>
      
    );
  }
}
export default App;