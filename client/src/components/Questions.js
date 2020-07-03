import React, {useEffect, useRef} from "react";
import Switch from "react-switch";
import io from "socket.io-client";

const Questions = (props) => {
    console.log(props.questions);
    // roundNumber
    if(props.questions.length > 0){
        return (

            <section>
                <li> {props.questions[props.roundNumber][props.questionNumber].question}</li>
                {/*{props.questions[props.roundNumber].map(({ question, index }) => (*/}
                {/*    <li key={props.questionNumber}>{question}</li>*/}
                {/*))}*/}

            </section>

        );
    }else{
        return null;
    }

};

export default Questions;
