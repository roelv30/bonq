import React from 'react';
import ReactDOM from 'react-dom';
import {Switch , Route, Link} from 'react-router-dom';
import axios from 'axios';
import Back from '../extern/Back';
import '../question_review/Review.css';
import io from "socket.io-client";
import SocketContext from '../components/SocketContext'

// useEffect(() => {
//
//
//
//
//
//
// }, []);

const roomid = 0;
let  everyone = [];
var checkedAnswers = [];


class Review extends React.Component {




    constructor(props) {
        super(props);

        this.state = {
        questions: [],
        answers: [],
        group_answers: [],
        group_sjizzle: [],
        first:[],
        answersChecked: [],
        showButton: true,

    };
    this.testFunction = this.testFunction.bind(this);
  }



  componentDidMount(){


    // axios.get(`https://bonq-api.herokuapp.com/api/question`)
    //   .then(response => {
    //     for(let i = 0; i < response.data.length; i++){
    //       // the loop keeps adding data from the api to the state
    //       this.setState(previousState => ({
    //         questions: [...previousState.questions, response.data[i].shown_question], // take the previous state, add data and update the state.
    //         answers: [...previousState.answers, response.data[i].answer[0].checked_answer]
    //       }))
    //     }
    //   })
  }
    getCheckedAnswers() {
        let groupsAnswer;
        {this.state.answers.map((answer, key1) => {
                this.state.group_answers.map((group, key) => {
                    //
                    //  console.log("answer");
                    //  console.log(answer);
                    //  console.log("Group answer");
                    //  console.log(this.state.first[key][key1]);
                    // console.log("group");
                    // console.log(group);

                   // this.setState(answersChecked[][]);
                    //console.log(this.state.first);

                    if(this.state.first[key][key1] === answer){
                        document.getElementById("check-"+key).checked = true;

                        console.log("answer is correct");
                        this.setState(previousState => ({
                            answersChecked: [...previousState.answersChecked, ["correct"]],
                           // answers: [...previousState.answers, response.data[0].rounds_array[i][j].answer],

                        }))
                        //this.setState(answersChecked[0] = ["correct"]);

                    }else{
                        document.getElementById("wrong-"+key).checked = true;
                        this.setState(previousState => ({
                            answersChecked: [...previousState.answersChecked, ["incorrect"]],
                            // answers: [...previousState.answers, response.data[0].rounds_array[i][j].answer],

                        }))
                    }



                    // this.setState(previousState => ({
                    //     answersChecked: [...previousState.answersChecked, [[groupsAnswer]]],
                    //    // answers: [...previousState.answers, response.data[0].rounds_array[i][j].answer],
                    //
                    // }))
                    console.log("checkedAnswers");
                    console.log(this.state.answersChecked);
                    console.log("first");
                    console.log(this.state.first);

                })
        })}

    }
  testFunction(){

      this.setState({showButton: false});
    //    console.log(this.props);
     let roomid;
       this.props.socket.emit("getAnswerList");



      this.props.socket.on("getAnswerListFull", payload => {
           // console.log(payload);
          var obj = payload;

          this.roomid = Object.keys(obj)[0];

          let first= obj[Object.keys(obj)[0]];
          let teamname = Object.keys(first)[0];



         // console.log(Object.values(first)[0][0].answer);
          this.everyone = Object.values(first)[0];
         // console.log(this.everyone);
          //set the team names
          for (let i = 0; i < Object.keys(first).length; i++) {

              this.setState(previousState => ({
                  group_answers: [...previousState.group_answers, Object.keys(first)[i]]
              }));
          }

            this.state.first = Object.values(first);
         // console.log(Object.values(first)[0]);

          console.log(this.state.first);
          //console.log(this.roomid); //returns 'someVal'
          axios.get("https://bonq-api.herokuapp.com/api/getQuestions/" + this.roomid)
              .then(response => {
                  for (let i = 0; i < response.data[0].rounds_array.length; i++) {
                      for (let j = 0; j < response.data[0].rounds_array[i].length ; j++) {
                          this.setState(previousState => ({
                              questions: [...previousState.questions, response.data[0].rounds_array[i][j].question], // take the previous state, add data and update the state.
                              answers: [...previousState.answers, response.data[0].rounds_array[i][j].answer],

                          }))
                      }
                      this.getCheckedAnswers();
                  }

              })
      });

       // console.log(this.roomid);

     


    // let checkButton = document.getElementsByClassName('right');
    // let wrongButton = document.getElementsByClassName('wrong');
    // // check if every answer is correct
    // // team 1 op vraag 1
    // if(this.state.answers[0] == this.state.group_answers[0]){
    //   checkButton[0].checked = true;
    // } else {
    //   wrongButton[0].checked = true;
    // }
    //
    // // team 2 op vraag 2
    // if(this.state.answers[1] == this.state.group_answers[1]){
    //   checkButton[4].checked = true;
    // } else {
    //   wrongButton[4].checked = true;
    // }




  }






