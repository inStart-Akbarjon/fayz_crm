import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
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

const COLORS = ['#8947a3', '#FFBB28', '#c1c1c1', '#FF8042', '#000000']

const ProductDetailsPage = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [clients, setClients] = useState([])

    const formatDate = dateString => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return 'Неизвестно'
        }
        return moment(date).format('DD MMM, YYYY') // Форматирование даты с помощью moment
    }

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(false)
                const productResponse = await axios.get(`http://localhost:8080/api/imported-products/${id}`)
                setProduct(productResponse.data)

                const clientsResponse = await axios.get(
                    `http://localhost:8080/api/clients/product/${productResponse.data.id}`,
                )
                setClients(clientsResponse.data)
            } catch (err) {
                console.error('Ошибка при получении данных продукта или клиентов', err)
                setLoading(false)
            }
        }
        fetchProductDetails()
    }, [id])

    if (!product) return <p>Загрузка...</p>

    const totalLength = product.category === 'Дерево' ? product.FirstlengthWood : product.Firstlength
    const soldLength = clients.reduce((acc, client) => acc + client.purchasedLength, 0)
    const availableLength = totalLength - soldLength

    const pieData = [
        { name: 'Доступно', value: availableLength },
        { name: 'Продано', value: soldLength },
    ]

    const calculateRevenue = () => {
        return clients.reduce((acc, client) => {
            return acc + (client.purchasedPrice - product.price) * client.purchasedLength
        }, 0)
    }

    const calculateTotalClientPurchase = () => {
        return clients.reduce((acc, client) => {
            return acc + client.purchasedLength * client.purchasedPrice
        }, 0)
    }

    const calculateTotalWithoutRevenue = () => {
        return soldLength * product.price
    }

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

    const barData = [
        { name: 'Сумма покупки', value: calculateTotalClientPurchase() },
        { name: 'Сумма без выручки', value: calculateTotalWithoutRevenue() },
        { name: 'Выручка', value: calculateRevenue() },
    ]

    const totalValue = calculateTotalClientPurchase()

    if (loading) return <p className="loading">Загрузка...</p>

    return (
        <div style={{ marginLeft: `18%`, marginTop: `6%` }}>
            <Link to="/imported-products" style={{ padding: 5, marginLeft: 80, fontWeight: 600 }} className="info exit">
                Выход
            </Link>
            <div className="charts-container flex-space wrapper">
                {/* Диаграммы */}
                <div style={{ marginLeft: 65 }} className="chart-item diogram-s">
                    <h3 style={{ marginLeft: 5, marginTop: 10, fontWeight: 600, fontSize: 25 }}>Метр продукта</h3>
                    <PieChart width={200} height={200}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            innerRadius={25}
                            fill="#8884d8"
                            dataKey="value">
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: COLORS[4] }}></span>
                            <p>
                                Всего метров: <span style={{ color: COLORS[4], fontWeight: 500 }}>{totalLength}м</span>
                            </p>
                        </div>
                        <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: COLORS[0] }}></span>
                            <p>
                                Доступно: <span style={{ color: COLORS[4], fontWeight: 500 }}>{availableLength}м</span>
                            </p>
                        </div>
                        <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: COLORS[1] }}></span>
                            <p>
                                Продано: <span style={{ color: COLORS[4], fontWeight: 500 }}>{soldLength}м</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="chart-item diogram-s">
                    <h3 style={{ marginLeft: 30, marginTop: 10, fontWeight: 600, fontSize: 25 }}>Финансовая сводка</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8">
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <LabelList
                                    dataKey="value"
                                    content={({ x, y, width, height, value }) => {
                                        const percent = ((value / totalValue) * 100).toFixed(0) + '%'
                                        return (
                                            <text
                                                x={x + width / 2}
                                                y={y + height / 2}
                                                fill="#fff"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize={14}>
                                                {percent}
                                            </text>
                                        )
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="summary-container diogram-s" style={{ marginRight: `3%`, marginTop: 20 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 22 }}>Сводка по выручке:</h3>
                    <p>
                        Общая сумма покупки:{' '}
                        <span style={{ fontWeight: 600 }}>{calculateTotalClientPurchase()} c.</span>
                    </p>
                    <p>
                        Сумма без выручки: <span style={{ fontWeight: 600 }}>{calculateTotalWithoutRevenue()} c.</span>
                    </p>
                    <p>
                        Выручка: <span style={{ fontWeight: 600 }}>{calculateRevenue()} c.</span>
                    </p>
                    <p>
                        Цена товара: <span style={{ fontWeight: 600 }}>{product.price} c.</span>
                    </p>
                </div>
            </div>

            <div>
                <hr style={{ marginTop: 30 }} />
                <div className="client-list-container">
                    <div className="flex-space wrapper" style={{ marginTop: 15, marginLeft: `6%` }}>
                        <h3 style={{ marginLeft: -50, marginTop: -50, fontWeight: 600, fontSize: 22 }}>
                            Клиенты, купившие этот продукт:
                        </h3>
                    </div>
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
                            <span> Телефон </span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                        <p className="details">
                            <span>Куплено</span>
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
                            <span></span>
                        </p>
                        <p className="details">
                            <span>Дата</span>
                        </p>
                        <p className="details">
                            <span></span>
                        </p>
                    </div>
                    {clients.length > 0 ? (
                        <ul className="client-list">
                            {clients.map(client => (
                                <div key={client._id} className={`product-item`}>
                                    <div className="product-summary flex-space">
                                        <div
                                            key={client._id}
                                            style={{ borderRadius: 5, fontSize: 20, color: `#363d55` }}>
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>
                                        <div style={{ marginLeft: `-4%` }} className="details">
                                            <span>{client.name}</span>
                                        </div>
                                        |
                                        <div className="details">
                                            <span>+{client.phone}</span>
                                        </div>
                                        |
                                        <div className="details">
                                            <span>{client.purchasedLength}м</span>
                                        </div>
                                        |
                                        <div className="details">
                                            <span>{client.purchasedPrice}c.</span>
                                        </div>
                                        |
                                        <div className="details">
                                            <span>{client.purchasedLength * client.purchasedPrice}c.</span>
                                        </div>
                                        |
                                        <div className="details">
                                            <span>{formatDate(client.purchasedDate)}</span>
                                        </div>
                                        |
                                    </div>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ marginLeft: `30%` }}>Нет клиентов, купивших этот продукт.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsPage
