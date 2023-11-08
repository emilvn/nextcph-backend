import Controller from "./Controller";
import {Method} from "./Controller";
import type {Request, Response, NextFunction} from "express";
import {db} from "../index";

interface INewProduct {
	id?: string;
	name: string;
	price: number;
	stock: number;
	channel: "COSMETIC" | "HAIR_CARE";
}

export default class ProductController extends Controller{
	path: string = '/products';
	routes = [
		{
			path: '/',
			method: Method.GET,
			handler: this.getAll
		},
		{
			path: '/:id',
			method: Method.GET,
			handler: this.getById
		},
		{
			path: '/',
			method: Method.POST,
			handler: this.create
		},
		{
			path: '/:id',
			method: Method.PUT,
			handler: this.update
		},
		{
			path: '/:id',
			method: Method.DELETE,
			handler: this.delete
		}
	];
	constructor() {
		super();
	}

	public async getAll(req:Request, res:Response, _next:NextFunction) {
		const products = await db.product.findMany();
		res.json(products);
	}

	public async getById(req:Request, res:Response, _next:NextFunction) {
		const {id} = req.params;
		const product = await db.product.findUnique({
			where: {
				id: id
			}
		});
		if(!product) {
			res.status(404).send("Not found");
		}
		res.json(product);
	}

	public async create(req:Request, res:Response, _next:NextFunction) {
		const {id, name, price, stock, channel}:INewProduct = req.body;
		const product = await db.product.create({
			data: {
				id,
				name,
				price,
				stock,
				channel
			}
		});
		res.json(product);
	}

	public async update(req:Request, res:Response, _next:NextFunction) {
		const {id} = req.params;
		const {name, price, stock, channel}:INewProduct = req.body;
		const product = await db.product.update({
			where: {
				id: id
			},
			data: {
				name,
				price,
				stock,
				channel
			}
		});
		res.json(product);
	}

	public async delete(req:Request, res:Response, _next:NextFunction) {
		const {id} = req.params;
		const product = await db.product.delete({
			where: {
				id: id
			}
		});
		res.json(product);
	}
}