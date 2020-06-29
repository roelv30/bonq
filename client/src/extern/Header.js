import React from 'react';
import './Header.css';
var myProps;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.token !== this.props.token) {
      myProps = this.props;
    }
  };

  handleLogout(event) {
    event.preventDefault();
    myProps.logout();
  };

  render() {
    if(this.props.isAuthenticated) {
      return (
        <header className="header">
          <a className="header__logout" href="/" onClick={this.handleLogout}>
            Logout
          </a>
          <img className="header__img" src="/img/logo.png" alt="Bonq Logo" />
        </header>
      )
    } else {
      return(
        <header className="header">
          <img className="header__img" src="/img/logo.png" alt="Bonq Logo" />
        </header>
      )
    }
  }
};

export default Header;
