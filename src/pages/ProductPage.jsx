import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https:/shopmate-server.vercel.app/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, Number(qty));
    toast.success(`${product.name} added to cart!`);
    navigate('/cart');
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center mt-10">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <button onClick={() => navigate(-1)} className="mb-4 text-gray-600 hover:text-black">
        &larr; Go Back
      </button>
      
      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded-lg" />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500 uppercase tracking-wide text-sm">{product.brand}</p>
          <div className="border-t border-b py-4">
             <span className="text-4xl font-bold text-gray-900">${product.price}</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Stock & Cart Actions */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Status:</span>
              <span className={product.countInStock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Quantity:</span>
                <select 
                  value={qty} 
                  onChange={(e) => setQty(e.target.value)}
                  className="border border-gray-300 rounded p-2 focus:outline-blue-500"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className={`w-full py-3 px-6 rounded text-white font-bold transition ${
                product.countInStock === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add To Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;