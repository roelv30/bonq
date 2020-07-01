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
        group_answers: ["13", "Ra", "Yeet", "Chungus", "13", "Ra"],
    }
    this.testFunction = this.testFunction.bind(this);
  }

  componentDidMount(){
    axios.get(`https://bonq-api.herokuapp.com/api/question`)
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

  testFunction(){
    let checkButton = document.getElementsByClassName('right');
    let wrongButton = document.getElementsByClassName('wrong');
    // check if every answer is correct
    // team 1 op vraag 1
    if(this.state.answers[0] == this.state.group_answers[0]){
      checkButton[0].checked = true;
    } else {
      wrongButton[0].checked = true;
    }

    // team 2 op vraag 2
    if(this.state.answers[1] == this.state.group_answers[1]){
      checkButton[4].checked = true;
    } else {
      wrongButton[4].checked = true;
    }
  }

  getCheckedAnswers(){

  }

  render() {

     const Questions =
      <section>
        {this.state.questions.map((question, key) => (
          <div className="review__main__box" key={key}>
            <p className="review__main__box__question">Question {key + 1}: {question}</p>
            <div className="review__main__box__check">
              <p className="review__main__box__answer">Answer: {this.state.answers[key]}</p>
              <section className="review__main__box__groups">
                {this.state.group_answers.map((answer, key) => {
                  let checkButtonId = `check-${key}`, wrongButtonId = `wrong-${key}`;
                  return(
                    <div key={key} className="review__main__box__groups__answers">
                      <div className="review__main__box__groups__answers-text">
                        <p className="review__main__box__groups__answers-text__group">Group {key + 1}: {answer}</p>
                      </div>
                      <aside className="review__main__box__check__buttons">
                        <form>
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
            <button onClick={this.testFunction} type="button">Check Answers</button>
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
