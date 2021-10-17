
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
    nb  

wsServer.on("connection", socket => {
    
    console.log(socket);

});



/* const wss = new WebSocketServer({ server });


const sockets = [];

wss.on("connection", (socket) => {
    
    sockets.push(socket);

    socket["nickname"] = "Anonymous";

    console.log("Connected to Browser 👍");
    socket.on("close", () => {
        console.log("Disconnected from the Browser");
    });

    socket.on("message", msg => {

        const message = JSON.parse(msg);

        console.log(message.payload);
        
        switch (message.type) {
            case "message":
                sockets.forEach((aSocket) =>
                    aSocket.send(`${socket.nickname} : ${message.payload}`)
                );
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }

    });

    //socket.send("hello")

}); */

httpServer.listen(portNum, handleListen);
