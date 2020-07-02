import React from 'react';
import PubQuizQuestionsForm from './PubQuizQuestionsForm';
import PubQuizSettings from './PubQuizSettings';
import './PubQuizSetup.css';
import './Back.css';
import Back from './Back';
import './JoinGame.css'
import '../App.css';
import SocketContext from '../components/SocketContext';


class PubQuizSetup extends React.Component {
//container for settings (rounds and teams etc)

  constructor(props){
    super(props);
    this.handleParseSettingsClick = this.handleParseSettingsClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.state = {
      completedSettings: false,
      roundCount: 8,
    };
  }

  handleParseSettingsClick = () => {
    // console.log("parse complete ");
    this.setState({
      completedSettings: true,
    });
  }

  handleBackClick = () => {
    this.setState({completedSettings: false});
  }

  callbackFunction = (rCount) => {
    // console.log("state before callback exec: ");
    // console.log(this.state.completedSettings);

    if (this.state.completedSettings == false) {
      // console.log("settings are completed");
      // console.log(this.state.completedSettings);
      this.setState({roundCount: rCount, completedSettings: true});
      return;
    }
    // console.log("settings are not completed");
    this.setState({roundCount: rCount, completedSettings: false});

    // console.log(this.state.completedSettings);
  }

  render() {
    const completedSettings = this.state.completedSettings;
    const roundCount = this.state.roundCount;

    // let button;

    // if (completedSettings) {
    //   button = <GoBackButton onClick={this.handleBackClick} />;
    // } else {
    //   button = <ProceedButton parentCallback={this.callbackFunction} onClick={ this.handleParseSettingsClick} />;
    // }
    let buttonDash = <Back text="&larr; back" link="/dashboard"/>

    if (completedSettings) {
      return (
        <section className="pubq scroll" >
          <div className="background"></div>
          <SocketContext.Consumer>
            {socket => <PubQuizQuestionsForm parentCallback={this.callbackFunction} roundCount={roundCount} completedSettings={completedSettings} socket={socket} history={this.props.history} />}
          </SocketContext.Consumer>

        </section>
      );
    } else{
      return (
        <section className="pubq scroll" >
          <div className="background"></div>
          { buttonDash }

          <PubQuizSettings parentCallback={this.callbackFunction} roundCount={roundCount} completedSettings={completedSettings} />
        </section>
      );
    }

  }
}

//make seperate component? - reminder
// function SettingsContainer(props) {
//   const completedSettings = props.completedSettings;
//   const locRoundCount = props.roundCount;
//   const callbackFunction = props.callbackFunction
//   console.log(completedSettings);
//   if (completedSettings) {
//     // return <componentB />;
//     return <PubQuizQuestionsForm roundCount={locRoundCount}/>
//   }
//   // return <componentA />;
//   return <PubQuizSettings />
// }

function ProceedButton(props) {
  return (
    <button onClick={props.onClick}>
      Next
    </button>
  );
}

function GoBackButton(props) {
  return (
    <button onClick={props.onClick}>
      Go Back
    </button>
  );
}

export default PubQuizSetup;
