const mongoose = require('mongoose');

const importedProductSchema = new mongoose.Schema({
    name: { type: String, required: false },
    id: { type: String, required: true },
    category: { type: String, required: false },
    price: { type: Number, required: false },
    quantity: { type: Number, required: false },
    country: { type: String, required: false },
    color: { type: String, required: false },
    surface: { type: String, required: false },
    thickness: { type: Number, required: false },
    length: { type: Number, required: false },
    FirstlengthWood: { type: Number, required: false  },
    width: { type: String, required: false },
    sum: { type: Number, required: false },
    weight: { type: Number, required: false },
    creationDate: { type: Date, default: Date.now },
    Firstlength: { type: Number, required: false },
});

const ImportedProduct = mongoose.model('ImportedProduct', importedProductSchema);

module.exports = ImportedProduct;

