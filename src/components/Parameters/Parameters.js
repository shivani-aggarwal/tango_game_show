import React from 'react';
import TextField from '@mui/material/TextField';
import './Parameters.css'

class Parameters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        parameters: this.props.parameters ? this.props.parameters : {},
        updateParameters: this.props.updateParameters ? this.props.updateParameters : ()=>{},
    }
  }

  showParameters = () => {
    let parameterNames = Object.keys(this.state.parameters);
    let parameters = [];
    for (let i=0; i<parameterNames.length;i++) {
        let options = this.getOptions(parameterNames[i]);
        parameters.push(
            <div key={parameterNames[i]} className='parameterRow'>
                <TextField
                    type={options.type}
                    label={options.label}
                    value={options.value ? options.value : this.state.parameters[parameterNames[i]]}
                    multiline={options.multiline}
                />
            </div>
        )
    }

    return <div>{parameters}</div>
  }

  getOptions = (parameter) => {
      let options = {};
      switch(parameter) {
            case 'numOfGames':
                options.label = "Number of Game Rounds:";
                options.type = "number";
                break;
            case 'numOfBriefcases':
                options.label = "Number of Briefcases:";
                options.type = "number";
                break;
            case 'arePrizeLocationsKnown':
                options.label = "Prize Locations Known by Host:";
                options.type = "text";
                break;
            case 'gameTurns':
                options.label = "Game Turn Format:";
                options.type = "text";
                options.value = JSON.stringify(this.state.parameters[parameter]);
                options.multiline = true;
                break;
            case 'numOfPrizes':
                options.label = "Number of Prizes:";
                options.type = "number";
                break;
            case 'canBriefcaseContainMultiplePrizes':
                options.label = "Briefcase Can Contain Multiple Prizes:";
                options.type = "text";
                break;
            default:
                break;
      }
      return options;
  }

  render() {
    return (
      this.showParameters()
    );
  }
}

export default Parameters;
