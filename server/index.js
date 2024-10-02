const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products'); // Подключаем маршруты для продуктов
const importedProductsRouter = require('./routes/importedProducts'); // Подключаем маршруты для импортированных продуктов
const Client = require('./models/Client'); // Импортируем модель клиента
const Product = require('./models/Product'); // Импортируем модель продукта

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use('/api/clients', clientRoutes);
app.use('/api/clients', productRoutes); // Исправлено название маршрута на /api/products
app.use('/api/imported-products', importedProductsRouter);

app.get('/api/imported-products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.get('/api/clients/product/:importedProductId', async (req, res) => {
    try {
        const clients = await Client.find({ 'products.id': req.params.importedProductId });

        if (!clients || clients.length === 0) {
            console.log(`No clients found for product ID: ${req.params.importedProductId}`);
            return res.status(404).json({ message: 'No clients found for this product' });
        }

        // Собираем все покупки всех клиентов
        const clientData = clients.flatMap(client => {
            // Находим все покупки данного продукта для этого клиента
            const purchasedProducts = client.products.filter(product => product.id === req.params.importedProductId);
            
            // Создаем массив записей о каждой покупке
            return purchasedProducts.map(purchasedProduct => ({
                _id: client._id,
                name: client.name,
                phone: client.phone,
                purchasedLength: purchasedProduct.length,
                purchasedPrice: purchasedProduct.price,
                purchasedSum: purchasedProduct.sum,
                purchasedCategory: purchasedProduct.category,
                purchasedDate: purchasedProduct.creationDate
            }));
        });

        res.json(clientData);
    } catch (err) {
        console.error('Ошибка при получении данных клиентов:', err);
        res.status(500).json({ message: err.message });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
