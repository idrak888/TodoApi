const {mongoose} = require('./mongoose.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	}catch(e) {
		return Promise.reject();
	}

	return User.findOne({_id:decoded._id, 'tokens.token':token, 'tokens.access':'auth'})
};

// UserSchema.pre('save', (next) => {
// 	var user = this;

// 	if(user.isModified('password')) {
// 		bcrypt.genSalt(10, (err, salt) => {
// 			bcrypt.hash(password, salt, (err, hash) => {
// 				user.password = hash;
// 			});
// 		});
// 		next();
// 	}else {
// 		next();
// 	}
// });

var User = mongoose.model('User', UserSchema);

module.exports = {
	User
}