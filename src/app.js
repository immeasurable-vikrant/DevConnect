const express = require('express');
const { connectDB } = require('./config/database');
const  User = require("./models/user")

const app = express();

app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: 'Vikrant',
        lastName: 'Singh Rajput',
        emailId: 'vikrantsingh@gmail.com',
        password: '123456',
    });
    
    const user1 = await user.save();
    res.send("Data is saved!")

});

connectDB()
	.then(() => {
		app.listen(3005, () => {
			console.log('server is listening on 3005!');
		});
	})
	.catch((err) => {
		console.log('database cannot be connected', err);
	});
