import React from 'react';
import Button from '@mui/material/Button';

class Simulation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        parameters: this.props.parameters ? this.props.parameters : {},
        updateSimulationResults: this.props.updateSimulationResults ? this.props.updateSimulationResults : ()=>{},
        simulationResults: [],
        gameInfo: {
            id: 0,
            briefcases: [],
            numOfPrizesWon: 0,
        },
        numOfGamesPlayed: 0,
        simulationInProgress: false,
    }
  }

  runSimulation = async () => {
    this.setState({
        simulationInProgress: true,
    })
    for (let i=0; i<this.state.parameters.numOfGames; i++) {
       await this.startGame();
    }
    this.setState({
        simulationResults: [],
        gameInfo: {
            id: 0,
            briefcases: [],
            numOfPrizesWon: 0,
        },
        numOfGamesPlayed: 0,
        simulationInProgress: false
    })
  }

  startGame = async () => {
    this.createBriefcases(this.state.parameters.numOfBriefcases);
    this.addPrizesToBriefcases(this.state.parameters.numOfPrizes);
    this.completeTurns();
  }

  endGame = () => {
    let simulationResults = this.state.simulationResults;
    simulationResults.push({
        numOfPrizesWon: this.state.gameInfo.numOfPrizesWon
    });
    let numOfGamesPlayed = this.state.numOfGamesPlayed + 1;
    let newGameId = this.state.gameInfo.id + 1;

    this.state.updateSimulationResults(simulationResults);
    this.setState({
        simulationResults: simulationResults,
        gameInfo: {
            id: newGameId,
            briefcases: [],
            numOfPrizesWon: 0,
        },
        numOfGamesPlayed: numOfGamesPlayed,
    });
  }

  completeTurns = () => {
    for (let i=0; i<this.state.parameters.gameTurns.length; i++) {
        let turnInfo = this.state.parameters.gameTurns[i];   
        switch(turnInfo.type) {
            case 'choose':
                this.chooseBriefcases(turnInfo.num);
                break;
            case 'eliminate':
                this.eliminateBriefcases(turnInfo.num, !this.state.parameters.arePrizeLocationsKnown);
                break;
            case 'switch':
                let choice = turnInfo.choice;
                if (choice === 'random') {
                    let choiceNum = this.generateRandomNumber(0,1);
                    if (choiceNum === 1) {
                        choice = "switch";
                    } else {
                        choice = 'keep';
                    }
                }
                this.switchBriefcases(turnInfo.num, choice);
                break;
            case 'reveal':
                this.revealBriefcases();
                break;
            default:
                break;
        }
    }
  }

  createBriefcases = (num) => {
    let briefcases = [];
    for (let i=0; i<num; i++) {
        let briefcase = {
            id: i,
            containsPrize: false,
            isEliminated: false,
            isChosen: false,
            prize: {}
        }
        briefcases.push(briefcase);
    }
    let gameInfo = this.state.gameInfo;
    gameInfo.briefcases = briefcases;
    this.setState({
        gameInfo: gameInfo
    })
  }

  // min and max inclusive
  generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min +1)) + min;
  }

  addPrizesToBriefcases = (num) => {
    let briefcases = this.state.gameInfo.briefcases;
    let availableBriefcases = this.state.gameInfo.briefcases;
    if (!this.state.parameters.canBriefcaseContainMultiplePrizes) {
        availableBriefcases = this.state.gameInfo.briefcases.filter(briefcase => {
            return briefcase.containsPrize === false;
        })
    }
    for (let i=0; i<num; i++) {
        let prize = {
            id: i
        }
        let briefcaseId = availableBriefcases[this.generateRandomNumber(0, availableBriefcases.length-1)].id;
        briefcases[briefcaseId].containsPrize = true;
        briefcases[briefcaseId].prize = prize;
        availableBriefcases = availableBriefcases.filter(briefcase => {
            return briefcase.id === briefcaseId;
        }) 
    }
    let gameInfo = this.state.gameInfo;
    gameInfo.briefcases = briefcases;
    this.setState({
        gameInfo: gameInfo
    })
  }

  chooseBriefcases = (num) => {
    let briefcases = this.state.gameInfo.briefcases;
    let availableBriefcases = this.state.gameInfo.briefcases.filter(briefcase => {
        return briefcase.isChosen === false;
    })
    for (let i=0; i<num; i++) {
        let briefcaseId = availableBriefcases[this.generateRandomNumber(0, availableBriefcases.length-1)].id;
        briefcases[briefcaseId].isChosen = true;
        availableBriefcases = availableBriefcases.filter(briefcase => {
            return briefcase.id === briefcaseId;
        }) 
    }
    let gameInfo = this.state.gameInfo;
    gameInfo.briefcases = briefcases;
    this.setState({
        gameInfo: gameInfo
    })
  }

  switchBriefcases = (num, choice) => {
    if (choice === 'keep') {
        return;
    } 
    let briefcases = this.state.gameInfo.briefcases;
    let chosenBriefcases = this.state.gameInfo.briefcases.filter(briefcase => {
        return briefcase.isChosen === true;
    })
    for (let i=0; i<num; i++) {
        let oldBriefcaseId = chosenBriefcases[this.generateRandomNumber(0, chosenBriefcases.length-1)].id;
        let availableBriefcases = this.state.gameInfo.briefcases.filter(briefcase => {
            return briefcase.isChosen === false;
        })
        briefcases[oldBriefcaseId].isChosen = false;
        let newBriefcaseId = availableBriefcases[this.generateRandomNumber(0, availableBriefcases.length-1)].id;
        briefcases[newBriefcaseId].isChosen = true;
        chosenBriefcases = this.state.gameInfo.briefcases.filter(briefcase => {
            return briefcase.isChosen === true;
        })
    }
    let gameInfo = this.state.gameInfo;
    gameInfo.briefcases = briefcases;
    this.setState({
        gameInfo: gameInfo
    })
  }

  eliminateBriefcases = (num, shouldEliminateWithPrize) => {
    let briefcases = this.state.gameInfo.briefcases;
    let availableBriefcases = this.state.gameInfo.briefcases.filter(briefcase => {
        let condition = briefcase.isChosen === false && !briefcase.containsPrize;
        if (shouldEliminateWithPrize) {
            condition = briefcase.isChosen === false;
        }
        return condition;
    })
    for (let i=0; i<num; i++) {
        let briefcaseId = availableBriefcases[this.generateRandomNumber(0, availableBriefcases.length-1)].id;
        briefcases[briefcaseId].isEliminated = true;
        availableBriefcases = availableBriefcases.filter(briefcase => {
            return briefcase.id === briefcaseId;
        }) 
    }
    let gameInfo = this.state.gameInfo;
    gameInfo.briefcases = briefcases;
    this.setState({
        gameInfo: gameInfo
    })
  }

  revealBriefcases = () => {
    let chosenBriefcases = this.state.gameInfo.briefcases.filter(briefcase => {
        return briefcase.isChosen === true;
    })
    let numOfPrizesWon = 0;
    for (let i=0; i<chosenBriefcases.length; i++) {
        if (chosenBriefcases[i].containsPrize) {
            numOfPrizesWon++;
        }
    } 
    let gameInfo = this.state.gameInfo;
    gameInfo.numOfPrizesWon = numOfPrizesWon;
    this.setState({
        gameInfo: gameInfo
    }, () => {
        this.endGame();
    })
  }

  render() {
    return (
      <div>
        <Button
            variant='contained'
            disabled={this.state.simulationInProgress}
            onClick={this.runSimulation}
        >
            {this.state.simulationInProgress ? "Running Simulation..." : "Run Simulation"}
        </Button>
      </div>
    );
  }
}

export default Simulation;
