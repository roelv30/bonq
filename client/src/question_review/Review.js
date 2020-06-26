import React from 'react';
import ReactDOM from 'react-dom';
import {Switch , Route, Link} from 'react-router-dom';
import axios from 'axios';
import Back from '../extern/Back';
import '../question_review/Review.css';

class Review extends React.Component {

  constructor(){
    super();
    this.state = {
        questions: [],
        answers: [],
    }
  }

  componentDidMount(){
    axios.get(`http://127.0.0.1:8000/api/question`)
      .then(response => {
        for(let i = 0; i < response.data.length; i++){
          // the loop keeps adding data from the api to the state
          this.setState(previousState => ({
            questions: [...previousState.questions, response.data[i].shown_question], // take the previous state, add data and update the state.
            answers: [...previousState.answers, response.data[i].answer[0].checked_answer]
          }))
        }
      })
  }

  clickHandler = () => {
    console.log("I once read a book about gravity, it was impossible to put down");
  }

  render() {

    return(

      <article className="review">
        <section className="review__back">
          <Back text="back to succes page" link="/succes"/>
        </section>

        <section className="review__main">

          <h2 className="review__main__title">Time to check the answers!</h2>
          {this.state.questions.map((question, key) => (
            <div className="review__main__box" key={key}>
              <p className="review__main__box__question">Question {key + 1}: {question}</p>
              <div className="review__main__box__check">
                <p className="review__main__box__answer">Answer: {this.state.answers[key]}</p>
                <aside className="review__main__box__check__buttons">
                  <form>
                    <label>
                      <input type="radio" name="review" id="js--check" value="correct"/>
                      <img src="/img/check.svg" alt="check icon"/>
                    </label>

                    <label>
                      <input type="radio" name="review" id="js--fail" value="incorrect" />
                      <img src="/img/wrong.svg" alt="wrong icon"/>
                    </label>
                  </form>
                </aside>
              </div>
            </div>
          ))}

        </section>

        <section className="review__options">
          <button id="js--review__button" onClick={this.clickHandler} type="button" className="review__options__confirm">submit</button>
        </section>
      </article>

    );
  }
}

export default Review;

// axios.get(`http://127.0.0.1:8000/api/question`)
//   .then(response => {
//     this.setState({questions: response.data});
//     console.log(response)
//   })
//
//   let pubquizList = {};
//
//   const addQuestionsToObject = () => {
//     const data = this.state.questions;
//
//       Object.keys(data).map((index) => (
//           // this functions loops through the state data taking the data from the question and
//           // its answer and adding it to an object.
//           // number filled in the [] after answer must always be zero since a question only has one right answer.
//           // filling in zero will prevent that another loop has to be made.
//           pubquizList[index] = {question: data[index].shown_question, answer: data[index].answer[0].checked_answer},
//           console.log(pubquizList)
//       ));
//       return pubquizList;
//  } //addQuestionsToObject
//  console.log("ik wil dood");
//  addQuestionsToObject();
