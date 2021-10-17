
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
const wsServer = new SocketIO(httpServer);
    

function publicRooms() {

    const { sockets: { adapter: sids, rooms } } = wsServer;
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



wsServer.on("connection", socket => {

    socket["nickname"] = "Anonymous";
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`);
    });
        
    socket.on("enter_room", (roomName, done) => {

        socket.join(roomName);
        done();

        socket.to(roomName).emit("welcome", socket.nickname);
    });
        
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
    });

    socket.on("message", (msg, room, done) => {
        socket.to(room).emit("message", `${socket.nickname} : ${msg}`);
        done();
    });
    
    socket.on("nickname", (nickname) => { socket["nickname"] = nickname;})
});

httpServer.listen(portNum, handleListen);
