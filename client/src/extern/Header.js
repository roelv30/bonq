import React from 'react';
import './Header.css';
var myProps;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  //Set props on update
  componentDidUpdate(prevProps, prevState){
    if (prevProps.token !== this.props.token) {
      myProps = this.props;
    }
  };

// Function that uses the logout function defined in App.js [logout()]
  handleLogout(event) {
    event.preventDefault();
    myProps.logout();
  };


// Header shows only bonq logo when not logged in
// When user is logged in the logout button wil be operable
  render() {
    return(
        <header className="header">
          <a className="header__img" href="/">
            <img className="header__img" src="/img/logo.png" alt="Bonq Logo" />
          </a>
          {this.props.isAuthenticated ?
            <a className="header__logout" href="/" onClick={this.handleLogout}>
            Logout
            </a>
            :
            null
          }
        </header>
      )

  }
};

export default Header;
