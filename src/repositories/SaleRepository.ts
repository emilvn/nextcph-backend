import {ChannelType, PrismaClient} from "@prisma/client";
import {INewSale} from "../types/types";
import Repository from "./Repository";

class SaleRepository extends Repository {
    db: PrismaClient;
    constructor(db:PrismaClient) {
        super();
        this.db = db;
    }
    public getByChannel = async (channel:ChannelType, page?:number, pageSize?:number) => {
        const limit = pageSize || 20;
        const offset = !!page && !!pageSize ? (page - 1) * pageSize : 0;

        const [sales, totalCount] = await this.db.$transaction([
            this.db.sale.findMany({
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
    public getByUserId = (user_id: string, channel:ChannelType) => {
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
    public create = async (data: INewSale) => {{
        const { user_id, products } = data;

        const createdSale = await this.db.$transaction(async (prisma) => {
            //create sale
            const newSale = await prisma.sale.create({
                data: {
                    user_id
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
    }}

    public delete = (id: string) => {
		return this.db.sale.delete({
			where: { id: id }
		});
	}
}

export default SaleRepository;