const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./db/Todo.js');

const express = require('express');
const bodyParser = require('body-parser');

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

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	Todo.findByIdAndRemove(id).then((todo) => {
		res.send(todo);
	});
});

app.listen(port, () => {
	console.log('Server is up on port '+port);
});