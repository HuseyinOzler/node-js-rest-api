const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
/* Film ekleme  */
router.post('/',(req, res, next) => {
const movie = new Movie(req.body);
const promise = movie.save();
 /*const {
   title,
   imdb_score,
   category,
   country,
   year,
 } = req.body; */
 promise.then((data) => {
  res.json(data);
 }).catch((err) => {
   res.json(err);
 });
});




router.get('/allmovies',(req,res) => {


  const promise = Movie.find({})
  promise.then((movies)=>{
    res.json({movies})
  }).catch((err,data)=>{
    res.json(err);
  });



});




//tüm filimleri getiren yönlendirici
//from : ne ile eşleştirilecekse
router.get('/', (req, res) => {
  const promise = Movie.aggregate([
    {
      $lookup:{
        from:'directors',
        localField: 'direction_id',
        foreignField:'_id',
        as:'directors'
      }
    },
    {
      $unwind:'$directors'
    }
  ])
   

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  })
});

//top 10 listesi
router.get('/top10', (req, res) => {
  const promise = Movie.find({}).limit(10).sort({
    imdb_score: -1
  });
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err)
  })
});


//id bazlı aramalar için kullanılır
//http://localhost:3000/api/movies/5b91a28d1e2fc321feaa81f6
//5d91 ile başlayan id
router.get('/:movie_id', (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);

  promise.then((data) => {
    if (!data)
      next({
        message: 'The data was not found.',
        code: 99
      });

    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});



//update (güncelleme) id bazlı güncelleme
router.put('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    {
      new:true
    }
  );
  promise.then((data) => {
    if (!data)
      next({
        message: 'The data was not found.',
        code: 99
      });

    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});



//id bazılı silme işlemi
router.delete('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(
    req.params.movie_id);
  promise.then((data) => {
    if (!data)
      next({
        message: 'The data was not found.',
        code: 99
      });

    res.json({status:1});
  }).catch((err) => {
    res.json(err);
  });
});
 



//Between iki tarih arası 
router.get('/between/:start_year/:end_year',(req,res) => {
  const { start_year,end_year } =req.params;
  const promise = Movie.find(
      { 
        year:{ "$gte":parseInt(start_year), "$lte":parseInt(end_year) }
      }
  );
  promise.then((data) => {
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});






module.exports = router;
