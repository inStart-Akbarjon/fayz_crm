import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import ClientList from './components/ClientList'
import Analytics from './components/Analytics'
import ImportedProductsPage from './components/ImportedProductsPage'
import ProductsPage from './components/ProductsPage'
import ProductDetailsPage from './components/ProductDetailsPage'
import MainPage from './components/MainPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faBox } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faChartColumn } from '@fortawesome/free-solid-svg-icons'
import Sidebar from './components/Sidebar' // путь к вашему файлу Sidebar

function App() {
    const [clients, setClients] = useState([])

    const handleClientAdded = newClient => {
        setClients([...clients, newClient])
    }

    return (
        <Router>
            <div className="fixed">
                <nav style={{ height: `10vh` }}>
                    <div className="logo">
                        <a style={{ marginLeft: 10 }} href="/">
                            Fayz CRM
                        </a>
                    </div>
                    <button style={{ marginRight: 10 }}>Login</button>
                </nav>
                <Sidebar />
            </div>
            <div>
              
            </div>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/clients" element={<ClientList />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/imported-products" element={<ImportedProductsPage />} />
                    <Route path="/products/:clientId" element={<ProductsPage />} />
                    <Route path="/imported-products/:id" element={<ProductDetailsPage />} />
                </Routes>
            </div>
        </Router>
    )
}

const navbarStyle = {
    backgroundColor: '#363d55',
    padding: '10px',
}

const navbarListStyle = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
}

const navbarItemStyle = {
    margin: '0 15px',
}

const navbarLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
}

export default App
