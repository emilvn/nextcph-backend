import express from "express";
import cors from "cors";
import Server from "./server";
import { PrismaClient } from "@prisma/client";
import ProductController from "./controllers/ProductController";

const app = express();
const server = new Server(app, 3000);
export const db = new PrismaClient();

const controllers = [
	new ProductController()
];
const middlewares = [
	cors(),
	express.json()
];

server.loadMiddleware(middlewares);
server.loadControllers(controllers);
server.run();