import {PrismaClient} from "@prisma/client";


abstract class Repository {
	protected abstract db: PrismaClient;
}

export default Repository;