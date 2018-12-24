const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./db/Todo.js');

const express = require('express');
const bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	var NewTodo = new Todo({
		text: req.body.text
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

app.listen(port, () => {
	console.log('Server is up on port '+port);
});