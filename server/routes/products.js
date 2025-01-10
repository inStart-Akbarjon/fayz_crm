const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Product = require('../models/Product');

// Получение продуктов для клиента
router.get('/:clientId/products', async (req, res) => {
    try {
        const { clientId } = req.params;
        if (!clientId) {
            return res.status(400).json({ message: 'Client ID is required' });
        }
        const client = await Client.findById(clientId).populate('products');
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client.products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




module.exports = router;
