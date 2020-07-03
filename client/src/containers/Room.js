import {useEffect, useRef, useState } from "react";
import React from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {bool} from "prop-types";
import Video from "../components/Video"
import Switch from "react-switch";
import Username from "../components/Username";
import Back from '../extern/Back';

import moment from "moment";
import 'react-tabs/style/react-tabs.css';
import { Tabs, TabLink, TabContent } from 'react-tabs-redux';
import AutoscrolledList from "./AutoscrolledList";
import MediaControls from "../components/MediaControls";
import axios from "axios";
import Questions from "../components/Questions"

import SocketContext from '../components/SocketContext';
const Container = styled.div`
    height: calc(100% - 6rem);
    padding: 2rem 0;
    z-index:1;
    position:relative;
    text-align: center;
`;

const StyledVideo = styled.video`
    // height: 40%;
    // width: 50%;
`;


const Room = (props) => {
    const roomID = props.match.params.roomID;
    const socketRef = useRef();
    const userVideo = useRef();
    var userAudio = useRef();
    var userVideoStream = useRef();
    const peersRef = useRef([]);

    //set all initial states
    const [peers, setPeers] = useState([]);
    const [userName, setUsernameOfuser] = useState("no name");
    const [switchState, setSwitchState] = useState(false);
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("team1");
    const [intro, setIntroDone] = useState(false);
    const [typeOfPlayer, setType] = useState();
    const [teamNameStateSet, setTeamNameState] = useState(false);
    const [avatar, setAvatarOfUser] = useState("/static/media/18.b0d5b6d8.svg");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [questionNumber, setquestionNumber] = useState(0);
    const [roundNumber, setRoundNumber] = useState(0);
    const [answer, setAnswer] = useState("-");
    const [maxRounds, setMaxRounds] = useState(0);
    const [maxQuestions, setMaxQuestions] = useState(0);
    const [showReview, setShowReview] = useState(false);
    const [showRounds, setShowRounds] = useState(false);
    const [showQuestionBtn, setShowQuestionBtn] = useState(false);
    const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);
    const [isShowingWaitingScreen, setisShowingWaitingScreen] = useState(false);
    const [startShowButton, setStartShowButton] = useState(true);


    //background effects
    useEffect(() => {
        socketRef.current = props.socket;


        socketRef.current.on("questNumberUpdate", payload => {
            setquestionNumber(payload);
        });

        socketRef.current.on("roundNumberUpdate", payload => {
            setquestionNumber(0);
            setRoundNumber(payload);

        });

        socketRef.current.on("setWaitingScreen", () => {
            setisShowingWaitingScreen(true);
        });


        socketRef.current.on("sendForm", payload => {
            console.log("sending form emitted");
            console.log(isAlreadySubmitted);
            if(isAlreadySubmitted === true){
                console.log("submitting is true");
                setIsAlreadySubmitted(false);
            }else{
                console.log("teamname");
                setTeamName(payload);
                console.log(payload);
                submitAnswersTeam(payload);
            }

        });

        socketRef.current.on("resetForm", payload => {
            console.log("resetform");
            setIsAlreadySubmitted(false);
        });



        socketRef.current.on("answerIsSubmitted", () => {
            console.log("submitted");
            setIsAlreadySubmitted(true);
            console.log(isAlreadySubmitted);
        });




        socketRef.current.on("questions", payload => {
            setQuestions(payload);
            setMaxRounds(payload.length);
            setMaxQuestions(payload[roundNumber].length);
        });

        if(socketRef.current){
            const token = localStorage.getItem('jwt');
            if(token){
                axios.get('https://bonq-api.herokuapp.com/api/dashboard', {
                    headers: { 'Authorization': 'Bearer ' + token }
                })
                    .then((response) => {
                        const user = response.data;
                        setUsernameOfuser(user.username);
                        setAvatarOfUser(user.avatar_url);

                    })
                    .catch((error) => {
                        const status = error.response.status;
                        if (status === 401) {

                        }
                    });
            }

        }

        socketRef.current.on("message", message => {
            setMessages(messages => [...messages, message]);
        });


        socketRef.current.on("isHeHost", message => {
            if(message === "yes"){
                setType("host");
                setTeamName("host");
                videoAudioSettings();
            }

        });
        socketRef.current.on("canJoin", message => {
            if(message === "yes"){
                setIntroDone(true);
            }else{
              alert("\t\t No room found with that roomcode\t\n  \tPlease check your roomcode and try again\t\t");
            }
        });


        socketRef.current.on("teams", teamUsers => {
            setTeams(teamUsers);
        });

        socketRef.current.on("update teams", teamUsers => {

            setTeams([])
            setTeams(teamUsers);

        });

        socketRef.current.on("user joined", payload => {
            console.log("you're next");

        });

    }, []);


    //if another peer is not connected add a new peer
    function createPeer(userToSignal, callerID, stream) {

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });
        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        });
        return peer;
    }
    //if another peer is connected add this one to the list
    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });
        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        });
        peer.signal(incomingSignal);
        return peer;
    }


    //press the hangup button
    const hangup = () => {
      if (userVideo.current.srcObject) {
        userVideo.current.srcObject.getTracks().forEach(track => track.stop());
      }
        socketRef.current.emit("leaving");
        props.history.push('/');
    };


    //set all settings voor video and audio
    const videoAudioSettings = () =>{
        navigator.mediaDevices.getUserMedia({ video: switchState, audio: true }).then(stream => { //get user mic and camera
            userAudio.current =  stream.getAudioTracks();
            //set a placholder if no mic present
            if(switchState === false){
                userVideo.current.poster = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
            }else{
                userVideo.current.srcObject = stream;
                userVideoStream.current = stream.getVideoTracks();
            }
            socketRef.current.emit("join room",roomID);
            socketRef.current.emit("join team", teamName);
            socketRef.current.on("all users", users => {

                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                        socketID: socketRef.current.id,
                    });
                    peers.push(peer);
                    socketRef.current.emit("send peer",peer);
                });
                setPeers(peers);
                setPeers([...new Set(peers)])
            });

            socketRef.current.on("user joined", payload => {

                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                    socketID: socketRef.current.id,

                });

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("leaving room signal", () => {
                props.history.push('/');
            });


            socketRef.current.on("user left", peer => {
                console.log("USER LEFT");
                peer.destroy();

            });

            socketRef.current.on("left", payload => {
                const audioEl = document.getElementsByClassName("audio-element")[0];
                if(audioEl != null){
                    audioEl.volume = 0.2;
                    audioEl.play();
                }

                var videoObject = document.getElementById(payload);
                if(videoObject === null){

                }else{
                    videoObject.remove();
                }

            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        }).catch(error => console.log(error.message));
    };


    const getQuestions = () =>{
        socketRef.current.emit("startGame");
        setStartShowButton(false);
        setShowQuestionBtn(true);
    };

    const getNextQuestions = () =>{
        if(questionNumber < (maxQuestions - 1) ){

            socketRef.current.emit("nextQuestion",  [roundNumber, questionNumber+ 1, teamName]);
        }else{
            setShowRounds(true);
            setShowQuestionBtn(false);
        }
    };

    const getNextRound = () =>{
        if(roundNumber < (maxRounds -1) ){

            socketRef.current.emit("nextRound",   [roundNumber+ 1, questionNumber]);
            setMaxQuestions(questions[roundNumber + 1].length);
            setShowQuestionBtn(true);
        }else{
            setShowReview(true);
            setShowRounds(false);
            setShowQuestionBtn(false);
        }
    };

    const startSession = () => {
        socketRef.current.emit("username", userName);
        socketRef.current.emit("checkUserType", roomID);
    };



    const handeChangeSwitch = (checked) => {
        setSwitchState(checked);
    };

    const getReview = () =>{
        props.history.push('/review/'+roomID);
        window.location.reload();
        socketRef.current.emit("reviewWaiting");

    };

    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
    };
    const setTeamNameSet = () => {
        setTeamNameState(true);
        videoAudioSettings();
    };

    const submit = event => {
        event.preventDefault();
        socketRef.current.emit("send", message);
        setMessage("");
    };

    const handleUsernameInput = (e) => {
        setUsernameOfuser(e.target.value);
    };


    const submitAnswersTeam = event => {
        const answerTeam = [roundNumber, questionNumber, answer, event];
        socketRef.current.emit("setAnswer", answerTeam);
    };
    const submitAnswersForm = event => {
        //console.log(isAlreadySubmitted);
        event.preventDefault();
        setIsAlreadySubmitted(true);

        socketRef.current.emit("toRestOfTeam", teamName);
        submitAnswersTeam(teamName);
    };


    if(intro === false) {
        return (
            <Container>
                <Username startSession={startSession} switchState={switchState} handeChangeSwitch={handeChangeSwitch} handleUsernameInput={handleUsernameInput}  userName={userName} />
            </Container>
        );
    }

    if(intro === true) {
        return (
            <Container >
                <audio className="audio-element">
                    <source src="https://freesound.org/data/previews/131/131657_2398403-lq.mp3"></source>
                </audio>

                    <article id={"vragen"}>
                        <Questions questions={questions} questionNumber={questionNumber} roundNumber={roundNumber} playerRole={typeOfPlayer} roomID={roomID} waiting={isShowingWaitingScreen}/>
                    </article>

                <section className={(typeOfPlayer === "host" ? 'show' + " room__host__button-container" : 'hidden' + " room__host__button-container")}>
                    <button type={"button"} onClick={getQuestions} className={ startShowButton  === true ? "show" + " room__host__button-grid" : "hidden" }>Start game</button>
                    <button type={"button"} onClick={getNextQuestions} className={(showQuestionBtn  === true ? 'show' + " room__host__button-grid" : 'hidden' + " room__host__button-grid")}>next Question</button>
                    <button type={"button"} onClick={getNextRound} className={(showReview === true || showRounds === false ? 'hidden' + " room__host__button-grid" : 'show' + " room__host__button-grid")}>next Round</button>
                    <button type={"button"} onClick={getReview} className={(showReview === true ? 'show' + " room__host__button-grid" : 'hidden' + " room__host__button-grid")}>Review</button>
                </section>

                <section className={"full-width"}>
                    <Tabs renderActiveTabContentOnly={false}>
                        <ul className={"tabs"}>
                            <li className={"tab"}>
                                <TabLink to="tab1" >
                                    Chat
                                </TabLink>
                            </li>
                            <li className={"tab"}>
                                <TabLink to="tab2" default>Team</TabLink>
                            </li>
                            <li className={"tab"}>
                                <TabLink to="tab3">Answers </TabLink>
                            </li>
                        </ul>
                            <TabContent for="tab1">
                                        <article id="messages" className="messages__container">
                                            <AutoscrolledList items={messages} avatar={avatar} />
                                        </article>
                                        <form onSubmit={submit} id="form__chat">
                                            <article className="input_group">
                                                <textarea
                                                    type="text"
                                                    className="input_group__form_control whiteText"
                                                     placeholder="Say something..."
                                                    maxLength="280"
                                                    onChange={e => setMessage(e.currentTarget.value)}
                                                    onKeyDown={e =>{
                                                      if(e.keyCode === 13 && e.shiftKey === false) {
                                                        e.preventDefault();
                                                        const form = document.querySelector("#form__chat");

                                                        if (form !== null) {
                                                            form.dispatchEvent(new Event('submit', {cancelable: true}));
                                                        }
                                                      };
                                                    }}
                                                    value={message}
                                                    id="text"
                                                />
                                                <span className="input_group__btn">
                                                <button id="submit" type="submit" className="btn btn-primary input_group__btn__submit">
                                                  Send
                                                  <img className="input_group__btn__img" src="/img/send.svg" alt="Send Message"/>
                                                </button>
                                              </span>
                                            </article>
                                        </form>
                            </TabContent>

                            <TabContent for="tab2" className={(typeOfPlayer === "host" ? 'hidden' : 'show')}>
                                <div className={teamNameStateSet ? "hidden" + " background__inside__team" : "visible" + " background__inside__team"}/>
                                <div className={teamNameStateSet ? "hidden" + " background__inside__team__shade" : "visible" + " background__inside__team__shade"}/>
                                <div className={teamNameStateSet ? "hidden" + " teamname__container" : "visible" + " teamname__container"}>
                                    <h2 className="teamname__container__title">Pick a Team Name:</h2>
                                    <input type="text" name="username" value={teamName} onChange={handleTeamNameChange}
                                            maxLength="25"
                                           pattern="^\w+$" maxLength="25" required autoFocus
                                           title="Username" className={"whiteText teamname__container__input"}/>
                                    <button  className="primary-button" type="button" onClick={setTeamNameSet} disabled={teamNameStateSet}>Create / Join</button>
                                    {/*<button onClick={setNextPage}>Next page</button>*/}
                                </div>
                                <section id={"test"}>
                                    <article id={"remoteContainer"}>
                                        <article className="remoteContainer__cams">
                                          {peers.map((peer, index) => {
                                              return (
                                                  <div id={peersRef.current[index].peerID} className={"otherPeopleDiv"}>
                                                      <Video key={index} peer={peer} socketID={peersRef.current[index].socketID} username={"gebruiker"} type={switchState} />
                                                  </div>
                                              );
                                          })}
                                        </article>
                                        <h2 className={"teamname"}>Teamname: {teamName},  </h2>
                                        <h4><ul className={"usersInTeam"}><li>users:</li>{teams.map(({ name, id }) => ( <li key={id}>{name}, </li>   ))}</ul></h4>
                                    </article>
                                </section>
                            </TabContent>
                            <TabContent for="tab3">
                                <form onSubmit={submitAnswersTeam} id="form-answer-team" className={(isAlreadySubmitted  === false ? 'show' : 'hidden')}>
                                    <article className={" input_group" } >
                                        <label htmlFor="text">Your answer for question: #{questionNumber}</label>
                                        <input type="text" className="input_group__form_control whiteText" value={answer}   onChange={e => setAnswer(e.currentTarget.value)} id="text"/>
                                        <span className="input_group__btn">
                                                <button onClick={submitAnswersForm} className="btn btn-primary"> Send </button>
                                        </span>
                                    </article>
                                </form>
                            </TabContent>
                        <section id="ownVideoStream">
                            <StyledVideo muted ref={userVideo} autoPlay playsInline className={"ownVideo"}/>
                            <p>{userName }</p>
                        </section>
                    </Tabs>
                        <MediaControls userVideoStream={userVideoStream} userAudio={userAudio} hangup={hangup} />
                </section>
            </Container>
        );
    }
};

export default Room;
//className={(isAlreadySubmitted  === false ? 'show' : 'hidden')}
