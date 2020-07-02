import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../extern/Waitingscreen.css';

class Waitingscreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      speed: 1,
    }
  }

  // style={{animation: `spin ${this.state.speed}s linear infinite`}}

  render(){



    return(
      <article className="waitingscreen">
        <section className="waitingscreen__imageholder">
          <img style={{animation: `leftBear ${this.state.speed}s linear infinite alternate`}} className="waitingscreen__imageholder__image" src="/img/winner.png" alt="Golden bear"/>
          <img className="waitingscreen__imageholder__image" src="/img/runnerup.png" alt="Silver bear"/>
          <img className="waitingscreen__imageholder__image" src="/img/third.png" alt="Bronze bear"/>
        </section>
      </article>
    );
  }

}

export default Waitingscreen;
