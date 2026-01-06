const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    tittle: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Ghazal', 'Nazm', 'Romantic Poetry', 'Modern Poetry', 'Sufi Poetry', 'Revolutionary Poetry', 'Best Sellers']
    },
    
}, { timestamps: true });  

module.exports = mongoose.model("book", BookSchema);
