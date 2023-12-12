import Controller from "./Controller";
import { Method } from "./Controller";
import type { Request, Response, NextFunction } from "express";
import type { PrismaClient } from "@prisma/client";
import type { INewProduct } from "../types/types";
import ProductRepository from "../repositories/ProductRepository";
import {
    LowStockSchema,
    NewProductSchema,
    OptionalChannelSchema
} from "../validation/schemas";

class ProductController extends Controller {
    path: string = "/products";
    repository: ProductRepository;
    constructor(db: PrismaClient) {
        super();
        this.repository = new ProductRepository(db);
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { channel, low_stock } = req.query;
            const channelParam = OptionalChannelSchema.parse(channel);
            const lowStockParam = LowStockSchema.parse(low_stock);
            const productsWithCategories = await this.repository.getAll(
                channelParam,
                lowStockParam
            );
            if (productsWithCategories.length === 0 && !lowStockParam) {
                res.status(404).send("No products found");
            } else if (productsWithCategories.length === 0 && lowStockParam) {
                res.status(204).send("No low stock products found");
            } else {
                res.json(productsWithCategories);
            }
        } catch (e) {
            next(e);
        }
    };

    public getById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const productWithCategories = await this.repository.getById(id);
            if (!productWithCategories) res.status(404).send("Not found");
            else res.json(productWithCategories);
        } catch (e) {
            next(e);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: INewProduct = NewProductSchema.parse(req.body);
            const productWithCategories = await this.repository.create(data);
            res.status(201).json(productWithCategories);
        } catch (e) {
            next(e);
        }
    };

    public createMany = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data: INewProduct[] = req.body;
            const productsWithCategories =
                await this.repository.createMany(data);
            res.status(201).json(productsWithCategories);
        } catch (e) {
            next(e);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data: INewProduct = NewProductSchema.parse(req.body);
            const productWithCategories = await this.repository.update(
                id,
                data
            );
            res.json(productWithCategories);
        } catch (e) {
            next(e);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const productWithCategories = await this.repository.delete(id);
            res.json(productWithCategories);
        } catch (e) {
            next(e);
        }
    };

    routes = [
        {
            path: "/",
            method: Method.GET,
            handler: this.getAll
        },
        {
            path: "/:id",
            method: Method.GET,
            handler: this.getById
        },
        {
            path: "/",
            method: Method.POST,
            handler: this.create
        },
        {
            path: "/:id",
            method: Method.PUT,
            handler: this.update
        },
        {
            path: "/:id",
            method: Method.PATCH,
            handler: this.update
        },
        {
            path: "/:id",
            method: Method.DELETE,
            handler: this.delete
        },
        {
            path: "/bulk",
            method: Method.POST,
            handler: this.createMany
        }
    ];
}

export default ProductController;
