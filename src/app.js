const express = require('express');
const { connectDB } = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
	const userObj = req.body;
	console.log(userObj);
	const user = new User(userObj);

	try {
		await user.save();
		res.send('Data is saved!');
	} catch (err) {
		res.status(400).send('Error saving the user: ' + err);
	}
});

// GET API - get user by email
app.get('/user', async (req, res) => {
	const userEmail = req.body.emailId;
	try {
		const userObj = await User.find({ emailId: userEmail });
		if(userObj.length < 1){
			res.status(400).send('User not found!');
		}
		res.send(userObj);
	} catch (err) {
		console.log("something went wrong!");
	}
});

// Feed API - GET API - get all the users from the database
app.get('/feed', async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		console.log("something went wrong!");
	}
});

// Delete API - delete a user from the database
app.delete("/user", async (req, res) => {
	try {
		const userId = req.body.userId;
		const deletedUser = await User.findByIdAndDelete(userId);
		res.send(deletedUser);
	} catch(err) {
		console.log(err)
	}
})

//Update API - delete a user from the database
app.patch("/user", async (req, res) => {
	try {
		const userId = req.body.userId;
		const data = req.body;
		await User.findByIdAndUpdate({_id: userId}, data);
		res.send("User Updated successfully!");
	} catch(err) {
		console.log(err)
	}
})

app.put("/user", async (req, res) => {
	try {
		const userId = req.body.userId;
		const data = req.body;
		await User.findByIdAndUpdate({_id: userId}, data);
		res.send("User Updated successfully!");
	} catch(err) {
		console.log(err)
	}
})

connectDB()
	.then(() => {
		app.listen(3005, () => {
			console.log('server is listening on 3005!');
		});
	})
	.catch((err) => {
		console.log('database cannot be connected', err);
	});
