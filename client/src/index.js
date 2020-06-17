import React from 'react';
import ReactDOM from 'react-dom';

import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store';
import { Router, Route, useHistory, BrowserRouter  } from "react-router-dom";
import Home from './containers/HomePage'
import Room from './containers/Room'
import NotFound from './components/NotFound'
import styles from './style.css'
import io from "socket.io-client";

//
// const history = useHistory();
// const goHome = () => {
//     history.push("/home");
// };



const socketRef = io.connect();

socketRef.on("leaving user homepage", () => {
    const audioEl = document.getElementsByClassName("audio-element-test")[0];
    if(audioEl != null){
        audioEl.volume = 0.2;
        audioEl.play();
    }
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>

            <audio className="audio-element-test">
                <source src="https://freesound.org/data/previews/253/253886_3169537-lq.mp3"></source>
            </audio>
            <Route exact  path="/" component={Home}  />
            {/*<Route path="/r/:room" component={Room} />*/}
            <Route path="/r/:roomID"    render={(props) =>
                <Room

                    test={store}
                    {...props}
                    // handleMatch={this.handleMatch}
                />
            }/>
            {/*<Route path="*" component={NotFound} />*/}
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
//serviceWorker.unregister();
