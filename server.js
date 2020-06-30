const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');
const WebSocket = require('ws');
const port = process.env.PORT || 3001;
// const  Server = require('ws');
// const wss = new WebSocket.Server({ port: port });

const room_size = 6;

const app = express();

//Serve static files from the React app
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


var activeSockets =  [];
var arrayOfUsersinThisRoom = [];
const server = app.listen(port);
// wss = new Server({ app });

var io = require('socket.io')(server);

const users = {};
const socketToRoom = {};
const socketToTeam = {};
const usersConnected = {};

const answers = {};

var request = require('request');

request({url: 'https://bonq-api.herokuapp.com/api/getRooms', json: true}, function(err, res, json) {
    if (err) {
        throw err;
    }
    json.forEach(myFunction);
    // console.log(json);
});


function myFunction(item, index) {
    if (users[item.room_id]) {
        // const length = teams[payload].length;
        // if (length === room_size) {
        //     socket.emit("room full");
        //     return;
        // }

        console.log("found one");
        //console.log(users[roomNumber][payload]);
        //      users[item.room_id].push(item.room_id);
        //teams[payload].push(socket.id);

    } else {
        users[item.room_id] = [];
        console.log("none found");
        //teams[payload] = [socket.id];


        ///let payload = {[ {"name":"tomato", "howMany": 3} ]}[payload]
        // users[roomNumber] = payload[socket.id];
        //users[roomNumber][payload].push(socket.id);
        //console.log(users);
    }

    // document.getElementById("demo").innerHTML += index + ":" + item + "<br>";
}


