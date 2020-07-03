import React from 'react';
import axios from 'axios';
// import {connect} from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './Back.css';
import './PubQuizSetup.css';
import './Register.css';
import { Router, Route, useHistory, BrowserRouter, Redirect  } from "react-router-dom";
import Back from './Back';
import io from "socket.io-client";

// import {changeSearchTerm, changeVideo} from './actions';

class PubQuizQuestionsForm extends React.Component {
//form where questions are inserted, dynamically based on PubQuizSettings.js choices

  componentDidMount(){
    this.updateRoundCount();

    setTimeout(() => {
     //console.log("parse round called");
      //console.log(this.state);
      //console.log(this.state.roundCount.length);
      for (let i = 0; i < this.state.roundCount.length; i++) {
        let selectedRoundName = "round" + i;
        let selectedRoundArray = [{ question: "", answer: ""}];
        // let data = this.state;
        this.setState(prevState => {
          let stateToFill = Object.assign({}, prevState);
          stateToFill[selectedRoundName] = selectedRoundArray;
          // console.log("stateToFill: ");
          // console.log(stateToFill);
          return stateToFill ;
        })
      }
    }, 100)
    // this.parseRoundsIntoState();
    //console.log("did mount");
  };

  // state = {
  //   items: [{ question: "",
  //             answer: ""}],
  // };

  // state1 = {
  //   round1: [{ question: "",
  //             answer: ""}],
  //   round2: [{ question: "",
  //             answer: ""}],
  // };

  // state = {
  //   roundCount: [0, 1, 2, 3, 4],
  //   selectedTab: 0,
  //   round0: [{ question: "b", answer: ""},],
  //   round1: [{ question: "", answer: ""},],
  //   round2: [{ question: "", answer: ""},],
  //   round3: [{ question: "", answer: ""},],
  //   round4: [{ question: "", answer: ""},],
  // };

  state = {
    round0: [],
    roundCount: [],
    selectedTab: 0,
    roundSelected: false,
    redirect: false,
    redirectTo: 0,
    room: 0,
  };

  // state = {
  //   roundCount: 5,
  //   selectedTab: 0,
  //   rounds: [],
  // };

  updateRoundCount = () => {
   // console.log("update count called");
    let roundArray = [];
    let extRoundCount = this.props.roundCount;
   // console.log(extRoundCount);
    for (var i = 0; i < extRoundCount; i++) {
      roundArray.push(i);
    }
    this.setState(prevState => {
      let stateToFill = Object.assign({}, prevState);
      stateToFill.roundCount = roundArray;
      // console.log("stateToFill: ");
      // console.log(stateToFill);
      return stateToFill ;
    })
  }

  parseRoundsIntoState = (e) => {
   // console.log("parse round called");
   // console.log(this.state);
   // console.log(this.state.roundCount.length);
    for (let i = 0; i < this.state.roundCount.length; i++) {
      let selectedRoundName = "round" + i;
      let selectedRoundArray = [{ question: "", answer: ""}];
      // let data = this.state;
      this.setState(prevState => {
        let stateToFill = Object.assign({}, prevState);
        stateToFill[selectedRoundName] = selectedRoundArray;
      //  console.log("stateToFill: ");
      //  console.log(stateToFill);
        return stateToFill ;
      })
    }
    //   for (let i = 0; i < this.state.roundCount; i++) {
    //     // let selectedRoundName = "round" + i;
    //     let selectedRoundArray = [{ question: "", answer: ""}];
    //     // this.setState({ rounds: this.state.rounds.concat([selectedRoundName]) });
    //     this.state.rounds = this.state.rounds.concat([selectedRoundArray]);
    //     console.log(this.state.rounds);
    //
    //     // let items = [...this.state.rounds, selectedRoundArray]
    //     // console.log(items);
    //   }
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
    // console.log("handle change called");
    let selectedRound = "round" + this.state.selectedTab;
    if (["question", "answer"].includes(e.target.className)) {
      // let items = [...this.state[selectedRound]];
      // items[e.target.dataset.id][e.target.className] = e.target.value;
      // this.setState({items}, ()=>console.log(this.state[selectedRound]), console.log(this.state[selectedRound]))
      // console.log("state before: ");
      // console.log(this.state);


      let questionOrAnswer = e.target.className
      let index = e.target.dataset.id
      let value = e.target.value
      // console.log(questionOrAnswer);
      // console.log(index);
      // console.log(value);
      // console.log(questionOrAnswer);
      // this.setState((prevState) => ({
      //   [selectedRound]: [...prevState[selectedRound][index][questionOrAnswer], value]
      // }));

      let data = [...this.state[selectedRound]];
      // console.log(data[e.target.dataset.id][e.target.className]);
      // console.log(data[e.target.dataset.id]);
      // console.log(e.target.value);
      // console.log(e.target.className);
      // console.log(this.state);

      data[e.target.dataset.id][e.target.className] = e.target.value;

      // console.log(this.state[selectedRound][index][questionOrAnswer]);

      // this.setState((prevState) => ({
      //   [selectedRound]: [...prevState[selectedRound][index][questionOrAnswer], value],
      // }));
      // console.log("state after: ");
      // console.log(this.state);
      // setTimeout(()=>{console.log(this.state);},500)
    }
  }

  addItem = (e) => {
    // e.preventDefault();
    // console.log("additem called");
    let selectedRound = "round" + this.state.selectedTab;


    this.setState((prevState) => ({
      [selectedRound]: [...prevState[selectedRound], {question: "", answer: ""}],
    }));


    // let newQnA = { question: "", answer: ""};
    // this.state.rounds[0] = this.state.rounds[0].concat(newQnA);
    // console.log(this.state);
  };

