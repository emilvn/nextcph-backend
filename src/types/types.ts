import {ChannelType} from "@prisma/client";
import { number, string } from "zod";

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

interface IOverviewData {
	totalRevenue: number;
	totalSales: number;
	averageDailySales: number;
	averageDailyRevenue: number;
	categories: IOverviewCategory[];
}

interface IOverviewCategory{
	name: string;
	total: number;
	percentage: number;
}

export {INewProduct, IUpdateProduct, INewSale}