import Controller from "./Controller";
import {Method} from "./Controller";
import type {Request, Response, NextFunction} from "express";
import type {ChannelType} from "@prisma/client";
import {z} from "zod";
import type {INewProduct, IUpdateProduct} from "../types/types";
import ProductRepository from "../repositories/ProductRepository";

const NewProductSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(191),
	price: z.number().positive(),
	stock: z.number().min(0),
	channel: z.enum(["HAIR_CARE", "COSMETIC"]),
	categories: z.array(z.string()
		.min(1)
		.max(191, {message: "Category name is too long"})),
});

const UpdateProductSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(191).optional(),
	price: z.number().positive().optional(),
	stock: z.number().min(0).optional(),
	channel: z.enum(["HAIR_CARE", "COSMETIC"]).optional(),
});

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

	public async getAll(req:Request, res:Response, next:NextFunction) {
		try{
			const {channelParam} = req.query;
			const channel = channelParam as ChannelType;
			let productsWithCategories;
			if(channel) {
				productsWithCategories = await ProductRepository.getByChannel(channel);
			}
			else {
				productsWithCategories = await ProductRepository.getAll();
			}
			if(productsWithCategories.length === 0) {
				res.status(404).send("No products found");
			}
			else {
				res.json(productsWithCategories);
			}
		}catch(e){
			next(e);
		}
	}

	public async getById(req:Request, res:Response, next:NextFunction) {
		try{
			const {id} = req.params;
			const productWithCategories = await ProductRepository.getById(id);
			if(!productWithCategories) res.status(404).send("Not found");
			else res.json(productWithCategories);
		}catch(e){
			next(e);
		}
	}

	public async create(req:Request, res:Response, next:NextFunction) {
		try{
			const data:INewProduct = NewProductSchema.parse(req.body);
			const productWithCategories = await ProductRepository.create(data);
			res.status(201).json(productWithCategories);
		}catch(e){
			next(e);
		}
	}

	public async update(req:Request, res:Response, next:NextFunction) {
		try{
			const {id} = req.params;
			const data:IUpdateProduct = UpdateProductSchema.parse(req.body);
			const productWithCategories = await ProductRepository.update(id, data);
			res.json(productWithCategories);
		}
		catch(e){
			next(e);
		}
	}

	public async delete(req:Request, res:Response, _next:NextFunction) {
		const {id} = req.params;
		const productWithCategories = await ProductRepository.delete(id);
		res.json(productWithCategories);
	}
}

export default ProductController;