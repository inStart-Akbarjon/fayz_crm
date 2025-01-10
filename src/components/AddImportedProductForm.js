import React, { useState } from 'react'
import axios from 'axios'

const AddImportedProductForm = ({ onProductAdded }) => {
    const [productType, setProductType] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        category: '',
        price: '',
        quantity: '',
        country: '',
        color: '',
        surface: '',
        thickness: '',
        Firstlength: '',
        FirstlengthWood: '',
        length: '',
        width: '',
        sum: '',
        weight: '',
        creationDate: '',
    })

    const handleProductTypeChange = type => {
        setProductType(type)
        // Очистка формы при смене типа продукта
        setFormData({
            name: '',
            id: '',
            category: '',
            price: '',
            quantity: '',
            country: '',
            color: '--ral-',
            surface: '',
            thickness: '',
            Firstlength: '',
            FirstlengthWood: '',
            length: '',
            width: '',
            sum: '',
            weight: '',
            creationDate: '',
        })
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8080/api/imported-products', formData)
            onProductAdded(response.data)
            setFormData({
                name: '',
                id: '',
                category: '',
                price: '',
                quantity: '',
                country: '',
                color: '',
                surface: '',
                thickness: '',
                Firstlength: '',
                FirstlengthWood: '',
                length: '',
                width: '',
                sum: '',
                weight: '',
                creationDate: '',
            })
        } catch (err) {
            console.error('Ошибка при добавлении продукта', err)
        }
    }

    return (
        <form className="product-summary-i" onSubmit={handleSubmit}>
            <div className="flex-space">
                <h4 style={{ marginBottom: 0 }}>Добавить продукт</h4>

                <div className="dropdown" data-bs-theme="dark">
                    <button
                        type="button"
                        className="btn btn-dark dropdown-toggle"
                        data-bs-toggle="dropdown"
                        data-bs-theme="blue"
                        aria-expanded="false"
                        style={{ borderRadius: 3 }}>
                        {productType || 'Выберите тип продукта'}{' '}
                        {/* Отображает выбранный тип продукта или текст по умолчанию */}
                    </button>
                    <ul className="dropdown-menu">
                        <li style={{ cursor: 'pointer' }}>
                            <button className="dropdown-item" onClick={() => handleProductTypeChange('Лист стальной')}>
                                Лист
                            </button>
                        </li>
                        <li style={{ cursor: 'pointer' }}>
                            <button className="dropdown-item" onClick={() => handleProductTypeChange('Дерево')}>
                                Дерево
                            </button>
                        </li>
                        <li style={{ cursor: 'pointer' }}>
                            <button className="dropdown-item" onClick={() => handleProductTypeChange('Крепеж')}>
                                Крепеж
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            {productType === 'Лист стальной' && (
                <div className="">
                    <div className="flex-space-i">
                        <input
                            className="input"
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Категория"
                            required
                        />
                        <input
                            className="input"
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="ID продукта"
                            required
                        />
                        <input
                            className="input"
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Страна"
                            required
                        />
                        <input
                            className="input"
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            placeholder="Цвет"
                            required
                        />
                        <select
                            className="input"
                            name="surface"
                            value={formData.surface}
                            onChange={handleChange}
                            required>
                            <option value="">Поверхность</option>
                            <option value="Матовый">Матовый</option>
                            <option value="Глянцевый">Глянцевый</option>
                        </select>
                        <input
                            className="input"
                            type="number"
                            name="thickness"
                            value={formData.thickness}
                            onChange={handleChange}
                            placeholder="Толщина"
                            required
                        />
                    </div>
                    <div className="flex-space-i">
                        <input
                            className="input"
                            type="number"
                            name="Firstlength"
                            value={formData.Firstlength}
                            onChange={handleChange}
                            placeholder="Длина"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="length"
                            value={formData.length}
                            onChange={handleChange}
                            placeholder="Длина"
                            required
                        />
                        <select className="input" name="width" value={formData.width} onChange={handleChange} required>
                            <option value="">Ширина</option>
                            <option value="1,00м">1,00м</option>
                            <option value="1,25м">1,25м</option>
                        </select>
                        <input
                            className="input"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Цена"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="sum"
                            value={formData.sum}
                            onChange={handleChange}
                            placeholder="Сумма"
                            required
                        />
                        <input
                            className="input"
                            type="date"
                            name="creationDate"
                            value={formData.creationDate}
                            onChange={handleChange}
                        />
                    </div>
                    <button style={{ marginLeft: `82%`, borderRadius: 3 }} className="btn btn-dark" type="submit">
                        Добавить продукт
                    </button>
                </div>
            )}

            {productType === 'Дерево' && (
                <div>
                    <div className="flex-space-i">
                        <input
                            className="input"
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Категория"
                            required
                        />
                        <input
                            className="input"
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="ID продукта"
                            required
                        />
                        <input
                            className="input"
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Страна"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="FirstlengthWood"
                            value={formData.FirstlengthWood}
                            onChange={handleChange}
                            placeholder="Длина"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="length"
                            value={formData.length}
                            onChange={handleChange}
                            placeholder="Длина"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="thickness"
                            value={formData.thickness}
                            onChange={handleChange}
                            placeholder="Толщина"
                            required
                        />
                    </div>

                    <div className="flex-space-i">
                        <input
                            className="input"
                            type="number"
                            name="width"
                            value={formData.width}
                            onChange={handleChange}
                            placeholder="Ширина"
                            required
                        />
                        <select className="input" name="color" value={formData.color} onChange={handleChange} required>
                            <option value="">Цвет</option>
                            <option value="--ralwood">Дерево</option>
                        </select>
                        <input
                            className="input"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Цена"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="sum"
                            value={formData.sum}
                            onChange={handleChange}
                            placeholder="Сумма"
                            required
                        />
                        <input
                            className="input"
                            type="date"
                            name="creationDate"
                            value={formData.creationDate}
                            onChange={handleChange}
                        />
                    </div>
                    <button style={{ marginLeft: `82%`, borderRadius: 3 }} className="btn btn-dark" type="submit">
                        Добавить продукт
                    </button>
                </div>
            )}

            {productType === 'Крепеж' && (
                <div>
                    <div className="flex-space-i">
                        <input
                            className="input"
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Категория продукта"
                            required
                        />
                        <input
                            className="input"
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="ID продукта"
                            required
                        />
                        <input
                            className="input"
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Страна производителя"
                            required
                        />
                        <input
                            className="input"
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            placeholder="Цвет"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="length"
                            value={formData.length}
                            onChange={handleChange}
                            placeholder="Длина"
                            required
                        />
                    </div>

                    <div className="flex-space-i">
                        <input
                            className="input"
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="Вес в кг"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Цена"
                            required
                        />
                        <input
                            className="input"
                            type="number"
                            name="sum"
                            value={formData.sum}
                            onChange={handleChange}
                            placeholder="Сумма"
                            required
                        />
                        <input
                            className="input"
                            type="date"
                            name="creationDate"
                            value={formData.creationDate}
                            onChange={handleChange}
                        />
                    </div>
                    <button style={{ marginLeft: `82%`, borderRadius: 3 }} className="btn btn-dark" type="submit">
                        Добавить продукт
                    </button>
                </div>
            )}
        </form>
    )
}

export default AddImportedProductForm
