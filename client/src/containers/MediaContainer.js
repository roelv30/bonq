import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types';
import styled from "styled-components";
const peerConnection = new RTCPeerConnection();
let initialmessage = [];



export default class MediaBridge extends React.Component {

  static propTypes = {
    socket: PropTypes.object.isRequired,
    getUserMedia: PropTypes.object.isRequired,
    media: PropTypes.func.isRequired,
  }
  state = {
    bridge: '',
    user: ''
  }






    updateUserList(socketIds) {
        const activeUserContainer = document.getElementById("active-user-container");

        for (var i = 0; i < socketIds.length; i++) {
            const alreadyExistingUser = document.getElementById(socketIds[i]);
                if (!alreadyExistingUser) {
                    const userContainerEl = this.createUserItemContainer(socketIds[i]);
                    activeUserContainer.appendChild(userContainerEl);
                }
        }
        // socketIds.forEach(socketId => {
        //     const alreadyExistingUser = document.getElementById(socketId);
        //     if (!alreadyExistingUser) {
        //         const userContainerEl = this.createUserItemContainer(socketId);
        //         activeUserContainer.appendChild(userContainerEl);
        //     }
        // });
    }
    createUserItemContainer(socketId) {

        // <video className="remote-video" id="remote-video" ref={(ref) => this.remoteVideo = ref} autoPlay></video>
        const userContainerEl = document.createElement("video");

        // const usernameEl = document.createElement("p");

        userContainerEl.setAttribute("class", "remote-video");
        userContainerEl.setAttribute("id", socketId);
        userContainerEl.setAttribute("ref", this.remoteVideo);
        // usernameEl.innerHTML = `Socket: ${socketId}`;

       // userContainerEl.appendChild(usernameEl);


        userContainerEl.addEventListener("click", () => {
            //unselectUsersFromList();
            userContainerEl.setAttribute("class", "active-user active-user--selected");
            const talkingWithInfo = document.getElementById("talking-with-info");
            talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
            //callUser(socketId);
        });
        return userContainerEl;
    }
  componentWillMount() {

    // chrome polyfill for connection between the local device and a remote peer
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;
    this.props.media(this);


  }

  componentDidMount() {

    this.props.getUserMedia
      .then(stream => {
          this.localStream = stream;
          this.localVideo.srcObject = stream;
          initialmessage = [stream.id];
          //this.localVideo.src = stream;
        });
    this.props.socket.on('message', this.onMessage);
    this.props.socket.on('hangup', this.onRemoteHangup);

      this.props.socket.on("update-user-list", ({ users }) => {
          console.log("users");
          console.log(users);
          this.updateUserList(users);
      });

      this.props.socket.on("remove-user", ({ socketId }) => {
          const elToRemove = document.getElementById(socketId);

          if (elToRemove) {
              elToRemove.remove();
          }
      });
  }
  componentWillUnmount() {
    this.props.media(null);
    if (this.localStream !== undefined) {
      this.localStream.getVideoTracks()[0].stop();
    }
    this.props.socket.emit('leave');
  }
  onRemoteHangup = () => this.setState({user: 'host', bridge: 'host-hangup'})
  onMessage = message => {
      if (message.type === 'offer') {
          // set remote description and answer
          this.pc.setRemoteDescription(new RTCSessionDescription(message));
          this.pc.createAnswer()
            .then(this.setDescription)
            .then(this.sendDescription)
            .catch(this.handleError); // An error occurred, so handle the failure to connect

      } else if (message.type === 'answer') {
          // set remote description
          this.pc.setRemoteDescription(new RTCSessionDescription(message));
      } else if (message.type === 'candidate') {
          // add ice candidate
          this.pc.addIceCandidate(
              new RTCIceCandidate({
                  sdpMLineIndex: message.mlineindex,
                  candidate: message.candidate
              })
          );
      }
  }
  sendData(msg) {
    this.dc.send(JSON.stringify(msg))
  }
  // Set up the data channel message handler
  setupDataHandlers() {
      this.dc.onmessage = e => {
          var msg = JSON.parse(e.data);
          console.log('received message over data channel:' + msg);
      };
      this.dc.onclose = () => {
        this.remoteStream.getVideoTracks()[0].stop();
        console.log('The Data Channel is Closed');
      };
  }
  setDescription = offer => this.pc.setLocalDescription(offer)
  // send the offer to a server to be forwarded to the other peer
  sendDescription = () => this.props.socket.send(this.pc.localDescription)
  hangup() {
    this.setState({user: 'guest', bridge: 'guest-hangup'});
    this.pc.close();
    this.props.socket.emit('leave');
  }


  handleError = e => console.log(e);
  init() {

    // wait for local media to be ready
    const attachMediaIfReady = () => {
      this.dc = this.pc.createDataChannel('chat');
      this.setupDataHandlers();
      console.log('attachMediaIfReady')
      this.pc.createOffer()
        .then(this.setDescription)
        .then(this.sendDescription)
        .catch(this.handleError); // An error occurred, so handle the failure to connect
    }
    // set up the peer connection
    // this is one of Google's public STUN servers
    // make sure your offer/answer role does not change. If user A does a SLD
    // with type=offer initially, it must do that during  the whole session
    this.pc = new RTCPeerConnection({iceServers: [{url: 'stun:stun.l.google.com:19302'}]});
    // when our browser gets a candidate, send it to the peer
    this.pc.onicecandidate = e => {
        console.log(e, 'onicecandidate');
        if (e.candidate) {
            this.props.socket.send({
                type: 'candidate',
                mlineindex: e.candidate.sdpMLineIndex,
                candidate: e.candidate.candidate
            });
        }
    };
      console.log("this.socket.id");
      console.log(this.props.socket.id);
      this.pc.ontrack = function({ streams: [stream] }) {
           const remoteVideo = document.getElementsByClassName("remote-video");

          if (remoteVideo) {
              remoteVideo.srcObject = stream;
          }
      };
      navigator.getUserMedia(
          { video: true, audio: true },
          stream => {
              const localVideo = document.getElementById("local-video");
              if (localVideo) {
                  localVideo.srcObject = stream;
              }

              stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
          },
          error => {
              console.warn(error.message);
          }
      );
    // when the other side added a media stream, show it on screen
    this.pc.onaddstream = e => {





        // console.log('onaddstream', e)
        this.remoteStream = e.stream;

        console.log( e.stream.id);
       // this.remoteVideo.srcObject = e.stream;

        //this.remoteVideo.src = window.URL.createObjectURL(this.remoteStream);
        this.setState({bridge: 'established'});
    };

    this.pc.ondatachannel = e => {
        // data channel
        this.dc = e.channel;
        this.setupDataHandlers();
        this.sendData({
          peerMediaStream: {
            video: this.localStream.getVideoTracks()[0].enabled
          }
        });
        //sendData('hello');
    };
    // attach local media to the peer connection
    this.pc.addStream(this.localStream);
    // call if we were the last to connect (to increase chances that everything is set up properly at both ends)
    if (this.state.user === 'host') {
      this.props.getUserMedia.then(attachMediaIfReady);
    }


  }

  render(){

      return (
          <div className={`media-bridge ${this.state.bridge}`}>
              <video className="remote-video" ref={(ref) => this.remoteVideo = ref} autoPlay></video>
              <video className="local-video" ref={(ref) => this.localVideo = ref} autoPlay muted></video>
          </div>
      );
  }
}


