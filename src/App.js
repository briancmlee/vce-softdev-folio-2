import React from 'react';
import './App.css';

const calculateYValue = (xValue, coefficientStringArray) => {
  // return coefficientStringArray.reduce((total, coeff, index) => {
  //   return Number(total + (Number(coeff) * Math.pow(xValue, 2 - index)));
  // })
  let accumulator = 0;

  for (let i = 0; i < 3; i++) {
    accumulator = accumulator + (Number(coefficientStringArray[i]) * Math.pow(xValue, i));
  }

  return accumulator;
};

console.log(calculateYValue(4, ["1", "8", "0"]));


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coefficientStringArray: ["0", "0", "0"],
      axisParams: {
        "domain": [-250, 250],
        "range": [-250, 250]
      }
    };

    this.equationChange = this.equationChange.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.resetGraph = this.resetGraph.bind(this);
    this.paramChange = this.paramChange.bind(this);
  }

  componentDidMount() {
    this.updateCanvas();
  }


  updateCanvas() {
    const canvasHeight = this.refs.canvas.height;
    const canvasWidth = this.refs.canvas.width;
    const ctx = this.refs.canvas.getContext("2d"); 

    const axisDomain = this.state.axisParams["domain"];
    const axisRange = this.state.axisParams["range"];

    const axisDomSize = axisDomain[1] - axisDomain[0];
    const axisRangeSize = axisRange[1] - axisRange[0];

    const canvXToGraphX = canvasXValue => { return axisDomain[0] + (canvasXValue * (axisDomSize / canvasWidth)) };
    const graphXToCanvX = graphXValue => { return canvasWidth * ((graphXValue - axisDomain[0]) / axisDomSize) };
    const graphYToCanvY = graphYValue => { return canvasHeight * (1 - ((graphYValue - axisRange[0]) / axisRangeSize)) };

    if (this.state.coefficientStringArray !== ["0", "0", "0"]) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.setLineDash([0, 0]);
      ctx.beginPath();
      for (let canvasXValue = 0; canvasXValue < canvasWidth; canvasXValue++) {
        if (canvasXValue === 0) {
          ctx.moveTo(canvasXValue, graphYToCanvY(calculateYValue(canvXToGraphX(canvasXValue), this.state.coefficientStringArray)));
        } else {
          ctx.lineTo(canvasXValue, graphYToCanvY(calculateYValue(canvXToGraphX(canvasXValue), this.state.coefficientStringArray)));
        }
      }
      ctx.stroke();
    }

    ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(0, graphYToCanvY(0));
    ctx.lineTo(canvasWidth,graphYToCanvY(0));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(graphXToCanvX(0), 0);
    ctx.lineTo(graphXToCanvX(0), canvasHeight);
    ctx.stroke();
  }
  
  equationChange(event) {
    const newValue = event.target.value;
    const valueIndex = event.target.getAttribute("power");
    
    let coefficientStringArray = this.state.coefficientStringArray;
    coefficientStringArray[valueIndex] = newValue

    this.setState({coefficientStringArray: coefficientStringArray}, () => {
      this.updateCanvas();
    })
  }

  paramChange(event) {
    const newValue = Number(event.target.value);
    const domainOrRange = event.target.className;
    const axisParamIndex = parseInt(event.target.getAttribute("index"))
    let axisParams = this.state.axisParams;

    if ((axisParamIndex === 0 && (newValue < axisParams[domainOrRange][1])) || (axisParamIndex === 1 && (newValue > axisParams[domainOrRange][0]))) {    
      axisParams[domainOrRange][axisParamIndex] = newValue;

      this.setState({axisParams: axisParams}, () => { 
        this.updateCanvas();
      })
    }
  }
  
  resetGraph() {
    this.setState({
      coefficientStringArray: ["0", "0", "0"],
      axisParams: {
        "domain": [-250, 250],
        "range": [-250, 250]
      }
    }, () => { this.updateCanvas() })
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
        <span>Domain: [ 
          <input type="number" className="domain" onChange={this.paramChange} value={this.state.axisParams["domain"][0]} index={0} />, 
          <input type="number" className="domain" onChange={this.paramChange} value={this.state.axisParams["domain"][1]} index={1} /> 
        ]</span>
        <span>Range: [ 
          <input type="number" className="range" onChange={this.paramChange} value={this.state.axisParams["range"][0]} index={0} />, 
          <input type="number" className="range" onChange={this.paramChange} value={this.state.axisParams["range"][1]} index={1} /> 
        ]</span>

        <canvas ref="canvas" height={500} width={500}/>
        <div id="reset-button">
          <button onClick={this.resetGraph} >Clear graph</button>
        </div>
      </div>
    );
  }
}

export default App;