  render() {


     const Questions =
      <section>
        {this.state.questions.map((question, key1) => (
          <div className="review__main__box" key={key1}>
            <p className="review__main__box__question">Question {key1 + 1}: {question}</p>
            <div className="review__main__box__check">
              <p className="review__main__box__answer">Answer: {this.state.answers[key1]}</p>
              <section className="review__main__box__groups">
                {this.state.group_answers.map((answer, key) => {
                  let checkButtonId = `check-${key}`, wrongButtonId = `wrong-${key}`;
                  return(
                    <div key={key} className="review__main__box__groups__answers">
                      <div className="review__main__box__groups__answers-text">

                          <p className="review__main__box__groups__answers-text__group">{answer} : {this.state.first[key][key1]} </p>

                      </div>
                      <aside className="review__main__box__check__buttons">
                        <form id={"form__answers"}>

                          <label>
                            <input className="right" id={checkButtonId} type="radio" name="review" value="correct"/>
                            <img src="/img/check.svg" alt="check icon"/>
                          </label>
                          <label>
                            <input className="wrong" id={wrongButtonId} type="radio" name="review" value="incorrect" />
                            <img src="/img/wrong.svg" alt="wrong icon"/>
                          </label>
                        </form>
                      </aside>
                    </div>
                  );
                })}
              </section>
          </div>
        </div>
        ))}
      </section>

    return(

      <article className="review">

        <section className="review__back">
          <Back text="back to succes page" link="/succes"/>
        </section>

        <section className="review__main">

          <h2 className="review__main__title">Time to check the answers!</h2>
          <section>
            <button onClick={this.testFunction} type="button" className={(this.state.showButton === true ? 'show' : 'hidden')}>Check Answers</button>
          </section>

          {Questions}

        </section>

        <section className="review__options">
          <button id="js--review__button" onClick={this.clickHandler} type="button" className="review__options__confirm">submit</button>
        </section>
      </article>

    );
  }
}

export default Review;
//
// {this.state.questions.map((question, key) => (
//   <div className="review__main__box" key={key}>
//     <p className="review__main__box__question">Question {key + 1}: {question}</p>
//     <div className="review__main__box__check">
//       <p className="review__main__box__answer">Answer: {this.state.answers[key]}</p>
//
//       <section className="review__main__box__groups">
//         {this.state.group_answers.map((answer, key) => (
//           <div key={key} className="review__main__box__groups__answers">
//             <div className="review__main__box__groups__answers-text">
//               <p className="review__main__box__groups__answers-text__group">Group {key + 1}: {answer}</p>
//             </div>
//
//           <aside className="review__main__box__check__buttons">
//             <form>
//               <label>
//                 <input className={"yeet" + key} type="radio" name="review" value="correct"/>
//                 <img src="/img/check.svg" alt="check icon"/>
//               </label>
//
//               <label>
//                 <input type="radio" name="review" value="incorrect" />
//                 <img src="/img/wrong.svg" alt="wrong icon"/>
//               </label>
//             </form>
//           </aside>
//         </div>
//         ))}
//       </section>
//       </div>
//     </div>
// ))}
