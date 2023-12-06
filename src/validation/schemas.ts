import { z } from "zod";


const NewProductSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(191),
	price: z.number().positive(),
	stock: z.number().min(0),
	channel: z.enum(["HAIR_CARE", "COSMETIC"]),
	categories: z.array(z.string()
		.min(1)
		.max(191, { message: "Category name is too long" })),
});

const UpdateProductSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(191).optional(),
	price: z.number().positive().optional(),
	stock: z.number().min(0).optional(),
	channel: z.enum(["HAIR_CARE", "COSMETIC"]).optional(),
});

const SaleProductSchema = z.object({
	id: z.string(),
	quantity: z.number().min(1),
	channel: z.enum(["HAIR_CARE", "COSMETIC"])
});

const NewSaleSchema = z.object({
	id: z.string().optional(),
	user_id: z.string(),
	products: z.array(SaleProductSchema),
})

const ChannelSchema = z.enum(["HAIR_CARE", "COSMETIC"]);
const DateSchema = z.coerce.date();

export { NewProductSchema, UpdateProductSchema, ChannelSchema, NewSaleSchema, DateSchema }