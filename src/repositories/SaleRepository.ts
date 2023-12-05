import { ChannelType, PrismaClient, Sale, SaleProduct } from "@prisma/client";
import { INewSale } from "../types/types";
import Repository from "./Repository";
import { Channel, channel } from "diagnostics_channel";

class SaleRepository extends Repository {
    db: PrismaClient;
    constructor(db: PrismaClient) {
        super();
        this.db = db;
    }
    public getByChannel = (channel: ChannelType) => {
        return this.db.sale.findMany({
            where: {
                products: {
                    every: {
                        product: {
                            channel: channel
                        }
                    }
                }
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });
    };
    public getById = (id: string) => {
        return this.db.sale.findUnique({
            where: {
                id: id
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
    public getByUserId = (user_id: string, channel: ChannelType) => {
        return this.db.sale.findMany({
            where: {
                user_id: user_id,
                products: {
                    every: {
                        product: {
                            channel: channel
                        }
                    }
                },
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
    public create = async (data: INewSale) => {
        const { created_at, user_id, products } = data;

        const createdSale = await this.db.$transaction(async (prisma) => {
            //create sale
            const newSale = await prisma.sale.create({
                data: {
                    user_id,
                    created_at
                }
            });

            // create sale product relations
            products.map(async (product) =>
                await this.db.saleProduct.create({
                    data: {
                        sale_id: newSale.id,
                        product_id: product.id,
                        product_quantity: product.quantity
                    }
                }));

            return newSale;
        });
        return this.getById(createdSale.id);
    }


    public createMany = async (data: INewSale[]) => {
        return this.db.$transaction(async (db) => {
            const newSales = Promise.all(data.map((sale) => {
                return this.create(sale);
            }));

            const ids = (await newSales).map((sale) => sale?.id).filter((id): id is string => id !== undefined);

            return db.sale.findMany({
                where: {
                    id: {
                        in: ids
                    }
                },
                include: {
                    products: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        });
    }

    public delete = (id: string) => {
        return this.db.sale.delete({
            where: { id: id }
        });
    }

    public getByMonth = (month: Date, channel: ChannelType) => {
        return this.db.sale.findMany({
            where: {
                created_at: {
                    gte: month,
                    lt: new Date(month.getFullYear(), month.getMonth() + 1, 1)
                },
                products: {
                    every: {
                        product: {
                            channel: channel
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                products: {
                    include: { 
                        product: {
                            include: {
                                categories: {
                                    include: {
                                        category: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    public getCategoryNames = (channel: ChannelType) => {
        return this.db.category.findMany({
            where: {
                channel: channel
            },
            select: {
                name: true, 
            }
        });
    }
}

export default SaleRepository;