import {PrismaClient} from '@prisma/client';
import { Router } from 'express';

const prisma = new PrismaClient();
const testRouter = Router();

testRouter.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

testRouter.post('/', async (req, res) => {
	const {name} = req.body;
	const user = await prisma.user.create({
		data: {
			name
		}});

	res.json(user);
})

export default testRouter;