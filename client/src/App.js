import React from 'react';
import { Route, BrowserRouter, Redirect  } from "react-router-dom";
import Room from './containers/Room';
import PubQuizSetup from './extern/PubQuizSetup'; //remove later
import './style.css';
import './App.css';
import SocketContext from './components/SocketContext'
import * as io from 'socket.io-client'
import axios from 'axios';
import Start from './extern/Start';
import Login from './extern/Login';
import Register from './extern/Register';
import Header from './extern/Header';
import Dashboard from './extern/Dashboard';
import Score from './extern/Score';
import Waitingscreen from './extern/Waitingscreen';
import Review from './question_review/Review';
import JoinGame from './extern/JoinGame';
import EasterEgg from './extern/EasterEgg';

const socket = io("/");

socket.on("leaving user homepage", () => {
    const audioEl = document.getElementsByClassName("audio-element-test")[0];
    if(audioEl != null){
        audioEl.volume = 0.2;
        audioEl.play();
    }
});

class App extends React.Component {
  constructor() {
      super();
      this.state = {
          isAuthenticated: false,
          token: null
      };
      this.authenticate = this.authenticate.bind(this);
      this.logout = this.logout.bind(this);
      this.refresh = this.refresh.bind(this);
  };

// KEEP USER LOGGED IN AFTER REFRESH
  componentDidMount() {
      const lsToken = localStorage.getItem('jwt');
      if (lsToken) {
          this.authenticate(lsToken);
      };
  };

//LOGIN USER AND SET JWT TOKEN
  authenticate(token) {
      this.setState({
          isAuthenticated: true,
          token: token
      });
      localStorage.setItem('jwt', token);
  };

//LOGOUT USER AND REMOVE JWT TOKEN
  logout() {
      localStorage.removeItem('jwt');
      this.setState({
          isAuthenticated: false,
          token: null
      });
  };

//AUTHENTICATE AFTER REFRESH
  refresh() {
      return axios.get('https://bonq-api.herokuapp.com/api/refreshToken', {
          headers: { 'Authorization': 'Bearer ' + this.state.token }
      })
      .then((response) => {
        const token = response.data.token;
        this.authenticate(token);
      })
      .catch((error) => {
        console.log('Error!', error);
      });
    };

  render() {
    return (
      <BrowserRouter>
          <Header
            authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated}
            token={this.state.token}
            refresh={this.refresh}
            logout={this.logout}
          />
          <Route exact path='/' render={(props) =>        <Start authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
          <audio className="audio-element-test">
              <source src="https://freesound.org/data/previews/253/253886_3169537-lq.mp3"></source>
          </audio>
          <Route exact path='/login' render={(props) =>     <Login authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
          <Route exact path='/register' render={(props) =>  <Register authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
          <Route exact path='/scoreboard' component={Score} />
          <Route exact path='/Waitingscreen' component={Waitingscreen} />

          <SocketContext.Provider value={socket}>
              <PrivateRoute exact path="/pubq/questions" component={PubQuizSetup} isAuthenticated={this.state.isAuthenticated} token={this.state.token} logout={this.logout} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} logout={this.logout} socket={socket}/>
              <Route path="/review"    render={(props) => <Review socket={socket} {...props} />}/>
          </SocketContext.Provider>

          <PrivateRoute exact path='/joingame' component={JoinGame} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} logout={this.logout} />
          <PrivateRoute exact path='/easteregg' component={EasterEgg} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} logout={this.logout}  />
          <Route path="/r/:roomID"    render={(props) => <Room socket={socket} {...props} />}/>
        </BrowserRouter>
      );
    };
  }

const PrivateRoute = ({ component: Component, isAuthenticated, token, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated ? (
            <Component {...props} {...rest} token={token} isAuthenticated={isAuthenticated} />
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
        )
    )} />
);


export default App;
