const mongoose=require('mongoose');


module.exports = () => {
    mongoose.connect('mongodb://movie_user:osm147.1@ds245512.mlab.com:45512/movie-api', {
        useMongoClient: true
    });
    mongoose.connection.on('open', () => {
        console.log('MongoDb Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDb Baglantı Hatası !!!', err);
    });

    mongoose.Promise = global.Promise;
};
