const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const requestRouter = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

requestRouter.post(
	'/request/send/:status/:toUserId',
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status;

			// Validate the toUserId format
			if (!mongoose.Types.ObjectId.isValid(toUserId)) {
				return res.status(400).json({
					message: 'Invalid user ID format!',
				});
			}

			// Validate status
			const allowedStatus = ['ignored', 'interested'];
			if (!allowedStatus.includes(status)) {
				return res.status(400).json({
					message: 'Invalid status type!' + ' ' + status,
				});
			}

			// Check if toUserId is an existing user
			const toUser = await User.findById(toUserId);
			if (!toUser) {
				return res.status(404).json({
					message: 'User not found!',
				});
			}

			// Check if there is an existing connection request
			const existingConnectionRequest = await ConnectionRequestModel.findOne({
				$or: [
					{ fromUserId, toUserId },
					{ fromUserId: toUserId, toUserId: fromUserId },
				],
			});

			if (existingConnectionRequest) {
				return res.status(400).send({
					message: 'Connection request already exists!',
				});
			}

			// Create a new connection request
			const newConnectionRequest = new ConnectionRequestModel({
				fromUserId,
				toUserId,
				status,
			});

			const data = await newConnectionRequest.save();
			res.json({
				message:
					req.user.firstName + ' is ' + status + ' in ' + toUser.firstName,
				data,
			});
		} catch (err) {
			res.status(400).send('ERROR: ' + err);
		}
	}
);

requestRouter.post(
	'/request/review/:status/:requestId',
	userAuth,
	(req, res) => {
        
    }
);

module.exports = requestRouter;
