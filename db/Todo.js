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
	completedAt: {
		type: Number,
		required: true,
		default: Math.floor((new Date()).getTime() / 1000)
	}
});

module.exports = {
	Todo
}