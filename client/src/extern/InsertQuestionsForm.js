import React from 'react';
import axios from 'axios';
// import {connect} from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

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

  state1 = {

  };

  parseRoundsIntoState = (e) => {
    let rounds = 5; //hardcoded for testing

  }

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
    }
  }

  addItem = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      round1: [...prevState.round1, {question: "", answer: ""}],
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/parsePubQnA', {
      state: this.state,
    })
    .then((response) => {
      console.log(response);
      })
    // .catch((error) => {
    //   const status = error.response.status;
    //   console.log(status);
    // });
  }

  changeSelectedRound = (e) => {
    console.log(e.target.dataset.id);
  }

  render() {
    // let {items} = this.props.questionItems
    // let {items} = this.state;
    let round = this.state.round1;
    return(
      <>
      <Tabs>
        <TabList>
          <Tab onClick={this.changeSelectedRound} data-id="1">Title 1</Tab>
          <Tab onClick={this.changeSelectedRound} data-id="2">Title 2</Tab>
        </TabList>

        <TabPanel>
          <h2>Any content 1</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
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
        <button onClick={this.addItem} >Add new Question</button>
        <input type="submit" value="Submit" />
      </form>
      </>
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
