import React from 'react'
import '../styles/ProductModal.css' // Добавьте стили для модального окна

const ProductModal = ({ product, onClose }) => {
    if (!product) return null

    const COLORS = ['#8947a3', '#FFBB28', '#c1c1c1', '#0088fe', '#0088fe']

    return (
        <div className="modal-overlay">
            <div style={{ marginTop: `5%` }} className="modal-content">
                <button style={{ marginRight: 10 }} className="modal-close" onClick={onClose}>
                    ×
                </button>
                <h2 style={{ fontSize: 20, fontWeight: 900 }}>Информация о продукте</h2>
                <hr />
                <p style={{ marginBottom: -8, marginTop: -8 }}>
                    <strong>Категория:</strong> <span className="info">{product.category}</span>
                </p>
                <hr />
                <p style={{ marginBottom: -8, marginTop: -8 }}>
                    <strong>Цена:</strong> <span className="info">{product.price} c.</span>{' '}
                </p>
                <hr />
                <p style={{ marginBottom: -8, marginTop: -8 }}>
                    <strong>Сумма:</strong> <span className="info">{product.sum} c.</span>{' '}
                </p>
                <hr />

                {product.category === 'Лист' && (
                    <>
                        <p style={{ marginBottom: -8, marginTop: -8 }}>
                            <strong>Цвет:</strong> <span className="info">{product.color}</span>
                        </p>
                        <hr />
                        <p style={{ marginBottom: -8, marginTop: -8 }}>
                            <strong>Ширина:</strong> <span className="info">{product.width}</span>
                        </p>
                        <hr />
                        <p style={{ marginBottom: -8, marginTop: -8 }}>
                            <strong>Толщина:</strong> <span className="info">{product.thickness}</span>
                        </p>
                        <hr />
                        <p style={{ marginBottom: -8, marginTop: -8 }}>
                            <strong>Поверхность:</strong> <span className="info">{product.surface}</span>
                        </p>
                        <hr />
                    </>
                )}
                <p style={{ marginBottom: -8, marginTop: -8 }}>
                    <strong>Начальная длина:</strong> <span className="info">{product.Firstlength}м</span>
                </p>
                <hr />
                <p style={{ marginBottom: -8, marginTop: -8 }}>
                    <strong>Оставшийся длина:</strong> <span className="info">{product.length}м</span>
                </p>
                {product.category === 'Дерево' && (
                    <>
                        <p style={{ marginBottom: -8, marginTop: -8 }}>
                            <strong>Ширина:</strong> <span className="info">{product.width}</span>
                        </p>
                        <hr />
                        <p style={{ marginBottom: -8, marginTop: -8 }}>
                            <strong>Толщина:</strong> <span className="info">{product.thickness}</span>
                        </p>
                        <hr />
                    </>
                )}
                {product.category === 'Крепеж' && (
                    <>
                        <p style={{ marginBottom: -8, marginTop: -8 }}>
                            <strong>Ширина:</strong> <span className="info">{product.width}</span>
                        </p>
                        <p style={{ marginBottom: -8, marginTop: -8 }}>
                            <strong>Вес:</strong> <span className="info">{product.weight}</span>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProductModal
