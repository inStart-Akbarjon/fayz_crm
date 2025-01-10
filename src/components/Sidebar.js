import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faChartColumn, faBox, faUser } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
    return (
        <div
            style={{
                marginLeft: `-50%`,
                marginTop: `10vh`,
                width: '250px',
                backgroundColor: 'white',
                height: '100vh',
                color: '#1a264e',
                position: 'fixed',
                borderRight: `2px solid #00239729`,
            }}>
            <div style={{ padding: '20px', fontSize: '24px', fontWeight: 'bold' }}></div>
            <div style={{ padding: '10px 25px' }}>
                <Link to="/" style={linkStyle}>
                    <FontAwesomeIcon icon={faHome} style={{ marginRight: '10px' }} />
                    Главная
                </Link>
            </div>
            <div style={{ padding: '10px 25px' }}>
                <Link to="/clients" style={linkStyle}>
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                    Клиенты
                </Link>
            </div>
            <div style={{ padding: '10px 25px' }}>
                <Link to="/imported-products" style={linkStyle}>
                    <FontAwesomeIcon icon={faBox} style={{ marginRight: '10px' }} />
                    Склад
                </Link>
            </div>
            <div style={{ padding: '10px 25px' }}>
                <Link to="/analytics" style={linkStyle}>
                    <FontAwesomeIcon icon={faChartColumn} style={{ marginRight: '10px' }} />
                    Аналитика
                </Link>
            </div>
        </div>
    )
}

const linkStyle = {
    color: '#1a264e',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '500',
}

export default Sidebar
