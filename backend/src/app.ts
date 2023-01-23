import dotenv from 'dotenv';
import express from 'express';
import {HandleCreateQueue, StopCreateQueue} from "./core/maius_invest/hello_world_clock";
import {StopQueue} from "./core/maius_invest/maius_invest";

// load the environment variables from the .env file
dotenv.config({
    path: '.env'
});

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
    public app = express();
}

// initialize server app
const server = new Server();

// make server listen on some port
((port = process.env.APP_PORT || 5000) => {
    server.app.use(express.json());
    server.app.post("/create-thread", async (req, res) => {
        await HandleCreateQueue()
        res.send();
    })
    server.app.post("/stop-thread", async (req, res) => {
        await StopQueue("CCh3YvmoZyek7Koj2zB1khr4yD4NhJRoR6FJiZkEXneb", "HVUo94uHtVCxeANMrbBqGN71Grsrhc6fbY38LyQFEQjk")
        res.send();
    })
    server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();