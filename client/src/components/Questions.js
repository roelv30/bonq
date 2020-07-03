import React, {useEffect, useRef} from "react";
import Switch from "react-switch";
import io from "socket.io-client";
import Share from '../extern/Share';

const Questions = (props) => {
    // roundNumber
    if(props.questions.length > 0){
        return (

            <section className="vraag__post">
                <h4 className="vraag__post__title"> {props.questions[props.roundNumber][props.questionNumber].question}</h4>
                {/*{props.questions[props.roundNumber].map(({ question, index }) => (*/}
                {/*    <li key={props.questionNumber}>{question}</li>*/}
                {/*))}*/}
            </section>

        );
    }else{
      if(props.playerRole === "host") {
        return (
          <section className="vraag__post">
          <h4>Room Code: <span className="vraag__post__code">{props.roomID}</span></h4>
          <p>When you're ready to play, click 'Get Questions'.</p>
          <Share/>
          </section>
        );
      } else {
        return(
          <section className="vraag__post">
          <img className="vraag__post__loading" src="/img/loading.gif"/>
          <h4 className=""> The host is preparing...</h4>
          </section>
        )
      }
    }
};

export default Questions;
