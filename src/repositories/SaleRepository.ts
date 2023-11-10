import {ChannelType, PrismaClient} from "@prisma/client";
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
    public create = (data: INewSale) => {
        const {id, user_id, products} = data;
        return this.db.sale.create({
            data: {
                id, user_id,
                products: {
                    connect: products.map(product => ({ id: product.id })),
                }
            }
        });
    }
    public delete = (id: string) => {
		return this.db.sale.delete({
			where: { id: id }
		});
	}
}

export default SaleRepository;