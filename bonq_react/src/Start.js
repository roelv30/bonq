import React from 'react';
import PinInput from 'react-pin-input';
import {NavLink} from 'react-router-dom';

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
      <section>

        <header>
          <img src="/img/logo.png" alt="Bonq Logo" />
        </header>

        <article>
          <h1>Join Room & Play!</h1>
          <form id="start__join" onSubmit={this.onSubmit}>
            <PinInput
                      length={6}
                      initialValue=""
                      onChange={this.onChange}
                      type="numeric"
                      onComplete={(value, index) => {
                        console.log(value);
                        // const form = document.getElementById("start__join");
                        // form.submit();
                        // this.refs.form.getDOMNode().dispatchEvent(new Event("submit"));
                      }}
            />
            <input type="submit" value="Join &#9654;" />
            </form>
        </article>
          <article>
          <h3> or </h3>
          <NavLink exact activeClassName="active" to="/login">
    				Login
    			</NavLink>

          <h3> New to bonq? </h3>
          <NavLink exact activeClassName="active" to="/register">
            Sign up for free!
          </NavLink>
          </article>
        </section>
    )
  }
};

export default Start;
