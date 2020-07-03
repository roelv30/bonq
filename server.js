const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');
const WebSocket = require('ws');
const port = process.env.PORT || 3001;


const room_size = 6;

const app = express();

//Serve static files from the React app
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

let arrayOfUsersinThisRoom = [];
const server = app.listen(port);

const io = require('socket.io')(server);

const users = {};
const socketToRoom = {};
const socketToTeam = {};

const answers = {};
let roomNumber;
const request = require('request');

request({url: 'https://bonq-api.herokuapp.com/api/getRooms', json: true}, function(err, res, json) {
    if (err) {
        throw err;
    }
    json.forEach(setRooms);

});

function setRooms(item) {
    if (users[item.room_id]) {
      } else {
        users[item.room_id] = [];
    }
}

let roomsWithout = [];
io.on('connection', socket => {
    const user = {
        name: null,
        id: socket.id,
        team: null,
        type: "player"
    };
    users[socket.id] = user;

    function getRoomNumber(){
        let roomIdFromClient = socket.handshake.headers.referer;
        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/r/");
            var roomNumber = roomURL[1];
        }
        return roomNumber;
    }

    function setAnswerIfAsnweIsEmpty(roundnumber){
        for (let j = 0; j < Object.keys(answers[roomNumber]).length; j++) {
            if(Object.values(answers[roomNumber])[j][0] === ""){
                Object.values(answers[roomNumber])[j][0] = "niets";
            }
            if(!Object.values(answers[roomNumber])[j][(roundnumber[0] + roundnumber[1] - 1)]){
                Object.values(answers[roomNumber])[j].push("niets");
            }
        }
    }

    function updateUserTeamList(){
        const roomID = socketToRoom[socket.id];
        const teamID = socketToTeam[socket.id];

        arrayOfUsersinThisTeam = [];
        if(users[roomNumber]){
            if (users[roomNumber][teamID]) {
                let sizeOfUsers = Object.keys(users[roomNumber][teamID]).length;
                users[roomID][teamID].forEach(myFunction);
                function myFunction(item, index) {
                    arrayOfUsersinThisTeam.push(users[item])
                }

                arrayOfUsersinThisTeam.forEach(myFunction2);
                function myFunction2(item, index) {
                    io.to(item.id).emit('update teams', arrayOfUsersinThisTeam);
                }
            }
        }
    }


    socket.on("getAnswerList", () => {
        let roomIdFromClient = socket.handshake.headers.referer;
        if(roomIdFromClient != null){
            var roomURL = roomIdFromClient.split("/review/");
            var roomNumber = roomURL[1];
        }

        //console.log(socket.handshake.headers.referer);
        io.emit('getAnswerListFull', answers[roomNumber]);
    });

    socket.on("setTypeHost", (roomId) => {
        users[socket.id].type = "host";
        if(!users[roomId]){
            users[roomId] = {["host"] : [users[socket.id].name]};
        }
    });

    socket.on("reviewWaiting", () => {
        roomNumber = getRoomNumber();
        io.to(roomNumber).emit("setWaitingScreen");
    });

    socket.on("setAnswer", payload => {
        roomNumber = getRoomNumber();

        if (answers[roomNumber]) {
            if(answers[roomNumber][payload[3]]){
                if(Object.values(answers[roomNumber][payload[3]])[0] === ''){
                    answers[roomNumber][payload[3]] = [payload[2]];
                }else{
                    answers[roomNumber][payload[3]].push(payload[2]);
                }
            }else{
                answers[roomNumber][payload[3]] = [payload[2]];
            }
        } else {
            answers[roomNumber] = {[payload[3]] : [payload[2]]};
        }
    });


    socket.on("toRestOfTeam", payload => {
         roomNumber = getRoomNumber();
        for (let i = 0; i < users[roomNumber][payload].length; i++) {
            io.to(users[roomNumber][payload][i]).emit('answerIsSubmitted');
        }
    });

    socket.on("startGame", () => {
         roomNumber = getRoomNumber();
        request('https://bonq-api.herokuapp.com/api/getQuestions/' + roomNumber, { json: true }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            io.to(roomNumber).emit('questions', body[0].rounds_array);
        });

    });


    socket.on("nextRound", (roundnumber) => {
         roomNumber = getRoomNumber();

        if(answers[roomNumber]){
            setAnswerIfAsnweIsEmpty(roundnumber);
        }

        io.to(roomNumber).emit('resetForm');
        io.to(roomNumber).emit('roundNumberUpdate', roundnumber[0]);
    });

    socket.on("nextQuestion", (questionNumber) => {
        roomsWithout = [];
        roomNumber = getRoomNumber();

        if(!answers[roomNumber]){

        }else{
            setAnswerIfAsnweIsEmpty(questionNumber);
        }

        io.to(roomNumber).emit('resetForm');
        io.to(roomNumber).emit('questNumberUpdate', questionNumber[1]);

    });

    socket.on("retrievedUser", (userFromDB) => {
        users[socket.id].name = userFromDB.username;
    });

    socket.on("checkUserType", (roomId) => {
        roomNumber = getRoomNumber();
        if(users[roomNumber]){
            if(users[roomNumber].host){
                if(users[roomNumber].host[0] === users[socket.id].name){
                    users[socket.id].type = "host";
                }
            }
        }

        if(users[socket.id].type === "host"){
            io.to(socket.id).emit('canJoin', "yes");
            io.to(socket.id).emit('isHeHost', "yes");
        }

        if(users[roomNumber]){
             io.to(socket.id).emit('canJoin', "yes");
        }else{
            console.log("no join");
            io.to(socket.id).emit('canJoin', "no");
        }
    });

    socket.on("username", username => {
        users[socket.id].name = username;
    });

    socket.on("join room", () => {
         roomNumber = getRoomNumber();
        arrayOfUsersinThisRoom = [];
        io.emit("joinedRoom", roomNumber);
        socket.join(roomNumber);
        socketToRoom[socket.id] = roomNumber;
    });

    socket.on("send", message => {
         roomNumber = getRoomNumber();
        io.to(roomNumber).emit("message", {
            text: message,
            date: new Date().toISOString(),
            user: users[socket.id]
        });
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

    socket.on("join team", payload => {
        roomNumber = getRoomNumber();
        arrayOfUsersinThisRoom = [];
        users[socket.id].team = payload;
        arrayOfUsersinThisTeam = [];

        if (users[roomNumber]) {
            if(users[roomNumber][payload]){
                users[roomNumber][payload].push(socket.id);
            }else{
                users[roomNumber][payload] = [socket.id];
                if(!answers[roomNumber]){
                    answers[roomNumber] = {[payload] : [""]};
                }else{
                    if(!answers[roomNumber][payload]){
                        Object.assign(answers[roomNumber], {[payload] : [""]});
                    }
                }
            }
        } else {
               users[roomNumber] = {[payload] : [socket.id]};
        }

        if (users[roomNumber][payload]) {
            let sizeOfUsers = Object.keys(users[roomNumber][payload]).length;

            users[roomNumber][payload].forEach(myFunction);
            function myFunction(item, index) {
                arrayOfUsersinThisTeam.push(users[item])
            }

            arrayOfUsersinThisTeam.forEach(myFunction2);
            function myFunction2(item, index) {
              io.to(item.id).emit('teams', arrayOfUsersinThisTeam);
            }

        }
        socketToTeam[socket.id] = payload;
        const usersInThisTeam = users[roomNumber][payload].filter(id => id !== socket.id);
        io.to(socket.id).emit("all users", usersInThisTeam)

    });

    socket.on('disconnect', () => {
        roomNumber = getRoomNumber();
        arrayOfUsersinThisTeam = [];

        const roomID = socketToRoom[socket.id];
        const teamID = socketToTeam[socket.id];
        io.to(roomID).emit('left', socket.id);

        if(teamID != null){
            let test = users[roomID][teamID];
            if (test) {
                test = test.filter(id => id !== socket.id);
                users[roomNumber][teamID] = test;
            }
        }
        socket.leave(roomID);
        //update team names in certain team.
        updateUserTeamList();
    });


    socket.on('leaving', () => {
        const roomID = socketToRoom[socket.id];
        const teamID = socketToTeam[socket.id];

        roomNumber = getRoomNumber();
        io.to(roomID).emit('left', socket.id);

        if(teamID != null){
            let test = users[roomID][teamID];
            if (test) {
                test = test.filter(id => id !== socket.id);
                users[roomNumber][teamID] = test;
            }
        }
        socket.leave(roomID);
        updateUserTeamList();

        io.to(roomID).emit('left', socket.id);
        io.to(socket.id).emit('leaving user homepage');
        io.to(socket.id).emit('leaving room signal');
    });
});

console.log(`server is listening on ${port}`);
