const express = require('express')
const router = express.Router()
const ImportedProduct = require('../models/ImportedProduct')
const Client = require('../models/Client')

// Получение всех импортированных продуктов
router.get('/', async (req, res) => {
    try {
        const products = await ImportedProduct.find()        
        res.json(products)
    } catch (err) {
        console.error('Ошибка при получении продуктов:', err)
        res.status(500).json({ message: err.message })
    }
})

// Добавление нового импортированного продукта
router.post('/', async (req, res) => {
    const product = new ImportedProduct(req.body)

    try {
        const newProduct = await product.save()
        res.status(201).json(newProduct)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Удаление импортированного продукта
router.delete('/:id', async (req, res) => {
    try {
        const product = await ImportedProduct.findByIdAndDelete(req.params.id)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Обновление импортированного продукта
router.put('/:id', async (req, res) => {
    try {
        const product = await ImportedProduct.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!product) return res.status(404).json({ message: 'Product not found' })
        res.json(product)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Получение импортированного продукта по ID
router.get('/:id', async (req, res) => {
    try {
        const product = await ImportedProduct.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json(product)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/product/:id', async (req, res) => {
    try {
        console.log('Запрашиваемый productId:', req.params.id)
        const client = await Client.findOne({ 'products._id': req.params.id })
        if (!client) {
            console.log('Клиент не найден')
            return res.status(404).json({ message: 'Client or product not found' })
        }
        const product = client.products.id(req.params.id)
        if (!product) {
            console.log('Продукт не найден')
            return res.status(404).json({ message: 'Product not found' })
        }
        res.json(product)
    } catch (err) {
        console.error('Ошибка при получении деталей продукта:', err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

module.exports = router
