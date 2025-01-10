const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Client = require('../models/Client');


// Импортируем ObjectId из mongoose
const { ObjectId } = mongoose.Types;

// Получение всех клиентов
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Удаление клиента
router.delete('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Обновление клиента
router.put('/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.status(200).json(client);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Добавление нового клиента
router.post('/', async (req, res) => {
    const client = new Client({
        name: req.body.name,
        phone: req.body.phone,
        products: req.body.products || [] 
    });

    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Добавление продукта к клиенту
router.post('/:id/products', async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });

        client.products.push(req.body);
        await client.save();

        res.status(201).json(client);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Получение продуктов для клиента
router.get('/:clientId/products', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId).populate('products');
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client.products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Удаление продукта из клиента
router.delete('/:clientId/products/:productId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const productIndex = client.products.findIndex(product => product._id.toString() === req.params.productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        client.products.splice(productIndex, 1);
        await client.save();

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Редактирование продукта у клиента
router.put('/:clientId/products/:productId', async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const product = client.products.id(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        Object.assign(product, req.body);
        await client.save();

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;