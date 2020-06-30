import React from 'react';
// import ReactDOM from 'react-dom';
// import { render } from 'react-dom'
// import { Router, Route, useHistory, BrowserRouter, Redirect  } from "react-router-dom";
import { Route, BrowserRouter, Redirect  } from "react-router-dom";
// import Home from './containers/HomePage'
import Room from './containers/Room';
// import NotFound from './components/NotFound'
import './style.css';


import './App.css';
import io from "socket.io-client";


//
// const history = useHistory();
// const goHome = () => {
//     history.push("/home");
// };


// import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import Start from './extern/Start';
import Login from './extern/Login';
// import Test from './extern/Test';
import Register from './extern/Register';
import Header from './extern/Header';
import Dashboard from './extern/Dashboard';

import './App.css';
import JoinGame from './extern/JoinGame';
import EasterEgg from './extern/EasterEgg';
// import Score from './extern/Score';
// import Share from './extern/Share';


const socketRef = io.connect();

socketRef.on("leaving user homepage", () => {
    const audioEl = document.getElementsByClassName("audio-element-test")[0];
    if(audioEl != null){
        audioEl.volume = 0.2;
        audioEl.play();
    }
});





//Kim haar code

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
          logout={this.logout}/>
        <Route exact path='/' component={Start} />
        <audio className="audio-element-test">
            <source src="https://freesound.org/data/previews/253/253886_3169537-lq.mp3"></source>
        </audio>
        <Route exact path='/login' render={(props) =>
            <Login authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
        <Route exact path='/register' render={(props) =>
            <Register authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
        <PrivateRoute exact path='/joingame' component={JoinGame} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} logout={this.logout} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} logout={this.logout} />
		    <PrivateRoute exact path='/easteregg' component={EasterEgg} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} logout={this.logout}  />
        {/*<Route exact  path="/" component={Home}  />*/}
        {/*<Route path="/r/:room" component={Room} />*/}
        <Route path="/r/:roomID"    render={(props) =>
            <Room


                {...props}
                // handleMatch={this.handleMatch}
            />
        }/>
        {/*<Route path="*" component={NotFound} />*/}
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
