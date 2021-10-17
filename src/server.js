import { instrument } from "@socket.io/admin-ui"
import {Server as SocketIO} from "socket.io"

import express from "express";
// import { WebSocketServer } from 'ws';

import http from "http"
import path from 'path';
const __dirname = path.resolve();


const app = express();

app.use(express.static('\public'));

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + '/src/public'));

console.log(__dirname)

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const portNum = 3001;
const handleListen = () => console.log(`Listening on http://localhost:${portNum}`)


const httpServer = http.createServer(app);
const wsServer = new SocketIO(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true,
    },
});
  
instrument(wsServer, {
    auth: false,
});

function publicRooms() {

    const { sockets: { adapter: {sids, rooms} } } = wsServer;
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
    const publicRooms = [];

    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });

    return publicRooms;
}

function countRoom(roomName) {
    const rooms = wsServer.sockets.adapter.rooms;
    return rooms.get(roomName)?.size;
}

wsServer.on("connection", socket => {

    socket["nickname"] = "Anonymous";
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
        
    socket.on("enter_room", (roomName, done) => {

        socket.join(roomName);
        done(countRoom(roomName));

        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
        
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("message", (msg, room, done) => {
        socket.to(room).emit("message", `${socket.nickname} : ${msg}`);
        done();
    });
    
    socket.on("nickname", (nickname) => { socket["nickname"] = nickname;})
});

httpServer.listen(portNum, handleListen);
