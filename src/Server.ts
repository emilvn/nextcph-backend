import type {Application, RequestHandler, Request, Response, NextFunction} from 'express';
import type Controller from './controllers/Controller';
import {ZodError} from "zod";

class Server{
	private app: Application;
	private readonly port: number;

	constructor(app:Application, port: number) {
		this.port = port;
		this.app = app;
	}

	public run(): void {
		this.app.listen(this.port, () => {
  			console.log(`Server started on port http://localhost:${this.port}`);
		});
	}

	public loadMiddleware(middlewares: RequestHandler[]): void {
		middlewares.forEach((middleware) => {
  			this.app.use(middleware);
		});
	}

	public loadControllers(controllers:Controller[]): void {
		controllers.forEach((controller) => {
  			this.app.use(controller.path, controller.router);
		});
	}

	public loadGlobalErrorHandler():void {
		this.app.use((err:any, _req:Request, res:Response, _next:NextFunction) => {
			if(err instanceof ZodError){
				res.status(400).json({
					success: false,
					name: err.name,
					status: 400,
					errors: err.issues
				});
				return;
			}
			const status = err.statusCode || 500;
			const message = err.message ||"Something went wrong";
			const name = err.name || "";
			res.status(status).json(JSON.stringify({
				success: false,
				name: name,
				status: status,
				message: message
			}));
		});
	}
}

export default Server;