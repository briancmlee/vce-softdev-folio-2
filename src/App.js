import React from 'react';
import logo from './logo.svg';
import './App.css';

const calculateYValue = (xValue, coefficientArray) => {
  return coefficientArray.reduce((total, coeff, index) => {
    return Number(total + (coeff * Math.pow(xValue, index)));
  })
};


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coefficientStringArray: ["0", "0", "0"]
    };

    this.equationChange = this.equationChange.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.resetGraph = this.resetGraph.bind(this);
  }

  componentDidMount() {
    const canvasHeight = this.refs.canvas.height;
    const canvasWidth = this.refs.canvas.width;
    const ctx = this.refs.canvas.getContext("2d");

    ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.stroke();
  }

  updateCanvas(coefficientStringArray) {
    const canvasHeight = this.refs.canvas.height;
    const canvasWidth = this.refs.canvas.width;


    let coordArray = [];
      for (var i = 0; i < canvasWidth; i++) {
        // const coordPair = [i - canvasWidth / 2, calculateYValue(i - canvasWidth / 2, coefficientStringArray)];
        const coordPair = [i - canvasWidth / 2, calculateYValue(i - canvasWidth / 2, coefficientStringArray.map(item => Number(item)))]
        coordArray.push(coordPair);
      }

    const ctx = this.refs.canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    
    ctx.setLineDash([0,0]);
    ctx.beginPath();
    coordArray.forEach((coordPair, index) => {
      if (index === 1) {
        ctx.moveTo(coordPair[0] + 250, canvasHeight - (coordPair[1] + 250))
      } else {
        ctx.lineTo(coordPair[0] + 250, canvasHeight - (coordPair[1] + 250))
      }
    })
    ctx.stroke();

    ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.stroke();
  }
  
  equationChange(event) {
    const newValue = event.target.value;
    const valueIndex = event.target.getAttribute("power");
    
    let coefficientStringArray = this.state.coefficientStringArray;
    coefficientStringArray[valueIndex] = newValue

    this.setState({coefficientStringArray: coefficientStringArray}, () => {
      this.updateCanvas(coefficientStringArray);
    })
  }
  
  resetGraph() {
    this.setState({
      coefficientStringArray: ["0", "0", "0"]
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Graphing Calculator</h1>
        <span>y=
          <input type="number" onChange={this.equationChange} value={this.state.coefficientStringArray[2]} power={2} />x<sup>2</sup> + 
          <input type="number" onChange={this.equationChange} value={this.state.coefficientStringArray[1]} power={1} />x + 
          <input type="number" onChange={this.equationChange} value={this.state.coefficientStringArray[0]} power={0} />
        </span>
        <canvas ref="canvas" height={500} width={500}  coefficientStringArray={this.state.coefficientStringArray} />
        <div id="reset-button">
          <button onClick={this.resetGraph} >Clear graph</button>
        </div>
      </div>
    );
  }
}

export default App;
