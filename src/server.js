
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

const portNum = 3000;
const handleListen = () => console.log(`Listening on http://localhost:${portNum}`)


const httpServer = http.createServer(app);
const wsServer = new SocketIO(httpServer);

httpServer.listen(portNum, handleListen);
