import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state handling

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  useEffect(() => {
    console.log("hi");
    const fetchProducts = async () => {
      try {
        console.log("hello");
        console.log("Fetching from:", `${API_URL}/api/products`);
        const {data} = await axios.get(`${API_URL}/api/products`);
        console.log("hii");
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* --- HERO SECTION (RESPONSIVE) --- */}
      {/* bg-gray-900 on mobile, large text centering */}
      <div className="bg-gray-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Welcome to <span className="text-yellow-500">ShopMate</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the latest electronics, gadgets, and accessories at unbeatable prices.
          </p>
          <a href="#products" className="bg-yellow-500 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition transform hover:scale-105 inline-block">
            Shop Now
          </a>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div id="products" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Latest Products</h2>

        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center text-xl mt-10">
            {error}
          </div>
        ) : (
          /* RESPONSIVE GRID CONFIGURATION */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default HomePage;