  handleSubmit = (e) => {
    // console.log("submit called");
    e.preventDefault();




    const token = localStorage.getItem('jwt');

    const socket  = this.props.socket;




    const POST_URL = 'https://bonq-api.herokuapp.com/api/parsePubQnA';
    // const POST_URL = 'http://localhost:8000/api/parsePubQnA';

    const roomNum = this.generateRoom();
    socket.emit("setTypeHost",roomNum);

    let header = {'Authorization': 'Bearer ' + token};
    let rounds = this.putRoundsIntoArray();
    axios.post(POST_URL, {
      rounds: rounds,
      room: roomNum,
    }, {headers:header})
        .then((response) => {
          if (response.data == true) {
            this.setState({redirect: true, redirectTo: roomNum});
          }
          // console.log(response.data);
        })
    // .catch((error) => {
    //   const status = error.response.status;
    //   console.log(status);
    // });
  }

  generateRoom = () => {
    const min = 100000;
    const max = 999999;
    const rand = min + Math.random() * (max - min);
    const fixedRandom  =  Number((rand).toFixed(0));

    // this.setState({room: fixedRandom});
    return fixedRandom;
  }

  putRoundsIntoArray = () => {
    let roundsArray = [];
    for (let i = 0; i < this.state.roundCount.length; i++) {
      let selectedRoundName = "round" + i;
      roundsArray.push(this.state[selectedRoundName]);
      // let selectedRoundArray = [{ question: "", answer: ""}];
    }
    return roundsArray;
  }

  changeSelectedRound = (e) => {
    console.log(e.target.dataset.id);
    // console.log("change round called");
    let id = e.target.dataset.id;
    // this.state.selectedTab = e.target.dataset.id;
    // this.setState((prevState) => ({
    //   selectedTab: ...prevState, selectedTab: e.target.dataset.id
    // }));
    this.setState(prevState => {
      let item = Object.assign({}, prevState);
      item.selectedTab = id;
      // console.log("item: ");
      // console.log(item);
      return item ;
    })
    if (this.state.roundSelected === false) {
      this.setState(prevState => {
        let item = Object.assign({}, prevState);
        item.roundSelected = true;
        // console.log("item: ");
        // console.log(item);
        return item ;
      })
    }
  }

  sendData = () => {
    let hardcodedRounds = 1;
    this.props.parentCallback(hardcodedRounds);
  }

  render() {




    const { redirect } = this.state;

    //

    if (redirect) {
      window.location.replace("/r/" + this.state.redirectTo);
      //this.props.history.push("/r/" + this.state.redirectTo);
      // return(
      //     <Redirect to={redirectto}/>
      // );
    }
    // let {items} = this.props.questionItems
    // let {items} = this.state;
    // this.parseRoundsIntoState();
    // let round = this.state["round" + this.state.selectedTab];
    // console.log(round);
    // document.addEventListener("click", ()=>{console.log(this.state);})

    const currentRound = this.state["round" + this.state.selectedTab];

    const testArray = [1, 2, 3, 4, 5];

    const roundTabList = this.state.roundCount.map((roundTab)=>{
      if (this.state.round0){
        // console.log("round found");
        // if (roundTab == 0) {
        //   return <Tab onClick={this.changeSelectedRound} className="react-tabs__tab--selected" data-id={roundTab}>{"Round " + (roundTab+1)}</Tab>;
        // } else {
          return <Tab className={(this.state.roundSelected === false ? "pulse" + " react-tabs__tab": '' + " react-tabs__tab")} onClick={this.changeSelectedRound} data-id={roundTab}>{"Round " + (roundTab+1)}</Tab>;
        // }

      }

    });

    const roundTabPanel = this.state.roundCount.map((roundPanel)=>{
      if (this.state.round0){
        // console.log("it does");
        return (
          <>
            <TabPanel>
              {
                currentRound.map((val, idx)=>{
                  let questionId = `question-${idx}`, answerId = `answer-${idx}`;
                  let questionPlaceholder = `Question ${idx+1}`, answerPlaceholder = `Answer ${idx+1}`;
                  return (
                      <section className="pubq__question__pair" key={idx}>
                        <label className="pubq__article__form__label pubq__article__form__label--q" htmlFor={questionId}>{`Question #${idx+1}`}
                          <input className="question" placeholder={questionPlaceholder} type="text" name={questionId} data-id={idx} id={questionId} defaultValue={this.state["round" + this.state.selectedTab][idx].question} />
                        </label>
                        <label className="pubq__article__form__label" htmlFor={answerId}>Answer:
                          <input className="answer" placeholder={answerPlaceholder} type="text" name={answerId} data-id={idx} id={answerId} defaultValue={this.state["round" + this.state.selectedTab][idx].answer} />
                        </label>
                      </section>
                  )
                })
              }
              <button className="pubq__article__button" type="button" onClick={this.addItem} >Add new Question</button>
                  <button className="pubq__article__button pubq__article__submit" type="submit" value="submit" > Start Game! &#10151;</button>
            </TabPanel>
            </>
        );
      } else {
        // console.log("it doesn't");
      }
    });

    let buttonPrev = <GoBackButton className="pubq__questions__back" onClick={ this.sendData } />

    return(
        <>
          { buttonPrev }
          <Tabs>
            <TabList>
              {roundTabList}
            </TabList>

            <form className="login__article__form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
              {roundTabPanel}

            </form>
          </Tabs>
        </>
    )
  }
}

function GoBackButton(props) {
  return (
      <button className={props.className} onClick={props.onClick}>
        &larr; back
      </button>
  );
}

export default PubQuizQuestionsForm;

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
