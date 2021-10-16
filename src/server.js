

import express from "express";

import path from 'path';
const __dirname = path.resolve();


const app = express();

app.use(express.static('\public'));

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + '/src/public'));

console.log(__dirname)

app.get("/", (req, res) => res.render("home"));


const portNum = 3001;
const handleListen = () => console.log(`Listening on http://localhost:${portNum}`)
app.listen(portNum, handleListen);
