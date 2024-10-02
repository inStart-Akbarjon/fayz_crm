import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ClientList from './ClientList';
import ImportedProductsPage from './ImportedProductsPage';

const MainPage = () => {
  return (

      <div>

        <Routes>

          <Route path="/" element={<h2>Welcome to the Main Page</h2>} />
        </Routes>
      </div>

  );
};

const navbarStyle = {
  backgroundColor: '#333',
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

export default MainPage;
