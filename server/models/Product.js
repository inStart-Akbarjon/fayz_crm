const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    tilePrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    country: { type: String, required: true },
    color: { type: String, required: true },
    surface: { type: String },
    thickness: { type: Number },
    length: { type: Number, required: true },
    width: { type: String },
    sum: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    weight: { type: Number },
    creationDate: { type: Date, default: Date.now } // Поле даты создания
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
