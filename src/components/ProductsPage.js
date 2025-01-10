// /client/src/components/Pro.js

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductList from './ProductList'
import { useParams, Link } from 'react-router-dom'
import Modal from 'react-modal'
import AddProductForm from './AddProductForm'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    LabelList,
    ResponsiveContainer,
} from 'recharts'

import '../styles/ProductsPage.css' 

const ProductsPage = () => {
    const { clientId } = useParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [editProductId, setEditProductId] = useState(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedProductType, setSelectedProductType] = useState('')
    const [viewProduct, setViewProduct] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [categories, setCategories] = useState([])
    const [countries, setCountries] = useState([])
    const [widths, setWidths] = useState([])
    const [surfaces, setSurfaces] = useState([])
    const [colors, setColors] = useState([])
    const [filters, setFilters] = useState({
        category: '',
        country: '',
        width: '',
        surface: '',
        color: '',
    })
    const [editProductData, setEditProductData] = useState({
      
        name: '',
        country: '',
        category: '',
        color: '',
        surface: '',
        thickness: 0,
        length: 0,
        width: '',
        price: 0,
        sum: 0,
        paidAmount: '',
        paymentStatus: '',
        weight: 0,
    })
    const [showOnlyDebts, setShowOnlyDebts] = useState(false)
    const [totalDebt, setTotalDebt] = useState(0)
    const COLORS = ['#8947a3', '#FFBB28', '#c1c1c1', '#FF8042', '#000000'] 

    Modal.setAppElement('#root')

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => {
        setModalIsOpen(false)
        setSelectedProductType('')
    }

    const handleProductTypeChange = e => {
        const selectedValue = e.target?.value
        if (selectedValue) {
            setSelectedProductType(selectedValue)
        } else {
            console.error('Value is undefined or null')
        }
    }

    useEffect(() => {
        if (!clientId) {
            setError('Client ID is not provided')
            setLoading(false)
            return
        }

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/clients/${clientId}/products`)
                setProducts(response.data)
                setLoading(false)
                calculateTotalDebt(response.data)
                updateFilterOptions(response.data) 
            } catch (err) {
                setError('Ошибка при загрузке продуктов')
                setLoading(false)
            }
        }

        fetchProducts()
    }, [clientId])

    const handleProductAdded = newProduct => {
        setProducts([...products, newProduct])
    }

    const handleEdit = product => {
        setEditProductId(product._id)
        setSelectedProductType(product.category)
        setEditProductData({
            name: product.name,
            country: product.country,
            category: product.category,
            color: product.color,
            surface: product.surface,
            thickness: product.thickness,
            length: product.length,
            width: product.width,
            price: product.price,
            tilePrice: product.tilePrice,
            sum: product.sum,
            paidAmount: product.paidAmount,
            paymentStatus: product.paymentStatus,
            creationDate: product.creationDate,
            weight: product.weight || 0, // Убедитесь, что weight инициализирован
        })
    }

    const handleEditChange = e => {
        const { name, value } = e.target
        setEditProductData({ ...editProductData, [name]: value })
    }

    const handleEditSubmit = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/clients/${clientId}/products/${editProductId}`,
                {
                    ...editProductData,
                    type: selectedProductType,
                },
            )
            setProducts(products.map(product => (product._id === editProductId ? response.data : product)))
            setEditProductId(null)
            setError(null)
        } catch (err) {
            console.error('Ошибка при редактировании продукта', err)
            setError('Ошибка при сохранении изменений')
        }
    }

    const handleDelete = async productId => {
        try {
            await axios.delete(`http://localhost:8080/api/clients/${clientId}/products/${productId}`)
            setProducts(products.filter(product => product._id !== productId))
        } catch (err) {
            console.error('Ошибка при удалении продукта:', err)
            setError('Ошибка при удалении продукта')
        }
    }

    const handleView = product => {
        setViewProduct(product)
    }

    const closeViewModal = () => {
        setViewProduct(null)
    }

    const handleSearchChange = e => {
        setSearchQuery(e.target.value)
    }

    const calculateTotalDebt = products => {
        const total = products.reduce((acc, product) => {
            const debt = product.sum - product.paidAmount // Вычисление долга для каждого продукта
            return debt > 0 ? acc + debt : acc
        }, 0)
        setTotalDebt(total) // Обновление состояния общей суммы долга
    }

    const handleViewDebts = () => {
        setShowOnlyDebts(!showOnlyDebts) // Переключение режима отображения продуктов с долгом
    }

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }))
    }

    const categoryCounts = {
        Лист: products.filter(product => product.category === 'Лист').length,
        Дерево: products.filter(product => product.category === 'Дерево').length,
        Крепеж: products.filter(product => product.category === 'Крепеж').length,
    }

    const totalCategories = categoryCounts['Лист'] + categoryCounts['Дерево'] + categoryCounts['Крепеж']

    const categoryData = [
        { name: 'Лист', value: categoryCounts['Лист'] },
        { name: 'Дерево', value: categoryCounts['Дерево'] },
        { name: 'Крепеж', value: categoryCounts['Крепеж'] },
    ]

    const totalSum = products.reduce((acc, product) => acc + product.sum, 0)
    const paidSum = products.reduce((acc, product) => acc + product.paidAmount, 0)
    const debtSum = totalSum - paidSum

    const data = [
        { name: 'Сумма', value: totalSum },
        { name: 'Оплачено', value: paidSum },
        { name: 'Долг', value: debtSum },
    ]

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.2
        const x = cx + radius * Math.cos((-midAngle * Math.PI) / 170)
        const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    const updateFilterOptions = products => {
        const uniqueCategories = [...new Set(products.map(product => product.category))]
        const uniqueCountries = [...new Set(products.map(product => product.country))]
        const uniqueWidths = [...new Set(products.map(product => product.width))]
        const uniqueSurfaces = [...new Set(products.map(product => product.surface))]
        const uniqueColors = [...new Set(products.map(product => product.color))]

        setCategories(uniqueCategories)
        setCountries(uniqueCountries)
        setWidths(uniqueWidths)
        setSurfaces(uniqueSurfaces)
        setColors(uniqueColors)
    }

    const filteredProducts = products.filter(
        product =>
            (filters.category === '' || product.category === filters.category) &&
            (filters.country === '' || product.country === filters.country) &&
            (filters.width === '' || product.width === filters.width) &&
            (filters.surface === '' || product.surface === filters.surface) &&
            (filters.color === '' || product.color === filters.color) &&
            (!showOnlyDebts || product.sum > product.paidAmount),
    )

    if (loading) return <p className="loading">Загрузка...</p>
    if (error) return <p>{error}</p>

    return (
        <div style={{ marginLeft: `18%`, marginTop: `5%` }} className="wrapper">
            <div className="container">
                <div className="sub-container">
                    <Link to="/clients" style={{ padding: 5, fontWeight: 600 }} className="info">
                        Выход
                    </Link>{' '}
                    {/* Кнопка для возврата */}
                    <div style={{ marginLeft: 100, marginRight: 0 }} className="chart-container">
                        <div style={{ marginLeft: `5%` }} className="pie-chart-container diogram-s">
                            <div className="chart-item">
                                <h3 style={{ marginLeft: 0, marginTop: 10 }}>Финансовая сводка</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8">
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-legend">
                                <div className="legend-item">
                                    <span className="color-box" style={{ backgroundColor: COLORS[0] }}></span>
                                    <p>
                                        Обшая сумма:{' '}
                                        <span style={{ color: COLORS[4], fontWeight: 500 }}>{totalSum} c.</span>
                                    </p>
                                </div>
                                <div className="legend-item">
                                    <span className="color-box" style={{ backgroundColor: COLORS[1] }}></span>
                                    <p>
                                        Оплачен: <span style={{ color: COLORS[4], fontWeight: 500 }}>{paidSum} c.</span>
                                    </p>
                                </div>
                                <div className="legend-item">
                                    <span className="color-box" style={{ backgroundColor: COLORS[2] }}></span>
                                    <p>
                                        Долг: <span style={{ color: COLORS[4], fontWeight: 500 }}>{debtSum} c.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginRight: `10%` }} className="pie-chart-container diogram-s">
                            <h3 style={{ marginLeft: 0, marginTop: 10 }}>Количество покупок</h3>
                            <PieChart className="" width={270} height={220}>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    innerRadius={30}
                                    dataKey="value">
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <span className="color-box" style={{ backgroundColor: COLORS[4] }}></span>
                                    <p>
                                        Всего продуктов:{' '}
                                        <span style={{ color: COLORS[4], fontWeight: 500 }}>{totalCategories}</span>
                                    </p>
                                </div>
                                <div className="legend-item">
                                    <span className="color-box" style={{ backgroundColor: COLORS[0] }}></span>
                                    <p>
                                        Лист:{' '}
                                        <span style={{ color: COLORS[4], fontWeight: 500 }}>
                                            {categoryCounts['Лист']}
                                        </span>
                                    </p>
                                </div>
                                <div className="legend-item">
                                    <span className="color-box" style={{ backgroundColor: COLORS[1] }}></span>
                                    <p>
                                        Дерево:{' '}
                                        <span style={{ color: COLORS[4], fontWeight: 500 }}>
                                            {categoryCounts['Дерево']}
                                        </span>
                                    </p>
                                </div>
                                <div className="legend-item">
                                    <span className="color-box" style={{ backgroundColor: COLORS[2] }}></span>
                                    <p>
                                        Крепеж:{' '}
                                        <span style={{ color: COLORS[4], fontWeight: 500 }}>
                                            {categoryCounts['Крепеж']}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="product-summary-i">
                        <div className="flex-space">
                            <h4 style={{ marginBottom: 0 }}>Добавить продукт</h4>
                            <div className="dropdown" data-bs-theme="dark">
                                <button
                                    type="button"
                                    className="btn btn-primary dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    data-bs-theme="blue"
                                    aria-expanded="false"
                                    style={{
                                        borderRadius: 3,
                                        fontSize: 15,
                                        fontWeight: 400,
                                        backgroundColor: `#363d55`,
                                    }}>
                                    {selectedProductType || 'Выберите тип продукта'}{' '}
                                    {/* Отображает выбранный тип продукта или текст по умолчанию */}
                                </button>

                                <ul className="dropdown-menu">
                                    <li style={{ cursor: 'pointer' }}>
                                        <a
                                            className="dropdown-item"
                                            onClick={() =>
                                                handleProductTypeChange({ target: { value: 'Лист стальной' } })
                                            }>
                                            Лист
                                        </a>
                                    </li>
                                    <li style={{ cursor: 'pointer' }}>
                                        <a
                                            className="dropdown-item"
                                            onClick={() => handleProductTypeChange({ target: { value: 'Черепица' } })}>
                                            Черепица
                                        </a>
                                    </li>
                                    <li style={{ cursor: 'pointer' }}>
                                        <a
                                            className="dropdown-item"
                                            onClick={() => handleProductTypeChange({ target: { value: 'Дерево' } })}>
                                            Дерево
                                        </a>
                                    </li>
                                    <li style={{ cursor: 'pointer' }}>
                                        <a
                                            className="dropdown-item"
                                            onClick={() => handleProductTypeChange({ target: { value: 'Крепеж' } })}>
                                            Крепеж
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {selectedProductType && (
                            <AddProductForm
                                productType={selectedProductType}
                                clientId={clientId}
                                onProductAdded={handleProductAdded}
                            />
                        )}
                    </div>
                    <div className="filters-container flex-space">
                        <label>
                            <select
                                name="category"
                                className="input"
                                value={filters.category}
                                onChange={handleFilterChange}>
                                <option value="">Категория</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <select
                                name="country"
                                className="input"
                                value={filters.country}
                                onChange={handleFilterChange}>
                                <option value="">Страна</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <select name="width" className="input" value={filters.width} onChange={handleFilterChange}>
                                <option value="">Ширина</option>
                                {widths.map(width => (
                                    <option key={width} value={width}>
                                        {width}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <select
                                name="surface"
                                className="input"
                                value={filters.surface}
                                onChange={handleFilterChange}>
                                <option value="">Поверхность</option>
                                {surfaces.map(surface => (
                                    <option key={surface} value={surface}>
                                        {surface}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <select name="color" className="input" value={filters.color} onChange={handleFilterChange}>
                                <option value="">Цвет</option>
                                {colors.map(color => (
                                    <option key={color} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="flex-space" style={{ marginTop: 15 }}>
                        <h3 style={{ marginLeft: 15 }}>Products:</h3>
                        <button style={{ fontWeight: 600 }} className="info" onClick={handleViewDebts}>
                            {showOnlyDebts ? 'Показать всех продуктов' : 'Показать долгов'}
                        </button>
                    </div>
                    {viewProduct && (
                        <Modal
                            isOpen={!!viewProduct}
                            onRequestClose={closeViewModal}
                            contentLabel="Информация о продукте"
                            style={{
                                content: {
                                    maxWidth: '500px',
                                    maxHeight: '71%',
                                    marginLeft: `37%`,
                                    marginTop: `5%`,
                                    borderRadius: 8,
                                },
                            }}>
                            <button style={{ marginRight: 10 }} className="modal-close" onClick={closeViewModal}>
                                ×
                            </button>
                            <h2>Информация о продукте</h2>
                            <p>
                                <strong>Тип:</strong> {viewProduct.category}
                            </p>
                            <p>
                                <strong>Страна:</strong> {viewProduct.country}
                            </p>
                            <p>
                                <strong>Цвет:</strong> {viewProduct.color}
                            </p>
                            <p>
                                <strong>Поверхность:</strong> {viewProduct.surface}
                            </p>
                            <p>
                                <strong>Толщина:</strong> {viewProduct.thickness}
                            </p>
                            <p>
                                <strong>Ширина:</strong> {viewProduct.width}
                            </p>
                            <p>
                                <strong>Длина:</strong> {viewProduct.length}м
                            </p>
                            <p>
                                <strong>Цена:</strong> {viewProduct.price} c.
                            </p>
                            <p>
                                <strong>Сумма:</strong> {viewProduct.sum} c.
                            </p>
                            <p>
                                <strong>Оплачено:</strong> {viewProduct.paidAmount} c.
                            </p>
                        </Modal>
                    )}
                    {editProductId && (
                        <div className="user-amount-container">
                            <h3>Редактировать продукт</h3>
                            {selectedProductType === 'Лист' && (
                                <>
                                    <div>
                                        <div className="flex-space-i">
                                            <input
                                                className="input"
                                                type="text"
                                                name="category"
                                                value={editProductData.category}
                                                onChange={handleEditChange}
                                                placeholder="Категория"
                                                required
                                            />

                                            <input
                                                className="input"
                                                type="text"
                                                name="country"
                                                value={editProductData.country}
                                                onChange={handleEditChange}
                                                placeholder="Страна"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="text"
                                                name="color"
                                                value={editProductData.color}
                                                onChange={handleEditChange}
                                                placeholder="Цвет"
                                                required
                                            />
                                            <select
                                                className="input"
                                                name="surface"
                                                value={editProductData.surface}
                                                onChange={handleEditChange}
                                                required>
                                                <option value="">Поверхность</option>
                                                <option value="Матовый">Матовый</option>
                                                <option value="Глянцевый">Глянцевый</option>
                                            </select>
                                            <input
                                                className="input"
                                                type="number"
                                                name="thickness"
                                                value={editProductData.thickness}
                                                onChange={handleEditChange}
                                                placeholder="Толщина"
                                                required
                                            />
                                            <select
                                                className="input"
                                                name="width"
                                                value={editProductData.width}
                                                onChange={handleEditChange}
                                                required>
                                                <option value=""> Ширина </option>
                                                <option value="1,00м">1,00м</option>
                                                <option value="1,25м">1,25м</option>
                                            </select>
                                        </div>
                                        <div className="flex-space-i">
                                            <input
                                                className="input"
                                                type="number"
                                                name="length"
                                                value={editProductData.length}
                                                onChange={handleEditChange}
                                                placeholder="Длина"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="number"
                                                name="price"
                                                value={editProductData.price}
                                                onChange={handleEditChange}
                                                placeholder="Цена"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="number"
                                                name="sum"
                                                value={editProductData.sum}
                                                onChange={handleEditChange}
                                                placeholder="Сумма"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="number"
                                                name="paidAmount"
                                                value={editProductData.paidAmount}
                                                onChange={handleEditChange}
                                                placeholder="Оплаченная сумма"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="date"
                                                name="creationDate"
                                                value={editProductData.creationDate}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            {selectedProductType === 'Черепица' && (
                                <>
                                    <div>
                                        <div className="flex-space-i">
                                            <input
                                                className="input"
                                                type="text"
                                                name="category"
                                                value={editProductData.category}
                                                onChange={handleEditChange}
                                                placeholder="Категория"
                                                required
                                            />

                                            <input
                                                className="input"
                                                type="text"
                                                name="country"
                                                value={editProductData.country}
                                                onChange={handleEditChange}
                                                placeholder="Страна"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="text"
                                                name="color"
                                                value={editProductData.color}
                                                onChange={handleEditChange}
                                                placeholder="Цвет"
                                                required
                                            />
                                            <select
                                                className="input"
                                                name="surface"
                                                value={editProductData.surface}
                                                onChange={handleEditChange}
                                                required>
                                                <option value="">Поверхность</option>
                                                <option value="Матовый">Матовый</option>
                                                <option value="Глянцевый">Глянцевый</option>
                                            </select>
                                            <input
                                                className="input"
                                                type="number"
                                                name="thickness"
                                                value={editProductData.thickness}
                                                onChange={handleEditChange}
                                                placeholder="Толщина"
                                                required
                                            />
                                            <select
                                                className="input"
                                                name="width"
                                                value={editProductData.width}
                                                onChange={handleEditChange}
                                                required>
                                                <option value=""> Ширина </option>
                                                <option value="1,00м">1,00м</option>
                                                <option value="1,25м">1,25м</option>
                                            </select>
                                        </div>
                                        <div className="flex-space-i">
                                            <input
                                                className="input"
                                                type="number"
                                                name="length"
                                                value={editProductData.length}
                                                onChange={handleEditChange}
                                                placeholder="Длина"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="number"
                                                name="price"
                                                value={editProductData.price}
                                                onChange={handleEditChange}
                                                placeholder="Цена"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="number"
                                                name="tilePrice"
                                                value={editProductData.tilePrice}
                                                onChange={handleEditChange}
                                                placeholder="Цена"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="number"
                                                name="sum"
                                                value={editProductData.sum}
                                                onChange={handleEditChange}
                                                placeholder="Сумма"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="number"
                                                name="paidAmount"
                                                value={editProductData.paidAmount}
                                                onChange={handleEditChange}
                                                placeholder="Оплаченная сумма"
                                                required
                                            />
                                            <input
                                                className="input"
                                                type="date"
                                                name="creationDate"
                                                value={editProductData.creationDate}
                                                onChange={handleEditChange}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedProductType === 'Дерево' && (
                                <>
                                    <div className="flex-space-i">
                                        <input
                                            className="input"
                                            type="text"
                                            name="category"
                                            value={editProductData.category}
                                            onChange={handleEditChange}
                                            placeholder="Категория продукта"
                                            required
                                        />
                                        <input
                                            className="input"
                                            type="text"
                                            name="country"
                                            value={editProductData.country}
                                            onChange={handleEditChange}
                                            placeholder="Страна производителя дерева"
                                            required
                                        />
                                        <input
                                            className="input"
                                            type="text"
                                            name="length"
                                            value={`${editProductData.length} м`}
                                            onChange={handleEditChange}
                                            placeholder="Длина"
                                            required
                                        />
                                        <input
                                            className="input"
                                            type="number"
                                            name="thickness"
                                            value={editProductData.thickness}
                                            onChange={handleEditChange}
                                            placeholder="Толщина"
                                            required
                                        />
                                        <input
                                            className="input"
                                            type="number"
                                            name="width"
                                            value={editProductData.width}
                                            onChange={handleEditChange}
                                            placeholder="Ширина"
                                            required
                                        />
                                    </div>
                                    <div className="flex-space-i">
                                        <input
                                            className="input"
                                            type="text"
                                            name="price"
                                            value={`${editProductData.price} c.`}
                                            onChange={handleEditChange}
                                            placeholder="Цена"
                                            required
                                        />
                                        <input
                                            className="input"
                                            type="text"
                                            name="sum"
                                            value={`${editProductData.sum} c.`}
                                            onChange={handleEditChange}
                                            placeholder="Сумма"
                                            required
                                        />
                                        <input
                                            className="input"
                                            type="text"
                                            name="paidAmount"
                                            value={`${editProductData.paidAmount} c.`}
                                            onChange={handleEditChange}
                                            placeholder="Оплаченная сумма"
                                            required
                                        />
                                        <input
                                            className="input"
                                            type="date"
                                            name="creationDate"
                                            value={editProductData.creationDate}
                                            onChange={handleEditChange}
                                        />
                                    </div>
                                </>
                            )}

                            {selectedProductType === 'Крепеж' && (
                                <>
                                    <input
                                        className="input"
                                        style={{ marginTop: 15 }}
                                        type="text"
                                        name="country"
                                        value={editProductData.country}
                                        onChange={handleEditChange}
                                        placeholder="Страна производителя"
                                    />
                                    <input
                                        className="input"
                                        style={{ marginTop: 15 }}
                                        type="text"
                                        name="color"
                                        value={editProductData.color}
                                        onChange={handleEditChange}
                                        placeholder="Цвет"
                                    />
                                    <input
                                        className="input"
                                        style={{ marginTop: 15 }}
                                        type="number"
                                        name="length"
                                        value={editProductData.length}
                                        onChange={handleEditChange}
                                        placeholder="Длина"
                                    />
                                    <input
                                        className="input"
                                        style={{ marginTop: 15 }}
                                        type="number"
                                        name="weight"
                                        value={editProductData.weight}
                                        onChange={handleEditChange}
                                        placeholder="Вес на кг"
                                    />
                                </>
                            )}
                            <button style={{ marginTop: 10 }} className="edit" onClick={handleEditSubmit}>
                                Сохранить
                            </button>
                            <button className="info" onClick={() => setEditProductId(null)}>
                                Отмена
                            </button>
                        </div>
                    )}
                    <ProductList
                        products={filteredProducts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                    />
                    <div style={{ marginTop: 250 }}></div>
                </div>
                <div className="footer">
                    <p>© 2024, Все права защищены</p>
                </div>
            </div>
        </div>
    )
}

export default ProductsPage
