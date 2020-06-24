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
var arrayOfUsersinThisTeam = [];
const server = app.listen(port);
// wss = new Server({ app });

var io = require('socket.io')(server);

const users = {};
const socketToRoom = {};
const socketToTeam = {};
const usersConnected = {};
const teams = {};
io.on('connection', socket => {

    socket.on("username", username => {

        const user = {
            name: username,
            id: socket.id
        };

        users[socket.id] = user;
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
                   // console.log("usersInThisRoom2");
                   // console.log(users[roomNumber]);
                   // console.log(usersInThisRoom2);
                    users[roomNumber].forEach(myFunction);
                    function myFunction(item, index) {
                       // console.log(item);
                        arrayOfUsersinThisRoom.push(users[item])
                    }

                    io.to(socket.id).emit("users", arrayOfUsersinThisRoom);
                    io.to(roomNumber).emit('users', arrayOfUsersinThisRoom);
        }
        io.emit("joinedRoom", roomNumber);
        socket.join(roomNumber);
        socketToRoom[socket.id] = roomNumber;

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

        //socket.emit("all users", usersInThisRoom);


        //socket.emit("all users", usersInThisRoom);
        //io.to(socket.id).emit("users", Object.values(users));
        //io.to(roomNumber).emit("users", Object.values(users));
    });

    socket.on("join team", payload => {
        let roomIdFromClient = socket.handshake.headers.referer;
        arrayOfUsersinThisRoom = [];
        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }
        console.log(payload);
        arrayOfUsersinThisTeam = [];

        if (teams[payload]) {
            const length = teams[payload].length;
            if (length === room_size) {
                socket.emit("room full");
                return;
            }
            teams[payload].push(socket.id);
        } else {
            teams[payload] = [socket.id];
        }

        if (teams[payload]) {
            let sizeOfUsers = Object.keys(teams).length;
            // console.log(sizeOfUsers );


            const usersInThisTeam = teams[payload].filter(id => id !== socket.id);

            teams[payload].forEach(myFunction);
            function myFunction(item, index) {
                // console.log(item);
                arrayOfUsersinThisTeam.push(users[item])
            }
            // console.log("arrayOfUsersinThisTeam");
            // console.log(arrayOfUsersinThisTeam);
            //io.to(socket.id).emit("teams", arrayOfUsersinThisTeam);


            arrayOfUsersinThisTeam.forEach(myFunction2);
            function myFunction2(item, index) {
                console.log("item");
                //console.log("payload");
                //console.log();

                io.to(item.id).emit('teams', arrayOfUsersinThisTeam);
                // console.log(item);
                // arrayOfUsersinThisTeam.push(users[item])
            }

        }

        socketToTeam[socket.id] = payload;
        console.log(payload);
        const usersInThisTeam = teams[payload].filter(id => id !== socket.id);

       // console.log(usersInThisRoom);
        io.to(socket.id).emit("all users", usersInThisTeam)

        // console.log("teams");
        // console.log(teams);

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
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }

        let test = teams[teamID];
        if (test) {
            test = test.filter(id => id !== socket.id);
            teams[teamID] = test;
        }

        console.log(teams);
        //socket.leave(teamID);
        socket.leave(roomID);

        //update team names in certain team.
        if (teams[teamID]) {
            let sizeOfUsers = Object.keys(teams).length;
            // console.log(sizeOfUsers );


            const usersInThisTeam = teams[teamID].filter(id => id !== socket.id);

            teams[teamID].forEach(myFunction);
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

        //update all user lists
        if (users[roomID]) {
            let sizeOfUsers = Object.keys(users).length;
            // console.log(sizeOfUsers );


            const usersInThisRoom2 = users[roomID].filter(id => id !== socket.id);
            // console.log("usersInThisRoom2");
            // console.log(users[roomNumber]);
            // console.log(usersInThisRoom2);
            users[roomID].forEach(myFunction);
            function myFunction(item, index) {
                // console.log(item);
                arrayOfUsersinThisRoom.push(users[item])
            }

            io.to(socket.id).emit("users", arrayOfUsersinThisRoom);
            io.to(roomID).emit('users', arrayOfUsersinThisRoom);
        }

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






});


console.log(`server is listening on ${port}`);
