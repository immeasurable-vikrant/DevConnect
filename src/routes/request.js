const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const requestRouter = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

requestRouter.post(
	'/request/send/:status/:fromUserId',
	userAuth,
	async (req, res) => {
		try {
			const toUserId = req.user._id;
			const fromUserId = req.params.fromUserId;
			const status = req.params.status;

			// Validate the fromUserId format
			if (!mongoose.Types.ObjectId.isValid(fromUserId)) {
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

			// Check if fromUserId is an existing user
			const toUser = await User.findById(fromUserId);
			if (!toUser) {
				return res.status(404).json({
					message: 'User not found!',
				});
			}

			// Check if there is an existing connection request
			const existingConnectionRequest = await ConnectionRequestModel.findOne({
				$or: [
					{ toUserId, fromUserId },
					{ toUserId: fromUserId, fromUserId: toUserId },
				],
			});

			if (existingConnectionRequest) {
				return res.status(400).send({
					message: 'Connection request already exists!',
				});
			}

			// Create a new connection request
			const newConnectionRequest = new ConnectionRequestModel({
				toUserId,
				fromUserId,
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
	async (req, res) => {
		try {
			const loggedInUser = req.user;
			const { status, requestId } = req.params;
			// validate the status
			const allowedStatus = ['accepted', 'rejected'];
			if (!allowedStatus.includes(status)) {
				return res.status(400).json({
					message: 'Status not allowed!',
				});
			}

			// loggedInUser == fromUserId
			// status = interested
			//request Id should be valid
			const connectionRequest = await ConnectionRequestModel.findOne({
				_id: requestId,
				fromUserId: loggedInUser._id,
				status: 'interested',
			});
			if (!connectionRequest) {
				return res
					.status(404)
					.json({ message: 'Connection request not found!' });
			}
			connectionRequest.status = status;
			const data = await connectionRequest.save();

			res.json({ message: 'Connection request' + ' ' + status, data });
		} catch (err) {
			console.log('ERROR: ', err);
		}
	}
);

module.exports = requestRouter;
