import React from 'react';
import './Header.css';

  class Header extends React.Component {
  render() {
    return(
    <header className="header">
      <img className="header__img" src="/img/logo.png" alt="Bonq Logo" />
    </header>
  );
  };
};

export default Header;
