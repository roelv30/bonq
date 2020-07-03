import React from 'react';
import {NavLink} from 'react-router-dom';
import './NewToBonq.css';


// Use this component for a link & text with the following props:
//- Link: link of page you want to go to
//- Text: text that shows inside of button
const  NewToBonq = (props) => {
  return(
      <section className="new">
        <p className="new__text"> {props.text} </p>
        <NavLink exact activeClassName="active" className="new__link" to={props.link}>
          {props.linktext}
        </NavLink>
      </section>
    );
}

export default NewToBonq;
