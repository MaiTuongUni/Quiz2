// 1. Import Area
require('dotenv').config();
const cors = require('cors');

const express = require('express');

// 1.1. Import Routers
const routerAttemp = require('./routes/quiz');

// 1.2. Import Packages
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const http = require('http');

// 2. Define server SocketIO, Express
const app = express();
const server = http.createServer(app)

app.use(
	fileUpload({
		useTempFiles: true
	})
);

// 4. Define Database

// @For tester
// mongoose.connect('mongodb+srv://mongodb:mongodb@cluster0.5yggc.mongodb.net/mongodb?retryWrites=true&w=majority', {
// 	useCreateIndex: true,
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useFindAndModify: false
// })
// .then(() => console.log('Connected to MongoDB!'))
// .catch((error) => console.log(`Connect fail, please check and try again!Error: ${error}`)) 

//@For dev
mongoose
.connect(process.env.MONGODB_URI || 'mongodb://localhost/Quiz', {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB!'))
.catch((error) => console.log(`Connect fail, please check and try again!Error: ${error}`)); 

// 5. Middlewares
app.use(cors());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json'
	);
	res.header('Access-Control-Expose-Headers', '*');
	req.header('Access-Control-Allow-Headers', '*');
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 6. Routes
app.use('/', routerAttemp);

// 7. Catch 404 error and forward them to error handler
app.use((req, res, next) => {
	const err = new HttpError('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = err.status || 500;

	return res.status(status).json({
		error: {
			message: error.message
		}
	});
});

// 10. Start server
app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function() {
	console.log('Server is listening at port ' + app.get('port'));
});
