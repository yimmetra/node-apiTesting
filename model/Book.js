// const mongoose = require('mongoose');
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const TypeBookSchema=mongoose.Schema({
    name:{
        type: String
    }
})

const BookSchema = mongoose.Schema({
    title: {
        type: String,
        required: '{PATH} is required!'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'author'
    },
    drink: {
        type: String,
        enum: ['Coffee', 'Tea']
    },
    book_type:[TypeBookSchema]
}, {
    timestamps: { createdAt: 'created_at',updatedAt:'updated_at' }
});
BookSchema.plugin(mongoosePaginate)

var Book = mongoose.model('book', BookSchema);

export {Book,BookSchema};