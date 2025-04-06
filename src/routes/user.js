const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();
const USER_SAFE_DATA = [
	'firstName',
	'lastName',
	'photoUrl',
	'age',
	'gender',
	'about',
];

//get all the pending connection request for the loggedin user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequest = await ConnectionRequestModel.find({
			fromUserId: loggedInUser._id,
			status: 'interested',
		}).populate('toUserId', USER_SAFE_DATA);

		res.json({
			message: 'Data fetched successfully!',
			data: connectionRequest,
		});
	} catch (err) {
		console.log('Error: ', err);
	}
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
	try {
		const loggedInUser = req.user;
		const connectionRequests = await ConnectionRequestModel.find({
			$or: [
				{ toUserId: loggedInUser._id, status: 'accepted' },
				{ fromUserId: loggedInUser._id, status: 'accepted' },
			],
		})
			.populate('toUserId', USER_SAFE_DATA)
			.populate('fromUserId', USER_SAFE_DATA);

		const data = connectionRequests.map((row) => {
			if (row.fromUserId._id === loggedInUser._id) {
				return row.toUserId;
			}
			return row.toUserId;
		});

		res.json({
			message: 'Data fetched successfully!',
			data: data,
		});
	} catch (err) {
		console.log('Error: ', err);
	}
});

userRouter.get('/feed', userAuth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		limit = limit > 50 ? 50 : limit
		const skip = (page - 1) * limit;
		// User should see all the user cards except:
		// 0. His own
		// 1. His connections
		// 2. Ignored people
		// 3. Already sent the connection request to

		const loggedInUser = req.user;

		// Find all connection requests (sent + received)
		const connectionRequests = await ConnectionRequestModel.find({
			$or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
		})
			.select(['fromUserId', 'toUserId'])
			.populate('fromUserId', 'firstName')
			.populate('toUserId', 'firstName');

		// Initialize Set to hide users from feed
		const hideUserFromFeed = new Set();

		connectionRequests.forEach((req) => {
			// Add both fromUserId and toUserId to the Set (as ObjectId, not strings)
			hideUserFromFeed.add(req.fromUserId._id);
			hideUserFromFeed.add(req.toUserId._id);
		});

		// Find users that should not be hidden
		const users = await User.find({
			$and: [
				{ _id: { $nin: Array.from(hideUserFromFeed) } }, // Exclude hidden users
				{ _id: { $ne: loggedInUser._id } }, // Exclude logged-in user
			],
		})
			.select(USER_SAFE_DATA)
			.skip(skip)
			.limit(limit);

		res.send(users);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

module.exports = userRouter;
