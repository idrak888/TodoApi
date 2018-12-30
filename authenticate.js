const {User} = require('./db/User.js');

var authenticate = (req, res, next) => {
	var token = req.header('X-Auth');

	User.findByToken(token).then((user) => {
		req.user = user;
		req.token = token;
		next();
	}).catch(e => {
		res.status(401).send();
	});
};

module.exports = {
	authenticate
}