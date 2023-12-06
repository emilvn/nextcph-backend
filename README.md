# Next CPH Backend
## First year exam project, KEA Datamatiker - December 2023

### Deployed backend
https://nextcph-backend.azurewebsites.net

### Installation
1. Clone the repository
```bash
git clone https://github.com/emilvn/nextcph-backend.git
```
2. Enter the directory
```bash
cd nextcph-backend
```
3. Install dependencies
```bash
npm install
```
4. Create a .env file in the root of the project and add a DATABASE_URL variable that points to your local database
```bash
DATABASE_URL=postgres://username:password@localhost:3306/nextcph
```
5. Setup the database
```bash
npx prisma db push
```
6. Run the server in development mode
```bash
npm run dev
```

Now the backend should be running. However there will be no data in the database, as you are using your own development database. 
If you want to get some data on your database, we have some dummy product and saledata you can add. To do this, follow the steps below.
Otherwise we recommend you use the deployed backend, which has data on it. You can find it here: https://nextcph-backend.azurewebsites.net

### Adding dummy data
1. Go to Postman and check that you have a connection to the server, by sending a request
```bash
GET http://localhost:3000/products
```
2. If you get a response with an empty array, you are good to go. If not, check that the server is running and that you have the correct port.
3. Get the dummy product data, it is located in
```bash
nextcph-backend/dummydata/dummy.products.json
```
4. Send a POST request to the server with the data as raw JSON data in the body
```bash
POST http://localhost:3000/products/bulk
```
5. to check if it worked, send a GET request to the server
```bash
GET http://localhost:3000/products
```
Now you should have some products in your database. If you want to add some sale data, follow the steps below.

1. Get the dummy sale data, it is located in
```bash
nextcph-backend/dummydata/dummy.sales.json
```
2. Send a POST request to the server with the data as raw JSON data in the body
```bash
POST http://localhost:3000/sales/bulk
```
3. to check if it worked, send a GET request to the server
```bash
GET http://localhost:3000/sales
```
Now you should have some sale data in your database.