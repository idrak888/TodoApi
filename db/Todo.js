const {mongoose} = require('./mongoose');

const Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		required: true,
		default: false
	},
	notes: {
		type: String,
		required: true,
		default: 'Notes'
	}
});

module.exports = {
	Todo
}