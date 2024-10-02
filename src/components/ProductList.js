import React from 'react';
import moment from 'moment';

const ProductList = ({ products, onEdit, onDelete, onView }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Неизвестно";
        }
        return moment(date).format('DD MMM, YYYY'); // Форматирование даты с помощью moment
    };

    const getClassForProductType = (type) => {
        switch(type) {
            case 'Лист':
                return 'steel-sheet';
            case 'Дерево':
                return 'wood';
            case 'Шрупы':
                return 'screws';
            default:
                return '';
        }
    };    

    const sortedProducts = products.slice().sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));

    return (
        <div className="product-list">
            
            <div className="product-summary-a flex-space">
                <p className="details"><span>Цвет</span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span> Цена </span></p>
                <p className="details"><span>Сумма</span></p>
                <p className="details"><span>Длина</span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
                <p className="details"><span></span></p>
            </div>

            {Array.isArray(products) && products.length > 0 ? (
                sortedProducts.map(product => (
                    <div key={product._id} className={`product-item`}>
                        <div className="product-summary flex-space">                          
                        <div key={product._id} className={`border`} style={{ backgroundColor: `var(${product.color})`, color: `var(${product.color})`, borderRadius: 5,}} >......|</div>
                            <div className="details"><span>{product.category}</span></div>|
                            <div className="details"><span>{product.country}</span></div>|
                            <div className="details"><span>{product.price}c.</span></div>|
                            <div className="details"><span>{product.sum}c.</span></div>|
                            <div className="details"><span>{product.length}</span>м</div>|
                            <div className="details"><span>{product.width}</span></div>|
                            <div className="details"><span>{product.thickness}</span></div>|
                            <div className="details"><span>{product.surface}</span></div>|
                            <div className="details">{formatDate(product.creationDate)}</div>                            
                            <div className='buttons'>
                                <button className="info" style={{fontWeight: 600}}  onClick={() => onView(product)}>Инфо</button>
                                <button className="info" style={{fontWeight: 600}} onClick={() => onEdit(product)}>Изменить</button>
                                <button className="info" style={{fontWeight: 600}} onClick={() => onDelete(product._id)}>Удалит</button>
                            </div>
                        </div>
                        <div className="" onClick={() => onView(product)}>
                            {product.type === 'Лист стальной' && (
                                <>
                                    <p className="details"><strong>Цвет:</strong> {product.color}</p>
                                    <p className="details"><strong>Поверхность:</strong> {product.surface}</p>
                                    <p className="details"><strong>Толщина:</strong> {product.thickness}</p>
                                    <p className="details"><strong>Длина:</strong> {product.length}</p>
                                    <p className="details"><strong>Ширина:</strong> {product.width}</p>
                                </>
                            )}
                            {product.type === 'Дерево' && (
                                <>
                                    <p className="details"><strong>Длина:</strong> {product.length}</p>
                                    <p className="details"><strong>Толщина:</strong> {product.thickness}</p>
                                    <p className="details"><strong>Ширина:</strong> {product.width}</p>
                                </>
                            )}
                            {product.type === 'Шрупы' && (
                                <>
                                    <p className="details"><strong>Цвет:</strong> {product.color}</p>
                                    <p className="details"><strong>Длина:</strong> {product.length}</p>
                                    <p className="details"><strong>Вес:</strong> {product.weight}</p>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className='no'>Продуктов пока нет</p>
            )}
        </div>
    );
};

export default ProductList;
