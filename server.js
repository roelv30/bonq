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
const usersConnected = {};

io.on('connection', socket => {

    socket.on("username", username => {

        const user = {
            name: username,
            id: socket.id
        };

        users[socket.id] = user;
        //usersConnected[socket.id] = user;
        console.log(users[socket.id]);
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
            var roomNumber = JSON.parse(roomURL[1]);
        }
        socket.join(roomNumber);

        if (users[roomNumber]) {
            const length = users[roomNumber].length;
            if (length === room_size) {
                socket.emit("room full");
                return;
            }
            users[roomNumber].push(socket.id);
        } else {
            users[roomNumber] = [socket.id];
        }

        if (users[roomNumber]) {
            let sizeOfUsers = Object.keys(users).length;
           // console.log(sizeOfUsers );


                    const usersInThisRoom2 = users[roomNumber].filter(id => id !== socket.id);
                    console.log("usersInThisRoom2");
                    console.log(users[roomNumber]);
                   // console.log(usersInThisRoom2);
                    users[roomNumber].forEach(myFunction);
                    function myFunction(item, index) {
                       // console.log(item);
                        arrayOfUsersinThisRoom.push(users[item])
                    }

                    io.to(socket.id).emit("users", arrayOfUsersinThisRoom);
                    io.to(roomNumber).emit('users', arrayOfUsersinThisRoom);
        }

        const usersInThisRoom = users[roomNumber].filter(id => id !== socket.id);
        io.emit("joinedRoom", roomNumber);
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
        console.log("user joined room: " + roomNumber);
        socketToRoom[socket.id] = roomNumber;


        // if(usersInThisRoom.length > 0){
        //     // const usersInThisRoom2 = users[usersInThisRoom].filter(id => id === id.name);
        //
        //     io.to(roomID).emit('users in same room', users[usersInThisRoom]);
        //     //console.log();
        // }

        //io.to(socket.id).emit("users", Object.values(users));
        //io.to(roomNumber).emit("users", Object.values(users));
        socket.emit("all users", usersInThisRoom);


        //socket.emit("all users", usersInThisRoom);
        //io.to(socket.id).emit("users", Object.values(users));
        //io.to(roomNumber).emit("users", Object.values(users));
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

    socket.on("leaving", () => {

        const roomID = socketToRoom[socket.id];
        io.to(roomID).emit('left', socket.id);
        io.to(socket.id).emit('leaving user homepage');
        io.to(socket.id).emit('leaving room signal');
        //console.log(roomID);
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
        delete users[socket.id];
        socket.leave(roomID);

    });


    socket.on('disconnect', () => {

        const roomID = socketToRoom[socket.id];
        io.to(roomID).emit('left', socket.id);
        //console.log(roomID);
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }

        delete users[socket.id];
        socket.leave(roomID);
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
    // socket.on('leave', () => {
    //     // sending to all clients in the room (channel) except sender
    //     socket.broadcast.to(room).emit('hangup');
    //     socket.leave(room);
    //
    //
    // });
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
