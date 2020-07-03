import React from 'react';
import NumericInput from 'react-numeric-input';
import './Start.css';
import './PubQuizSetup.css';
import './Register.css';

class PubQuizSettings extends React.Component {
  // component to parse desired rounds and team count

  state = {
    roundCount: 1,          // at least one round
    teamCount: 1,           // at least one team
  }

  sendData = () => {          // parse data back to parent via props, PubQuizSetup.js,
    this.props.parentCallback(this.state.roundCount);
  }

  handleRoundChange = (props) => {          // store input value into state
    this.state.roundCount = props;
  }

  handleTeamChange = (props) => {          // store input value into state
    this.state.teamCount = props;
  }

  render(){
    let button = <ProceedButton className="pubq__article__button pubq__article__button-next" onClick={ this.sendData } />
    return (
      <section className="pubq__settings__cont">
        <form className="pubq__settings__cont__form">
          <label className="login__article__form__label" htmlFor="rounds">Rounds:
            <NumericInput className="pubq__settings__cont__form__input" onChange={this.handleRoundChange} name="rounds" min={1} max={10} value={1}/>
          </label>
          <label className="login__article__form__label" htmlFor="teams">Teams:
            <NumericInput className="pubq__settings__cont__form__input" onChange={this.handleTeamChange} name="teams" min={1} max={10} value={1}/>
          </label>
          </form>
          { button }
      </section>
    )
  }
}

function ProceedButton(props) {         // button to trigger function callback to parent, for switching components
  return (
    <button className={props.className} onClick={props.onClick}>
      Next
    </button>
  );
}

export default PubQuizSettings;
