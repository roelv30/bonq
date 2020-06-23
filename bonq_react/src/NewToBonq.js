import React from 'react';
import {NavLink} from 'react-router-dom';
import './NewToBonq.css';

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
