import Controller from "./Controller";
import { Method } from "./Controller";
import type { Request, Response, NextFunction } from "express";
import type { PrismaClient } from "@prisma/client";
import type { INewSale } from "../types/types";
import SaleRepository from "../repositories/SaleRepository";
import { ChannelSchema, UserIdSchema, NewSaleSchema, DateSchema } from "../validation/schemas";

class SaleController extends Controller {
    path: string = "/sales";
    repository: SaleRepository;
    constructor(db: PrismaClient) {
        super();
        this.repository = new SaleRepository(db);
    }

    public getByUserId = async (req: Request, res: Response, next: NextFunction) => {
        const { user_id } = req.query;
        const { channel } = req.query;
        if (!!user_id) {
            try {
                const channelParam = ChannelSchema.parse(channel);
                const userIdParam = UserIdSchema.parse(user_id);
                const sales = await this.repository.getByUserId(userIdParam, channelParam);

                if (!sales) {
                    res.status(404).send("No sales found");
                }
                else {
                    res.json(sales);
                }
            } catch (e) {
                next(e);
            }
        } else {
            next();
        }

    }

    public getByChannel = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { channel } = req.query;
            const channelParam = ChannelSchema.parse(channel);
            const sales = await this.repository.getByChannel(channelParam);
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

    public getByMonth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { channel } = req.query;
            const channelParam = ChannelSchema.parse(channel);
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
            handler: this.getByUserId
        },
        {
            path: '/',
            method: Method.GET,
            handler: this.getByChannel
        },
        {
            path: '/month/',
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