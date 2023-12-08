import {ChannelType} from "@prisma/client";

interface INewProduct {
	id?: string;
	name: string;
	price: number;
	stock: number;
	min_stock: number;
	max_stock: number;
	channel: ChannelType;
	categories: string[];
}

interface IUpdateProduct {
	id?: string;
	name?: string;
	price?: number;
	stock?: number;
	min_stock?: number;
	max_stock?: number;
	channel?: ChannelType;
}

interface ISaleProduct {
	id: string;
	quantity: number;
	channel: ChannelType;
}

interface INewSale {
	id?: string;
	created_at?: string;
	user_id: string;
	products: ISaleProduct[];
}

export {INewProduct, IUpdateProduct, INewSale}