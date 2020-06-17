(this.webpackJsonpbonq=this.webpackJsonpbonq||[]).push([[0],{113:function(e,t){},128:function(e,t){},130:function(e,t){},137:function(e,t,n){},139:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(19),c=n.n(r),l=n(25),u=n(17),i=new Set,s=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i,t=arguments.length>1?arguments[1]:void 0;return"ADD_ROOM"===t.type?new Set([e,t.room]):e},m=function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=arguments.length>1?arguments[1]:void 0;return"SET_AUDIO"===t.type?t.audio:e},v=function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=arguments.length>1?arguments[1]:void 0;return"SET_VIDEO"===t.type?t.video:e},d=Object(u.b)({rooms:s,video:v,audio:m}),h=localStorage.getItem("reduxState")?JSON.parse(localStorage.getItem("reduxState")):{rooms:new Set,video:!0,audio:!0},f=Object(u.c)(d,h);f.subscribe((function(){return localStorage.setItem("reduxState",JSON.stringify(f.getState()))}));var g=f,p=n(35),b=n(2),E=n(68),w=n(69),j=n(75),O=n(73),y=function(e){return o.a.createElement("div",{className:"home",id:"home"},o.a.createElement("div",null,o.a.createElement("h1",{itemProp:"headline"},"Bonq Video Room"),o.a.createElement("p",null,"Please enter a room name or code"),o.a.createElement("form",{onSubmit:e.joinRoom},o.a.createElement("input",{type:"text",name:"room",value:e.roomId,onChange:e.handleChange,pattern:"^\\w+$",maxLength:"10",required:!0,autoFocus:!0,title:"Room name should only contain letters or numbers."}),o.a.createElement("button",{className:"primary-button",type:"submit"},"Join"),o.a.createElement("button",{className:"primary-button",onClick:e.setRoom},"Random"))))},I=n(10),D=n.n(I),N=function(e){Object(j.a)(n,e);var t=Object(O.a)(n);function n(e){var a;return Object(E.a)(this,n),(a=t.call(this,e)).state={value:new Date-(new Date).setHours(0,0,0,0)},a.setRoom=function(){return a.setState({value:new Date-(new Date).setHours(0,0,0,0)})},a.joinRoom=function(e){e.preventDefault(),console.log(a.state.value),a.props.history.push("r/"+a.state.value)},a.handleChange=function(e){return a.setState({value:e.target.value})},console.log("props homepage:"),console.log(e),a}return Object(w.a)(n,[{key:"render",value:function(){return o.a.createElement(y,{roomId:this.state.value,handleChange:this.handleChange,joinRoom:this.joinRoom,setRoom:this.setRoom,rooms:this.props.rooms})}}]),n}(o.a.Component);N.contextTypes={router:D.a.object};var S=Object(l.b)((function(e){return{rooms:e.rooms}}))(N),x=n(74),z=n(26),k=n(37),R=n(24),C=n.n(R),V=n(38),H=n.n(V),M=n(39);function L(){var e=Object(k.a)(["\n    height: 40%;\n    width: 50%;\n"]);return L=function(){return e},e}function B(){var e=Object(k.a)(["\n    padding: 20px;\n    display: flex;\n    height: 100vh;\n    width: 90%;\n    margin: auto;\n    flex-wrap: wrap;\n"]);return B=function(){return e},e}var q=M.a.div(B()),T=M.a.video(L()),F=function(e){var t=Object(a.useRef)();return Object(a.useEffect)((function(){e.peer.on("stream",(function(e){t.current.srcObject=e}))}),[]),o.a.createElement(T,{playsInline:!0,autoPlay:!0,ref:t})},J={height:window.innerHeight/2,width:window.innerWidth/2},_=function(e){var t=Object(a.useState)([]),n=Object(z.a)(t,2),r=n[0],c=n[1],l=Object(a.useState)("audio-button-true"),u=Object(z.a)(l,2),i=u[0],s=u[1],m=Object(a.useState)("video-button-true"),v=Object(z.a)(m,2),d=v[0],h=v[1],f=Object(a.useRef)(),g=Object(a.useRef)(),p=Object(a.useRef)(),b=Object(a.useRef)(),E=Object(a.useRef)([]);e.match.params.roomID;Object(a.useEffect)((function(){f.current=C.a.connect(),console.log("emitting room"),f.current.emit("join room"),f.current.on("joinedRoom",(function(e){console.log("joined room:"),console.log(e)})),navigator.mediaDevices.getUserMedia({video:J,audio:!0}).then((function(t){g.current.srcObject=t,p.current=t.getAudioTracks(),b.current=t.getVideoTracks(),f.current.on("all users",(function(e){var n=[];e.forEach((function(e){var a=function(e,t,n){var a=new H.a({initiator:!0,trickle:!1,stream:n});return a.on("signal",(function(n){f.current.emit("sending signal",{userToSignal:e,callerID:t,signal:n})})),a}(e,f.current.id,t);E.current.push({peerID:e,peer:a,socketID:f.current.id}),n.push(a)})),c(n)})),f.current.on("user joined",(function(e){var n=function(e,t,n){var a=new H.a({initiator:!1,trickle:!1,stream:n});return a.on("signal",(function(e){f.current.emit("returning signal",{signal:e,callerID:t})})),a.signal(e),a}(e.signal,e.callerID,t);E.current.push({peerID:e.callerID,peer:n,socketID:f.current.id}),c((function(e){return[].concat(Object(x.a)(e),[n])}))})),f.current.on("user left",(function(e){e.destroy()})),f.current.on("left",(function(t){var n=document.getElementsByClassName("audio-element")[1];n.volume=.2,n.play();var a=document.getElementById(t);null===a?(console.log("object is null"),e.history.push("/")):a.remove()})),f.current.on("receiving returned signal",(function(e){E.current.find((function(t){return t.peerID===e.id})).peer.signal(e.signal)}))}))}),[]);return o.a.createElement(q,null,o.a.createElement("audio",{className:"audio-element"},o.a.createElement("source",{src:"https://freesound.org/data/previews/253/253886_3169537-lq.mp3"})),o.a.createElement("div",{className:"auth"},o.a.createElement("div",{className:"media-controls"},o.a.createElement("button",{onClick:function(){"audio-button-true"===i?(s("audio-button-false"),p.current[0].enabled=!1):(s("audio-button-true"),p.current[0].enabled=!0)},className:i},o.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 50 50",className:"svg"},o.a.createElement("path",{className:"on",d:"M38 22h-3.4c0 1.49-.31 2.87-.87 4.1l2.46 2.46C37.33 26.61 38 24.38 38 22zm-8.03.33c0-.11.03-.22.03-.33V10c0-3.32-2.69-6-6-6s-6 2.68-6 6v.37l11.97 11.96zM8.55 6L6 8.55l12.02 12.02v1.44c0 3.31 2.67 6 5.98 6 .45 0 .88-.06 1.3-.15l3.32 3.32c-1.43.66-3 1.03-4.62 1.03-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c1.81-.27 3.53-.9 5.08-1.81L39.45 42 42 39.46 8.55 6z",fill:"white"}),o.a.createElement("path",{className:"off",d:"M24 28c3.31 0 5.98-2.69 5.98-6L30 10c0-3.32-2.68-6-6-6-3.31 0-6 2.68-6 6v12c0 3.31 2.69 6 6 6zm10.6-6c0 6-5.07 10.2-10.6 10.2-5.52 0-10.6-4.2-10.6-10.2H10c0 6.83 5.44 12.47 12 13.44V42h4v-6.56c6.56-.97 12-6.61 12-13.44h-3.4z",fill:"white"}))),o.a.createElement("button",{onClick:function(){"video-button-true"===d?(h("video-button-false"),b.current[0].enabled=!1):(h("video-button-true"),b.current[0].enabled=!0)},className:d},o.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 50 50",className:"svg"},o.a.createElement("path",{className:"on",d:"M40 8H15.64l8 8H28v4.36l1.13 1.13L36 16v12.36l7.97 7.97L44 36V12c0-2.21-1.79-4-4-4zM4.55 2L2 4.55l4.01 4.01C4.81 9.24 4 10.52 4 12v24c0 2.21 1.79 4 4 4h29.45l4 4L44 41.46 4.55 2zM12 16h1.45L28 30.55V32H12V16z",fill:"white"}),o.a.createElement("path",{className:"off",d:"M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zm-4 24l-8-6.4V32H12V16h16v6.4l8-6.4v16z",fill:"white"}))),o.a.createElement("button",{onClick:function(){var e=document.documentElement;document.fullscreenEnabled&&(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement?document.exitFullscreen():e.requestFullscreen())},className:"fullscreen-button"},o.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 50 50",className:"svg"},o.a.createElement("path",{className:"on",d:"M10 32h6v6h4V28H10v4zm6-16h-6v4h10V10h-4v6zm12 22h4v-6h6v-4H28v10zm4-22v-6h-4v10h10v-4h-6z",fill:"white"}),o.a.createElement("path",{className:"off",d:"M14 28h-4v10h10v-4h-6v-6zm-4-8h4v-6h6v-4H10v10zm24 14h-6v4h10V28h-4v6zm-6-24v4h6v6h4V10H28z",fill:"white"}))),o.a.createElement("button",{onClick:function(){g.current.srcObject.getTracks().forEach((function(e){return e.stop()})),f.current.emit("leaving"),console.log(e)},className:"hangup-button"},o.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 50 50",className:"svg"},o.a.createElement("path",{d:"M24 18c-3.21 0-6.3.5-9.2 1.44v6.21c0 .79-.46 1.47-1.12 1.8-1.95.98-3.74 2.23-5.33 3.7-.36.35-.85.57-1.4.57-.55 0-1.05-.22-1.41-.59L.59 26.18c-.37-.37-.59-.87-.59-1.42 0-.55.22-1.05.59-1.42C6.68 17.55 14.93 14 24 14s17.32 3.55 23.41 9.34c.37.36.59.87.59 1.42 0 .55-.22 1.05-.59 1.41l-4.95 4.95c-.36.36-.86.59-1.41.59-.54 0-1.04-.22-1.4-.57-1.59-1.47-3.38-2.72-5.33-3.7-.66-.33-1.12-1.01-1.12-1.8v-6.21C30.3 18.5 27.21 18 24 18z",fill:"white"}))))),o.a.createElement("div",{id:"test"},o.a.createElement(T,{muted:!0,ref:g,autoPlay:!0,playsInline:!0}),r.map((function(e,t){return console.log("peers"),console.log(E.current[t].peerID),o.a.createElement("div",{id:E.current[t].peerID},o.a.createElement(F,{key:t,peer:e,socketID:e.socketID}))}))))};n(137);C.a.connect("http://localhost:3001").on("leaving user homepage",(function(){var e=document.getElementsByClassName("audio-element")[0];e.volume=.1,e.play()})),c.a.render(o.a.createElement(l.a,{store:g},o.a.createElement(p.a,null,o.a.createElement("audio",{className:"audio-element"},o.a.createElement("source",{src:"https://freesound.org/data/previews/131/131657_2398403-lq.mp3"})),o.a.createElement(b.a,{exact:!0,path:"/",component:S}),o.a.createElement(b.a,{path:"/r/:roomID",component:_}))),document.getElementById("app"))},76:function(e,t,n){e.exports=n(139)}},[[76,1,2]]]);
//# sourceMappingURL=main.84b400c4.chunk.js.map