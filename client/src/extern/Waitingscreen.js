import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../extern/Waitingscreen.css';

class Waitingscreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      speed: 1.5,
    }
  }

  // style={{animation: `spin ${this.state.speed}s linear infinite`}}

  render(){

    return(
      <article className="waitingscreen">
        <section className="waitingscreen__imageholder">
          <img style={{animation: `leftBear ${this.state.speed}s linear infinite alternate`}} className="waitingscreen__imageholder__image" src="/img/winner.png" alt="Golden bear"/>
          <img style={{animation: `middleBear ${this.state.speed}s linear infinite alternate`}} className="waitingscreen__imageholder__image" src="/img/runnerup.png" alt="Silver bear"/>
          <img style={{animation: `rightBear ${this.state.speed}s linear infinite alternate`}} className="waitingscreen__imageholder__image" src="/img/third.png" alt="Bronze bear"/>
        </section>

        <section className="waitingscreen__textholder">
          <h2>The Host is checking your answers!</h2>
          <h3>Please be patient</h3>
        </section>
      </article>
    );
  }

}

export default Waitingscreen;