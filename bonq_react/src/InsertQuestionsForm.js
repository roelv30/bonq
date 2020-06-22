import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
// import {changeSearchTerm, changeVideo} from './actions';

class InsertQuestionsForm extends React.Component {

  // state = {
  //   items: [{ question: "",
  //             answer: ""}],
  // };

  state = {
    round1: [{ question: "",
              answer: ""}],
    round2: [{ question: "",
              answer: ""}],
  };

  // handleChange = (e) => {
  //   if (["question", "answer"].includes(e.target.className)) {
  //     let items = [...this.state.items]
  //     items[e.target.dataset.id][e.target.className] = e.target.value
  //     this.setState({items}, ()=>console.log(this.state.items))
  //   }else{
  //     // obsolete?
  //     this.setState({[e.target.name]: e.target.value})
  //   }
  // }
  //
  // addItem = (e) => {
  //   this.setState((prevState) => ({
  //     items: [...prevState.items, {question: "", answer: ""}],
  //   }));
  // };

  handleChange = (e) => {
    if (["question", "answer"].includes(e.target.className)) {
      let items = [...this.state.round1]
      items[e.target.dataset.id][e.target.className] = e.target.value
      this.setState({items}, ()=>console.log(this.state.round1), console.log(this.state.round2))
    }else{
      // obsolete?
      this.setState({[e.target.name]: e.target.value})
    }
  }

  addItem = (e) => {
    this.setState((prevState) => ({
      round1: [...prevState.round1, {question: "", answer: ""}],
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/parsePubQnA', {
      round1: this.state.round1,
      round2: this.state.round2,
    })
    .then((response) => {
      console.log(response);
      })
    // .catch((error) => {
    //   const status = error.response.status;
    //   console.log(status);
    // });
  }

  render() {
    // let {items} = this.props.questionItems
    // let {items} = this.state;
    let round = this.state.round1;
    return(
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        {
          round.map((val, idx)=>{
            let questionId = `question-${idx}`, answerId = `answer-${idx}`;
            return (
              <div key={idx}>
                <label htmlFor={questionId}>{`Question #${idx+1}`}</label>
                <input type="text" name={questionId} data-id={idx} id={questionId} className="question"/>
                <label htmlFor={answerId}>Answer: </label>
                <input type="text" name={answerId} data-id={idx} id={answerId} className="answer"/>
              </div>
            )
          })
        }
        <button onClick={this.addItem}>Add new Question</button>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default InsertQuestionsForm;

/*

{x, y} = foo;
x = foo.x;
y = foo.y;

{cats} = this.state;
cats = this.state.cats;

*/
