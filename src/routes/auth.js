const express = require('express');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		// 1. Validation of data
		validateSignupData(req);
		// 2. Encrypt the password
		const { firstName, lastName, emailId, password } = req.body;
		const passwordHash = await bcrypt.hash(password, 10);
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

authRouter.post('/login', async (req, res) => {
	try {
		const { emailId, password } = req.body;
		// if(validators.validateEmail(emailId)) {
		// 	res.status(400).send('Invalid emailId');
		// }
		const user = await User.findOne({ emailId });
		if (!user) {
			throw new Error('Invalid Credentials!');
		}
		const isPasswordValid = await user.validatePassword(password);

		if (isPasswordValid) {
			//Create a JWT token
			const token = await user.getJWT();
			// add the token to the cookie and send the response back to the user
			res.cookie(
				'token',
				token,
				{ expires: new Date(Date.now() + 86400000) },
				{ httpOnly: true }
			);
			res.send('Successfully logged in!!');
		} else {
			res.status(400).send('Invalid password');
		}
	} catch (err) {
		res.status(400).send('Error saving the user: ' + err);
	}
});

authRouter.post('/logout', (req, res) => {
	res
		.cookie('token', null, {
			expires: new Date(Date.now()),
		})
		.send("logout successful!");
});

module.exports = authRouter;
