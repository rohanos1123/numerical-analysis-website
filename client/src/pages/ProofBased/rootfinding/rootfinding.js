import React, { Component, startTransition, useState} from 'react';
import './App.css';
import axios from 'axios'
import { MathComponent } from "mathjax-react";
import {Mafs, Coordinates, Plot, Theme, useMovablePoint, MovablePoint, vec, Text} from "mafs"
import 'mafs/core.css';



const LinePlotter = ({function_str, i_onChange}) =>{
  const [point, setPoint] = useState([1, 1]);

  const Parser = require('expr-eval').Parser;
  const parser = new Parser();
  let expr = parser.parse(function_str);

  function handleMove(newPoint) {
    setPoint(newPoint);
    i_onChange(newPoint)
  }

  
  
  return (
    <Mafs viewBox ={{x : [-10, 10], y : [-2, 2]}}  zoom = {true}>
      <Coordinates.Cartesian subdivisions = {4}/>
    
      
      <Plot.OfX y={(x) => expr.evaluate({x : x})} color = {Theme.blue}/>
      <Plot.OfX y={(x) => x} color = {Theme.pink}/>
      <Text
        x={point[0]}
        y={point[1]}
        attach="w"
        attachDistance={15}
        size = {15}
      >
        P0
      </Text>
      <MovablePoint point={point} onMove={handleMove} 
      constrain = {([x, y]) =>  [x, expr.evaluate({x : x})]}/>
    </Mafs>
    
  )
}













class Textbox extends Component{
  constructor(props){
    super(props); 
    this.state = {
      textEntry : " "
    }
  }

  handleChange(e){
    this.setState({textEntry : e.target.value})
  }

  onSubmit(e){
    e.preventDefault()
    this.props.i_onChange(this.state.textEntry)
  }


  render(){
    return(
      <div>
        <form onSubmit = {(e) => this.onSubmit(e)}>
          <label for="textIn">{this.props.label}</label>
          <input id = "textIn" type="text" value = {this.state.textEntry} onChange = {(e) => this.handleChange(e)}/>
          <input type = "submit"/>
        </form>
      </div>
    )
  }
}


class PointInitial extends Component{
  constructor(props){
    super(props);
    this.state = {
      x_min : -1, 
      x_max : 1
    }
  }

  handleMin(e){
    this.setState({x_min : e.target.value})
  }

  handleMax(e){
    this.setState({x_max : e.target.value})
  }

  handleSubmit(e){
    e.preventDefault(); 
    const tempArry = [this.state.x_min, this.state.x_max]
    this.props.i_onChange(tempArry)
  }

  render(){
    return(
      <div>
        <form onSubmit = {(e) => this.handleSubmit(e)}> 
          <label for="min_val">x</label>
          <input id="min_val" type = "text" onChange = {(e) => this.handleMin(e)}/>
          <br></br>
          <input type="submit"/>
        </form> 
      </div> 
    )
  }
}




class Slider extends Component{
  constructor(props){
    super(props); 

    this.state = {
      sliderVal : 0
    }
  }

  handleChange(e){
    this.setState({sliderVal : e.target.value})
    this.props.i_onChange(e.target.value)
  }

  render(){
    return(
      <div>   
      <p>Iteration</p>
      <input id="range_slide" type="range" min = {0} max = {this.props.max} class="iterSlider" onChange = {(e) => this.handleChange(e)} value = {this.state.sliderVal}/>
      <label id="slider_info" for="range_slide">{this.state.sliderVal}</label>
      </div> 
    )
  }
}


class MethodChoices extends Component{
  constructor(props){
    super(props);


  }



}



class InterForm extends Component{
  constructor(props){
    super(props); 


    const postData = {
      "function" : "x^2",
      "type" : "fixed-point", 
      "initialPoint" : (0,0), 
      "iteration-count" : 1
    }

    this.state = {range : [-1, 1], 
    type : "fixed-point", 
    function : "x^2",
    initialPoint : [0,0],
    iterationCount : 1, 
    maxIterations : 5, 
    reposeData : ""
    

    }
  }

     async postState(elementToSend){
    
        await axios.post("http://localhost:5000/api/lagpoly", elementToSend)
      .then(
        response => {
          this.setState({pltData : response.data})
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    }


    handleFunction = (func) =>{
      this.setState({function : func})
      this.postState(this.state)
    }

    handleMaxIters = (val) =>{
      this.setState({maxIterations : val})
      this.postState(this.state)
    }
    
    handleRange = (temp) =>{
      this.setState({initialPoint : temp})
      this.postState(this.state)
    }

    handleIteration = (iterValue) =>{
      this.setState({iterVal : iterValue})
      this.postState(this.state)
    }

    handleInitPoint = (newPoint) =>{
      this.setState({initialPoint : newPoint})
      this.postState(this.state)

    }


    



  render(){
    return(
      <div>

      <div className = "form_entry">
        <Textbox label = "f(x):" i_onChange = {this.handleFunction}/>
        <br></br>
        <Textbox label = "Max Iterations" i_onChange = {this.handleMaxIters}/>
        <br></br>
        <PointInitial i_onChange = {this.handleRange}/>
        <br></br>
      </div>

        <div className = "iterSlider"> 
        <Slider i_onChange = {this.handleIteration} max = {Number(this.state.maxIterations)} />
        </div> 

         <div className = "plot">
        <LinePlotter function_str = {this.state.function} i_onChange = {this.handleInitPoint}/>
        </div>



        <div className = "Information">
        <h3>Information</h3>
        <p>Function: {this.state.function}</p>
        <p>Method type: {this.state.type}</p>
        <p>Initial Point: ({this.state.initialPoint[0].toFixed(2)},{this.state.initialPoint[1].toFixed(2)})</p>
        <p>Max Iterations: {this.state.maxIterations}</p>
        <p>Iterations: {this.state.iterVal}</p>
        </div> 


        <FixedPointDesc/>

      </div>

    )
  }
}

class FixedPointDesc extends Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className = "FixedPtDesc"> 
       <h1>Exploring the Fixed Point Iteration</h1>
       <p>Let g be a function in  <i>C[a,b]</i> such that: <MathComponent tex={String.raw`g(x) \in [a,b]`}/>
       for all <i>x</i> in <i>[a, b]</i>. Suppose that in <i>g'</i> exists in <i>(a,b)</i> where 
       for a constant k, 0 &lt; k &lt; 1,  exists with: 
       <MathComponent tex={String.raw`|g'(x)| \le k \text{ for all } x \in (a,b)`}/>
       Then, for a point P<sub>0</sub> in (a,b), the sequence defined by: 
       <MathComponent tex={String.raw`p_n = g(p_{n-1}) \text{ } n \ge 1`}/>
       converges to a unique fixed-point <i>p</i> in [a,b]. 
       </p>


       <p> 
         This can be seen in the following demonstration that shows the fixed point 
         theorem. 
       </p>
      </div> 
    )
  }



}


class App extends Component {
  render() {
    return (
      <div> 
      <h1 id = "title">Root Finding</h1>
      <InterForm />
      </div>
      
    );
  }
}
export default App;