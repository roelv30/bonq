import React from 'react';
import ReactDOM from 'react-dom';
import {Switch , Route, Link} from 'react-router-dom';
import axios from 'axios';

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
          this.setState(previousState => ({
            questions: [...previousState.questions, response.data[i].shown_question],
            answers: [...previousState.answers, response.data[i].answer[0].checked_answer]
          }))
        }
      })
  }

  render() {

    return(

      <section>

      {this.state.questions.map((question, key) => (
        <div key={key}>
          <p>{question}</p>
          <p>{this.state.answers[key]}</p>
        </div>
      ))}

        <Link to="/succes">Back to succes page</Link>
      </section>
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
