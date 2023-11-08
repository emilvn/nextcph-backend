import Controller from "./Controller";
import {Method} from "./Controller";
import type {Request, Response, NextFunction} from "express";
import {db} from "../index";
import type {ChannelType} from "@prisma/client";

interface INewProduct {
	id?: string;
	name: string;
	price: number;
	stock: number;
	channel: ChannelType;
	categories: string[];
}

class ProductController extends Controller{
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
			method: Method.PATCH,
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
		const {channelParam} = req.query;
		const channel = channelParam as ChannelType;
		if(channel) {
			const productsWithCategories = await db.product.findMany({
				where: {
					channel: channel
				},
				include: {
					categories: {
						select: { category: true }
					}
				}
			});
			res.json(productsWithCategories);
		}
		else {
			const productsWithCategories = await db.product.findMany({
				include: {
					categories: {
						select: { category: true }
					}
				}
			});
			res.json(productsWithCategories);
		}
	}

	public async getById(req:Request, res:Response, _next:NextFunction) {
		const {id} = req.params;
		const productWithCategories = await db.product.findUnique({
			where: {
				id: id
			},
			include: {
				categories: {
					select: { category: true }
				}
			}
		});
		if(!productWithCategories) {
			res.status(404).send("Not found");
		}
		res.json(productWithCategories);
	}

	public async create(req:Request, res:Response, _next:NextFunction) {
		const {id, name, price, stock, channel, categories}:INewProduct = req.body;

		const productWithCategories = await db.product.create({
			data: {
				id, name, price, stock, channel,
				categories: {
					create: categories.map((categoryName) => ({
						category: {
							connectOrCreate: {
								where: { name: categoryName },
								create: { name: categoryName },
							},
						},
					})),
				}
			},
			include: {
				categories: {
					select: { category: true }
				}
			}
		});
		res.json(productWithCategories);
	}

	public async update(req:Request, res:Response, _next:NextFunction) {
		const {id} = req.params;
		const {name, price, stock, channel}:INewProduct = req.body;
		const productWithCategories = await db.product.update({
			where: { id: id },
			data: { name, price, stock, channel},
			include: {
				categories: {
					select: { category: true }
				}
			}
		});
		res.json(productWithCategories);
	}

	public async delete(req:Request, res:Response, _next:NextFunction) {
		const {id} = req.params;
		const productWithCategories = await db.product.delete({
			where: { id: id },
			include: {
				categories: {
					select: { category: true }
				}
			}
		});
		res.json(productWithCategories);
	}
}

export default ProductController;