import React from 'react';
import PinInput from 'react-pin-input';
import './JoinGame.css';
import Back from './Back';

//This component is used for the Join Game page for a logged in user
class JoinGame extends React.Component {
  state= {
    value: ""
  };

//Join a room with number from inputfield
  joinRoom = e => {
    e.preventDefault();
    this.props.history.push('r/' + this.state.value );
    window.location.reload();
  };

//Update value state based on numbers in inputfield
  onChange = value => {
    this.setState({value});
  };

//When using random button generate random number for random game
  setRoom = () => {
      const min = 100000;
      const max = 999999;
      const rand = min + Math.random() * (max - min);
      const fixedRandom  =  Number((rand).toFixed(0));

      this.setState({value: fixedRandom})


     this.props.history.push('r/' + fixedRandom );
      window.location.replace("/r/" + fixedRandom);
  }



  render() {
    return (
      <section className="join">
        <div className="background"></div>
        <Back text="&larr; back" link="/dashboard"/>
        <article className="join__article">
          <h1 className="join__article__title--pink">Pubquiz</h1>
          <h1 className="join__article__title">Enter a code to join a game</h1>
          <img className='join__article__img' src="/img/arrow-down.svg" alt="Arrow pointing down" />
          <form id="inputCode" onSubmit={this.joinRoom} ref={ (ref) => { this.form = ref; } }>
            <PinInput className= "join__article__input"
                      length={6}
                      initialValue=""
                      onChange={this.onChange}
                      type="numeric"
                      required
                      onComplete={(value, index) => {this.form.dispatchEvent(new Event('submit'))}}
            />
            <button className="join__article__button"
                    type="submit"
                    value="Join Game &#9654;"
                    disabled={!this.state.value}>Join Game &#9654;</button>
          </form>
        </article>

        <article className="join__article">
          <p className="join__article__or">
            <span className="join__article__or__text"> or </span>
          </p>
          <img src="/img/dice.svg" alt="Dice Icon" className="join__article__img"/>
          <h1 className="join__article__title">Enter a game with random people </h1>
          <button className="join__article__button--random" onClick={this.setRoom} >Join Random Game </button>
        </article>
      </section>
    )
  }
};

export default JoinGame;
