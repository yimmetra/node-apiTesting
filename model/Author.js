// const mongoose = require('mongoose');
import mongoose from "mongoose";

const AuthorSchema = mongoose.Schema({
    name: {
        type: String,
        required: '{PATH} is required!'
    },
    books: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'book' }
    ]
}, {
    timestamps: { createdAt: 'created_at',updatedAt:'updated_at' }
});

var Author = mongoose.model('author', AuthorSchema);
export default Author;