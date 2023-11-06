import express from 'express';
import cors from 'cors';
import testRouter from './routes/test';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/test', testRouter);

app.listen(3000, () => {
  console.log('Server started on port http://localhost:3000');
});