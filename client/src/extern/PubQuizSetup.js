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
  // <<<summary>>>

  constructor(props){         // use constructor to immediatley assign props
    super(props);
    this.handleParseSettingsClick = this.handleParseSettingsClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.state = {
      completedSettings: false,         // boolean to track if eligible to change component
      roundCount: 0,                    // track round count in parent to pass to next component
    };
  }

  handleParseSettingsClick = () => {          // update state when user is done
    this.setState({completedSettings: true,});
  }

  handleBackClick = () => {          // update state when user is done
    this.setState({completedSettings: false});
  }

  callbackFunction = (rCount) => {          // callback function for children to parse states back to parent
    if (this.state.completedSettings == false) {
      this.setState({roundCount: rCount, completedSettings: true});
      return;
    }
    this.setState({roundCount: rCount, completedSettings: false});
  }

  render() {
    const completedSettings = this.state.completedSettings;
    const roundCount = this.state.roundCount;
    let buttonDash = <Back text="&larr; back" link="/dashboard"/>         // if you're somewhere you don't want to be then you can go back *thumbs up*

    if (completedSettings) {          // switch components based on completed state
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

export default PubQuizSetup;
