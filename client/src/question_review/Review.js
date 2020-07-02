import React from 'react';
import ReactDOM from 'react-dom';
import {Switch , Route, Link} from 'react-router-dom';
import axios from 'axios';
import Back from '../extern/Back';
import '../question_review/Review.css';
import io from "socket.io-client";
import SocketContext from '../components/SocketContext';

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
        teamScore: [],
    };
    this.fetchAnswers = this.fetchAnswers.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

    getCheckedAnswers() {
        this.state.answers.map((answer, key1) => {
                this.state.group_answers.map((group, key) => {

                    if(this.state.first[key][key1] === answer){
                        document.getElementById("check-"+key+"-"+key1).checked = true;

                        console.log("answer is correct");
                        this.setState(previousState => ({
                            answersChecked: [...previousState.answersChecked, ["correct"]],

                        }))

                    }else{
                        this.setState(previousState => ({
                            answersChecked: [...previousState.answersChecked, ["incorrect"]],

                        }))
                    }
                })
        })

    } // getCheckedAnswers


  onSubmit(e){
    e.preventDefault();
    const POST_URL = 'https://bonq-api.herokuapp.com/api/setscore';
    let checkButton = document.querySelectorAll('input');
    let points = {};
    let teamScore = [];

    for(let i = 0; i < checkButton.length; i++){
      if (checkButton[i].checked){
        teamScore.push(checkButton[i].dataset.team);
        }
      }

    teamScore.forEach(function(teamName) {
      points[teamName] = (points[teamName] || 0) + 1
    });

    for(let i = 0; i < Object.keys(points).length; i++){
      axios.post(POST_URL, {
        team: Object.keys(points)[i],
        score: points[Object.keys(points)[i]],
      })
      .then((response) => {
          this.props.history.push('/scoreboard' );
        console.log("push succesful");
      })
      .catch((error) => {
        const status = error.response;
        console.log(status);
      })



    }
    //
    // console.log(teamScore);
    // console.log(points);

  } //onSubmit


  fetchAnswers(){

      this.setState({showButton: false});
      this.props.socket.emit("getAnswerList");

      this.props.socket.on("getAnswerListFull", payload => {

          var obj = payload;

          this.roomid = Object.keys(obj)[0];

          let first= obj[Object.keys(obj)[0]];

          this.everyone = Object.values(first)[0];
          for (let i = 0; i < Object.keys(first).length; i++) {

              this.setState(previousState => ({
                  group_answers: [...previousState.group_answers, Object.keys(first)[i]]
              }));
          }

          this.state.first = Object.values(first);

          console.log(this.state.first);
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
  } // fetchAnswers

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
                    let checkButtonId = `check-${key}-${key1}`;
                    return(
                      <section key={key} className="review__main__box__groups__answers">
                        <section className="review__main__box__groups__answers-text">

                            <li className="review__main__box__groups__answers-text__group">{answer} : {this.state.first[key][key1]} </li>

                        </section>
                        <aside className="review__main__box__check__buttons">
                          <form>
                              <input className="review__main__box__check__buttons__input" data-question={key1} data-team={answer} id={checkButtonId} type="checkbox" name="review" value="correct"/>
                              <label className="review__main__box__check__buttons__label" htmlFor={checkButtonId}><img src="/img/check.svg" alt="check icon"/></label>
                          </form>
                        </aside>
                      </section>
                    );
                  })}
                </section>
            </div>
          </div>
          ))}


      </section>

    return(

      <article className="review">

        <section className="review__main">

          <h2 className="review__main__title">Time to check the answers!</h2>
          <section>
            <button onClick={this.fetchAnswers} type="button" className={(this.state.showButton === true ? 'show' : 'hidden')}>Check Answers</button>
          </section>

          {Questions}

        </section>

        <section className="review__options">
          <button id="js--review__button" onClick={this.onSubmit} type="button" className="review__options__confirm">submit</button>
        </section>
      </article>

    );
  }
} // render

export default Review;
