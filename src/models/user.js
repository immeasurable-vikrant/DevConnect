const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	emailId: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
	},
	age: {
		type: Number,
	},
	gender: {
		type: String,
	},
	photoUrl: {
		type: String,
		default: 'https://i.imgur.com/81Q1J11.png'
	},
	about: {
		type: String
	},
	skills: {
		type: [String]
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User; 