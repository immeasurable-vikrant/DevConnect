const express = require('express');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);	
app.use('/', userRouter);	



connectDB()
	.then(() => {
		app.listen(7777, () => {
			console.log('server is listening on 7777!');
		});
	})
	.catch((err) => {
		console.log('database cannot be connected', err);
	});
