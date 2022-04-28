const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

mongoose
	.connect(process.env.MONGODB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('DB connection successful!');

		const port = process.env.PORT || 3000;

		app.listen(port, () => {
			console.log(`App running on port ${port}...`);
		});
	})
	.catch((e) => {
		console.log(e)
	});