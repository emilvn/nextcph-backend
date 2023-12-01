import {ChannelType} from "@prisma/client";

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

interface ISaleProduct {
	id: string;
	quantity: number;
	channel: ChannelType;
}

interface ICategory {
	id: string;
	name: string
}

interface INewSale {
	id?: string;
	created_at?: string;
	user_id: string;
	products: ISaleProduct[];
}

//skal måske fjernes
interface IProduct {
    id: string;
    name: string;
    price: number;
    stock: number;
    channel: ChannelType;
    created_at: Date;
    updated_at: Date;
    categories: string[];
}


export {INewProduct, IUpdateProduct, INewSale, IProduct}