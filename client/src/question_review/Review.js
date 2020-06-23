import React from 'react';
import ReactDOM from 'react-dom';
import {Switch , Route, Link} from 'react-router-dom';
import axios from 'axios';


export default class Review extends React.Component {

  constructor(){
    super();
    this.state = {
      questions: [],
    }
  }

  componentDidMount(){
    axios.get(`http://127.0.0.1:8000/api/question`)
      .then(response => {
        this.setState({questions: response.data});
      })
  }

  render() {

    const data = this.state.questions;
    console.log(data);

    return(
      <section>

        <div>
          {Object.keys(data).map((key) => (
            <div>
              <h1>{data[key].shown_question}</h1>
              {Object.keys(data[key].answer).map((index) => (
                <h2>{data[key].answer[index].checked_answer}</h2>
              ))}
            </div>
          ))}

        </div>

        <h1>Hallo</h1>
        <Link to="/succes">Back to succes page</Link>
      </section>
    );
  }
}
