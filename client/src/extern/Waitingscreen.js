import React from 'react';
import '../extern/Waitingscreen.css';
const Waitingscreen = () =>{

    return(
      <article className="waitingscreen">
        <section className="waitingscreen__imageholder">
          <img style={{animation: `leftBear 1.5s linear infinite alternate`}} className="waitingscreen__imageholder__image" src="/img/winner.png" alt="Golden bear"/>
          <img style={{animation: `middleBear 1.5s linear infinite alternate`}} className="waitingscreen__imageholder__image" src="/img/runnerup.png" alt="Silver bear"/>
          <img style={{animation: `rightBear 1.5s linear infinite alternate`}} className="waitingscreen__imageholder__image" src="/img/third.png" alt="Bronze bear"/>
        </section>
        <section className="waitingscreen__textholder">
          <h2>The Host is checking your answers!</h2>
          <h3>Please be patient</h3>
        </section>
      </article>
    );
}

export default Waitingscreen;
