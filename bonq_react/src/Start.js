import React from 'react';
import PinInput from 'react-pin-input';
import {NavLink} from 'react-router-dom';
import './Start.css';
import NewToBonq from './NewToBonq';

class Start extends React.Component {
  state= {
    value: ""
  };

  onChange = value => {
    this.setState({value});
  }

  onSubmit = event => {
    event.preventDefault();
    console.log(this.state.value);
  }

  render() {
    return (
      <section className="start">
        <div className="background">
       </div>
        <article className="start__article">
          <h1 className="start__article__title">Join Room & Play!</h1>
          <form id="inputCode" onSubmit={this.onSubmit}>
            <PinInput
              className= "start__article__input"
              length={6}
              initialValue=""
              onChange={this.onChange}
              type="numeric"
              onComplete={(value, index) => {
                console.log(value);
                // const form = document.getElementById("inputCode");
                // form.submit();
                // this.refs.form.getDOMNode().dispatchEvent(new Event("submit"));
              }}
            />
            <input className="start__article__button" type="submit" value="Join Game &#9654;" />
            </form>
        </article>

        <article className="start__article">
          <p className="start__article__or">
            <span className="start__article__or__text"> or </span>
          </p>
          <NavLink exact activeClassName="active" className="start__article__button" to="/login">
    				Log in to Host
    			</NavLink>
  			  <NewToBonq text="New to bonq?" link="/register" linktext="Sign up for free!" />
        </article>
      </section>
    )
  }
};

export default Start;
