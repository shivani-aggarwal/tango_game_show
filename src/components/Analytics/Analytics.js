import React from 'react';
import './Analytics.css';

class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        simulationResults: this.props.simulationResults,
        data: [],
        total: 0,
    }
  }

  componentDidMount() {
    this.analyzeSimulationResults(this.state.simulationResults);
  }

  componentDidUpdate(prevProps) {
      if (prevProps.needsUpdate !== this.props.needsUpdate) {
        this.analyzeSimulationResults(this.props.simulationResults);
        this.props.finishUpdating();
      }
  }

  analyzeSimulationResults = (results) => {
      let total = results.length;
      let numOfPrizesWon = 0;
      for (let i=0; i<total; i++) {
          if (results[i].numOfPrizesWon) {
              numOfPrizesWon++;
          }
      }
      let data = [
          {
              title: "Number of Prizes Won: ",
              value: numOfPrizesWon,
              percentage: (numOfPrizesWon/total)*100,
              color: "green"
          },
          {
              title: "Number of Prizes Lost: ",
              value: total - numOfPrizesWon,
              percentage: ((total - numOfPrizesWon)/total)*100,
              color: 'red'
          }
      ]
      this.setState({
          data: data,
          total: total
      })
  }

  showData = () => {
      let dataDisplay = [];
      if (this.state.total === 0) {
        dataDisplay.push(
            <h3 key={1}>No results yet</h3>
        )
      }
      else {
        for (let i=0; i<this.state.data.length; i++) {
            dataDisplay.push(
                <div key={i} className="dataRow">
                    <h3>{this.state.data[i].title}</h3>
                    <h2 style={{color:this.state.data[i].color}}>
                        {this.state.data[i].value + " (" + this.state.data[i].percentage + "%)"}
                    </h2>
                </div>
            )
        }
      }
      return <div id="analytics">{dataDisplay}</div>
  }

  render() {
    return (
      this.showData()
    );
  }
}

export default Analytics;
