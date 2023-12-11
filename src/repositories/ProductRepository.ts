import {ChannelType, PrismaClient} from "@prisma/client";
import {INewProduct, IUpdateProduct} from "../types/types";
import Repository from "./Repository";
class ProductRepository extends Repository{
	db: PrismaClient;
	constructor(db:PrismaClient) {
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
	}

	public create = (data: INewProduct) => {
		const {id, name, price, stock, channel, categories, min_stock, max_stock} = data;
		return this.db.product.create({
			data: {
				id, name, price, stock, channel, min_stock, max_stock,
				categories: {
					create: categories.map((categoryName) => ({
						category: {
							connectOrCreate: {
								where: { name: categoryName },
								create: { name: categoryName , channel: channel},
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

	public createMany = async (data: INewProduct[]) => {
		return this.db.$transaction(async (db) => {
				const newProducts = Promise.all(data.map((product) => {
					return this.create(product);
				}));
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

	}
	public update = (id: string, data: IUpdateProduct) => {
		const {name, price, stock, channel, min_stock, max_stock} = data;
		const UpdateData:Record<string, any> = {};
		if(name !== undefined) UpdateData.name = name;
		if(price !== undefined) UpdateData.price = price;
		if(stock !== undefined) UpdateData.stock = stock;
		if(channel !== undefined) UpdateData.channel = channel;
		if(min_stock !== undefined) UpdateData.min_stock = min_stock;
		if(max_stock !== undefined) UpdateData.max_stock = max_stock;

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