io.on('connection', socket => {



    socket.on("setAnswer", payload => {
        console.log(answers);

        let roomIdFromClient = socket.handshake.headers.referer;
        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }

        if (answers[roomNumber]) {
            //console.log("team is already existing");
            // if(users[roomNumber][payload]){
            //     users[roomNumber][payload].push(socket.id);
            // }else{
            //     users[roomNumber][payload] = [socket.id];
            // }
            //console.log(answers[roomNumber][]);
            if(answers[roomNumber][payload[3]]){
                answers[roomNumber][payload[3]].push({"round": payload[0], "question": payload[1], "answer": payload[2]});
            }else{
                answers[roomNumber][payload[3]] = [{"round": payload[0], "question": payload[1], "answer": payload[2]}];
            }

        } else {
            answers[roomNumber] = {[payload[3]] : [{"round": payload[0], "question": payload[1], "answer": payload[2]}]};
        }


        //console.log(answers[roomNumber]);
    });

    socket.on("startGame", () => {
        let roomIdFromClient = socket.handshake.headers.referer;
        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }
        //



        request('https://bonq-api.herokuapp.com/api/getQuestions/' + roomNumber, { json: true }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            io.to(roomNumber).emit('questions', body[0].rounds_array);
            console.log(body[0].rounds_array);

        });

    });

    //console.log(users);


    socket.on("retrievedUser", (userFromDB) => {
        console.log(socket.id);
        users[socket.id].name = userFromDB.username;
        //console.log(users[socket.id]);
    });

    socket.on("getUserName", () => {
        console.log("getUserName");
        console.log(socket.id);
        console.log(users[socket.id].name);

    });


    socket.on("checkUserType", () => {

        let roomIdFromClient = socket.handshake.headers.referer;

        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }
        io.to(socket.id).emit('isHeHost', "yes");
        // if(users[roomNumber]  && users[socket.id] != "host"){
        //     io.to(socket.id).emit('isHeHost', "yes");
        // }else{
        //     io.to(socket.id).emit('isHeHost', "no");
        // }

    });

    socket.on("username", username => {
        const user = {
            name: null,
            id: socket.id,
            team: null,
            type: "player"
        };
        users[socket.id] = user;

        users[socket.id].name = username;




        //usersConnected[socket.id] = user;
        // console.log(users[socket.id]);
        //io.to(roomNumber).emit("connected", user);
        //io.to(roomNumber).emit("users", Object.values(usersConnected));
        //const usersInThisRoom = users[roomNumber].filter(id => id !== socket.id);
        //io.to(roomNumber).emit('users', users[usersInThisRoom]);


        //console.log("sending");
        //io.to(socket.id).emit("users", Object.values(users));
        //io.to(roomNumber).emit("users", Object.values(users));
        // console.log(arrayOfUsersinThisRoom);
        //  io.to(socket.id).emit("users", Object.values(users));
        //  io.to(roomNumber).emit("users", Object.values(users));
    });


    //console.log(test[1]);
    socket.on("join room", roomID => {
        let roomIdFromClient = socket.handshake.headers.referer;
        arrayOfUsersinThisRoom = [];
        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }
        io.emit("joinedRoom", roomNumber);
        socket.join(roomNumber);

        // if (users[roomNumber]) {
        //     const length = users[roomNumber].length;
        //     if (length === room_size) {
        //         socket.emit("room full");
        //         return;
        //     }
        //     users[roomNumber].push(socket.id);
        // } else {
        //     users[roomNumber] = [socket.id];
        // }

        // if (users[roomNumber]) {
        //     let sizeOfUsers = Object.keys(users).length;
        //     // console.log(sizeOfUsers );
        //
        //
        //     const usersInThisRoom2 = users[roomNumber].filter(id => id !== socket.id);
        //     console.log("usersInThisRoom2");
        //     console.log(users[roomNumber]);
        //     // console.log(usersInThisRoom2);
        //     users[roomNumber].forEach(myFunction);
        //     function myFunction(item, index) {
        //         // console.log(item);
        //         arrayOfUsersinThisRoom.push(users[item])
        //     }
        //
        //     io.to(socket.id).emit("users", arrayOfUsersinThisRoom);
        //     io.to(roomNumber).emit('users', arrayOfUsersinThisRoom);
        // }


        // console.log("room");
        // console.log(users);
        //console.log(usersInThisRoom);

        // usersInThisRoom.forEach(myFunction);
        //
        // function myFunction(item, index) {
        //     arrayOfUsersinThisRoom.push(users[item])
        // }
        // io.to(roomNumber).emit('users in same room', arrayOfUsersinThisRoom);
        // console.log(arrayOfUsersinThisRoom);
        // if(usersInThisRoom.length > 0)
        // {
        //
        //
        // }

        // console.log("user joined room: " + roomNumber);



        // if(usersInThisRoom.length > 0){
        //     // const usersInThisRoom2 = users[usersInThisRoom].filter(id => id === id.name);
        //
        //     io.to(roomID).emit('users in same room', users[usersInThisRoom]);
        //     //console.log();
        // }

        //io.to(socket.id).emit("users", Object.values(users));
        //io.to(roomNumber).emit("users", Object.values(users));
        // const usersInThisRoom = users[roomNumber].filter(id => id !== socket.id);
        // io.emit("joinedRoom", roomNumber);
        // socket.join(roomNumber);
        socketToRoom[socket.id] = roomNumber;
        // console.log(usersInThisRoom);
        // io.to(socket.id).emit("all users", usersInThisRoom)
        //socket.emit("all users", usersInThisRoom);


        //socket.emit("all users", usersInThisRoom);
        //io.to(socket.id).emit("users", Object.values(users));
        //io.to(roomNumber).emit("users", Object.values(users));
    });

    socket.on("send", message => {
        let roomIdFromClient = socket.handshake.headers.referer;
        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }
        //console.log("User:"  +user);
        io.to(roomNumber).emit("message", {
            text: message,
            date: new Date().toISOString(),
            user: users[socket.id]
        });

        ///console.log("got a message");
        //
        // io.emit("message", {
        //   text: message,
        //   date: new Date().toISOString(),
        //   user: users[client.id]
        // });
    });

    socket.on("send peer", payload => {
        io.to(socket.id).emit('getPeer', payload);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    // socket.on("leaving", () => {
    //
    //     const roomID = socketToRoom[socket.id];
    //     io.to(roomID).emit('left', socket.id);
    //     io.to(socket.id).emit('leaving user homepage');
    //     io.to(socket.id).emit('leaving room signal');
    //     //console.log(roomID);
    //     let room = users[roomID];
    //     if (room) {
    //         room = room.filter(id => id !== socket.id);
    //         users[roomID] = room;
    //     }
    //     //delete users[socket.id];
    //     socket.leave(roomID);
    //
    // });



    socket.on("join team", payload => {
        let roomIdFromClient = socket.handshake.headers.referer;
        console.log(users[socket.id]);
        arrayOfUsersinThisRoom = [];
        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }
        users[socket.id].team = payload;
        //console.log(users[socket.id]);
        // console.log(payload);
        arrayOfUsersinThisTeam = [];
        //console.log(users[roomNumber]);
        if (users[roomNumber]) {
            // const length = teams[payload].length;
            // if (length === room_size) {
            //     socket.emit("room full");
            //     return;
            // }

            if(users[roomNumber][payload]){
                users[roomNumber][payload].push(socket.id);
            }else{
                users[roomNumber][payload] = [socket.id];
            }
            //console.log(users[roomNumber][payload]);

            //teams[payload].push(socket.id);

        } else {
            //teams[payload] = [socket.id];

            users[roomNumber] = {[payload] : [socket.id]};
            ///let payload = {[ {"name":"tomato", "howMany": 3} ]}[payload]
            // users[roomNumber] = payload[socket.id];
            //users[roomNumber][payload].push(socket.id);
            //console.log(users);
        }
        //console.log("users");
        //console.log(users);

        if (users[roomNumber][payload]) {
            let sizeOfUsers = Object.keys(users[roomNumber][payload]).length;
            // console.log(sizeOfUsers );


            // const usersInThisTeam = users[roomNumber][payload].filter(id => id !== socket.id);

            users[roomNumber][payload].forEach(myFunction);
            function myFunction(item, index) {
                // console.log(item);
                arrayOfUsersinThisTeam.push(users[item])
            }
            // console.log("arrayOfUsersinThisTeam");
            // console.log(arrayOfUsersinThisTeam);
            //io.to(socket.id).emit("teams", arrayOfUsersinThisTeam);


            arrayOfUsersinThisTeam.forEach(myFunction2);
            function myFunction2(item, index) {
                // console.log("item");
                //console.log("payload");
                //console.log();

                io.to(item.id).emit('teams', arrayOfUsersinThisTeam);
                // console.log(item);
                // arrayOfUsersinThisTeam.push(users[item])
            }

        }
        socketToTeam[socket.id] = payload;

        const usersInThisTeam = users[roomNumber][payload].filter(id => id !== socket.id);

        io.to(socket.id).emit("all users", usersInThisTeam)

        // console.log("teams");
        // console.log(teams);
        // const usersInThisRoom = users[roomNumber].filter(id => id !== socket.id);
        // io.emit("joinedRoom", roomNumber);
        // socket.join(roomNumber);
        // socketToRoom[socket.id] = roomNumber;
        // console.log(usersInThisRoom);
        // io.to(socket.id).emit("all users", usersInThisRoom)

    });

    socket.on('disconnect', () => {
        let roomIdFromClient = socket.handshake.headers.referer;
        arrayOfUsersinThisTeam = [];

        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }

        const roomID = socketToRoom[socket.id];
        const teamID = socketToTeam[socket.id];
        console.log("a user left");
        io.to(roomID).emit('left', socket.id);
        //console.log(roomID);
        // let room = users[roomID];
        // if (room) {
        //     room = room.filter(id => id !== socket.id);
        //     users[roomID] = room;
        // }

        if(teamID != null){
            let test = users[roomID][teamID];
            if (test) {
                test = test.filter(id => id !== socket.id);
                users[roomNumber][teamID] = test;
            }
        }
        //socket.leave(teamID);
        socket.leave(roomID);

        //update team names in certain team.
        if(users[roomNumber]){
            if (users[roomNumber][teamID]) {
                let sizeOfUsers = Object.keys(users[roomNumber][teamID]).length;
                // console.log(sizeOfUsers );

                users[roomID][teamID].forEach(myFunction);
                function myFunction(item, index) {
                    console.log(item);
                    arrayOfUsersinThisTeam.push(users[item])
                }

                arrayOfUsersinThisTeam.forEach(myFunction2);
                function myFunction2(item, index) {
                    console.log("item");
                    //console.log("payload");
                    //console.log();

                    io.to(item.id).emit('update teams', arrayOfUsersinThisTeam);
                    // console.log(item);
                    // arrayOfUsersinThisTeam.push(users[item])
                }

                //io.to(socket.id).emit("update teams", arrayOfUsersinThisTeam);
                //io.to(roomNumber).emit('update teams', arrayOfUsersinThisTeam);
            }
        }


        //update all user lists
        // if (users[roomID]) {
        //     let sizeOfUsers = Object.keys(users).length;
        //     // console.log(sizeOfUsers );
        //
        //
        //     const usersInThisRoom2 = users[roomID].filter(id => id !== socket.id);
        //     // console.log("usersInThisRoom2");
        //     // console.log(users[roomNumber]);
        //     // console.log(usersInThisRoom2);
        //     users[roomID].forEach(myFunction);
        //     function myFunction(item, index) {
        //         // console.log(item);
        //         arrayOfUsersinThisRoom.push(users[item])
        //     }
        //
        //     io.to(socket.id).emit("users", arrayOfUsersinThisRoom);
        //     io.to(roomID).emit('users', arrayOfUsersinThisRoom);
        // }

        // if (teams[teamID]) {
        //     let sizeOfUsers = Object.keys(teams).length;
        //     // console.log(sizeOfUsers );
        //
        //     const usersInThisTeam = teams[teamID].filter(id => id !== socket.id);
        //
        //     teams[teamID].forEach(myFunction);
        //     function myFunction(item, index) {
        //         // console.log(item);
        //         arrayOfUsersinThisTeam.push(users[item])
        //     }
        //     // console.log("arrayOfUsersinThisTeam");
        //     // console.log(arrayOfUsersinThisTeam);
        //     //io.to(socket.id).emit("teams", arrayOfUsersinThisTeam);
        //
        //
        //     arrayOfUsersinThisTeam.forEach(myFunction2);
        //     function myFunction2(item, index) {
        //         console.log("item");
        //         //console.log("payload");
        //         //console.log();
        //
        //         io.to(item.id).emit('update team', arrayOfUsersinThisTeam);
        //         // console.log(item);
        //         // arrayOfUsersinThisTeam.push(users[item])
        //     }
        //
        // }


        //delete teams[socket.id];


    });

    socket.on('leaving', () => {
        let roomIdFromClient = socket.handshake.headers.referer;
        arrayOfUsersinThisTeam = [];

        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }


        const roomID = socketToRoom[socket.id];
        const teamID = socketToTeam[socket.id];
        console.log("a user left");
        io.to(roomID).emit('left', socket.id);
        //console.log(roomID);
        // let room = users[roomID];
        // if (room) {
        //     room = room.filter(id => id !== socket.id);
        //     users[roomID] = room;
        // }

        if(teamID != null){
            let test = users[roomID][teamID];
            if (test) {
                test = test.filter(id => id !== socket.id);
                users[roomNumber][teamID] = test;
            }
        }
        //socket.leave(teamID);
        socket.leave(roomID);

        //update team names in certain team.
        if(users[roomNumber]){
            if (users[roomNumber][teamID]) {
                let sizeOfUsers = Object.keys(users[roomNumber][teamID]).length;
                // console.log(sizeOfUsers );

                users[roomID][teamID].forEach(myFunction);
                function myFunction(item, index) {
                    console.log(item);
                    arrayOfUsersinThisTeam.push(users[item])
                }

                arrayOfUsersinThisTeam.forEach(myFunction2);
                function myFunction2(item, index) {
                    console.log("item");
                    //console.log("payload");
                    //console.log();

                    io.to(item.id).emit('update teams', arrayOfUsersinThisTeam);
                    // console.log(item);
                    // arrayOfUsersinThisTeam.push(users[item])
                }

                //io.to(socket.id).emit("update teams", arrayOfUsersinThisTeam);
                //io.to(roomNumber).emit('update teams', arrayOfUsersinThisTeam);
            }
        }
        io.to(roomID).emit('left', socket.id);
        io.to(socket.id).emit('leaving user homepage');
        io.to(socket.id).emit('leaving room signal');

    });

    //console.log("User connected");






    //
    // //console.log( socket.request.headers.referer);
    // let room = '';
    // const create = err => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     socket.join(room);
    //     socket.emit('create');
    // };
    // // sending to all clients in the room (channel) except sender
    // socket.on('message', message => {
    //     // console.log(200, message);
    //     socket.broadcast.to(room).emit('message', message)
    // });
    //
    // socket.on('find', (props) => {
    //
    //     console.log(activeSockets);
    //
    //     console.log("found");
    //     const url = props.pathname;
    //
    //     room = url[url.length - 1];
    //     const sr = io.sockets.adapter.rooms[room];
    //     if (sr === undefined) {
    //         console.log("created a room");
    //         // no room with such name is found so create it
    //         socket.join(room);
    //         socket.emit('create');
    //
    //     } else if (sr.length === room_size) {
    //         console.log("full");
    //
    //     }else{
    //
    //         console.log("joining");
    //         socket.emit('join');
    //        // console.log(sr)
    //     }
    //     // } else { // max two clients
    //     //     socket.emit('full', room);
    //     // }
    // });
    // socket.on('auth', data => {
    //     data.sid = socket.id;
    //     // sending to all clients in the room (channel) except sender
    //     socket.broadcast.to(room).emit('approve', data);
    // });
    // socket.on('getstream', id => {
    //
    // });
    // socket.on('accept', id => {
    //     io.sockets.connected[id].join(room);
    //     // sending to all clients in 'game' room(channel), include sender
    //
    //     io.in(room).emit('bridge');
    //     socket.broadcast.emit("update-user-list", {
    //         users: [socket.id]
    //     });
    // });
    // socket.on('reject', () => socket.emit('full'));
    //

    // socket.on("disconnect", () => {
    //     activeSockets = activeSockets.filter(
    //         existingSocket => existingSocket !== socket.id
    //     );
    //     socket.broadcast.emit("remove-user", {
    //         socketId: socket.id
    //     });
    // });



});



console.log(`server is listening on ${port}`);
