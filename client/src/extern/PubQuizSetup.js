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
    this.setState({
      completedSettings: true,
    });
  }

  handleBackClick = () => {
    this.setState({completedSettings: false});
  }

  callbackFunction = (rCount) => {
    if (this.state.completedSettings == false) {
      this.setState({roundCount: rCount, completedSettings: true});
      return;
    }
    this.setState({roundCount: rCount, completedSettings: false});
  }

  render() {
    const completedSettings = this.state.completedSettings;
    const roundCount = this.state.roundCount;
    let buttonDash = <Back text="&larr; back" link="/dashboard"/>

    if (completedSettings) {
      return (
        <section className="pubq scroll" >
          <div className="pubq__background"></div>
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
