import React from 'react';
import PubQuizQuestionsForm from './PubQuizQuestionsForm';
import PubQuizSettings from './PubQuizSettings';

class PubQuizSetup extends React.Component {
//container for settings (rounds and teams etc)

constructor(props) {
  super(props);
  this.handleParseSettingsClick = this.handleParseSettingsClick.bind(this);
  this.handleBackClick = this.handleBackClick.bind(this);
  this.state = {
    completedSettings: false,
    roundCount: 8,
  };
}

handleParseSettingsClick() {
  this.setState({completedSettings: true});
}

handleBackClick() {
  this.setState({completedSettings: false});
}

render() {
  const completedSettings = this.state.completedSettings;
  const roundCount = this.state.roundCount;
  let button;
    if (completedSettings) {
      button = <GoBackButton onClick={this.handleBackClick} />;
    } else {
      button = <ProceedButton onClick={this.handleParseSettingsClick} />;
    }

    if (completedSettings) {
      return (
        <div>
          {button}
          <SettingsContainer roundCount={roundCount} completedSettings={completedSettings} />
        </div>
      );
    } else{
      return (
        <div>
          <SettingsContainer roundCount={roundCount} completedSettings={completedSettings} />
          {button}
        </div>
      );
    }

  }
}

//make seperate component? - reminder
function SettingsContainer(props) {
  const completedSettings = props.completedSettings;
  const locRoundCount = props.roundCount;
  console.log(completedSettings);
  if (completedSettings) {
    // return <componentB />;
    return <PubQuizQuestionsForm roundCount={locRoundCount}/>
  }
  // return <componentA />;
  return <PubQuizSettings />
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
