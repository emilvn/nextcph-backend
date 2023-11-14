import Controller from "./Controller";
import {Method} from "./Controller";
import type {Request, Response, NextFunction} from "express";
import type {PrismaClient} from "@prisma/client";
import type {INewProduct, IUpdateProduct} from "../types/types";
import ProductRepository from "../repositories/ProductRepository";
import { NewProductSchema, UpdateProductSchema, ChannelSchema } from "../validation/schemas";

class ProductController extends Controller{
	path: string = '/products';
	repository: ProductRepository;
	constructor(db:PrismaClient) {
		super();
		this.repository = new ProductRepository(db);
	}

	public getByChannel = async (req:Request, res:Response, next:NextFunction) => {
		try{
			const {channel} = req.query;
			const channelParam = ChannelSchema.parse(channel);
			const productsWithCategories = await this.repository.getByChannel(channelParam);
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

	public getById = async (req:Request, res:Response, next:NextFunction) => {
		try{
			const {id} = req.params;
			const productWithCategories = await this.repository.getById(id);
			if(!productWithCategories) res.status(404).send("Not found");
			else res.json(productWithCategories);
		}catch(e){
			next(e);
		}
	}

	public create = async (req:Request, res:Response, next:NextFunction) => {
		try{
			const data:INewProduct = NewProductSchema.parse(req.body);
			const productWithCategories = await this.repository.create(data);
			res.status(201).json(productWithCategories);
		}catch(e){
			next(e);
		}
	}

	public update = async (req:Request, res:Response, next:NextFunction) => {
		try{
			const {id} = req.params;
			const data:IUpdateProduct = UpdateProductSchema.parse(req.body);
			const productWithCategories = await this.repository.update(id, data);
			res.json(productWithCategories);
		}
		catch(e){
			next(e);
		}
	}

	public delete = async (req:Request, res:Response, next:NextFunction) => {
		try{
			const {id} = req.params;
			const productWithCategories = await this.repository.delete(id);
			res.json(productWithCategories);
		}catch (e) {
			next(e);
		}
	}

	routes = [
		{
			path: '/',
			method: Method.GET,
			handler: this.getByChannel
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
}

export default ProductController;