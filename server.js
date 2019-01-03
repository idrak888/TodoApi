const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./db/Todo.js');
const {User} = require('./db/User.js');
const {authenticate} = require('./authenticate.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

var app = express();
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Expose-Headers", "X-Auth");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth");
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
	}
	next();
});

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
	var NewTodo = new Todo({
		text: req.body.text,
		notes: req.body.notes,
		_creator: req.user._id
	});

	NewTodo.save().then((doc) => {
		res.send(doc);
	});
});

app.get('/todos', authenticate, (req, res) => {
	Todo.find({_creator:req.user._id}).then((doc) => {
		res.send(doc);
	});
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	Todo.findByIdAndRemove(id).then((todo) => {
		res.send(todo);
	});
});

//users

app.delete('/users', (req, res) => {
	User.find().remove().then((doc) => {
		res.send(doc);
	});
});

app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);
	
	const output = `
		<h1>Thank you for logging in to TodoApp by <strong>Idrak Mustahsin</strong></h1>
		Email: ${body.email}`;

	user.save().then(() => {
	nodemailer.createTestAccount((err, account) => {
	    // create reusable transporter object using the default SMTP transport
	    let transporter = nodemailer.createTransport({
	        service: 'gmail',
	        auth: {
	            user: 'fullstackenthusiast@gmail.com', // generated ethereal user
	            pass: '8nov2016' // generated ethereal password
	        },
	        tls: {

	        }
	    });

	    // setup email data with unicode symbols
	    let mailOptions = {
	        from: '"Idrak Mustahsin <fullstackenthusiast@gmail.com>"', // sender address
	        to: body.email, // list of receivers
	        subject: 'Thank you for using my Todo App', // Subject line
	        text: 'Hello world', // plain text body
	        html: output// html body
	    };

	    // send mail with defined transport object
	    transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	            return console.log(error);
	        }
	        console.log('Message sent: %s', info.messageId);
	        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	    });
	});
		res.header('x-auth', user.generateAuthToken()).send(user);
	}).catch(e => {
		res.status(400).send(e);
	});
});

app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

app.get('/users', (req, res) => {
	User.find().then((doc) => {
		res.send(doc);
	});
});

app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findOne({email:body.email}).then(user => {
		if (user.password === body.password) {
			var token = user.generateAuthToken();
			res.header('x-auth', token).send('User '+user.email+' logged in.');
		}else {
			res.status(401).send('Wrong password or email.');
		}
	}).catch(e => {
		res.status(400).send("Email not signed up");
	});	
});

app.listen(port, () => {
	console.log('Server is up on port '+port);
});