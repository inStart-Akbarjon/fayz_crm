import React, { useState } from 'react'

const SearchBar = ({ placeholder, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('')

    const handleChange = event => {
        setSearchTerm(event.target.value)
        onSearch(event.target.value)
    }

    return (
        <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder={placeholder}
            style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
        />
    )
}

export default SearchBar
