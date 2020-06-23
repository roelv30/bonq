import React from 'react';
import {NavLink} from 'react-router-dom';
import './Back.css';

const  Back = () => {
  return(
      <NavLink exact className="back" activeClassName="active" to="/">
        &larr; back to start
      </NavLink>
    );
}

export default Back;
