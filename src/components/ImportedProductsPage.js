import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AddImportedProductForm from './AddImportedProductForm'
import ProductModal from './ProductModal' // Импортируйте модальное окно
import '../styles/ImportedProductsPage.css'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'

const ImportedProductsPage = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [clients, setClients] = useState([]) // Данные о клиентах
    const [editingProduct, setEditingProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showProductInfo, setShowProductInfo] = useState(null)
    const [error, setError] = useState(null)
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
    const COLORS = ['#8947a3', '#FFBB28', '#c1c1c1', '#FF8042', '#000000']

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/imported-products')
            updateFilterOptions(response.data)
            setProducts(response.data)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.error('Ошибка при получении продуктов', err)
        }
    }

    const handleProductAdded = newProduct => {
        setProducts([...products, newProduct])
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

    const handleFilterChange = e => {
        const { name, value } = e.target
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }))
    }

    // Фильтрация импортированных продуктов на основе выбранных фильтров
    const filteredProducts = products.filter(
        product =>
            (filters.category === '' || product.category === filters.category) &&
            (filters.country === '' || product.country === filters.country) &&
            (filters.width === '' || product.width === filters.width) &&
            (filters.surface === '' || product.surface === filters.surface) &&
            (filters.color === '' || product.color === filters.color),
    )

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.2
        const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
        const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }
    const handleEditProduct = async (productId, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/imported-products/${productId}`, updatedData)
            setProducts(products.map(p => (p._id === productId ? response.data : p)))
            setEditingProduct(null)
        } catch (err) {
            console.error('Ошибка при обновлении продукта', err)
        }
    }

    const handleDeleteProduct = async productId => {
        try {
            await axios.delete(`http://localhost:8080/api/imported-products/${productId}`)
            setProducts(products.filter(p => p._id !== productId))
        } catch (err) {
            console.error('Ошибка при удалении продукта', err)
        }
    }

    const handleProductClick = product => {
        setShowProductInfo(product)
    }

    const navigateToProductDetails = productId => {
        navigate(`/imported-products/${productId}`)
    }

    const getClassForProductType = type => {
        switch (type) {
            case 'Лист':
                return 'steel-sheet'
            case 'Дерево':
                return 'wood'
            case 'Крепеж':
                return 'screws'
            default:
                return ''
        }
    }

    const formatDate = date => {
        return new Date(date).toLocaleDateString()
    }

    const calculateMetrics = (products, width) => {
        const totalLength = products
            .filter(product => product.width === width && product.category === 'Лист')
            .reduce((sum, product) => sum + product.Firstlength, 0)

        const soldLength = products
            .filter(product => product.width === width && product.category === 'Лист')
            .reduce((sum, product) => sum + (product.Firstlength - product.length), 0)

        return { totalLength, soldLength }
    }

    const calculateWoodMetrics = products => {
        const totalLength = products
            .filter(product => product.category === 'Дерево')
            .reduce((sum, product) => sum + product.FirstlengthWood, 0)

        const soldLength = products
            .filter(product => product.category === 'Дерево')
            .reduce((sum, product) => sum + (product.FirstlengthWood - product.length), 0)

        return { totalLength, soldLength }
    }

    const width1mMetrics = calculateMetrics(products, '1,00м')
    const width125mMetrics = calculateMetrics(products, '1,25м')
    const woodMetrics = calculateWoodMetrics(products)

    const pieData1m = [
        { name: 'Доступно', value: width1mMetrics.totalLength - width1mMetrics.soldLength },
        { name: 'Продано', value: width1mMetrics.soldLength },
    ]

    const pieData125m = [
        { name: 'Доступно', value: width125mMetrics.totalLength - width125mMetrics.soldLength },
        { name: 'Продано', value: width125mMetrics.soldLength },
    ]

    const pieDataWood = [
        { name: 'Доступно', value: woodMetrics.totalLength - woodMetrics.soldLength },
        { name: 'Продано', value: woodMetrics.soldLength },
    ]

    const renderSummary = data => {
        const available = data.find(d => d.name === 'Доступно')?.value || 0
        const sold = data.find(d => d.name === 'Продано')?.value || 0

        const totalLength = available + sold

        const calculateRevenue = (product, clients) => {
            // Вычисление суммы без выручки
            const remainingLengthValue = product.category === 'Лист' ? product.Firstlength : product.FirstlengthWood
            const soldLength = remainingLengthValue - product.length
            const baseSumWithoutRevenue = product.length * product.price // Остаток умножаем на цену без выручки
            const totalClientSum = clients.reduce((total, client) => {
                // Сумма, которую клиенты заплатили за этот продукт с выручкой
                const clientProduct = client.products.find(
                    p => p.name === product.name && p.category === product.category,
                )
                return clientProduct ? total + clientProduct.sum : total
            }, 0)

            const revenue = totalClientSum - baseSumWithoutRevenue // Выручка = сумма проданных продуктов - базовая сумма

            return { baseSumWithoutRevenue, revenue }
        }

        const calculateCategoryMetrics = (products, clients, width = null) => {
            return products
                .filter(product => product.category === 'Лист' && (!width || product.width === width))
                .reduce(
                    (acc, product) => {
                        const { baseSumWithoutRevenue, revenue } = calculateRevenue(product, clients)
                        acc.totalBaseSumWithoutRevenue += baseSumWithoutRevenue
                        acc.totalRevenue += revenue
                        return acc
                    },
                    { totalBaseSumWithoutRevenue: 0, totalRevenue: 0 },
                )
        }

        const calculateWoodCategoryMetrics = (products, clients) => {
            return products
                .filter(product => product.category === 'Дерево')
                .reduce(
                    (acc, product) => {
                        const { baseSumWithoutRevenue, revenue } = calculateRevenue(product, clients)
                        acc.totalBaseSumWithoutRevenue += baseSumWithoutRevenue
                        acc.totalRevenue += revenue
                        return acc
                    },
                    { totalBaseSumWithoutRevenue: 0, totalRevenue: 0 },
                )
        }

        // Используем функции для расчета данных по категориям
        const steelMetrics1m = calculateCategoryMetrics(products, clients, '1,00м')
        const steelMetrics125m = calculateCategoryMetrics(products, clients, '1,25м')
        const woodMetrics = calculateWoodCategoryMetrics(products, clients)

        const pieDataSteel1m = [
            { name: 'Сумма без выручки', value: steelMetrics1m.totalBaseSumWithoutRevenue },
            { name: 'Выручка', value: steelMetrics1m.totalRevenue },
        ]

        const pieDataSteel125m = [
            { name: 'Сумма без выручки', value: steelMetrics125m.totalBaseSumWithoutRevenue },
            { name: 'Выручка', value: steelMetrics125m.totalRevenue },
        ]

        const pieDataWood = [
            { name: 'Сумма без выручки', value: woodMetrics.totalBaseSumWithoutRevenue },
            { name: 'Выручка', value: woodMetrics.totalRevenue },
        ]

        return (
            <div style={{ marginLeft: 30 }} className="chart-legend">
                <div className="legend-item">
                    <span className="color-box" style={{ backgroundColor: COLORS[4] }}></span>
                    <p>
                        Всего метров: <span style={{ color: COLORS[4], fontWeight: 500 }}>{totalLength}м</span>
                    </p>
                </div>
                <div className="legend-item">
                    <span className="color-box" style={{ backgroundColor: COLORS[0] }}></span>
                    <p>
                        Доступно: <span style={{ color: COLORS[0], fontWeight: 500 }}>{available}м</span>
                    </p>
                </div>
                <div className="legend-item">
                    <span className="color-box" style={{ backgroundColor: COLORS[1] }}></span>
                    <p>
                        Продано: <span style={{ color: COLORS[1], fontWeight: 500 }}>{sold}м</span>
                    </p>
                </div>
            </div>
        )
    }

    if (loading) return <p className="loading">Загрузка...</p>

    return (
        <div style={{ marginLeft: `18%` }} className="imported-products-page top">
            <div className="charts-container flex-space">
                <div style={{ marginLeft: 50 }} className="chart-item diogram-s">
                    <h4 style={{ marginLeft: 58, marginTop: 10 }}>Лист 1м</h4>
                    <PieChart width={200} height={200}>
                        <Pie
                            data={pieData1m}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            innerRadius={25}
                            fill="#8884d8"
                            dataKey="value">
                            {pieData1m.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    {renderSummary(pieData1m)}
                </div>

                <div className="chart-item diogram-s">
                    <h4 style={{ marginLeft: 50, marginTop: 10 }}>Лист 1,25м</h4>
                    <PieChart width={200} height={200}>
                        <Pie
                            data={pieData125m}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            innerRadius={25}
                            fill="#8884d8"
                            dataKey="value">
                            {pieData125m.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    {renderSummary(pieData125m)}
                </div>

                <div style={{ marginRight: 60 }} className="chart-item diogram-s">
                    <h4 style={{ marginLeft: 60, marginTop: 10 }}>Дерево</h4>
                    <PieChart width={200} height={200}>
                        <Pie
                            data={pieDataWood}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            innerRadius={25}
                            fill="#8884d8"
                            dataKey="value">
                            {pieDataWood.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    {renderSummary(pieDataWood)}
                </div>
            </div>

            <div className="products-container">
                <AddImportedProductForm onProductAdded={handleProductAdded} />

                <div className="filters-container flex-space product-summary-i">
                    <select name="category" className="input" value={filters.category} onChange={handleFilterChange}>
                        <option value="">Категория</option>
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        name="country"
                        style={{ marginLeft: `3%` }}
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

                    <select
                        name="width"
                        style={{ marginLeft: `3%` }}
                        className="input"
                        value={filters.width}
                        onChange={handleFilterChange}>
                        <option value="">Ширина</option>
                        {widths.map(width => (
                            <option key={width} value={width}>
                                {width}
                            </option>
                        ))}
                    </select>

                    <select
                        name="surface"
                        style={{ marginLeft: `3%` }}
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

                    <select
                        name="color"
                        style={{ marginLeft: `3%` }}
                        className="input"
                        value={filters.color}
                        onChange={handleFilterChange}>
                        <option value="">Цвет</option>
                        {colors.map(color => (
                            <option key={color} value={color}>
                                {color}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginLeft: 20, marginRight: 17 }} className="product-list">
                    <hr style={{ marginBottom: 10 }} />

                    <h3 style={{ marginBottom: 30, color: `#000` }}>Imported Products:</h3>
                    <div className="product-summary-a flex-space">
                        <p className="details">
                            <span>Цвет</span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span> Цена </span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span>Сумма</span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span>Длина</span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                    </div>
                    {filteredProducts.map(product => (
                        <div key={product._id} className={`product-item`}>
                            <div className={`product-summary flex-space`}>
                                <div
                                    key={product._id}
                                    className="border"
                                    style={{
                                        backgroundColor: `var(${product.color})`,
                                        color: `var(${product.color})`,
                                        borderRadius: 5,
                                        alignItems: `center`,
                                    }}>
                                    ......|
                                </div>
                                <div>{product.category}</div>|<div>{product.price}с.</div>|<div>{product.sum}с.</div>|
                                <div>{product.length}м</div>|<div>{product.thickness}</div>|
                                <div>{formatDate(product.creationDate)}</div>
                                <div style={{}}>
                                    <button
                                        className="info"
                                        style={{ fontWeight: 600 }}
                                        onClick={() => handleProductClick(product)}>
                                        Инфо
                                    </button>
                                    <button
                                        className="info"
                                        style={{ fontWeight: 600 }}
                                        onClick={() => navigateToProductDetails(product._id)}>
                                        Детали
                                    </button>
                                    <button
                                        className="info"
                                        style={{ fontWeight: 600 }}
                                        onClick={() => setEditingProduct(product)}>
                                        Изменить
                                    </button>
                                    <button
                                        className="info"
                                        style={{ fontWeight: 600 }}
                                        onClick={() => handleDeleteProduct(product._id)}>
                                        Удалит
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ProductModal product={showProductInfo} onClose={() => setShowProductInfo(null)} />
        </div>
    )
}

export default ImportedProductsPage
