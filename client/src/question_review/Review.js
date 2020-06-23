import React from 'react';
import ReactDOM from 'react-dom';
import {Switch , Route, Link} from 'react-router-dom';

export default class Review extends React.Component {
  state = {}

  render() {
    return(
      <section>
        <h1>Hallo</h1>
        <Link to="/succes">Back to succes page</Link>
      </section>
    );
  }
}
