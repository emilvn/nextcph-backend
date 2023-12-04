import { ChannelType, PrismaClient } from "@prisma/client";
import { INewSale } from "../types/types";
import Repository from "./Repository";

class SaleRepository extends Repository {
    db: PrismaClient;
    constructor(db: PrismaClient) {
        super();
        this.db = db;
    }
    public getByChannel = async (channel:ChannelType, page?:number, pageSize?:number, user_id?:string) => {
        const limit = pageSize || 20;
        const offset = !!page && !!pageSize ? (page - 1) * pageSize : 0;

        const [sales, totalCount] = await this.db.$transaction([
            this.db.sale.findMany({
                where: {
                    user_id: user_id,
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
                },
                take: limit,
                skip: offset,
                orderBy: {
                    created_at: "desc"
                }
            }),
            this.db.sale.count({
                where: {
                    products: {
                        every: {
                            product: {
                                channel: channel
                            }
                        }
                    }
                }
            })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: sales,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page || 1,
                pageSize: limit
            }
        };
    };

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

    public getById = (id:string) => {
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
}

export default SaleRepository;