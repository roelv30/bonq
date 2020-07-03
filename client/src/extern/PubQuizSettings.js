import React from 'react';
import NumericInput from 'react-numeric-input';
import './Start.css';
import './PubQuizSetup.css';
import './Register.css';

class PubQuizSettings extends React.Component {
//settings inputs(rounds and teams etc)
  // standardValue = 1;

  state = {
    roundCount: 1,
    teamCount: 1,
  }

  sendData = () => {
    let localRoundCount;
    if (this.state.roundCount > 10) {
      localRoundCount = 10;
    } else {
      localRoundCount = this.state.roundCount;
    }
    this.props.parentCallback(localRoundCount);
  }

  handleRoundChange = (props) => {
    // console.log(props);
    // this.setState({roundCount: [props]});
    this.state.roundCount = props;
  }

  handleTeamChange = (props) => {
    // this.setState({teamCount: [props]});
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

function ProceedButton(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      Next
    </button>
  );
}

export default PubQuizSettings;
