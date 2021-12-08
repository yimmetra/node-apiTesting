// const mongoose = require('mongoose');
import mongoose from "mongoose";

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
    }
}, {
    timestamps: { createdAt: 'created_at',updatedAt:'updated_at' }
});

var Book = mongoose.model('book', BookSchema);

export {Book,BookSchema};