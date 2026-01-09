import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  // Calculate total items for the badge
  const cartCount = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);

  return (
    // 'sticky top-0 z-50': Keeps navbar visible while scrolling
    <nav className="bg-gray-900 text-white py-4 shadow-lg sticky top-0 z-50">
      
      {/* Container: Stacks vertically on mobile, horizontal on desktop */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* 1. Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold tracking-wide text-yellow-500 hover:text-yellow-400 transition">
          ShopMate
        </Link>

        {/* 2. Search Box - Full width on mobile, 1/3 width on desktop */}
        <div className="relative w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full p-2 pl-10 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>

        {/* 3. Navigation Actions */}
        <div className="flex items-center gap-6">
          
          <Link to="/" className="hover:text-yellow-400 transition font-medium hidden sm:block">
            Home
          </Link>
          
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative flex items-center hover:text-yellow-400 transition group">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-gray-900">
                {cartCount}
              </span>
            )}
            <span className="ml-2 hidden sm:block font-medium group-hover:text-yellow-400">Cart</span>
          </Link>

          {/* User Auth Logic */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300 hidden lg:inline">
                Hi, {user.name?.split(' ')[0]}
              </span>
              <button 
                onClick={logout} 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-bold transition shadow-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login Button */}
              <Link 
                to="/login" 
                className="flex items-center gap-2 hover:text-yellow-400 transition font-medium"
              >
                <FaUser size={14} /> 
                <span>Login</span>
              </Link>
              
              <span className="text-gray-500">|</span>

              {/* ✅ ADDED: Register Button */}
              <Link 
                to="/register" 
                className="bg-yellow-500 text-gray-900 px-4 py-1.5 rounded-full font-bold hover:bg-yellow-400 transition shadow-md text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;