import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AddProductForm = ({ productType, clientId, onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        country: '',
        color: '--ral-',
        surface: '',
        thickness: ' ',
        length: ' ',
        width: '',
        price: ' ',
        tilePrice: ' ',
        sum: ' ',
        paidAmount: ' ',
        creationDate: '', // Обновлено для выбора пользователем
    })

    const [importedProducts, setImportedProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('') // начальная категория
    const COLORS = ['#8947a3', '#FFBB28', '#c1c1c1', '#FF8042', '#000000']

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/imported-products')
            .then(response => {
                setImportedProducts(response.data)
            })
            .catch(error => {
                console.error('Ошибка при получении импортированных продуктов:', error)
            })
    }, [])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleCategoryChange = e => {
        setSelectedCategory(e.target.value) // обновление выбранной категории
    }

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            // Шаг 1: Добавляем продукт для клиента
            const response = await axios.post(`http://localhost:8080/api/clients/${clientId}/products`, {
                ...formData,
                type: productType,
            })

            // Вызываем callback после успешного добавления продукта
            onProductAdded(response.data)

            // Шаг 2: Обновляем длину импортированного продукта и рассчитываем выручку
            if (selectedProduct && formData.length && formData.price) {
                const updatedLength = selectedProduct.length - formData.length
                const revenue = (formData.price - selectedProduct.price) * formData.length // Расчет выручки

                // Обновляем импортированный продукт
                await axios.put(`http://localhost:8080/api/imported-products/${selectedProduct._id}`, {
                    length: updatedLength,
                    revenue: (selectedProduct.revenue || 0) + revenue,
                })
            }

            // Сброс формы
            setFormData({
                name: '',
                category: '',
                country: '',
                color: '',
                surface: '',
                thickness: '',
                length: '',
                width: '',
                price: '',
                tilePrice: '',
                sum: '',
                paidAmount: '',
                creationDate: '',
            })
            setSelectedProduct(null) // Сбрасываем выбранный продукт
        } catch (err) {
            console.error('Ошибка при добавлении продукта', err)
        }
    }

    const handleSelectImportedProduct = e => {
        const selectedProductId = e.target.value
        const product = importedProducts.find(product => product._id === selectedProductId)
        if (product) {
            setSelectedProduct(product)
            setFormData({
                ...formData,
                category: product.category,
                id: product.id, // ID импор. продукта
                color: product.color,
                surface: product.surface,
                thickness: product.thickness,
                width: product.width,
                country: product.country,
                lengthLast: product.length,
            })
        }
    }

    return (
        <form className="flex-space-a" onSubmit={handleSubmit}>
            {productType === 'Лист стальной' && (
                <div>
                    <div className="flex-space-i">
                        <select className="input" id="importedProduct" onChange={handleSelectImportedProduct}>
                            <option style={{ color: `#ccc`, fontWeight: 300, backgroundColor: `#414a67` }} value="">
                                Выберите продукт из склада
                            </option>
                            {importedProducts.map(product => (
                                <option
                                    key={product._id}
                                    style={{ color: `#fff`, fontWeight: 300, backgroundColor: `#414a67` }}
                                    value={product._id}>
                                    {product.category} -{' '}
                                    <span style={{ background: COLORS[1] }}>{product.country}</span> - {product.color}{' '}
                                    -- ({product.width}) -- {product.surface} -- ({product.thickness})
                                </option>
                            ))}
                        </select>
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
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Страна"
                            required
                        />
                        <input
                            style={{
                                padding: 12,
                                width: 180,
                                marginBottom: 0,
                                color: `#fff`,
                                backgroundColor: `#414a67`,
                            }}
                            className="info"
                            type="text"
                            name="lengthLast"
                            value={formData.lengthLast}
                            onChange={handleChange}
                        />
                        <p>м</p>
                    </div>
                    <div className="flex-space-i">
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
                        <select className="input" name="width" value={formData.width} onChange={handleChange} required>
                            <option value=""> Ширина </option>
                            <option value="1,00м">1,00м</option>
                            <option value="1,25м">1,25м</option>
                        </select>
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
                    <>
                        <div className="flex-space-i">
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
                                type="number"
                                name="paidAmount"
                                value={formData.paidAmount}
                                onChange={handleChange}
                                placeholder="Оплаченная сумма"
                                required
                            />
                            {/* Поле для ввода даты создания */}
                            <input
                                className="input"
                                type="date"
                                name="creationDate"
                                value={formData.creationDate}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            className="add-c"
                            style={{ width: `25%`, fontSize: 15, marginLeft: `75%`, marginTop: `1.7%` }}
                            type="submit">
                            Добавить продукт
                        </button>
                    </>
                </div>
            )}
            {productType === 'Черепица' && (
                <div>
                    <div className="flex-space-i">
                        <select className="input" id="importedProduct" onChange={handleSelectImportedProduct}>
                            <option style={{ color: `#ccc`, fontWeight: 300, backgroundColor: `#414a67` }} value="">
                                Выберите продукт из склада
                            </option>
                            {importedProducts.map(product => (
                                <option
                                    key={product._id}
                                    style={{ color: `#fff`, fontWeight: 300, backgroundColor: `#414a67` }}
                                    value={product._id}>
                                    {product.category} -{' '}
                                    <span style={{ background: COLORS[1] }}>{product.country}</span> - {product.color}{' '}
                                    -- ({product.width}) -- {product.surface} -- ({product.thickness})
                                </option>
                            ))}
                        </select>
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
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Страна"
                            required
                        />
                        <input
                            style={{
                                padding: 12,
                                width: 180,
                                marginBottom: 0,
                                color: `#fff`,
                                backgroundColor: `#414a67`,
                            }}
                            className="info"
                            type="text"
                            name="lengthLast"
                            value={formData.lengthLast}
                            onChange={handleChange}
                        />
                        <p>м</p>
                    </div>
                    <div className="flex-space-i">
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
                        <select className="input" name="width" value={formData.width} onChange={handleChange} required>
                            <option value=""> Ширина </option>
                            <option value="1,00м">1,00м</option>
                            <option value="1,25м">1,25м</option>
                        </select>
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
                    <>
                        <div className="flex-space-i">
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
                                name="tilePrice"
                                value={formData.tilePrice}
                                onChange={handleChange}
                                placeholder="Цена черепицы"
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
                                type="number"
                                name="paidAmount"
                                value={formData.paidAmount}
                                onChange={handleChange}
                                placeholder="Оплаченная сумма"
                                required
                            />
                            {/* Поле для ввода даты создания */}
                            <input
                                className="input"
                                type="date"
                                name="creationDate"
                                value={formData.creationDate}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            className="add-c"
                            style={{ width: `25%`, fontSize: 15, marginLeft: `75%`, marginTop: `1.7%` }}
                            type="submit">
                            Добавить продукт
                        </button>
                    </>
                </div>
            )}

            {productType === 'Дерево' && (
                <>
                    <div className="flex-space-i">
                        <select className="input" id="importedProduct" onChange={handleSelectImportedProduct}>
                            <option value="">Выберите продукт из склада</option>
                            {importedProducts.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.name} ({product.category})
                                </option>
                            ))}
                        </select>
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
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Страна производителя дерева"
                            required
                        />
                        <input
                            style={{
                                padding: 12,
                                width: 180,
                                marginBottom: 0,
                                color: `#fff`,
                                backgroundColor: `#414a67`,
                            }}
                            className="info"
                            type="text"
                            name="lengthLast"
                            value={formData.lengthLast}
                            onChange={handleChange}
                        />
                        <p>м</p>
                    </div>{' '}
                    <div className="flex-space-i">
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
                    </div>
                    <>
                        <div className="flex-space-i">
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
                                type="number"
                                name="paidAmount"
                                value={formData.paidAmount}
                                onChange={handleChange}
                                placeholder="Оплаченная сумма"
                                required
                            />
                            {/* Поле для ввода даты создания */}
                            <input
                                className="input"
                                type="date"
                                name="creationDate"
                                value={formData.creationDate}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            className="add-c"
                            style={{ width: `25%`, fontSize: 15, marginLeft: `75%`, marginTop: `1.7%` }}
                            type="submit">
                            Добавить продукт
                        </button>
                    </>
                </>
            )}

            {productType === 'Крепеж' && (
                <>
                    <select className="input" id="importedProduct" onChange={handleSelectImportedProduct}>
                        <option value="">Выберите продукт из склада</option>
                        {importedProducts.map(product => (
                            <option key={product._id} value={product._id}>
                                {product.name} ({product.category})
                            </option>
                        ))}
                    </select>
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
                    <input
                        className="input"
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Вес на кг"
                        required
                    />
                    <>
                        <div className="flex-space-i">
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
                                type="number"
                                name="paidAmount"
                                value={formData.paidAmount}
                                onChange={handleChange}
                                placeholder="Оплаченная сумма"
                                required
                            />
                            {/* Поле для ввода даты создания */}
                            <input
                                className="input"
                                type="date"
                                name="creationDate"
                                value={formData.creationDate}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            className="add-c"
                            style={{ width: `25%`, fontSize: 15, marginLeft: `75%`, marginTop: `1.7%` }}
                            type="submit">
                            Добавить продукт
                        </button>
                    </>
                </>
            )}
        </form>
    )
}

export default AddProductForm
