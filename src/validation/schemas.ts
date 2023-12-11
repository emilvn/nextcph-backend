import { z } from "zod";

const NewProductSchema = z
    .object({
        id: z.string().optional(),
        name: z
            .string()
            .min(1, { message: "For kort produktnavn" })
            .max(191, { message: "For langt produktnavn" }),
        price: z.number().positive({ message: "Pris må ikke være negativ" }),
        stock: z
            .number()
            .min(0, { message: "Lagerbeholdning må ikke være negativ" }),
        min_stock: z.number().min(0, {
            message: "Minimum lagerbeholdning må ikke være negativ"
        }),
        max_stock: z.number().min(1, {
            message: "Maksimum lagerbeholdning må ikke være 0 eller derunder"
        }),
        channel: z.enum(["HAIR_CARE", "COSMETIC"], {
            invalid_type_error:
                "Channel skal være enten HAIR_CARE eller COSMETIC"
        }),
        categories: z
            .array(
                z
                    .string()
                    .min(1, { message: "For langt kategorinavn" })
                    .max(191, { message: "For langt kategorinavn" })
            )
            .min(1, { message: "For få kategorier (min 1)" })
            .max(5, { message: "For mange kategorier (max 5)" })
    })
    .refine((data) => data.min_stock <= data.max_stock, {
        message: "Minimum lagerbeholdning må ikke være større end maksimum"
    });

const SaleProductSchema = z.object({
    id: z.string(),
    quantity: z.number().min(1, { message: "Antal skal minimum være 1" }),
    channel: z.enum(["HAIR_CARE", "COSMETIC"], {
        invalid_type_error: "Channel skal være enten HAIR_CARE eller COSMETIC"
    })
});

const NewSaleSchema = z.object({
    id: z.string().optional(),
    user_id: z.string({
        required_error: "Bruger id mangler"
    }),
    created_at: z.string().optional(),
    products: z.array(SaleProductSchema).min(1, {
        message: "Der skal være mindst 1 produkt på et salg"
    })
});

const RequiredChannelSchema = z.enum(["HAIR_CARE", "COSMETIC"], {
    required_error: "Missing required channel query parameter",
    invalid_type_error:
        "Invalid channel query parameter, must be either HAIR_CARE or COSMETIC"
});
const OptionalChannelSchema = z
    .enum(["HAIR_CARE", "COSMETIC"], {
        invalid_type_error:
            "Invalid channel query parameter, must be either HAIR_CARE or COSMETIC"
    })
    .optional();

const DateSchema = z.coerce.date();

export {
    NewProductSchema,
    RequiredChannelSchema,
    NewSaleSchema,
    DateSchema,
    OptionalChannelSchema
};
