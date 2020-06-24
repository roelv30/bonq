import React from 'react';
import axios from 'axios';
// import {connect} from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// import {changeSearchTerm, changeVideo} from './actions';

class InsertQuestionsForm extends React.Component {

  componentDidMount(){
    // this.parseRoundsIntoState();
    console.log("did mount");
  };

  // state = {
  //   items: [{ question: "",
  //             answer: ""}],
  // };

  state1 = {
    round1: [{ question: "",
              answer: ""}],
    round2: [{ question: "",
              answer: ""}],
  };

  state = {
    roundCount: 5,
    selectedTab: 0,
    round0: [{ question: "", answer: ""},],
    round1: [{ question: "", answer: ""},],
    round2: [{ question: "", answer: ""},],
    round3: [{ question: "", answer: ""},],
    round4: [{ question: "", answer: ""},],
  };

  // state = {
  //   roundCount: 5,
  //   selectedTab: 0,
  //   rounds: [],
  // };

  parseRoundsIntoState = (e) => {
    for (let i = 0; i < this.state.roundCount; i++) {
      // let selectedRoundName = "round" + i;
      let selectedRoundArray = [{ question: "", answer: ""}];
      // this.setState({ rounds: this.state.rounds.concat([selectedRoundName]) });
      this.state.rounds = this.state.rounds.concat([selectedRoundArray]);
      console.log(this.state.rounds);

      // let items = [...this.state.rounds, selectedRoundArray]
      // console.log(items);
    }
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
    let selectedRound = "round" + this.state.selectedTab;
    if (["question", "answer"].includes(e.target.className)) {
      // let items = [...this.state[selectedRound]];
      // items[e.target.dataset.id][e.target.className] = e.target.value;
      // this.setState({items}, ()=>console.log(this.state[selectedRound]), console.log(this.state[selectedRound]))

      let questionOrAnswer = e.target.className
      let index = e.target.dataset.id
      let value = e.target.value
      // console.log(questionOrAnswer);
      // this.setState((prevState) => ({
      //   [selectedRound]: [...prevState[selectedRound][index][questionOrAnswer], value]
      // }));

      let data = [...this.state[selectedRound]];
      data[e.target.dataset.id][e.target.className] = e.target.value;
      console.log(data);
      // this.setState((prevState) => ({
      //   [selectedRound]: [...prevState[selectedRound][index][questionOrAnswer], value]}))
    }
  }

  addItem = (e) => {
    // e.preventDefault();
    let selectedRound = "round" + this.state.selectedTab;


    this.setState((prevState) => ({
      [selectedRound]: [...prevState[selectedRound], {question: "", answer: ""}],
    }));


    // let newQnA = { question: "", answer: ""};
    // this.state.rounds[0] = this.state.rounds[0].concat(newQnA);
    console.log(this.state);
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
    this.state.selectedTab = e.target.dataset.id;
  }

  render() {
    // let {items} = this.props.questionItems
    // let {items} = this.state;
    // this.parseRoundsIntoState();
    // let round = this.state["round" + this.state.selectedTab];
    // console.log(round);
    return(
      <>
      <Tabs>
        <TabList>
          <Tab onClick={this.changeSelectedRound} data-id="1">Title 1</Tab>
          <Tab onClick={this.changeSelectedRound} data-id="2">Title 2</Tab>
        </TabList>

        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <TabPanel>
            <h2>Any content 1</h2>
            {
              this.state["round" + this.state.selectedTab].map((val, idx)=>{
                let questionId = `question-${idx}`, answerId = `answer-${idx}`;
                return (
                  <div key={idx}>
                    <label htmlFor={questionId}>{`Question #${idx+1}`}</label>
                    <input type="text" name={questionId} data-id={idx} id={questionId} defaultValue={this.state["round" + this.state.selectedTab][idx].question} className="question"/>
                    <label htmlFor={answerId}>Answer: </label>
                    <input type="text" name={answerId} data-id={idx} id={answerId} defaultValue={this.state["round" + this.state.selectedTab][idx].answer} className="answer"/>
                  </div>
                )
              })
            }
          </TabPanel>
          <TabPanel>
            <h2>Any content 2</h2>
            {
              this.state["round" + this.state.selectedTab].map((val, idx)=>{
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
          </TabPanel>
          <button type="button" onClick={this.addItem} >Add new Question</button>
          <button type="submit" value="Submit" > Submit</button>
        </form>
      </Tabs>
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
/*<Tabs>
  <TabList>
    <Tab onClick={this.changeSelectedRound} data-id="1">Title 1</Tab>
    <Tab onClick={this.changeSelectedRound} data-id="2">Title 2</Tab>
  </TabList>

  <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
    <TabPanel>
      <h2>Any content 1</h2>
      {
        this.state["round" + this.state.selectedTab].map((val, idx)=>{
          let questionId = `question-${idx}`, answerId = `answer-${idx}`;
          return (
            <div key={idx}>
              <label htmlFor={questionId}>{`Question #${idx+1}`}</label>
              <input type="text" name={questionId} data-id={idx} id={questionId} defaultValue={this.state["round" + this.state.selectedTab].question} className="question"/>
              <label htmlFor={answerId}>Answer: </label>
              <input type="text" name={answerId} data-id={idx} id={answerId} value={this.state["round" + this.state.selectedTab].question} className="answer"/>
            </div>
          )
        })
      }
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
      {
        this.state["round" + this.state.selectedTab].map((val, idx)=>{
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
    </TabPanel>
    <button type="button" onClick={this.addItem} >Add new Question</button>
    <button type="submit" value="Submit" > Submit</button>
  </form>
</Tabs>*/