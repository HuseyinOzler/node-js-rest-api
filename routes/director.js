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



module.exports = router;
