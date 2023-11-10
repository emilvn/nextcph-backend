import express from "express";
import cors from "cors";
import Server from "./Server";
import ProductController from "./controllers/ProductController";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = Number(process.env.PORT) || 3000;
const server = new Server(app, port);
const db = new PrismaClient();

const controllers = [
	new ProductController(db)
];

const middlewares = [
	cors(),
	express.json()
];

server.loadMiddleware(middlewares);
server.loadControllers(controllers);
server.loadGlobalErrorHandler();
server.run();