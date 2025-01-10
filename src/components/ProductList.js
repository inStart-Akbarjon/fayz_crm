import React, { useState } from 'react'
import moment from 'moment'

const ProductList = ({ products, onEdit, onDelete, onView }) => {
    const [categoryFilter, setCategoryFilter] = useState('Лист')

    const formatDate = dateString => {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) {
            return 'Неизвестно'
        }
        return moment(date).format('DD MMM, YYYY') // Форматирование даты с помощью moment
    }

    // Функция для фильтрации продуктов по категории
    const filteredProducts =
        categoryFilter === 'All' ? products : products.filter(product => product.category === categoryFilter)

    // Сортировка продуктов по дате создания
    const sortedProducts = filteredProducts.slice().sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))

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

    return (
        <div className="product-list">
            {/* Кнопки для фильтрации по категориям */}

            <div className="filters-container flex-space">
                <button
                    style={{ borderRadius: 0, backgroundColor: `white` }}
                    className="input"
                    onClick={() => setCategoryFilter('Лист')}>
                    Лист
                </button>
                <button
                    style={{ borderRadius: 0, backgroundColor: `white` }}
                    className="input"
                    onClick={() => setCategoryFilter('Черепица')}>
                    Черепица
                </button>
                <button
                    style={{ borderRadius: 0, backgroundColor: `white` }}
                    className="input"
                    onClick={() => setCategoryFilter('Дерево')}>
                    Дерево
                </button>
                <button
                    style={{ borderRadius: 0, backgroundColor: `white` }}
                    className="input"
                    onClick={() => setCategoryFilter('Крепеж')}>
                    Крепеж
                </button>
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
                    <span></span>
                </p>
                <p className="details">
                    <span></span>
                </p>
                <p className="details">
                    <span> Цена </span>
                </p>
                <p className="details">
                    <span>Сумма</span>
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
            </div>

            {/* Отображение отфильтрованных и отсортированных продуктов */}
            {Array.isArray(products) && products.length > 0 ? (
                sortedProducts.map(product => (
                    <div key={product._id} className={`product-item`}>
                        <div className="product-summary flex-space">
                            <div
                                key={product._id}
                                className={`border`}
                                style={{
                                    backgroundColor: `var(${product.color})`,
                                    color: `var(${product.color})`,
                                    borderRadius: 5,
                                }}>
                                ......|
                            </div>
                            {/* Условные поля в зависимости от категории */}
                            {product.category === 'Лист' && (
                                <>
                                    <div className="details">
                                        <span>{product.category}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.country}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.price}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.sum}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.length}</span>м
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.width}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.thickness}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.surface}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.color}</span>
                                    </div>
                                    |<div className="details">{formatDate(product.creationDate)}</div>
                                </>
                            )}
                            {product.category === 'Дерево' && (
                                <>
                                    <div className="details">
                                        <span>{product.category}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.country}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.price}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.sum}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.length}</span>м
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.thickness}</span>
                                    </div>
                                    x
                                    <div className="details">
                                        <span>{product.width}</span>
                                    </div>
                                    |<div className="details">{formatDate(product.creationDate)}</div>
                                </>
                            )}

                            {product.category === 'Крепеж' && (
                                <>
                                    <div className="details">
                                        <span>{product.category}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.country}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.price}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.sum}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.length}</span>cм
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.weight} кг</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.color}</span>
                                    </div>
                                    |<div className="details">{formatDate(product.creationDate)}</div>
                                </>
                            )}

                            {product.category === 'Черепица' && (
                                <>
                                    <div className="details">
                                        <span>{product.category}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.country}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.price}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.tilePrice}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.sum}c.</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.length}</span>м
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.width}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.thickness}</span>
                                    </div>
                                    |
                                    <div className="details">
                                        <span>{product.surface}</span>
                                    </div>
                                    |<div className="details">{formatDate(product.creationDate)}</div>
                                </>
                            )}
                            <div className="buttons">
                                <button className="info" style={{ fontWeight: 600 }} onClick={() => onView(product)}>
                                    Инфо
                                </button>
                                <button className="info" style={{ fontWeight: 600 }} onClick={() => onEdit(product)}>
                                    Изменить
                                </button>
                                <button
                                    className="info"
                                    style={{ fontWeight: 600 }}
                                    onClick={() => onDelete(product._id)}>
                                    Удалит
                                </button>
                            </div>
                        </div>
                        <div className="" onClick={() => onView(product)}>
                            {product.type === 'Лист стальной' && (
                                <>
                                    <p className="details">
                                        <strong>Цвет:</strong> {product.color}
                                    </p>
                                    <p className="details">
                                        <strong>Поверхность:</strong> {product.surface}
                                    </p>
                                    <p className="details">
                                        <strong>Толщина:</strong> {product.thickness}
                                    </p>
                                    <p className="details">
                                        <strong>Длина:</strong> {product.length}
                                    </p>
                                    <p className="details">
                                        <strong>Ширина:</strong> {product.width}
                                    </p>
                                </>
                            )}
                            {product.type === 'Дерево' && (
                                <>
                                    <p className="details">
                                        <strong>Длина:</strong> {product.length}
                                    </p>
                                    <p className="details">
                                        <strong>Толщина:</strong> {product.thickness}
                                    </p>
                                    <p className="details">
                                        <strong>Ширина:</strong> {product.width}
                                    </p>
                                </>
                            )}
                            {product.type === 'Крепеж' && (
                                <>
                                    <p className="details">
                                        <strong>Цвет:</strong> {product.color}
                                    </p>
                                    <p className="details">
                                        <strong>Длина:</strong> {product.length}
                                    </p>
                                    <p className="details">
                                        <strong>Вес:</strong> {product.weight}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="no">Продуктов пока нет</p>
            )}
        </div>
    )
}

export default ProductList
