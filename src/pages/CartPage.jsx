import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { FaTrash, FaArrowLeft, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';

const CartPage = () => {
  // Destructure the new functions here
  const { cartItems, removeFromCart, decreaseQty, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Basic Calculations
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  const totalItems = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);

  // Empty State Check
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl flex flex-col items-center justify-center">
        <div className="bg-gray-50 p-8 rounded-full shadow-sm mb-6 border border-gray-200">
           <FaShoppingCart size={50} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-yellow-500 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition shadow-md"
        >
          <FaArrowLeft size={14} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: Cart Items List */}
        <div className="w-full lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item._id} 
              className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 transition hover:shadow-md"
            >
              {/* Product Info */}
              <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-md border border-gray-200" 
                />
                <div className="ml-4 flex-1">
                  <Link to={`/product/${item._id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1">Brand: {item.brand}</p>
                  <p className="text-gray-900 font-bold mt-1 sm:hidden">${item.price}</p>
                </div>
              </div>

              {/* Controls (Qty & Delete) */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 border-t sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                <p className="text-gray-800 font-bold text-lg hidden sm:block w-20 text-right">
                  ${item.price}
                </p>
                
                {/* ✅ UPDATED: Quantity Controls */}
                <div className="flex items-center bg-gray-100 rounded-lg">
                  <button 
                    onClick={() => decreaseQty(item._id)}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-l-lg transition"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus size={10} />
                  </button>
                  
                  <span className="font-bold text-gray-900 w-8 text-center text-sm">
                    {item.qty}
                  </span>

                  <button 
                    onClick={() => addToCart(item)}
                    className="p-2 text-gray-600 hover:text-black hover:bg-gray-200 rounded-r-lg transition"
                    aria-label="Increase quantity"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item._id)} 
                  className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
                  title="Remove Item"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Summary Box */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Total Items:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">${total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className="text-green-600 font-medium text-sm bg-green-100 px-2 py-0.5 rounded">Free</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-bold text-gray-900 border-t pt-4 mb-6">
              <span>Total:</span>
              <span>${total}</span>
            </div>

            <button 
              onClick={() => navigate('/payment')} 
              className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition shadow-lg transform active:scale-95"
            >
              Proceed to Checkout
            </button>

            <Link to="/" className="block text-center text-gray-500 hover:text-black mt-4 text-sm hover:underline">
              or Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;