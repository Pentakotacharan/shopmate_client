import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-60 object-cover"
      />
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 truncate">
            {product.name}
          </h2>
        </Link>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <Link 
            to={`/product/${product._id}`} 
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;