import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ClientList from './components/ClientList';
import ImportedProductsPage from './components/ImportedProductsPage';
import ProductsPage from './components/ProductsPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import MainPage from './components/MainPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';

function App() {
    const [clients, setClients] = useState([]);

    const handleClientAdded = (newClient) => {
        setClients([...clients, newClient]);
    };

    return (
        <Router>
            <div className='fixed'>
                <nav style={{height: `10vh`}}>
                    <div class="logo">
                        <a style={{marginLeft: 10}} href="/">Fayz CRM</a>
                    </div>
                    <button>Login</button>
                </nav>
                <div style={{height: `90vh`, marginTop: `10vh`, width: `17%`, position: `fixed`}} class="offcanvas offcanvas-start fixed show" tabindex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
                    <div class="offcanvas-header">                       
                    </div>
                    <a style={{color: `#363d55`, fontWeight: 600}} class="info-a" href="/"><FontAwesomeIcon icon={faUser} style={{marginRight: `3%`}}/> Клиенты </a>
                    <a style={{color: `#363d55`, fontWeight: 600}} class="info-a" href="/imported-products"><FontAwesomeIcon icon={faBox} style={{marginRight: `3%`}}/> Продукты склада </a>
                    <a style={{color: `#363d55`, fontWeight: 600}} class="info-a" href="#"><FontAwesomeIcon icon={faGear} style={{marginRight: `3%`}}/> Настройки</a>
                    <div class="offcanvas-body">
                    </div>
                    <div class="offcanvas-body">
                    </div>
                    <div class="offcanvas-body">
                    </div>
                    <div class="offcanvas-body">
                    </div>
                    <div class="offcanvas-body">
                    </div>
                    <div class="offcanvas-body">
                    </div>
                    <div class="offcanvas-body">
                    </div>
                    <div class="offcanvas-body">
                    </div>
                </div>
            </div>
            <div className="App">
                <Routes>
                    <Route path="/" element={<ClientList />} />
                    <Route path="/imported-products" element={<ImportedProductsPage />} />
                    <Route path="/products/:clientId" element={<ProductsPage />} />
                    <Route path="/imported-products/:id" element={<ProductDetailsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

const navbarStyle = {
    backgroundColor: '#363d55',
    padding: '10px',
  };
  
  const navbarListStyle = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
  };
  
  const navbarItemStyle = {
    margin: '0 15px',
  };
  
  const navbarLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  };
    

export default App;
