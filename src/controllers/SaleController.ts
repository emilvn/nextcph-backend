import Controller from "./Controller";
import { Method } from "./Controller";
import type { Request, Response, NextFunction } from "express";
import type { PrismaClient } from "@prisma/client";
import type { INewSale } from "../types/types";
import SaleRepository from "../repositories/SaleRepository";
import {RequiredChannelSchema, NewSaleSchema, DateSchema, OptionalChannelSchema} from "../validation/schemas";

class SaleController extends Controller {
    path: string = "/sales";
    repository: SaleRepository;
    constructor(db: PrismaClient) {
        super();
        this.repository = new SaleRepository(db);
    }

    public getAll = async (req:Request, res:Response, next:NextFunction) => {
        try{
            const {channel, page, pageSize, user_id} = req.query;
			const userIdParam = user_id as string | undefined;
            const channelParam = OptionalChannelSchema.parse(channel);

            const salesData = await this.repository
				.getAll(channelParam, Number(page), Number(pageSize), userIdParam);

			if(salesData.data.length === 0) {
                res.status(404).send("No sales found");
            }
            else {
                res.json(salesData);
            }
        } catch (e) {
            next(e);
        }
    }

    public getByMonth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { channel } = req.query;
            const channelParam = RequiredChannelSchema.parse(channel);
            let { month } = req.query;
            if (typeof month !== "string") {
                const now = new Date();
                month = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
            }

            const monthParam = DateSchema.parse(month);
            const sales = await this.repository.getByMonth(monthParam, channelParam);
            if (sales.length === 0) {
                res.status(404).send("No sales found");
            }
            else {
                res.json(sales);
            }
        } catch (e) {
            next(e);
        }
    }

    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const sale = await this.repository.getById(id);

            if (!sale) {
                res.status(404).send("No sale found");
            }
            else {
                res.json(sale);
            }
        } catch (e) {
            next(e);
        }
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: INewSale = NewSaleSchema.parse(req.body);
            const sale = await this.repository.create(data);
            res.status(201).json(sale);
        } catch (e) {
            next(e);
        }
    }

    public createMany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: INewSale[] = req.body.map((sale: INewSale) => NewSaleSchema.parse(sale));
            const sales = await this.repository.createMany(data);
            res.status(201).json(sales);
        } catch (e) {
            next(e);
        }

    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const sale = await this.repository.delete(id);
            res.json(sale);
        } catch (e) {
            next(e);
        }
    }


    routes = [
        {
            path: '/',
            method: Method.GET,
            handler: this.getAll
        },
        {
            path: '/month',
            method: Method.GET,
            handler: this.getByMonth
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
        },
        {
            path: '/bulk',
            method: Method.POST,
            handler: this.createMany
        }
    ];
}

export default SaleController;