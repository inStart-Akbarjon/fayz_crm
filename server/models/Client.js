const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    products: [{
        id: String,
        name: String,
        category: String,
        price: Number, 
        tilePrice: Number, 
        quantity: Number,
        country: String,
        color: String,
        surface: String,
        thickness: Number,
        length: Number,
        width: String,
        sum: Number,
        paidAmount: Number,
        paymentStatus: String,
        weight: Number,
        creationDate: Date // Поле даты создания
    }]    
});

module.exports = mongoose.model('Client', clientSchema);
