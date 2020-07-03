import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import './Score.css';
import {Redirect} from "react-router-dom";

class Score extends React.Component {

  constructor() {
    super();
    this.state = {
      teams: [],
    }
  };

  componentDidMount(){
    const BASE_URL = `https://bonq-api.herokuapp.com/api/score`;
    axios.get(BASE_URL)
    .then(response => {
      // import team data and sort on score descending
      // teams are sorted by their scores
      const teams = response.data;
      teams.sort((a, b) => b['score'] - a['score']);
      this.setState({teams});
      console.log(this.state.teams);
    })
  } // componentDidMount

  render() {
    // first map through all elements in teams Object
    // then show views according to their scores
    const Scoreboard =
      <section>
        {this.state.teams.map((team, i) => {
          switch(i){
            case 0:
              return (
                <article className="score__winner" key={i}>
                <img className="score__winner__img" src="/img/winner.png"/>
                    <section className="score__winner__data">
                    <h1 className="score__winner__data__name">{team.team}</h1>
                    <p className="score__winner__data__score">You got {team.score} questions right!</p>
                    </section>
                </article>
              )
            case 1:
              return (
                <article className="score__runnerup" key={i}>
                <img className="score__runnerup__img" src="/img/runnerup.png"/>
                  <section className="score__runnerup__data">
                    <p className="score__runnerup__data__text">The runner-up</p>
                    <h1 className="score__runnerup__data__name">{team.team}</h1>
                  </section>
                  <p className="score__runnerup__data__score">{team.score}</p>
                </article>
              )
            case 2:
              return (
                <article className="score__third" key={i}>
                <img className="score__third__img" src="/img/third.png"/>
                  <section className="score__third__data">
                      <p className="score__runnerup__data__text">And the honorable mention</p>
                    <h1 className="score__third__data__name">{team.team}</h1>
                  </section>
                  <p className="score__third__data__score">{team.score}</p>
                </article>
              )

            default:
              return(
                <article className="score__other" key={i}>
                  <img className="score__other__img" src="/img/background.png"/>
                    <h1 className="score__other__name">{team.team}</h1>
                    <p className="score__other__score">{team.score}</p>
                </article>
              )
          }
        })}
      </section>

    // main score screen
    return (
      <section className="score">
        <p className="score__text">And the winner is ... </p>
        {Scoreboard}
        <article className="score__buttonbox">
          <NavLink exact activeClassName="active" className="score__buttonbox__button" to="/dashboard">
            End Game  &#9654;
          </NavLink>
        </article>
      </section>
    )
  }
};

export default Score;
