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


    const [peers, setPeers] = useState([]);
    const [userName, setUsernameOfuser] = useState("no name");
    const [switchState, setSwitchState] = useState(false);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("team1");
    const [intro, setIntroDone] = useState(false);
    const [typeOfPlayer, setType] = useState();

    const [teamNameStateSet, setTeamNameState] = useState(false);

    const [avatar, setAvatarOfUser] = useState("/static/media/18.b0d5b6d8.svg");

    const socketRef = useRef();
    const userVideo = useRef();
    var userAudio = useRef();
    var userVideoStream = useRef();

    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    // const type = props.match.params.type;
    //const type = props.match.params.type;
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
    const [showQuestionBtn, setShowQuestionBtn] = useState(true);


    const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);



    useEffect(() => {
        socketRef.current = props.socket;



        console.log(socketRef.current);

        socketRef.current.on("questNumberUpdate", payload => {
            setquestionNumber(payload);
        });

        socketRef.current.on("roundNumberUpdate", payload => {
            setquestionNumber(0);
            setRoundNumber(payload);

        });

        socketRef.current.on("sendForm", payload => {
            if(isAlreadySubmitted){
                setIsAlreadySubmitted(false);
            }else{
                submitAnswersTeam();
            }

        });










        socketRef.current.on("questions", payload => {

            console.log("questions");
                console.log(payload);
            setQuestions(payload);
            setMaxRounds(payload.length);
            setMaxQuestions(payload[roundNumber].length);

        });

        if(socketRef.current){
            // socketRef.current.emit();
            console.log("joined");

            const token = localStorage.getItem('jwt');
            if(token){
                axios.get('https://bonq-api.herokuapp.com/api/dashboard', {
                    headers: { 'Authorization': 'Bearer ' + token }
                })
                    .then((response) => {
                        const user = response.data;
                        setUsernameOfuser(user.username);
                        setAvatarOfUser(user.avatar_url);
                        //this.setState({user});
                        // myProps = this.props;

                    })
                    .catch((error) => {
                        const status = error.response.status;
                        if (status === 401) {
                            // logged in but invalid jwt
                           // this.props.refresh();
                        }
                    });
            }



        }

        // socketRef.current.on("connected", user => {
        //     //socket.emit("send", "joined the server");
        //     setUsers(users => [...users, user]);
        // });

        socketRef.current.on("message", message => {

            setMessages(messages => [...messages, message]);
            //console.log("message"  + messages);

        });



        socketRef.current.on("isHeHost", message => {

            console.log("is host");
            if(message === "yes"){
                setType("host");
                setTeamName("host");
                videoAudioSettings();
            }

        });
        socketRef.current.on("canJoin", message => {

            console.log(message);
            if(message === "yes"){
                setIntroDone(true);
            }else{
              alert("\t\t No room found with that roomcode\t\n  \tPlease check your roomcode and try again\t\t");
            }

            //console.log("message"  + messages);


        });
        socketRef.current.on("users", users => {
            //console.log();
            setUsers(users);
            // console.log("users");
            // console.log(users);
            // {users.map(({ name, id }) => (
            //     //console.log("USERS: "+ id)
            //     //  document.getElementById(id).innerHTML = "whatever"
            //     // <li key={id}>{name}</li>
            // ))}
        });

        socketRef.current.on("teams", teamUsers => {
            //console.log();
            setTeams(teamUsers);
            // console.log("teams");
            // console.log(teamUsers);
            // {teams.map(({ name, id }) => (
            //     //console.log("USERS: "+ id)
            //     //  document.getElementById(id).innerHTML = "whatever"
            //     // <li key={id}>{name}</li>
            // ))}
        });

        socketRef.current.on("update teams", teamUsers => {
            //console.log();
            setTeams([])
            setTeams(teamUsers);
            // console.log("teams");
            // console.log(teamUsers);
            {teams.map(({ name, id }) => (
                console.log("USERS: "+ id)
                //  document.getElementById(id).innerHTML = "whatever"
                // <li key={id}>{name}</li>
            ))}
        });

        socketRef.current.on("joinedRoom", payload => {
            // console.log("joined room:");
            // console.log(payload);

        });




        socketRef.current.on("users in same room", payload => {
            // console.log("users in same room");
            // console.log(payload);
        });
        socketRef.current.on("user joined", payload => {
            console.log("you're next");

            // console.log(peers);
        });






    }, []);


    // peers.map((peer,  index) => {
    //
    //     peer.on('stream', stream => {
    //         console.log("someone has a stream");
    //         //console.log("got a stream ejeej");
    //         //console.log(stream);
    //         // got remote video stream, now let's show it in a video tag
    //          var video = document.getElementById(peersRef.current[index].socketID);
    //         //console.log(peersRef.current[0].socketID);
    //
    //         if ('srcObject' in video) {
    //             video.srcObject = stream
    //
    //         } else {
    //             video.src = window.URL.createObjectURL(stream) // for older browsers
    //         }
    //
    //         video.play();
    //     })
    //
    //
    //
    // });



    function createPeer(userToSignal, callerID, stream) {

        //currentPeer = callerID;
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })
        //currentPeer.current = peer;

        return peer;
    }

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



    const hangup = () => {

      if (userVideo.current.srcObject) {
        userVideo.current.srcObject.getTracks().forEach(track => track.stop());

      }
        socketRef.current.emit("leaving");
        props.history.push('/');
    };


    const videoAudioSettings = () =>{
       // console.log(switchState);
        navigator.mediaDevices.getUserMedia({ video: switchState, audio: true }).then(stream => {

            userAudio.current =  stream.getAudioTracks();

            if(switchState === false){
                // userVideo.current.srcObject = null;
                userVideo.current.poster = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
            }else{
                userVideo.current.srcObject = stream;
                userVideoStream.current = stream.getVideoTracks();
            }

            socketRef.current.emit("join room",roomID);
            socketRef.current.emit("join team", teamName);

            // console.log("emitting room");


            // socketRef.current.on("joinedRoom", payload => {
            //     console.log("joined room:");
            //     console.log(payload);
            //     //socketRef.current.emit("username", userName);
            //
            // });
            // socketRef.current.on("getPeer", payload => {
            //     console.log("mypeer:");
            //     // currentPeer.current = payload;
            //
            //     console.log(payload);
            //
            // });

            socketRef.current.on("all users", users => {

                //console.log(socketRef.current.id);
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                        socketID: socketRef.current.id,
                    })

                    peers.push(peer);
                    socketRef.current.emit("send peer",peer);
                })

                setPeers(peers);
                // console.log("peers");
                // console.log(peers);
                setPeers([...new Set(peers)])
            });

            socketRef.current.on("user joined", payload => {
                console.log("user joined");
                console.log(users);
                const peer = addPeer(payload.signal, payload.callerID, stream);

                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                    socketID: socketRef.current.id,

                })

                setPeers(users => [...users, peer]);

            });

            socketRef.current.on("leaving room signal", () => {
                //console.log("leaving room");
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
                    // console.log("object is null");
                    //props.history.push('/');
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



    // const setStream = () => {
    //
    //
    //
    //     console.log(socketRef.current);
    //    // socketRef.current.peerID.addStream(stream) // <- add streams to peer dynamically
    // }

    // const setNextPage = () => {
    //         setIntroDone(true);
    //         setType(false);
    //
    //
    // };

    const getQuestions = () =>{
        socketRef.current.emit("startGame");
      //  console.log(questions.length);

        console.log(maxRounds);

    };

    const reset = () =>{
        setQuestions(0);
        setRoundNumber(0);
    };

    const getNextQuestions = () =>{
       // socketRef.current.emit("startGame");
        console.log(questionNumber);

        if(questionNumber <= (maxQuestions - 2) ){
           // setquestionNumber(questionNumber+ 1)
            socketRef.current.emit("nextQuestion",  questionNumber+ 1);
        }else{
            setShowRounds(true);
            setShowQuestionBtn(false);
        }

    };

    const getNextRound = () =>{


        if(roundNumber <= (maxRounds -2) ){

            socketRef.current.emit("nextRound",  roundNumber+ 1);
            setMaxQuestions(questions[roundNumber + 1].length);
            setShowQuestionBtn(true);
        }else{
            setShowReview(true);
            setShowRounds(false);
            setShowQuestionBtn(false);
        }


        // socketRef.current.emit("startGame");


    };



    const startSession = () => {
        socketRef.current.emit("username", userName);


        socketRef.current.emit("checkUserType", roomID);



        //setVideoStream(true);
        // console.log(videoStream);
        // setTimeout(function(){
        //
        // }, 1000);

    }



    const handeChangeSwitch = (checked) => {
        console.log("checking checkbox");
        console.log(checked);
        setSwitchState(checked);
    }

    const getReview = () =>{
        props.history.push('/review');
        console.log("Get review");
    };

    const handleTeamNameChange = (e) => {

        setTeamName(e.target.value);

    };
    const setTeamNameSet = () => {

        setTeamNameState(true);
        videoAudioSettings();


    }

    const getUsernames = () =>{
        {peers.map((peer, index) => {
            // console.log("peer");
            // console.log(peers[index]);
        })}
    }

    // const onEnterPress = (e) => {
    //
    //   };

    const submit = event => {
        event.preventDefault();
        // event.stopImmediatePropagation();
        //socket.emit("roomName", nameRoomJoin);
        socketRef.current.emit("send", message);
        setMessage("");
    };

    const handleUsernameInput = (e) => {

        setUsernameOfuser(e.target.value);

    };

    const handleAvatarPath = (e) => {
        //setAvatarOfUser(??)
    };

    const submitAnswersTeam = event => {
        //
        //socket.emit("roomName", nameRoomJoin);

        const answerTeam = [roundNumber, questionNumber, answer, teamName];
        console.log(answerTeam);
        socketRef.current.emit("setAnswer", answerTeam);

        // console.log(questionNumber);
        // console.log(teamName);
        // console.log(answer);

    };
    const submitAnswersForm = event => {
        console.log(isAlreadySubmitted);
        event.preventDefault();
        setIsAlreadySubmitted(true);
        submitAnswersTeam();
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

                    <div id={"vragen"}>
                        <Questions questions={questions} questionNumber={questionNumber} roundNumber={roundNumber}/>
                    </div>


                <section className={(typeOfPlayer === "host" ? 'show' + " room__host__button-container" : 'hidden' + " room__host__button-container")}>
                    <button type={"button"} onClick={getQuestions} className="room__host__button-grid">Get questions</button>
                    <button type={"button"} onClick={getNextQuestions} className={(maxQuestions > 1 ? 'show' + " room__host__button-grid" : 'hidden' + " room__host__button-grid")}>next Question</button>
                    <button type={"button"} onClick={getNextRound} className={(showReview === true ? 'hidden' + " room__host__button-grid" : 'show' + " room__host__button-grid")}>next Round</button>
                    <button type={"button"} onClick={getReview} className={(showReview === true ? 'show' + " room__host__button-grid" : 'hidden' + " room__host__button-grid")}>Review</button>
                </section>



                <article className={"full-width"}>
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

                        <div>
                            <TabContent for="tab1">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div id="messages" className="messages__container">
                                            <AutoscrolledList items={messages} avatar={avatar} />
                                        </div>
                                        <form onSubmit={submit} id="form__chat">
                                            <div className="input-group">
                                                <textarea
                                                    type="text"
                                                    className="form-control whiteText"
                                                    placeholder="Say something..."
                                                    maxLength="280"
                                                    onChange={e => setMessage(e.currentTarget.value)}
                                                    onKeyDown={e =>{
                                                      if(e.keyCode === 13 && e.shiftKey === false) {
                                                        e.preventDefault();
                                                        // console.log("haha ik ben ge enterd");
                                                        // console.log(e);
                                                        const form = document.querySelector("#form__chat");

                                                        if (form !== null) {
                                                            form.dispatchEvent(new Event('submit', {cancelable: true}));
                                                        }
                                                      };
                                                    }}
                                                    value={message}
                                                    id="text"
                                                />
                                                <span className="input-group-btn">
                                                <button id="submit" type="submit" className="btn btn-primary input-group-btn-submit">
                                                  Send
                                                  <img className="input-group-btn-img" src="/img/send.svg" alt="Send Message"/>
                                                </button>
                                              </span>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-4">
                                        <ul id="users">
                                            {users.map(({ name, id }) => (
                                                <li key={id}>{name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                            </TabContent>
                            <TabContent for="tab2" className={(typeOfPlayer === "host" ? 'hidden' : 'show')}>

                                <div className={teamNameStateSet ? "hidden" + " background__inside__team" : "visible" + " background__inside__team"}></div>
                                <div className={teamNameStateSet ? "hidden" + " background__inside__team__shade" : "visible" + " background__inside__team__shade"}></div>
                                <div className={teamNameStateSet ? "hidden" + " teamname__container" : "visible" + " teamname__container"}>
                                    <h2 className="teamname__container-title">Pick a Team Name:</h2>
                                    <input type="text" name="username" value={teamName} onChange={handleTeamNameChange}
                                            maxLength="25"
                                           pattern="^\w+$" maxLength="25" required autoFocus
                                           title="Username" className={"whiteText teamname__container__input"}/>
                                    <button  className="primary-button" type="button" onClick={setTeamNameSet} disabled={teamNameStateSet}>Create / Join</button>
                                    {/*<button onClick={setNextPage}>Next page</button>*/}
                                </div>
                                <div id={"test"}>


                                <div id={"remoteContainer"}>
                                    {/*{peers.length}*/}
                                    <section className="remoteContainer__cams">
                                      {peers.map((peer, index) => {
                                          return (
                                              <div id={peersRef.current[index].peerID} className={"otherPeopleDiv"}>
                                                  {/*<video id={peersRef.current[index].socketID} ></video>*/}
                                                  <Video key={index} peer={peer} socketID={peersRef.current[index].socketID} username={"gebruiker"} type={switchState} />
                                                  {/**/}
                                              </div>
                                          );
                                      })}
                                    </section>
                                    <h2 className={"teamname"}>Teamname: {teamName},  </h2>
                                    <h4><ul className={"usersInTeam"}><li>users:</li>{teams.map(({ name, id }) => ( <li key={id}>{name}, </li>   ))}</ul></h4>
                                </div>
                            </div>

                            </TabContent>
                            <TabContent for="tab3">
                                <form onSubmit={submitAnswersTeam} id="form-answer-team" >

                                    <div className={" input-group" } >
                                        {/*<input type="text" className="form-control" value={roundNumber}   id="text"/>*/}
                                        {/*<input type="text" className="form-control" value={questionNumber}   id="text"/>*/}

                                        <label htmlFor="text">Your answer for question: #{questionNumber}</label>
                                        <input type="text" className="form-control whiteText" value={answer}   onChange={e => setAnswer(e.currentTarget.value)} id="text"/>

                                        <span className="input-group-btn">
                                                <button onClick={submitAnswersForm} className="btn btn-primary">
                                                  Send
                                                </button>
                                              </span>
                                    </div>
                                </form>
                            </TabContent>
                        </div>
                        <div id="ownVideoStream">
                            <StyledVideo muted ref={userVideo} autoPlay playsInline className={"ownVideo"}/>
                            <p>{userName }</p>
                        </div>
                    </Tabs>
                        <MediaControls userVideoStream={userVideoStream} userAudio={userAudio} hangup={hangup} />
                </article>


            </Container>
        );
    }
};

export default Room;
