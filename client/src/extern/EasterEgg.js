import React from 'react';
import Back from './Back';

// Creates page for easter egg flashgames based on title in prop
const EasterEgg = (props) =>{
    const game = props.location.gameProps.game;
    return (
      <section className="join">
        <Back text="&larr; back" link="/dashboard"/>
        <article className="join__article">
          <embed className="join__article__easteregg" src={game +".swf"} type="application/x-shockwave-flash"></embed>
        </article>
      </section>
    )
};

export default EasterEgg;
