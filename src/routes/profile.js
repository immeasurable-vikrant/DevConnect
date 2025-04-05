const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
	try {
		const user = req.user;

		res.send(user);
	} catch (err) {
		res.status(400).send('ERROR : ' + err.message);
	}
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
	try {
		if (!validateEditProfileData(req)) {
			throw new Error('Invalid edit request!');
		}
		// user coming from userAuth there we have attached to the req.
		const loggedInUser = req.user;
		// bad way of editing the fields
		// loggedInUser.firstName = req.body.firstName;
		// loggedInUser.lastName = req.body.lastName;

		Object.keys(req.body).forEach((key) => {
			return (loggedInUser[key] = req.body[key]);
		});
		await loggedInUser.save();
		console.log('loggedInUser', loggedInUser);
		res.send('profile updated successfully!');
	} catch (err) {
		res.status(400).send('err: cannot edit the profile');
	}
});

profileRouter.patch('/profile/edit/password', userAuth, async (req, res) => {
	try {

	} catch (err) {
		console.log("Err: ", err)
	}
})

module.exports = profileRouter;
