const mongoose = require('mongoose');
const validator = require('validator');
const secretKey = 'devConnect@123';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
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
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Email is invalid');
				}
			},
		},
		password: {
			type: String,
			validate(val) {
				if (!validator.isStrongPassword(val)) {
					throw new Error('Password is not strong enough');
				}
			},
		},
		age: {
			type: Number,
			min: 18,
		},
		gender: {
			type: String,
			validate(val) {
				if (!['male', 'female', 'other'].includes(val)) {
					throw new Error('Gender must be male, female or other');
				}
			},
		},
		photoUrl: {
			type: String,
			default: 'https://i.imgur.com/81Q1J11.png',
			validate(val) {
				if (!validator.isURL(val)) {
					throw new Error('Photo URL is invalid');
				}
			},
		},
		about: {
			type: String,
		},
		skills: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.getJWT = async function () {
	const user = this;
	const token = await jwt.sign({ _id: user._id }, secretKey, {
		expiresIn: '1d',
	});
	return token
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
	const user = this;
	const passwordHash = user.password;
	const isPasswordValid = await bcrypt.compare(
		passwordInputByUser.trim(),
		passwordHash.trim()
	);
	return isPasswordValid;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
