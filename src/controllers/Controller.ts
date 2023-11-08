import {Router} from "express";
import type {Request, NextFunction, Response} from "express";

export enum Method {
	GET = 'get',
	POST = 'post',
	PUT = 'put',
	PATCH = 'patch',
	DELETE = 'delete'
}

interface IRoute{
	path: string;
	method: Method;
	handler: (req:Request, res:Response, next:NextFunction) => Promise<void>;
}
abstract class Controller {
	private _router: Router = Router();
	public abstract path: string;
	protected abstract readonly routes: IRoute[];

	private initRouter(): void {
		this.routes.forEach((route) => {
			this._router[route.method](route.path, route.handler);
		});
	}
	public get router(): Router {
		this.initRouter();
		return this._router;
	}

}

export default Controller;