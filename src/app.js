const express = require('express');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');

const app = express();
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
		app.listen(3005, () => {
			console.log('server is listening on 3005!');
		});
	})
	.catch((err) => {
		console.log('database cannot be connected', err);
	});
