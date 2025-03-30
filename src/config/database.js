const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(
			'mongodb+srv://vikrantimmeasurable:i4vcn4xJjm3ors4C@cluster0-devconnect.eczlt5p.mongodb.net/devConnectDB'
		);
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
    connectDB
}