import React from 'react';
import {NavLink} from 'react-router-dom';
import './Back.css';

const  Back = (props) => {
  return(
      <NavLink exact className="back" activeClassName="active" to={props.link}>
      {props.text}
      </NavLink>
    );
}

export default Back;

