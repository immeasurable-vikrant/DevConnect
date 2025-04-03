const express = require('express');
const { connectDB } = require('./config/database');
const User = require('./models/user');
const validateSignupData = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middlewares/auth');
const secretKey = 'devConnect@123';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
	try {
		// 1. Validation of data
		validateSignupData(req);
		// 2. Encrypt the password
		const { firstName, lastName, emailId, password } = req.body;
		const passwordHash = await bcrypt.hash(password, 10);
		console.log('passwordHash', passwordHash);
		// 3. Creating a new instance of the User model and Save the data
		const user = new User({
			firstName,
			lastName,
			password: passwordHash,
			emailId,
		});
		await user.save();
		res.send('Data is saved!');
	} catch (err) {
		res.status(400).send('Error saving the user: ' + err);
	}
});

app.post('/login', async (req, res) => {
	try {
		const { emailId, password } = req.body;
		// if(validators.validateEmail(emailId)) {
		// 	res.status(400).send('Invalid emailId');
		// }
		const user = await User.findOne({ emailId });
		if (!user) {
			throw new Error('Invalid Credentials!');
		}
		const isPasswordValid = await bcrypt.compare(
			password.trim(),
			user.password.trim()
		);

		if (isPasswordValid) {
			//Create a JWT token
			const token = await jwt.sign({ _id: user._id }, secretKey);
			console.log('token', token);

			// add the token to the cookie and send the response back to the user
			res.cookie('token', token);
			res.send('Successfully logged in!!');
		} else {
			res.status(400).send('Invalid password');
		}
	} catch (err) {
		res.status(400).send('Error saving the user: ' + err);
	}
});

app.get('/profile', userAuth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch (err) {
		console.log("err", err)
	}
});

// app.put("/user", async (req, res) => {
// 	try {
// 		const userId = req.body.userId;
// 		const data = req.body;
// 		await User.findByIdAndUpdate({_id: userId}, data, { runValidators: false });
// 		res.send("User Updated successfully!");
// 	} catch(err) {
// 		console.log("err")
// 		res.status(400).send("Error updating the user");
// 	}
// })

connectDB()
	.then(() => {
		app.listen(3005, () => {
			console.log('server is listening on 3005!');
		});
	})
	.catch((err) => {
		console.log('database cannot be connected', err);
	});
