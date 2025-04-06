const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
	{
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // reference to the User collection/model
			required: true,
		},
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: {
				values: ['ignore', 'interested', 'accepted', 'rejected'],
				message: `{VALUE} is incorrect!`,
			},
		},
	},
	{
		timestamps: true,
	}
);

connectionRequestSchema.pre('save', function (next) {
	const connectionRequest = this;
	if (connectionRequest.toUserId.equals(connectionRequest.fromUserId)) {
		throw new Error('You cannot send request to yourself!');
	}
	next();
});

const ConnectionRequestModel = mongoose.model(
	'ConnectionRequest',
	connectionRequestSchema
);

module.exports = ConnectionRequestModel;
