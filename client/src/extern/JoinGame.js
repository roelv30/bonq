import React from 'react';
import PinInput from 'react-pin-input';
import {NavLink} from 'react-router-dom';
import './JoinGame.css';
import NewToBonq from './NewToBonq';
import Home from "../components/Home";
import Back from './Back';

class JoinGame extends React.Component {
  state= {
    value: ""
  };

  joinRoom = e => {
        e.preventDefault();
        this.props.history.push('r/' + this.state.value );
    };

  onChange = value => {
    this.setState({value});
  };



  render() {
    return (
      <section className="join">
        <div className="background">
       </div>

        <Back />
        <article className="join__article">
          <h1 className="join__article__title">Enter a code to join a game</h1>
          <img className='join__article__img' src="/img/arrow-down.svg" alt="Arrow pointing down" />
          <form id="inputCode" onSubmit={this.joinRoom} ref={ (ref) => { this.form = ref; } }>
            <PinInput
              className= "join__article__input"
              length={6}
              initialValue=""
              onChange={this.onChange}
              type="numeric"
              onComplete={(value, index) => {
               // console.log(value);
                  this.form.dispatchEvent(new Event('submit'))
              }}
            />
            <input className="join__article__button" type="submit" value="Join Game &#9654;" />
            </form>
        </article>

        <article className="join__article">
          <p className="join__article__or">
            <span className="join__article__or__text"> or </span>
          </p>
        <img src="/img/dice.svg" alt="Dice Icon" className="join__article__img"/>
        <h1 className="join__article__title">Enter a game with random people </h1>
        <button className="join__article__button--random">Join Random Game </button>

        </article>
      </section>
    )
  }
};

export default JoinGame;
