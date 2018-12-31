const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./db/Todo.js');
const {User} = require('./db/User.js');
const {authenticate} = require('./authenticate.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

var app = express();
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
	}
	next();
});

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var NewTodo = new Todo({
		text: req.body.text,
		notes: req.body.notes
	});

	NewTodo.save().then((doc) => {
		res.send(doc);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((doc) => {
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

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {
		res.header('x-auth', user.generateAuthToken()).send(user);
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
			res.send(user.tokens);
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