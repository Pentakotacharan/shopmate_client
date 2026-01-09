import React from 'react';
import { FaTrash } from 'react-icons/fa';

const CartItem = ({ item, removeFromCart }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded shadow-sm mb-3">
      <div className="flex items-center">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
        <div>
          <h3 className="font-semibold text-gray-800">{item.name}</h3>
          <p className="text-gray-600">${item.price}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="font-bold text-gray-700">Qty: {item.qty}</span>
        <button 
          onClick={() => removeFromCart(item._id)} 
          className="text-red-500 hover:text-red-700 transition p-2 bg-red-50 rounded-full"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;