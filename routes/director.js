const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Model dosyasını dahil etme
const Director = require('../models/Director');
router.post('/',(req,res) => {
   
  const director = new Director(req.body);
  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});






//film yönetmenleri ile filmlerini eşleştirir 
//path:'$movi olan kısma kadar yönetmen ile filmi eşleştirir'
//preserveNullAndEmptyArrays:true --> burada eşleme olamsa bile yönetmeni getirir filmi olmasada olur yine gelir
//$group ile tek bir yönetmenin birden fazla filmini bir arada tutmayı sağlıyor 
router.get('/',(req,res) => {
  const promise = Director.aggregate([
    {
      $lookup:{
          from:'movies',
          localField:'_id',
          foreignField: 'direction_id',
          as:'movies'
      }
    },
    {
      $unwind:{
        path:'$movies',
        preserveNullAndEmptyArrays:true
      }
    },
    {
      $group:{
        _id:{
          _id:'$_id',
          name:'$name',
          surname:'$surname',
          bio:'$bio'
        },
        movies:{
          $push:'$movies'
        }
      }
    },
    {
      $project:{
        _id:'$_id._id',
        name:'$_id.name',
        surname:'$_id.surname',
        movies:'$movies'
      }
    }
  ]);
   

  promise.then((data)=>{
 res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});






//tek kayıt getirir yönetmen ve filleri
//$lookup fonksiyonu ile diğer db ler arasında eşleştirme yapar
//$unwind as içindeki bilgileri yazdırır
//$group gruplama operatoru
//$project hangi alanı istiyorsak o alanı bize getiri diğerleri göstermez
router.get('/:director_id', (req, res) => {
  const promise = Director.aggregate([
    {
      $match:{
        '_id': mongoose.Types.ObjectId(req.params.director_id)

      }
    },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'direction_id',
        as: 'movies'
      }
    },
    {
      $unwind: {
        path: '$movies',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          name: '$name',
          surname: '$surname',
          bio: '$bio'
        },
        movies: {
          $push: '$movies'
        }
      }
    },
    {
      $project: {
        _id: '$_id._id',
        name: '$_id.name',
        surname: '$_id.surname',
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



//id bazlı yönetmen (director) güncelleme işlemi
router.put('/:director_id',(req,res) => {
  const promise = Director.findByIdAndUpdate(
    req.params.director_id,
    req.body,
    {
      new:true,
    }
  );
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


//id bazlı yönetmen (director) silme işlemi
router.delete('/:director_id',(req,res) =>{
  const promise = Director.findByIdAndRemove(req.params.director_id)
    promise.then((director) => {
      res.json(director);
    }).catch((err) => {
      res.json(err);
    });
  
});





module.exports = router;
