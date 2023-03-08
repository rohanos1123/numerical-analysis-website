import React, { Component, useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'
import { MathComponent } from "mathjax-react";
//import Plot from 'react-plotly.js';
import {Mafs, Coordinates, Plot, Theme, useMovablePoint, MovablePoint, vec, Text} from "mafs"
import 'mafs/core.css'
import {
  atan2, chain, derivative, e, evaluate, expression, log, pi, pow, round, sqrt
} from 'mathjs'
//import {Mafs, Coordinates, Plot, Theme, useMovablePoint, MovablePoint, vec, Text} from "mafs"






class TextBox extends Component{
  constructor(props){
      super(props); 
      this.state = {nodeCount : 0}
  }

  

  handleChange(e){
    this.setState({nodeCount : e.target.value}) 
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.i_onChange(this.state.nodeCount) 
  }

  render(){
    
    return(
    <div> 
      <form onSubmit = {(e) => this.handleSubmit(e)}>
      <label> 
        {this.props.i_label}
        <input type="text" onChange = {(e) => this.handleChange(e)} placeholder = {this.props.i_placeholder} value = {this.state.nodeCount}/> 
      </label> 
      <input type = "submit" value = "Apply"/>
      </form>
    </div>
    ) 
}
}



const RadioButton = ({i_label, i_value, i_onChange, i_name}) =>{
  const  [nodeType, setnodeType] = useState('Equally Spaced'); 

  return(
    <div> 
        <label> 
        <input type="radio" value={i_value} onChange = {i_onChange} name = {i_name}/>
        {i_label}
        </label>
    </div>
  ); 
}



class RangeEntry extends Component{
  constructor(props){
    super(props)
    this.state = {minVal : 0, 
    maxVal : 0}
  }

  handleMin(e){
    this.setState({minVal : e.target.value}) 
  }

  handleMax(e){
  this.setState({maxVal : e.target.value})
}

  handleSubmit = (e) =>{
    e.preventDefault();
    const pair = [this.state.minVal, this.state.maxVal]
    this.props.i_onChange(pair) 
  }

  render(){  
  return(
    <div> 
      <form onSubmit = {this.handleSubmit}> 
      <label for = "minBox">Minimum:  </label>
      <input id = "minBox" type="text" onChange = {(e) => this.handleMin(e)} placeholder = {this.props.i_placeholder} value = {this.state.nodeCount}/> 
      <br></br>
      <label for = "maxBox">Maximum: </label>
      <input  id = "maxBox" type="text" onChange = {(e) => this.handleMax(e)} placeholder = {this.props.i_placeholder} value = {this.state.nodeCount}/> 
      <br></br>
      <input type = "submit" value = "Apply"/>
      </form> 
    </div> 
  )
  }


} 

//Graph Function

  
//Polydata will be an object that consists of the first form of the barycentric 

const LinePlotter = ({function_str, i_onChange, i_pointArray, polyData, weightList}) =>{
 
  const [posList, setPosList] = useState([]);

  const Parser = require('expr-eval').Parser;
  const parser = new Parser();
  let expr = parser.parse(function_str);

  function calcPoly(xPt, rootList, polyWeights){

  

    if(rootList.includes(xPt)){
      //Return f(xPt) (as this is information we already know (and avoid 0 division))
      return expr.evaluate({x : xPt}) 
    }
    else{

      //Calculate the l(x) and store in polyproduct 
      let polyProduct = 1 
      for(let i = 0 ; i < rootList.length; i++){
        polyProduct *= (xPt - rootList[i])
    }
    

    return polyProduct
  }
}



  useEffect(() => {
    let pointArry = []
    for(let i = 0; i < i_pointArray.length; i++){
      pointArry.push([i_pointArray[i], expr.evaluate({x : i_pointArray[i]})])
    }
    setPosList(pointArry);
  }, [i_pointArray, function_str]);

  


  function handleMove(data) {

    const pointArry = []
    const tempPAx = []


    for(let i = 0; i < i_pointArray.length; i++){
      pointArry.push([i_pointArray[i], expr.evaluate({x : i_pointArray[i]})])
    }

    const newPoint = data[0]; 
    const key = data[1]; 
    const tempPA = pointArry.slice() 
    tempPA[key] = newPoint; 
    setPosList(tempPA);
    for(let i = 0; i < tempPA.length; i++){
      tempPAx.push(tempPA[i][0])
    }

    i_onChange(tempPAx)
  }


  
  return (
    <Mafs viewBox ={{x : [-10, 10], y : [-2, 2]}}  zoom = {true} width = {500} height = {500}>
      <Coordinates.Cartesian subdivisions = {1}/>
    
      
      <Plot.OfX y={(x) => expr.evaluate({x : x})} color = {Theme.blue}/>
      <Plot.OfX y={(x) => calcPoly(x, polyData, weightList)} color = {Theme.pink}/>
    
      {posList.map((point, i) => (
        <MovablePoint
          key={i}
          point={posList[i]}
          color={Theme.red}
          constrain = {([x,y]) => [x, expr.evaluate({x : x})]}
          onMove={(newPoint) => {
            handleMove([newPoint, i])
          }
        }
        />
      ))}
    </Mafs>
    
  )
}



class MainForm extends Component{
  constructor(props){
    super(props); 

    const initPltData = {"funcPoints" : {x : [0], y : [0]},
    "polyPoints" : {x : [0], y : [0]},
    "derivation" : " ",
    "polyString" : " "}; 

    this.state = {nodeType : "Equally Spaced",
                  count : 0,
                  function : "x^2", 
                  nodeList : [0, 0],
                  range : [-5, 5],
                  weightData : [],
                  pltData : initPltData, 
                  }
}

  //Sends state of front end elements to backend 
  async postState(elementToSend){
    
    await axios.post("http://localhost:5000/api/lagpoly", elementToSend)
    .then(
      response => {
        this.setState({nodeList : response.data.NodeList, weightList : response.data.lagrangeWeights})
      })
      .catch(error => {
        console.log(error)
      })


  }



  //Node Point Changes
  handleCN = () => {
    this.setState({nodeType : "Chebyshev Nodes"}, () => {
      this.postState(this.state)
    })
  }

  handleES = () =>{
    this.setState({nodeType : "Equally Spaced"}, () => {
      this.postState(this.state)
    })
  }

  handleCustom = () =>{
    this.setState({nodeType : "Custom"}, () => {
      this.postState(this.state)
    })
  }



  handleGaussNodes = () =>{
    this.setState({nodeType:"Gauss Nodes"}, () => {
      this.postState(this.state)
    })
    
  }

  //Handling Number of Nodes information
  handleNodeCount(value){
    let tempNode = "Equally Spaced"
    if (this.state.nodeType == "Chebyshev Nodes"){
      tempNode = "Chebyshev Nodes"
    }


    this.setState({count : value, nodeType : tempNode}, () => {
      this.postState(this.state)
    })
  }
    

  //Handling the function: 
  handleFunction(value){
    this.setState({function : value}, () => {
      this.postState(this.state)
    })  
  }


  //Handling node slider
  handlePointChange = (values) =>{
    this.setState({nodeList : values}, () => {
      this.setState({nodeType : "Custom"})
      this.postState(this.state)
    })
  }

  handleRange = (n_range) =>{
    const newRange = n_range
    this.setState({range : newRange})

  }

 
  




  render(){

    return(
    <div className = "RadioButtons">

      <div className = "NodeSelections"> 
      <RadioButton i_label = "Chebyshev Nodes" i_onChange = {this.handleCN} i_name = "nodeSelect"/>
      <RadioButton i_label = "Equally Spaced" i_onChange = {this.handleES} i_name = "nodeSelect" />
      <RadioButton i_label = "Gauss Nodes" i_onChange = {this.handleGaussNodes} i_name = "nodeSelect" />
      <RadioButton i_label = "Custom" i_onChange = {this.handleCustom} i_name = "nodeSelect" />
     </div> 
    
     <div className = "FuncPlotter">
        <LinePlotter function_str = {this.state.function} i_onChange = {this.handlePointChange} i_pointArray = {this.state.nodeList} polyData = {this.state.nodeList} weightData = {this.state.weightList}/>
      </div> 
      
    
    <div className = "menSystem"> 
      <div className = "pointEntry"> 
        <TextBox i_label = " Number of points:  " i_onChange = {(e) => this.handleNodeCount(e)}/>
      
      </div> 
      <br>
          
      </br>
      <div className = "functionEntry"> 
          <TextBox i_label = " Function to Evaluate:  " i_onChange = {(e) => this.handleFunction(e)}/>
      </div>
      </div>
      <br>
          
        </br>

      
      <div className = "RangeEntry1"> 
        <p>Enter Range Here: </p>
        <RangeEntry i_onChange = {this.handleRange}/>        
      </div>


      <div className = "Information">
        <h3>Information</h3>
        <p>Node Type: {this.state.nodeType}</p>
        <p>Function: {this.state.function}</p>
        <p>Number Of Points: {this.state.count}</p>

        </div> 

    </div> 



    
    )

    

  }



}




class App extends Component {
  render() {
    return (
      <div> 
      <h1 id = "title">Global Interpolation</h1>  
      <MainForm />
      </div>
      
    );
  }
}
export default App;