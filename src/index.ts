import express from "express";
import cors from "cors";
import Server from "./Server";
import ProductController from "./controllers/ProductController";

const app = express();
const server = new Server(app, 3000);

const controllers = [
	new ProductController()
];

const middlewares = [
	cors(),
	express.json()
];

server.loadMiddleware(middlewares);
server.loadControllers(controllers);
server.loadGlobalErrorHandler();
server.run();