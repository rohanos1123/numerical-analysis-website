import React, { Component, useState} from 'react';
import './App.css';
import axios from 'axios'
import { MathComponent } from "mathjax-react";
import Plot from 'react-plotly.js';



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
      <input type="submit" />
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



class Slider extends Component{
  constructor(props){
      super(props)
      this.state = {pointPos : this.props.i_min,
      name : this.props.i_name}
  }

  handleChange(event){
    this.setState({pointPos : event.target.value})
    this.props.i_onChange([this.props.name, event.target.value])
  }

  render(){
    return(
    <div class="slidecontainer">
    <label for="myRange">{(this.state.pointPos/100).toFixed(3)}</label>
    <br></br>
    <input type="range" min={this.props.i_min * 100} max={this.props.i_max * 100}
    value={this.state.pointPos} onChange = {(e) => this.handleChange(e)} class="slider" id="myRange" name = {this.props.name} />
    </div>
    )
  }

}


class SliderSet extends Component{
  
  constructor(props){
    super(props)
    this.state = {pointValues : []}
    for(let i = 0; i < this.props.size; i++){  
        this.state.pointValues.push(this.props.min)
    }  
  
  }

  handleSlide(data){
    const index = data[0]
    const m_value = data[1]

    const tempId = this.state.pointValues.slice()
    tempId[index] = m_value/100
    this.setState({pointValues : tempId})

    this.props.i_onChange(this.state.pointValues)
    

  }

  changeCount(){

  }

  render(){
    return(
      <ul>{this.state.pointValues.map((value, i) => <Slider name = {i} i_onChange = {(e) => this.handleSlide(e)} i_min = {this.props.min} i_max = {this.props.max}/>)}</ul>
    )
  }
  
}

class Example extends React.Component {
  render() {
    return <MathComponent tex={String.raw`l_1(x) = \frac{(x+0.5)(x-0.0)(x-0.5)(x-1.0)}{(-1.0+0.5)(-1.0-0.0)(-1.0-0.5)(-1.0-1.0)}`} />;
  }
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

  handleSubmit(e){
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
      <input type = "submit"/>
      </form> 
    </div> 
  )
  }


} 

//Graph Function

const FuncPlot = ({funcPoints, polyPoints}) =>{
      return(<Plot 
        data={[
          {
            x: funcPoints.x,
            y: funcPoints.y,
            type: 'line',
            marker: {color: 'red'},
          },
          {type: 'line', x: polyPoints.x, y: polyPoints.y},
        ]}
    
        layout={
            { autosize : false, width: 500, height: 500, title: 'Lagrange Interpolation'} }
        />)
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
                  nodes : [],
                  range : [-5, 5],
                  pltData : initPltData, 
                  }
}

  //Sends state of front end elements to backend 
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
    this.setState({count : value}, () => {
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
  handleNodeSlider = (value) =>{
    this.setState({nodes : value}, () => {
      this.postState(this.state)
    })
  }

  handleNodeSlides = (minVal, maxVal) =>{
    const newRange = [minVal, maxVal]
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
      <h1>{this.state.nodeType}</h1>
     </div> 
    
    
      <div className = "pointEntry"> 
        <TextBox i_label = " Number of points:  " i_onChange = {(e) => this.handleNodeCount(e)}/>
      
      </div> 
      <br>
          
      </br>
      <div className = "functionEntry"> 
          <TextBox i_label = " Function to Evaluate:  " i_onChange = {(e) => this.handleFunction(e)}/>
      </div>
      <br>
          
        </br>

      <p>Enter Range Here: </p>
      <div className = "RangeEntry1"> 
        <RangeEntry/>
        
      </div>

  


      <div className = "Sliders">
          <SliderSet size = {4} min = {this.state.range[0]} max = {this.state.range[1]} i_onChange = {this.handleNodeSlider}/>
      </div>

  

      <div className = "parent" >
        <div className = "plot">  
          <FuncPlot polyPoints = {this.state.pltData.polyPoints} funcPoints = {this.state.pltData.funcPoints}/>
        </div>
      </div> 

    </div> 
    )

  }



}



class App extends Component {
  render() {
    return (
      <div> 
      <MainForm />
      </div>
      
    );
  }
}
export default App;