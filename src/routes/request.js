const express = require('express');
const { userAuth } = require('../middlewares/auth');
const mongoose = require('mongoose');
const { ConnectionRequest } = require('../models/connectionRequest');
const { User } = require('../models/user'); // assuming you have a User model
const requestRouter = express.Router();

requestRouter.post(
	'/request/send/:status/:toUserId',
	userAuth,
	async (req, res) => {
		try {
			const fromUserId = req.user._id;
			const toUserId = req.params.toUserId;
			const status = req.params.status.toLowerCase();

			console.log("Request params:", { fromUserId, toUserId, status });

			// Validate ObjectIds
			if (
				!mongoose.Types.ObjectId.isValid(fromUserId) ||
				!mongoose.Types.ObjectId.isValid(toUserId)
			) {
				return res.status(400).json({
					message: 'Invalid user ID format!',
				});
			}

			// Validate status
			const allowedStatus = ['ignored', 'interested'];
			if (!allowedStatus.includes(status)) {
				return res.status(400).json({ message: 'Invalid status type!' });
			}

			// Check if target user exists
			const toUser = await User.findById(toUserId);
			if (!toUser) {
				return res.status(404).json({ message: 'Target user not found!' });
			}

			// Check if a connection already exists (in either direction)
			const existingConnectionRequest = await ConnectionRequest.findOne({
				$or: [
					{ fromUserId: toUserId, toUserId: fromUserId },
					{ fromUserId, toUserId },
				],
			});

			if (existingConnectionRequest) {
				return res
					.status(400)
					.json({ message: 'Connection Request Already Exists!' });
			}

			// Create a new connection request
			const newConnectionRequest = new ConnectionRequest({
				fromUserId,
				toUserId,
				status,
			});

			const data = await newConnectionRequest.save();

			res.status(200).json({
				message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
				data,
			});
		} catch (err) {
			console.error("Error details:", err);
			res.status(500).json({ 
				message: 'Internal Server Error', 
				error: err.message,
				stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
			});
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
			const connectionRequest = await ConnectionRequest.findOne({
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
