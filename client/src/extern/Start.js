import React from 'react';
import PinInput from 'react-pin-input';
import {NavLink, Redirect} from 'react-router-dom';
import './Start.css';
import NewToBonq from './NewToBonq';

//This component is used for the start page where a user can decide to join a game or log in
class Start extends React.Component {
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

  render() {

    // Cannot access start when already logged in
    if (this.props.isAuthenticated) {
      return (
        <Redirect to='/dashboard'/>
      );
    };

    return (
      <section className="start">
        <div className="background"></div>
        <article className="start__article">
          <p className="start__article__description">Welcome to bonq, your social gaming platform. Play games like pubquiz with voice- & videochat!</p>
          <h1 className="start__article__title">Join Room & Play!</h1>
          <form id="inputCode" onSubmit={this.joinRoom} ref={ (ref) => { this.form = ref; } }>
            <PinInput
              className= "start__article__input"
              length={6}
              initialValue=""
              onChange={this.onChange}
              type="numeric"
              onComplete={(value, index) => {this.form.dispatchEvent(new Event('submit'))}}
            />
            <button className="start__article__button"
                    type="submit"
                    value="Join Game &#9654;"
                    disabled={!this.state.value}>Join Game &#9654;</button>
          </form>
        </article>

        <article className="start__article">
          <p className="start__article__or">
            <span className="start__article__or__text"> or </span>
          </p>
          <NavLink exact activeClassName="active" className="start__article__button pink" to="/login">
    				Log in to Host
    			</NavLink>
  			  <NewToBonq text="New to bonq?" link="/register" linktext="Sign up for free!" />
        </article>
      </section>
    )
  }
};

export default Start;
