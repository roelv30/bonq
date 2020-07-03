import React from 'react';
import {NavLink} from 'react-router-dom';
import './Back.css';

//Use this component for a back button with following props:
//- Link: link of page you want to return to
//- Text: text that shows inside of button

const  Back = (props) => {
  return(
      <NavLink exact className="back" activeClassName="active" to={props.link}>
      {props.text}
      </NavLink>
    );
}

export default Back;
