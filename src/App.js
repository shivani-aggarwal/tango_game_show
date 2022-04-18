import React from 'react';
import Parameters from './components/Parameters/Parameters';
import Simulation from './components/Simulation/Simulation';
import Analytics from './components/Analytics/Analytics';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    const initialParameters = {
      numOfGames: 2000,
      numOfBriefcases: 3,
      arePrizeLocationsKnown: true,
      gameTurns: [
        {
          type: 'choose',
          num: 1
        },
        {
          type: 'eliminate',
          num: 1,
        }, 
        {
          type: 'switch',
          num: 1,
          choice: 'random',
        },
        {
          type: 'reveal',
        }
      ],
      numOfPrizes: 1,
      canBriefcaseContainMultiplePrizes: false,
    }
    this.state = {
      parameters: initialParameters,
      simulationResults: [],
      needToUpdateAnalytics: false,
    }
  }

  updateParameters = (newParameters) => {
    this.setState({
      parameters: newParameters
    })
  }

  updateSimulationResults = (newSimulationResults) => {
    this.setState({
      simulationResults: newSimulationResults,
      needToUpdateAnalytics: true
    })
  }

  finishUpdatingAnalytics = () => {
    this.setState({
      needToUpdateAnalytics: false
    })
  }

  render() {
    return (
      <div>
        <header>
          <h1>Tango Game Show Network</h1>
        </header>
        <div className='body'>
          <div className='leftColumn'>
            <h2>Parameters</h2>
            <Parameters parameters={this.state.parameters} updateParameters={this.updateParameters}/>
            <Simulation parameters={this.state.parameters} updateSimulationResults={this.updateSimulationResults}/>
          </div>
          <div className='rightColumn'>
            <h2>Tango Analytics</h2>
            <Analytics simulationResults={this.state.simulationResults} needsUpdate={this.state.needToUpdateAnalytics} finishUpdating={this.finishUpdatingAnalytics}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
