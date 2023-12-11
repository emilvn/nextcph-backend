import { ChannelType, PrismaClient } from "@prisma/client";
import type { INewProduct } from "../types/types";
import Repository from "./Repository";
class ProductRepository extends Repository {
    db: PrismaClient;
    constructor(db: PrismaClient) {
        super();
        this.db = db;
    }

    public getAll = (channel?: ChannelType) => {
        return this.db.product.findMany({
            where: {
                channel: channel
            },
            include: {
                categories: {
                    select: { category: true }
                }
            }
        });
    };
    public getById = (id: string) => {
        return this.db.product.findUnique({
            where: {
                id: id
            },
            include: {
                categories: {
                    select: { category: true }
                }
            }
        });
    };

    public getLowStock = (channel?: ChannelType) => {
        return this.db.product.findMany({
            where: {
                stock: {
                    lt: this.db.product.fields.min_stock
                },
                channel: channel
            },
            include: {
                categories: {
                    select: { category: true }
                }
            }
        });
    };

    public create = (data: INewProduct) => {
        return this.db.product.create({
            data: {
                ...data,
                categories: {
                    create: data.categories.map((categoryName) => ({
                        category: {
                            connectOrCreate: {
                                where: { name: categoryName },
                                create: {
                                    name: categoryName,
                                    channel: data.channel
                                }
                            }
                        }
                    }))
                }
            },
            include: {
                categories: {
                    select: { category: true }
                }
            }
        });
    };

    public createMany = async (data: INewProduct[]) => {
        return this.db.$transaction(async (db) => {
            const newProducts = Promise.all(
                data.map((product) => {
                    return this.create(product);
                })
            );
            return db.product.findMany({
                where: {
                    id: {
                        in: (await newProducts).map((product) => product.id)
                    }
                },
                include: {
                    categories: {
                        select: { category: true }
                    }
                }
            });
        });
    };
    public update = (id: string, data: INewProduct) => {
        return this.db.$transaction(async (db) => {
            await db.productCategory.deleteMany({
                where: {
                    product_id: id
                }
            });
            return db.product.update({
                where: { id: id },
                data: {
                    ...data,
                    categories: {
                        create: data.categories.map((categoryName) => ({
                            category: {
                                connectOrCreate: {
                                    where: { name: categoryName },
                                    create: {
                                        name: categoryName,
                                        channel: data.channel
                                    }
                                }
                            }
                        }))
                    }
                },
                include: {
                    categories: {
                        select: { category: true }
                    }
                }
            });
        });
    };
    public delete = (id: string) => {
        return this.db.product.delete({
            where: { id: id },
            include: {
                categories: {
                    select: { category: true }
                }
            }
        });
    };
}

export default ProductRepository;
