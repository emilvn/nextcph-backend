import Controller from "./Controller";
import {Method} from "./Controller";
import type {Request, Response, NextFunction} from "express";
import type {PrismaClient} from "@prisma/client";
import type {INewSale} from "../types/types";
import SaleRepository from "../repositories/SaleRepository";
import { ChannelSchema, NewSaleSchema } from "../validation/schemas";

class SaleController extends Controller{ 
    path: string = "/sales";
    repository: SaleRepository;
    constructor(db:PrismaClient) {
        super();
        this.repository = new SaleRepository(db);
    }

    public getByChannel = async (req:Request, res:Response, next:NextFunction) => {
        try{
            const {channel, page, pageSize, user_id} = req.query;
			const userIdParam = user_id as string | undefined;
            const channelParam = ChannelSchema.parse(channel);

            const salesData = await this.repository
				.getByChannel(channelParam, Number(page), Number(pageSize), userIdParam);

			if(salesData.data.length === 0) {
                res.status(404).send("No sales found");
            }
            else {
                res.json(salesData);
            }

        }catch(e){
            next(e);
        }
    }

    public getById = async (req:Request, res:Response, next:NextFunction) => {
        try{
			const {id} = req.params;
			const sale = await this.repository.getById(id);

			if(!sale) {
				res.status(404).send("No sale found");
			}
			else {
				res.json(sale);
			}
		}catch(e){
			next(e);
		}
    }

    public create = async (req:Request, res:Response, next:NextFunction) => {
        try{
            const data:INewSale = NewSaleSchema.parse(req.body);
            const sale = await this.repository.create(data);
            res.status(201).json(sale);
        }catch (e) {
            next(e);
        }
    }

    public delete = async (req:Request, res:Response, next:NextFunction) => {
		try{
			const {id} = req.params;
			const sale = await this.repository.delete(id);
			res.json(sale);
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
			method: Method.DELETE,
			handler: this.delete
		}
	];
}

export default SaleController;