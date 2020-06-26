import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {bool} from "prop-types";
import Video from "../components/Video"
import Switch from "react-switch";
import Back from '../extern/Back';

import moment from "moment";
import 'react-tabs/style/react-tabs.css';
import { Tabs, TabLink, TabContent } from 'react-tabs-redux';
import AutoscrolledList from "./AutoscrolledList";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    // height: 40%;
    // width: 50%;
`;




const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


const Room = (props) => {

    const [peers, setPeers] = useState([]);
    const [muted, setMuteIcon] = useState("audio-button-true");
    const [videoIcon, setVideoIcon] = useState("video-button-true");
    const [userName, setUsernameOfuser] = useState("no name");
    const [switchState, setSwitchState] = useState(false);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("team1");
    const [intro, setIntroDone] = useState(false);

    const [teamNameStateSet, setTeamNameState] = useState(false);

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


    useEffect(() => {
        socketRef.current = io.connect('/');

        // socketRef.current.on("connected", user => {
        //     //socket.emit("send", "joined the server");
        //     setUsers(users => [...users, user]);
        // });

        socketRef.current.on("message", message => {

            setMessages(messages => [...messages, message]);
            //console.log("message"  + messages);



        });

        socketRef.current.on("users", users => {
            //console.log();
            setUsers(users);
            // console.log("users");
            // console.log(users);
            {users.map(({ name, id }) => (
                //console.log("USERS: "+ id)
                //  document.getElementById(id).innerHTML = "whatever"
                // <li key={id}>{name}</li>
            ))}
        });

        socketRef.current.on("teams", teamUsers => {
            //console.log();
            setTeams(teamUsers);
            // console.log("teams");
            // console.log(teamUsers);
            {teams.map(({ name, id }) => (
                //console.log("USERS: "+ id)
                //  document.getElementById(id).innerHTML = "whatever"
                // <li key={id}>{name}</li>
            ))}
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


    const muteSelf = () => {


        if(muted === "audio-button-true"){
            setMuteIcon("audio-button-false");
            userAudio.current[0].enabled = false;
        }else{
            setMuteIcon("audio-button-true");
            userAudio.current[0].enabled = true;
        }

    }
    const disableVideo = () => {

        if(videoIcon === "video-button-true"){
            setVideoIcon("video-button-false");
            userVideoStream.current[0].enabled = false;
        }else{
            setVideoIcon("video-button-true");
            userVideoStream.current[0].enabled = true;

        }

    }

    const ToggleFullScreen = () => {
        const el = document.documentElement;
        // full-screen available?
        if (document.fullscreenEnabled) {
            // are we full-screen?
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
        }
    };

    const toggleWithVideo = () => {

    };






    const hangup = () => {
        userVideo.current.srcObject.getTracks().forEach(track => track.stop());
        socketRef.current.emit("leaving");
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
                //console.log("USER LEFT");
                peer.destroy();

            });

            socketRef.current.on("left", payload => {

                const audioEl = document.getElementsByClassName("audio-element")[0];
                if(audioEl != null){
                    audioEl.volume = 0.2;
                    audioEl.play();
                }

               // console.log("USER LEFT");
                //  console.log(payload);

                // var videoObject = document.getElementById(payload);
                // if(videoObject === null){
                //     // console.log("object is null");
                //     //props.history.push('/');
                // }else{
                //     videoObject.remove();
                // }

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

    const startSession = () => {
        socketRef.current.emit("username", userName);


        setIntroDone(true);
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

    const handleUsernameInput = (e) => {

        setUsernameOfuser(e.target.value);

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


    const submit = event => {
        event.preventDefault();
        //socket.emit("roomName", nameRoomJoin);
        socketRef.current.emit("send", message);
        setMessage("");
    };



    if(intro === false) {
        return (
            <Container>
              <Back text="&larr; back" link="/dashboard"/>


                <section>
                    <h2>Choose a username</h2>
                    <input type="text" name="username" value={userName} onChange={handleUsernameInput} className={"whiteText"}
                           pattern="^\w+$" maxLength="20" required autoFocus
                           title="Username"/>
                    <button className="primary-button" type="button" onClick={startSession}>Set username</button>
                    {/*<button onClick={setNextPage}>Next page</button>*/}
                </section>




                <section>
                    <h2>Enable camera?</h2>
                    <Switch onChange={handeChangeSwitch} checked={switchState}  />
                </section>

                <section>
                    Chosen name:  {userName}
                </section>
            </Container>

        );

    }


    if(intro === true) {

        return (

            <Container>
                <h6>Users</h6>
                <ul id="users">
                    {users.map(({ name, id }) => (
                        <li key={id}>{name}</li>
                    ))}
                </ul>


                <audio className="audio-element">
                    <source src="https://freesound.org/data/previews/131/131657_2398403-lq.mp3"></source>
                </audio>



                <div className="auth">


                </div>


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
                                <TabLink to="tab3">Options </TabLink>
                            </li>
                        </ul>

                        <div>
                            <TabContent for="tab1">




                                <div className="row">
                                    <div className="col-md-8">
                                        <h6>Messages</h6>
                                        <div id="messages">
                                            <AutoscrolledList items={messages} />
                                        </div>
                                        <form onSubmit={submit} id="form">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={e => setMessage(e.currentTarget.value)}
                                                    value={message}
                                                    id="text"
                                                />
                                                <span className="input-group-btn">
                <button id="submit" type="submit" className="btn btn-primary">
                  Send
                </button>
              </span>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-4">
                                        <h6>Users</h6>
                                        <ul id="users">
                                            {users.map(({ name, id }) => (
                                                <li key={id}>{name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>












                            </TabContent>
                            <TabContent for="tab2">

                                <div className={teamNameStateSet ? "hidden" : "visible"}>
                                    <h2>Choose a Teamname</h2>
                                    <input type="text" name="username" value={teamName} onChange={handleTeamNameChange} className={"whiteText"}
                                           pattern="^\w+$" maxLength="20" required autoFocus
                                           title="Username"/>
                                    <button  className="primary-button" type="button" onClick={setTeamNameSet} disabled={teamNameStateSet}>Set team name</button>
                                    {/*<button onClick={setNextPage}>Next page</button>*/}
                                </div>
                                <div id={"test"}>


                                <div id={"remoteContainer"}>
                                    {/*{peers.length}*/}

                                    {peers.map((peer, index) => {
                                        return (
                                            <div id={peersRef.current[index].peerID} className={"otherPeopleDiv"}>
                                                {/*<video id={peersRef.current[index].socketID} ></video>*/}
                                                <Video key={index} peer={peer} socketID={peersRef.current[index].socketID} username={"gebruiker"} type={switchState} />
                                                {/**/}
                                            </div>
                                        );
                                    })}
                                    <h2 className={"teamname"}>Teamname: {teamName},  </h2>
                                    <h4><ul className={"usersInTeam"}><li>users:</li>{teams.map(({ name, id }) => ( <li key={id}>{name}, </li>   ))}</ul></h4>
                                </div>
                            </div>

                            </TabContent>
                            <TabContent for="tab3">Content 3 /* empty in HTML */</TabContent>
                        </div>
                        <div id="ownVideoStream">
                            <StyledVideo muted ref={userVideo} autoPlay playsInline className={"ownVideo"}/>
                            <p>{userName }</p>
                        </div>
                    </Tabs>


                        <div className="media-controls" >
                            <button onClick={muteSelf} className={muted}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
                                    <path className="on"
                                          d="M38 22h-3.4c0 1.49-.31 2.87-.87 4.1l2.46 2.46C37.33 26.61 38 24.38 38 22zm-8.03.33c0-.11.03-.22.03-.33V10c0-3.32-2.69-6-6-6s-6 2.68-6 6v.37l11.97 11.96zM8.55 6L6 8.55l12.02 12.02v1.44c0 3.31 2.67 6 5.98 6 .45 0 .88-.06 1.3-.15l3.32 3.32c-1.43.66-3 1.03-4.62 1.03-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c1.81-.27 3.53-.9 5.08-1.81L39.45 42 42 39.46 8.55 6z"
                                          fill="white"></path>
                                    <path className="off"
                                          d="M24 28c3.31 0 5.98-2.69 5.98-6L30 10c0-3.32-2.68-6-6-6-3.31 0-6 2.68-6 6v12c0 3.31 2.69 6 6 6zm10.6-6c0 6-5.07 10.2-10.6 10.2-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c6.56-.97 12-6.61 12-13.44h-3.4z"
                                          fill="white"></path>
                                </svg>
                            </button>
                            <button onClick={disableVideo} className={videoIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
                                    <path className="on"
                                          d="M40 8H15.64l8 8H28v4.36l1.13 1.13L36 16v12.36l7.97 7.97L44 36V12c0-2.21-1.79-4-4-4zM4.55 2L2 4.55l4.01 4.01C4.81 9.24 4 10.52 4 12v24c0 2.21 1.79 4 4 4h29.45l4 4L44 41.46 4.55 2zM12 16h1.45L28 30.55V32H12V16z"
                                          fill="white"></path>
                                    <path className="off"
                                          d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm-4 24l-8-6.4V32H12V16h16v6.4l8-6.4v16z"
                                          fill="white"></path>
                                </svg>
                            </button>
                            <button onClick={ToggleFullScreen} className="fullscreen-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
                                    <path className="on"
                                          d="M10 32h6v6h4V28H10v4zm6-16h-6v4h10V10h-4v6zm12 22h4v-6h6v-4H28v10zm4-22v-6h-4v10h10v-4h-6z"
                                          fill="white"></path>
                                    <path className="off"
                                          d="M14 28h-4v10h10v-4h-6v-6zm-4-8h4v-6h6v-4H10v10zm24 14h-6v4h10V28h-4v6zm-6-24v4h6v6h4V10H28z"
                                          fill="white"></path>
                                </svg>
                            </button>


                            <button onClick={hangup} className="hangup-button">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="svg">
                                    <path
                                        d="M24 18c-3.21 0-6.3.5-9.2 1.44v6.21c0 .79-.46 1.47-1.12 1.8-1.95.98-3.74 2.23-5.33 3.7-.36.35-.85.57-1.4.57-.55 0-1.05-.22-1.41-.59L.59 26.18c-.37-.37-.59-.87-.59-1.42 0-.55.22-1.05.59-1.42C6.68 17.55 14.93 14 24 14s17.32 3.55 23.41 9.34c.37.36.59.87.59 1.42 0 .55-.22 1.05-.59 1.41l-4.95 4.95c-.36.36-.86.59-1.41.59-.54 0-1.04-.22-1.4-.57-1.59-1.47-3.38-2.72-5.33-3.7-.66-.33-1.12-1.01-1.12-1.8v-6.21C30.3 18.5 27.21 18 24 18z"
                                        fill="white"></path>
                                </svg>
                            </button>
                        </div>



                </article>


            </Container>
        );
    }
};

export default Room;
