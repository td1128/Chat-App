import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser()); //middleware to access cookies 

app.use("/api/auth",authRoutes);

app.use("/api/messages",messageRoutes);

app.use("/api/users",userRoutes);
app.get('/', (req, res) => {
    res.send("Hello, world!    gfukffliukf");
})


app.listen(PORT,() => {
    connectToMongoDB();
    console.log(`listening on ${PORT}`);
});
