import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import './Score.css';
import {Redirect} from "react-router-dom";


class Score extends React.Component {

  constructor() {
    super();
    this.state = {
      //THIS IS REAL DATA BIATCH
      teams_api: [],
      scores_api: [],

      //THIS IS TEST DATA
      teams: [
        {
          name: "runnerups",
          score: 200,
        },
        {
          name: 'BONQ',
          score: 420,

        },
        {
          name: 'loser',
          score: 1,

        },
        {
          name: 'super lange team naam ',
          score: 2,

        },
        {
          name: 'loser2',
          score: 9,

        },
        {
          name: 'yoink',
          score: 2,
        },
        {
          name: "derdeplek",
          score: 100,
        }],
    }
  };

  componentWillMount(){
    const BASE_URL = `https://bonq-api.herokuapp.com/api/score`;

    axios.get(BASE_URL)
    .then(response => {
      for(let i = 0; i < response.data.length; i++){
        this.setState(previousState => ({
            teams_api: [...previousState.teams_api, response.data[i].team], // take the previous state, add data and update the state.
            scores_api: [...previousState.scores_api, response.data[i].score],
        }))
      }
    })
  }

  render() {

    if (this.props.isAuthenticated) {
      return (
        <Redirect to='/dashboard'/>
      );
    };

    const teams = this.state.teams;
    teams.sort((a, b) => b["score"] - a["score"]);
    console.log(teams);

    return (
      <section className="score">
        <p className="score__text">And the winner is ... </p>


          {this.state.teams.map((team, i) => {

            if(i === 0 ) {
              return (
                <article className="score__winner" key={i}>
                <img className="score__winner__img" src="/img/winner.png"/>
                    <section className="score__winner__data">
                    <h1 className="score__winner__data__name">{team.name}</h1>
                    <p className="score__winner__data__score">You got {team.score} questions right!</p>
                    </section>
                </article>
              )
            } else if(i === 1 ) {
              return (
                <article className="score__runnerup" key={i}>
                <img className="score__runnerup__img" src="/img/runnerup.png"/>
                  <section className="score__runnerup__data">
                    <p className="score__runnerup__data__text">The runner-up</p>
                    <h1 className="score__runnerup__data__name">{team.name}</h1>
                  </section>
                  <p className="score__runnerup__data__score">{team.score}</p>
                </article>
              )
            } else if(i === 2 ) {
                return (
                  <article className="score__third" key={i}>
                  <img className="score__third__img" src="/img/third.png"/>
                    <section className="score__third__data">
                        <p className="score__runnerup__data__text">And the honorable mention</p>
                      <h1 className="score__third__data__name">{team.name}</h1>
                    </section>
                    <p className="score__third__data__score">{team.score}</p>
                  </article>
                )

            } else {
              return(
                <article className="score__other" key={i}>
                  <img className="score__other__img" src="/img/background.png"/>
                    <h1 className="score__other__name">{team.name}</h1>
                    <p className="score__other__score">{team.score}</p>
                </article>
            )

            }
          })}
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
