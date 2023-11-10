import {ChannelType, PrismaClient} from "@prisma/client";
import {INewProduct, IUpdateProduct} from "../types/types";
class ProductRepository{
	private db: PrismaClient;
	constructor(db:PrismaClient) {
		this.db = db;
	}

	public getByChannel = (channel: ChannelType) => {
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
	}
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
	}
	public create = (data: INewProduct) => {
		const {id, name, price, stock, channel, categories} = data;
		return this.db.product.create({
			data: {
				id, name, price, stock, channel,
				categories: {
					create: categories.map((categoryName) => ({
						category: {
							connectOrCreate: {
								where: { name: categoryName },
								create: { name: categoryName },
							},
						},
					})),
				}
			},
			include: {
				categories: {
					select: { category: true }
				}
			}
		});
	}
	public update = (id: string, data: IUpdateProduct) => {
		const {name, price, stock, channel} = data;
		const UpdateData:Record<string, any> = {};
		if(name !== undefined) UpdateData.name = name;
		if(price !== undefined) UpdateData.price = price;
		if(stock !== undefined) UpdateData.stock = stock;
		if(channel !== undefined) UpdateData.channel = channel;

		return this.db.product.update({
			where: { id: id },
			data: UpdateData,
			include: {
				categories: {
					select: { category: true }
				}
			}
		});
	}
	public delete = (id: string) => {
		return this.db.product.delete({
			where: { id: id },
			include: {
				categories: {
					select: { category: true }
				}
			}
		});
	}
}

export default ProductRepository;