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

class PubQuizQuestionsForm extends React.Component {
//form where questions are inserted, dynamically based on PubQuizSettings.js choices

  componentDidMount(){
    this.updateRoundCount();          // retrieve rounds set by user in settings, assign to state in prep for round tab generation

    setTimeout(() => {          // fill set rounds with initial question and answer pair into state. In a timeout because updating state isn't instant, ignores prev function changes if not in timeout. Not put into seperate function, because setTimeouts never work right in JavaScript.
      for (let i = 0; i < this.state.roundCount.length; i++) {
        let selectedRoundName = "round" + i;
        let selectedRoundArray = [{ question: "", answer: ""}];
        this.setState(prevState => {
          let stateToFill = Object.assign({}, prevState);
          stateToFill[selectedRoundName] = selectedRoundArray;
          return stateToFill ;
        })
      }
    }, 100)
  };

  state = {         // state with needed items, instantiated with at least one round already so initial render is allowed
    round0: [],
    roundCount: [],               // is array to enable mapping later
    selectedTab: 0,               // keep track of which tab is selected to show Q A pairs
    roundSelected: false,         // track if tab is selected to disable pulse effect
    redirect: false,              // track if eligible for redirect to game start
    redirectTo: 0,                // field to store roomID
    // room: 0,                   // unused? dupe of above? Delete later if no bugs
  };

  updateRoundCount = () => {          // function to fill roundCount state
    let roundArray = [];
    let extRoundCount = this.props.roundCount;
    for (var i = 0; i < extRoundCount; i++) {
      roundArray.push(i);
    }
    this.setState(prevState => {
      let stateToFill = Object.assign({}, prevState);
      stateToFill.roundCount = roundArray;
      return stateToFill ;
    })
  }

  parseRoundsIntoState = (e) => {         // function to insert base Q A pairs into defined rounds
    for (let i = 0; i < this.state.roundCount.length; i++) {
      let selectedRoundName = "round" + i;
      let selectedRoundArray = [{ question: "", answer: ""}];
      this.setState(prevState => {
        let stateToFill = Object.assign({}, prevState);
        stateToFill[selectedRoundName] = selectedRoundArray;
        return stateToFill ;
      })
    }
  }

  handleChange = (e) => {         // parse values from input fields into selected round Q or A
    let selectedRound = "round" + this.state.selectedTab;
    if (["question", "answer"].includes(e.target.className)) {

      // let questionOrAnswer = e.target.className
      // let index = e.target.dataset.id
      // let value = e.target.value

      let data = [...this.state[selectedRound]];

      data[e.target.dataset.id][e.target.className] = e.target.value;
    }
  }

  addItem = (e) => {          // add more Q A pairs into selected round
    let selectedRound = "round" + this.state.selectedTab;

    this.setState((prevState) => ({
      [selectedRound]: [...prevState[selectedRound], {question: "", answer: ""}],
    }));
    console.log(selectedRound);
    console.log(this.state);
  };

  removeItem = (e) => {         // prototype function for removing Q A pairs
    let selectedRound = "round" + this.state.selectedTab;
    let selectedQA = this.state[selectedRound][e.target.dataset.id];
    let position = e.target.dataset.id;

    this.setState(prevState => {
      let item = Object.assign({}, prevState);
      let newArray = Object.values(item[selectedRound]);
      newArray.splice(position, 1);
      item[selectedRound] = newArray;
      return item;
    })
  };

  checkIfFormFilled = (rounds) => {         // check all state data, user may not start if fields are left empty
    console.log(rounds);
    for (var i = 0; i < rounds.length; i++) {
      console.log(rounds[i]);
      for (var j = 0; j < rounds[i].length; j++) {
        if (rounds[i][j].question == "" || rounds[i][j].answer == "") {
          return false;
        }
      }
    }
  }

