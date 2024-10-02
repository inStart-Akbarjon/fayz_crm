const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    products: [{
        id: String,
        name: String,
        category: String,
        price: Number, // Поле для хранения цены продукта, по которой купил клиент
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
