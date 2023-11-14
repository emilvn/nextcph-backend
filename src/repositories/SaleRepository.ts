import {ChannelType, PrismaClient, Sale, SaleProduct} from "@prisma/client";
import {INewSale} from "../types/types";
import Repository from "./Repository";

class SaleRepository extends Repository {
    db: PrismaClient;
    constructor(db:PrismaClient) {
        super();
        this.db = db;
    }
    public getByChannel = (channel:ChannelType) => {
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
        });
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
            }
        });
    }
    public create = async (data: INewSale) => {{
        const { user_id, products } = data;
        // First, create the sale and get the newly generated id
        const newSale = await this.db.sale.create({
            data: {
                user_id
            }
        });

        // Then, connect the products to the sale using the new id
        products.map(async (product) =>
            await this.db.saleProduct.create({
            data: {
                sale_id: newSale.id,
                product_id: product.id,
                product_quantity: product.quantity
            }
        }));

        return this.getById(newSale.id);
    }}

    public delete = (id: string) => {
		return this.db.sale.delete({
			where: { id: id }
		});
	}
}

export default SaleRepository;