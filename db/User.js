const {mongoose} = require('./mongoose.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token:{
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
	var userObject = this.toObject();
	return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {
	var access = 'auth';
	var token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString();

	this.tokens.push({access, token});
	this.save();
	return token;
};

var User = mongoose.model('User', UserSchema);

module.exports = {
	User
}