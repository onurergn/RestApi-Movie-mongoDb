const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//MODELS
const User = require('../models/User');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expres' });
});

router.post('/register', function(req, res, next) {
  const {username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>{
    const user = new User({
      username,
      password: hash
    });

    const promise = user.save();

    promise.then((data) => {
      if(!data){
        next({ message: 'data is cant be empty' });
      }
      else{
        res.json(data);
      } 
    }).catch((err) => {
      res.json(err);
    });
  });
});

//LOGIN ÇIKTI OLARAK TOKEN URET
router.post('/authenticate', (req, res) => {
	const { username, password } = req.body;

	User.findOne({
		username
	}, (err, user) => {
		if (err)
			throw err;

		if(!user){
			res.json({
				status: false,
				message: 'Authentication failed, user not found.'
			});
		}else{
			bcrypt.compare(password, user.password).then((result) => {
				if (!result){
					res.json({
						status: false,
						message: 'Authentication failed, wrong password.'
					});
				}else{
					const payload = {
						username
					};
					const token = jwt.sign(payload, req.app.get('api_secret_key'), {
						expiresIn: 720 // 12 saat geçerli token
					});

					res.json({
						status: true,
						token
					})
				}
			});
		}
	});

});

module.exports = router;
