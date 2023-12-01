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
            const data: INewSale[] = req.body.map((sale:INewSale) => NewSaleSchema.parse(sale));
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

    public getDashboardOverview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { channel } = req.query;
            const channelParam = ChannelSchema.parse(channel);

            let { month } = req.query;
            if (typeof month !== "string") {
                const now = new Date();
                month = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
            }

            const monthParam = DateSchema.parse(month);
            const rawSalesData = await this.repository.getByMonth(monthParam, channelParam);

            let Categories: { name: string; total?: number }[] = [];
            Categories = await this.repository.getCategoryNames();

            let totalSales = 0;
            let totalRevenue = 0;

            // iterer gennem rå salgsdata og opdater kategori totaler
            for (const sale in rawSalesData) {
                totalSales++;
                for (const category in Categories) {
                    for (const product in rawSalesData[sale].products) {
                        if (Categories[category]?.name === rawSalesData[sale]?.products[product]?.product?.categories[0]?.category?.name) {
                            Categories[category].total = typeof Categories[category]?.total !== 'undefined'
                                ? (Categories[category]?.total || 0) + (rawSalesData[sale]?.products[product]?.product?.price || 0) * (rawSalesData[sale]?.products[product]?.product_quantity || 0)
                                : (rawSalesData[sale]?.products[product]?.product?.price || 0) * (rawSalesData[sale]?.products[product]?.product_quantity || 0);
                        }
                    }
                }
            }

            // Beregner samlet omsætning baseret på kategori totaler
            totalRevenue = Categories.reduce((acc, category) => (acc + (category.total || 0)), 0);

            const daysInMonth = new Date(monthParam).getUTCDate();

            // Beregner gennemsnitlig daglig salg og omsætning
            const averageDailySales = totalSales / daysInMonth;
            const averageDailyRevenue = totalRevenue / daysInMonth;

            //oprettter array med kategorier inklusiv procentvis omsætningsandel de udgør
            const categoriesWithPercentage = Categories.map(category => ({
                name: category.name,
                total: category.total || 0,
                percentage: (category.total || 0) / totalRevenue * 100
            }));

            const dashboardOverview = {
                totalRevenue: totalRevenue,
                totalSales: totalSales,
                averageDailySales: averageDailySales,
                averageDailyRevenue: averageDailyRevenue,
                categories: categoriesWithPercentage,
                // sales: rawSalesData // skal måske ikke sendes med?
            };

            res.json(dashboardOverview);
        } catch (e) {
            next(e);
        }
    };

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
            path: '/dashboard',
            method: Method.GET,
            handler: this.getDashboardOverview,
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
        },
    ];
}

export default SaleController;