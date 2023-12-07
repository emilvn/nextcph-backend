import { ChannelType, type PrismaClient} from "@prisma/client";
import Repository from "./Repository";

class CategoryRepository extends Repository {
	db: PrismaClient;
	constructor(db: PrismaClient) {
		super();
		this.db = db;
	}
	public getNames = (channel?: ChannelType) => {
		return this.db.category.findMany({
			where: {
				channel: channel
			},
			select: {
				name: true,
			}
		});
	}
}

export default CategoryRepository;