import React, { useState } from 'react'
import axios from 'axios'

const AddClient = ({ onClientAdded }) => {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:8080/api/clients', { name, phone })
            console.log('Клиент добавлен:', res.data)
            setName('')
            setPhone('')
        } catch (err) {
            console.error('Ошибка при добавлении клиента', err)
        }
    }

    return (
        <form
            style={{ borderLeft: `1px solid #d0d0d0`, height: `55vh`, padding: 40 }}
            className="flex-space-c"
            onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Имя"
                    style={{ fontSize: 15 }}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-c"
                />
                <input
                    type="phone"
                    placeholder="Телефон"
                    style={{ fontSize: 15 }}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-c"
                />
                <button className="add-c" style={{ fontSize: 14, fontWeight: 500, width: `100%` }} type="submit">
                    Добавить клиента
                </button>
            </div>
        </form>
    )
}

export default AddClient