  handleSubmit = (e) => {         // put all rounds in array and post in database. Authorisation required for integrity, JWT token sent as header with request. Once posted -> start room creation
    e.preventDefault();

    const token = localStorage.getItem('jwt');

    const socket  = this.props.socket;

    const POST_URL = 'https://bonq-api.herokuapp.com/api/parsePubQnA';
    // const POST_URL = 'http://localhost:8000/api/parsePubQnA';

    const roomNum = this.generateRoom();
    socket.emit("setTypeHost",roomNum);

    let header = {'Authorization': 'Bearer ' + token};
    let rounds = this.putRoundsIntoArray();

    if (this.checkIfFormFilled(rounds) !== false) {         // check if all inputs are filled
      axios.post(POST_URL, {
        rounds: rounds,
        room: roomNum,
      }, {headers:header})
      .then((response) => {
        if (response.data == true) {
          this.setState({redirect: true, redirectTo: roomNum});
        }
      })
    } else {            // notify user of inability to send form.
      alert("Oh no! You forgot a question or answer! \nPlease fill in all fields.");
    }

  }

  generateRoom = () => {        // random 6 digit num generator for roomID
    const min = 100000;
    const max = 999999;
    const rand = min + Math.random() * (max - min);
    const fixedRandom  =  Number((rand).toFixed(0));

    return fixedRandom;
  }

  putRoundsIntoArray = () => {          // insert all rounds into array for single post request
    let roundsArray = [];
    for (let i = 0; i < this.state.roundCount.length; i++) {
      let selectedRoundName = "round" + i;
      roundsArray.push(this.state[selectedRoundName]);
    }
    return roundsArray;
  }

  changeSelectedRound = (e) => {          // function to change slected round state
    let id = e.target.dataset.id;
    this.setState(prevState => {
      let item = Object.assign({}, prevState);
      item.selectedTab = id;
      return item ;
    })
    if (this.state.roundSelected === false) {         // disable initial pulse effect for tabs
      this.setState(prevState => {
        let item = Object.assign({}, prevState);
        item.roundSelected = true;
        return item ;
      })
    }
  }

  sendData = () => {
    let hardcodedRounds = 1;
    this.props.parentCallback(hardcodedRounds);
  }

  render() {

    const { redirect } = this.state;          // when submitted, setState force to rerender to redirect next loc
    if (redirect) {
      window.location.replace("/r/" + this.state.redirectTo);
    }

    const currentRound = this.state["round" + this.state.selectedTab];

    const roundTabList = this.state.roundCount.map((roundTab)=>{          // generate all tabs tabby tab things
      if (this.state.round0){
          return <Tab className={(this.state.roundSelected === false ? "pulse" + " react-tabs__tab": '' + " react-tabs__tab")} onClick={this.changeSelectedRound} data-id={roundTab}>{"Round " + (roundTab+1)}</Tab>;
      }
    });

    const roundTabPanel = this.state.roundCount.map((roundPanel)=>{          // generate all tab panels
      // if (this.state.round0){         // obsolete check? delete lines later
        return (
          <>
            <TabPanel>
              {
                currentRound.map((val, idx)=>{
                  let round = "round" + this.state.selectedTab;
                  let roundObj = this.state[round];
                  if (Object.values(roundObj)[idx] === undefined) {
                    console.log("don't render");
                  } else {
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
                          <button className="pubq__article__button-remove" data-id={idx} type="button" onClick={this.removeItem}>remove</button>
                        </section>
                    )
                  }

                })
              }
              <button className="pubq__article__button" type="button" onClick={this.addItem} >Add new Question</button>
              <button className="pubq__article__button pubq__article__submit" type="submit" value="submit" > Start Game! &#10151;</button>
            </TabPanel>
          </>
        );
      // }
    });

    let buttonPrev = <GoBackButton className="pubq__questions__back" onClick={ this.sendData } />

    // final render with local components
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

function GoBackButton(props) {          // turn back if you are in a place you don't want to be
  return (
      <button className={props.className} onClick={props.onClick}>
        &larr; back
      </button>
  );
}

export default PubQuizQuestionsForm;
