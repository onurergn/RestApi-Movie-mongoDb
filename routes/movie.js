const { Router } = require('express');
const express = require('express');
const multer = require('multer');
const uploader = multer();
const router = express.Router();

//MODELS
const Movie = require('../models/Movie');

//CREATE MOVIE
router.post('/createMovie', uploader.none(), (req, res, next) => {
  const {director_id, title, category, country, year, imdb_score} = req.body;
  const movie = new Movie({
    director_id: director_id,
    title: title,
    category: category,
    country: country,
    year: year,
    imdb_score: imdb_score
  });

  const promise = movie.save();
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

});


//GET ALL MOVIE
router.get('/getMovieAll', (req, res) => {
  const promise = Movie.find({ });
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


//GET FROM movie_id
router.get('/getMovie:movie_id', (req, res, next) => {
  //res.send(req.params.movie_id);
  const promise = Movie.findById(req.params.movie_id);
  promise.then((movie) => {
    if(!movie){
      next({ message: 'the movie was not found' });
    }
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});


//GET MOVIE WITH DIRECTORS
router.get('/getMovWithDirector', (req, res, next) => {
  const promise = Movie.aggregate([
		{
			$lookup: {
				from: 'directors',
				localField: 'director_id',
				foreignField: '_id',
				as: 'yönetmeni'
			}
		},
		{
			$unwind: {
        path: '$yönetmeni',
        preserveNullAndEmptyArrays: true
      }
		}
	]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  })
});


//UPDATE BY ID
router.put('/updateMovieById:movie_id', (req, res, next) => {
  //res.send(req.params.movie_id);
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,//geri dönen değer
    {
      new: true//güncellenen değer dönsün
    }
    );
  promise.then((movie) => {
    if(!movie){
      next({ message: 'the movie was not found' });
    }
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});


//DELETE FROM movie_id
router.delete('/delMovieById:movie_id', (req, res, next) => {
  //res.send(req.params.movie_id);
  const promise = Movie.findByIdAndRemove(req.params.movie_id);
  
  promise.then((movie) => {
    if(!movie){
      next({ message: 'the movie was not found' });
      res.json({ status :0 });
    }
    res.json({ status :1 });
  }).catch((err) => {
    res.json(err);
  });
});


//TOP 10 LIST
router.get('/getTop10', (req, res) => {
  const promise = Movie.find({ }).limit(10).sort({ imdb_score: -1 });

  promise.then((data) => {
    if(!data){
      res.json({ status :0 });
    }
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


//BELIRLI YILLAR ARASINDAKI FILMLERI GETIR
router.get('/between/:start_year/:end_year', (req, res) => {
  const {start_year, end_year} = req.params;
  const promise = Movie.find(
      {
        year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
      }
    );

  promise.then((data) => {
    if(!data){
      res.json({ status :0 });
    }
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


module.exports = router;
