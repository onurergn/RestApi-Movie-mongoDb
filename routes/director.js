const express = require('express');
const multer = require('multer');
const uploader = multer();
const mongoose = require('mongoose');
const router = express.Router();

//MODELS
const Director = require('../models/Director');

router.get('/getAllDirectors', uploader.none(), function(req, res, next) {
  const promise = Director.find({ });
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

router.post('/createNewDirector', (req, res) => {
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

//GET ALL DIRECTORS WITH MOVIES
router.get('/getDirectorsWithMovie', (req, res) => {
  const promise = Director.aggregate([
    {
			$lookup: {
				from: 'movies',
				localField: '_id',
				foreignField: 'director_id',
				as: 'yönetmenin filmleri'
			}
		},
		{
			$unwind: {
				path: '$yönetmenin filmleri',
        preserveNullAndEmptyArrays: true // filmi olmayan yönetmenleride getirmek için kullanılır
			}
		},
    {
      $group:{ // yönetmen ve filmleri tek bir çatı altında toplanmasını istedik.
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$yönetmenin filmleri'
        }
      }
    },
    { // birden fazla array olayını kaldırdık
      $project: {
				_id: '$_id._id',
				name: '$_id.name',
				surname: '$_id.surname',
        bio: '$_id.bio',
				movies: '$movies'
			}
    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


//GET DIRECTOR OF MOVIE BY ID
router.get('/getDirectorById:director_id', (req, res) => {
  const promise = Director.aggregate([
    {
      $match: {
        '_id': mongoose.Types.ObjectId( req.params.director_id )
      }
    },
    {
			$lookup: {
				from: 'movies',
				localField: '_id',
				foreignField: 'director_id',
				as: 'yönetmenin filmleri'
			}
		},
		{
			$unwind: {
				path: '$yönetmenin filmleri',
        preserveNullAndEmptyArrays: true // filmi olmayan yönetmenleride getirmek için kullanılır
			}
		},
    {
      $group:{ // yönetmen ve filmleri tek bir çatı altında toplanmasını istedik.
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$yönetmenin filmleri'
        }
      }
    },
    { // birden fazla array olayını kaldırdık
      $project: {
				_id: '$_id._id',
				name: '$_id.name',
				surname: '$_id.surname',
        bio: '$_id.bio',
				movies: '$movies'
			}
    }
  ]);
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


//UPDATE DIRECTOR
router.put('/updateDirector:director_id', (req, res, next) => {
  const promise = Director.findByIdAndUpdate(
    req.params.director_id,
    req.body,
    {
      new: true
    }
  );

  promise.then((director) => {
    if (!director){
      next( {message: 'The director was not found'} );
    }
    else{
      res.json(director);
    }
  }).catch((err) => {
    res.json(err);
  });
});


//DELETE DIRECTOR BYID
router.delete('/delDirectorById:director_id', (req, res, next) => {
  const promise = Director.findByIdAndRemove(req.params.director_id);

  promise.then((director) => {
    if (!director){
      next( {message: 'The director was not found'} );
    }
    else{
       res.json( {status: 1} );
    }
  }).catch((err) => {
    res.json(err);
  })
}); 

module.exports = router;
