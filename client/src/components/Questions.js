import React, {useEffect, useRef} from "react";
import Switch from "react-switch";
import io from "socket.io-client";

const Questions = (props) => {
    console.log(props.questions);
    if(props.questions.length > 0){
        return (

            <section className="vraag__post">
                <h4 className="vraag__post__title"> {props.questions[props.roundNumber][props.questionNumber].question}</h4>
            </section>

        );
    }else{
        return null;
    }
};

export default Questions;
