import React from 'react'
import mainImage from '../assets/images/main.jpg'

const MainPage = () => {
    return (
        <div style={{ marginLeft: 200, marginTop: 120 }}>
            <h1>Fayz Group</h1>
            <img
                src={mainImage}
                height={500}
                width={800}
                style={{ borderRadius: 15, marginTop: 20, marginLeft: `21%` }}
                alt="Main"
            />
        </div>
    )
}

export default MainPage
