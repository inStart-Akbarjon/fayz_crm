// /client/src/components/ClientList.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/ClientList.css' // Импортируем стили
import '../styles/ProductsPage.css' // Импортируем стили
import { useNavigate, Link } from 'react-router-dom'
import { PieChart, Pie, Cell } from 'recharts'
import AddClient from './AddClient'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const ClientList = () => {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedClientId, setSelectedClientId] = useState(null)
    const [editClientId, setEditClientId] = useState(null)
    const [editClientData, setEditClientData] = useState({ name: '', phone: '' })
    const [clientDebts, setClientDebts] = useState({})
    const [totalDebt, setTotalDebt] = useState(0)
    const [totalPurchases, setTotalPurchases] = useState(0)
    const [totalPaidAmount, setTotalPaidAmount] = useState(0) // Добавляем состояние для оплаченной суммы
    const [clientDebt, setClientDebt] = useState(0)
    const [showOnlyDebtors, setShowOnlyDebtors] = useState(false)
    const [searchQuery, setSearchQuery] = useState('') // Состояние для хранения поискового запроса
    const COLORS = ['#8947a3', '#FFBB28', '#c1c1c1', '#FF8042', '#000000'] // Добавляем цвет для общей суммы покупок
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientsAndDebts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/clients')
                const clientsData = response.data
                setClients(clientsData)

                let totalDebt = 0
                let totalPaidAmount = 0
                let totalPurchases = 0 // Добавляем переменную для общей суммы покупок
                const debts = {}

                for (let client of clientsData) {
                    const productsResponse = await axios.get(`http://localhost:8080/api/clients/${client._id}/products`)
                    const products = productsResponse.data
                    const debtSum = calculateDebt(products)
                    const paidSum = products.reduce((acc, product) => acc + product.paidAmount, 0)
                    const purchasesSum = products.reduce((acc, product) => acc + product.sum, 0)

                    debts[client._id] = debtSum
                    totalDebt += debtSum
                    totalPaidAmount += paidSum
                    totalPurchases += purchasesSum // Обновляем общую сумму покупок
                }

                setClientDebts(debts)
                setTotalDebt(totalDebt)
                setTotalPaidAmount(totalPaidAmount)
                setTotalPurchases(totalPurchases) // Устанавливаем общую сумму покупок
                setLoading(false)
            } catch (err) {
                console.error('Ошибка при загрузке данных', err)
                setError('Не удалось загрузить данные')
                setLoading(false)
            }
        }

        fetchClientsAndDebts()
    }, [])

    const calculateDebt = products => {
        const totalSum = products.reduce((acc, product) => acc + product.sum, 0)
        const paidSum = products.reduce((acc, product) => acc + product.paidAmount, 0)
        return totalSum - paidSum
    }

    const fetchClientProducts = async clientId => {
        try {
            const response = await axios.get(`http://localhost:8080/api/clients/${clientId}/products`)
            const products = response.data
            const debtSum = calculateDebt(products)
            setClientDebt(debtSum) // Обновляем состояние с долгом клиента
        } catch (err) {
            console.error('Ошибка при загрузке продуктов клиента', err)
        }
    }

    const handleClientAdded = newClient => {
        setClients([...clients, newClient])
    }

    const data = [
        { name: 'Paid Amount', value: totalPaidAmount },
        { name: 'Total Debt', value: totalDebt },
    ]

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.2
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    const handleViewProducts = async clientId => {
        setSelectedClientId(clientId)
        await fetchClientProducts(clientId)
        navigate(`/products/${clientId}`)
    }

    const handleToggleDebtors = () => {
        console.log('Previous state:', showOnlyDebtors)
        setShowOnlyDebtors(!showOnlyDebtors)
        console.log('New state:', !showOnlyDebtors)
    }

    const handleDelete = async clientId => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/clients/${clientId}`)
            console.log('Response:', response)
            setClients(clients.filter(client => client._id !== clientId))
        } catch (err) {
            console.error('Ошибка при удалении клиента:', err.response ? err.response.data : err.message)
        }
    }

    const handleEdit = client => {
        setEditClientId(client._id)
        setEditClientData({ name: client.name, phone: client.phone })
    }

    const handleEditSubmit = async () => {
        try {
            await axios.put(`http://localhost:8080/api/clients/${editClientId}`, editClientData)
            setClients(clients.map(client => (client._id === editClientId ? { ...client, ...editClientData } : client)))
            setEditClientId(null)
        } catch (err) {
            console.error('Ошибка при редактировании клиента', err)
        }
    }

    const filteredClients = clients
        .filter(
            client =>
                client.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Поиск по имени
                client.phone.includes(searchQuery), // Поиск по телефону
        )
        .filter(
            client => (showOnlyDebtors ? clientDebts[client._id] > 0 : true), // Фильтрация по должникам
        )

    if (loading) return <p className="loading">Загрузка...</p>
    if (error) return <p className="error-message">{error}</p>

    return (
        <div style={{ marginLeft: `18%` }} className="client-list-container">
            <Link to="/" style={{ padding: 5 }} className="info">
                Exit
            </Link>{' '}
            {/* Кнопка для возврата */}
            <div style={{ marginLeft: -70 }} className="chart-container flex-space">
                <div style={{ marginLeft: 80, marginTop: 40 }} className="pie-chart-container diogram-c">
                    <PieChart style={{ marginLeft: 15 }} width={200} height={200}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            innerRadius={25}
                            fill="#8884d8"
                            dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <div style={{ marginLeft: 10 }} className="chart-legend">
                        <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: COLORS[4] }}></span>
                            <p>
                                Общая сумма покупок:{' '}
                                <span style={{ color: COLORS[4], fontWeight: 500 }}>{totalPurchases} c.</span>
                            </p>
                        </div>
                        <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: COLORS[0] }}></span>
                            <p>
                                Оплаченная сумма:{' '}
                                <span style={{ color: COLORS[4], fontWeight: 500 }}>{totalPaidAmount} c.</span>
                            </p>
                        </div>
                        <div className="legend-item">
                            <span className="color-box" style={{ backgroundColor: COLORS[1] }}></span>
                            <p>
                                Общая сумма долгов:{' '}
                                <span style={{ color: COLORS[4], fontWeight: 500 }}>{totalDebt} c.</span>
                            </p>
                        </div>
                    </div>
                </div>
                <AddClient onClientAdded={handleClientAdded} />
            </div>
            <hr />
            {editClientId ? (
                <div className="edit-form">
                    <input
                        type="text"
                        value={editClientData.name}
                        onChange={e => setEditClientData({ ...editClientData, name: e.target.value })}
                        placeholder="Имя"
                    />
                    <input
                        type="phone"
                        value={editClientData.phone}
                        onChange={e => setEditClientData({ ...editClientData, phone: e.target.value })}
                        placeholder="Phone"
                    />
                    <button className="info" style={{ fontWeight: 600 }} onClick={handleEditSubmit}>
                        Изменить
                    </button>
                    <button className="info" style={{ fontWeight: 600 }} onClick={() => setEditClientId(null)}>
                        Назад
                    </button>
                </div>
            ) : null}
            <div className="flex-space" style={{ marginTop: 15 }}>
                <h3 style={{ marginLeft: 15, marginTop: `0.7%` }}>Clients:</h3>
                <input
                    type="text"
                    style={{ fontWeight: 500 }}
                    placeholder="Поиск по имени или по номеру"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input-a"
                />
                <button className="info" onClick={handleToggleDebtors} style={{ fontWeight: 600 }}>
                    {showOnlyDebtors ? 'Показать всех клиентов' : 'Показать должников'}
                </button>
            </div>
            <div className="product-summary-a flex-space">
                <p className="details">
                    <span>Имя</span>
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
                    <span>Телефон</span>
                </p>
                <p className="details">
                    <span></span>
                </p>
                <p className="details">
                    <span></span>
                </p>
                <p className="details">
                    <span>Долг</span>
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
            {filteredClients.length > 0 ? (
                <ul style={{ marginTop: 15, alignItems: `center` }} className="client-list">
                    {filteredClients.map(client => (
                        <li
                            key={client._id}
                            style={{ borderRadius: 5, fontSize: 20, color: `#363d55`, alignItems: `center` }}
                            className="client-item flex-space">
                            <FontAwesomeIcon style={{ marginLeft: `0.7%` }} icon={faUser} />
                            <span className="details" style={{ paddingLeft: 5, marginLeft: `1.5%` }}>
                                {client.name}
                            </span>
                            <span className="details" style={{ paddingLeft: 5 }}>
                                +{client.phone}
                            </span>
                            <span style={{ fontWeight: 500 }} className="details">
                                {clientDebts[client._id] ? `${clientDebts[client._id].toFixed(0)}c.` : 'Нет долгов'}
                            </span>

                            <div className="client-actions">
                                <button
                                    style={{ fontWeight: 600 }}
                                    className="info"
                                    onClick={() => handleViewProducts(client._id)}>
                                    Продукты
                                </button>
                                <button style={{ fontWeight: 600 }} className="info" onClick={() => handleEdit(client)}>
                                    Изменить
                                </button>
                                <button
                                    style={{ fontWeight: 600 }}
                                    className="info"
                                    onClick={() => handleDelete(client._id)}>
                                    Удалит
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no">Нет клиентов</p>
            )}
        </div>
    )
}

export default ClientList
