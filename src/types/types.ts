import {ChannelType, Product} from "@prisma/client";

interface INewProduct {
	id?: string;
	name: string;
	price: number;
	stock: number;
	channel: ChannelType;
	categories: string[];
}

interface IUpdateProduct {
	id?: string;
	name?: string;
	price?: number;
	stock?: number;
	channel?: ChannelType;
}

interface IProduct {
	id: string;
	name: string;
	price: number;
	stock: number;
	channel: ChannelType;
	categories: {
		category: ICategory;
	}[]
}

interface ICategory {
	id: string;
	name: string
}

interface INewSale {
	id?: string;
	user_id: string;
	products: IProduct[];
}

export {INewProduct, IUpdateProduct, INewSale}