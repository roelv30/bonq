import React, { useEffect, useRef, useState } from "react";
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

const Container = styled.div`
    height: calc(100% - 6rem);
    padding: 5rem 0;
    z-index:1;
    position:relative;
    text-align:center;    
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
    const [userName, setUsernameOfuser] = useState("no name");
    const [switchState, setSwitchState] = useState(false);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState("team1");
    const [intro, setIntroDone] = useState(false);
    const [typeOfPlayer, setType] = useState();

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
        socketRef.current = io.connect('http://localhost:3001');

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

                        //this.setState({user});
                        // myProps = this.props;

                    })
                    .catch((error) => {
                        const status = error.response.status;
                        if (status === 401 && this.props.isAuthenticated) {
                            // logged in but invalid jwt
                            this.props.refresh();
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





            console.log(message);
            if(message === "no"){
                setType("player");
            }else{
                setType("host");
                setIntroDone(true);
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




    const toggleWithVideo = () => {

    };






    const hangup = () => {

        userVideo.current.srcObject.getTracks().forEach(track => track.stop());
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

    const startSession = () => {
        socketRef.current.emit("username", userName);


        socketRef.current.emit("checkUserType");



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

    const handleUsernameInput = (e) => {

        setUsernameOfuser(e.target.value);

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

                <h6>Users</h6>
                <ul id="users">
                    {users.map(({ name, id }) => (
                        <li key={id}>{name}</li>
                    ))}
                </ul>


                <audio className="audio-element">
                    <source src="https://freesound.org/data/previews/131/131657_2398403-lq.mp3"></source>
                </audio>



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
                        <MediaControls userVideoStream={userVideoStream} userAudio={userAudio} hangup={hangup} />
                </article>


            </Container>
        );
    }
};

export default Room;
