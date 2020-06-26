import React from 'react';

class PubQuizSetup extends React.Component {
//container for settings (rounds and teams etc)

constructor(props) {
  super(props);
  this.handleParseSettingsClick = this.handleParseSettingsClick.bind(this);
  this.handleBackClick = this.handleBackClick.bind(this);
  this.state = {completedSettings: false};
}

handleParseSettingsClick() {
  this.setState({completedSettings: true});
}

handleBackClick() {
  this.setState({completedSettings: false});
}

render() {
  const completedSettings = this.state.completedSettings;
  let button;
    if (completedSettings) {
      button = <LogoutButton onClick={this.handleBackClick} />;
    } else {
      button = <LoginButton onClick={this.handleParseSettingsClick} />;

    }
    return (
      <div>
        <SettingsContainer completedSettings={completedSettings} />
        {button}
      </div>
    );
  }
}

//make seperate component amos - reminder
function SettingsContainer(props) {
  const completedSettings = props.completedSettings;
  if (completedSettings) {
    // return <componentA />;
  }
  // return <componentB />;
}

export default PubQuizSetup;
