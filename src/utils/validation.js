const validator = require('validator');
const validateSignupData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;

	if (!(firstName || lastName)) {
		throw new Error('Name is not valid!');
	} else if (firstName.length < 3 || firstName.length > 50) {
		throw new Error('FirstName should be 4 to 50 characters long!');
	} else if (!validator.isEmail(emailId)) {
		throw new Error('Email is not valid!');
	} else if (password.length < 8 || password.length > 50) {
		throw new Error('Password should be 8 to 50 characters long!');
	} else if (!validator.isStrongPassword(password)) {
		throw new Error('Password is not strong enough!');
	}
};

const validateEditProfileData = (req) => {
	const { firstName, lastName, emailId, password } = req.body;
	const allowedEditFields = [
        'firstName',
		'lastName',
		'emailId',
		'about',
		'photoUrl',
		'age',
		'gender',
		'skills',
	];

	const isEditAllowed = Object.keys(req.body).every((field) =>
		allowedEditFields.includes(field)
	);

    return isEditAllowed
}
module.exports = {
    validateSignupData,
    validateEditProfileData
};
