const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: [true, '{PATH} alanı zorunludur'],
        maxlength: [15, '{PATH} alanı maximum {MAXLENGTH} karakter olmalıdır'],
        minlength: [3, '{PATH} alanı minimum {MINLENGTH} karakter olmalıdır']
    },
    category: {
        type: String,
        required: [true, '{PATH} alanı zorunludur'],
        maxlength: [30, '{PATH} alanı maximum {MAXLENGTH} karakter olmalıdır'],
        minlength: [3, '{PATH} alanı minimum {MINLENGTH} karakter olmalıdır']
    },
    country: String,
    year: {
        type: Number,
        max: [2030, '{PATH} alanı maximum {MAX} yılı içerisinde olmalıdır'],
        min: [1970, '{PATH} alanı minimum {MIN} yılı içerisinde olmalıdır']
    },
    imdb_score: {
        type: Number,
        max: 10,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movie', MovieSchema);