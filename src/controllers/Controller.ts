import {Router} from "express";
import type {Request, NextFunction, Response} from "express";
import Repository from "../repositories/Repository";

enum Method {
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
	public readonly router: Router = Router();
	public abstract path: string;
	protected abstract readonly routes: IRoute[];
	protected abstract readonly repository: Repository;

	public initRouter(): void {
		this.routes.forEach((route) => {
			this.router[route.method](route.path, route.handler);
		});
	}

}

export {Method};
export default Controller;