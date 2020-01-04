import { LeaderBoard } from './data/leaderboard';
import { QueryManager } from './managers/QueryManager';
import { MongoManager } from './managers/MongoManager';
import express from "express";
import http from "http";
import path from "path";

const expressServer = express();
const httpServer = http.createServer(expressServer);

const app = express();

app.get('/', (req, res) => {
    res.send("Hello");
});

app.listen(5000, () => {
    console.log('Server Running');
});

const c = new LeaderBoard();
const x = new MongoManager();