const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    direction_id: Schema.Types.ObjectId,
    image_id: Schema.Types.ObjectId,
    title:{
        type:String,
        required:[true,'` {PATH} ` alan girilmesi zorunludur'],
        maxlength: [10, '` {PATH} ` 10 dan fazla karekter girilemez'],
        minlength: [3, '` {PATH} ` 3 den fazla karekter girilmelidir'],
    },
    category:{
        type:String,
        
    },
    country:String,
    year:{
        type:Number,
        max:2040,
        min:1900
    },
    imdb_score:{
        type:Number,
        max:10,
        min:0
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});







module.exports = mongoose.model('movie',MovieSchema);
