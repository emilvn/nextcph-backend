import {db} from "../index";
import {ChannelType} from "@prisma/client";
import {INewProduct, IUpdateProduct} from "../types/types";
class ProductRepository{
	static async getAll(){
		return db.product.findMany({
			include: {
				categories: {
					select: {category: true}
				}
			}
		});
	}
	static async getByChannel(channel: ChannelType){
		return db.product.findMany({
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
	static async getById(id: string){
		return db.product.findUnique({
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
	static async create(data: INewProduct){
		const {id, name, price, stock, channel, categories} = data;
		return db.product.create({
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
	static async update(id: string, data: IUpdateProduct){
		const {name, price, stock, channel} = data;
		const UpdateData:Record<string, any> = {};
		if(name !== undefined) UpdateData.name = name;
		if(price !== undefined) UpdateData.price = price;
		if(stock !== undefined) UpdateData.stock = stock;
		if(channel !== undefined) UpdateData.channel = channel;

		return db.product.update({
			where: { id: id },
			data: UpdateData,
			include: {
				categories: {
					select: { category: true }
				}
			}
		});
	}
	static async delete(id: string){
		return db.product.delete({
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