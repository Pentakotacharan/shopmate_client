import { createContext, useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // --- 1. Load Cart Logic (Same as before) ---
  useEffect(() => {
    const cartKey = user ? `cart_${user._id}` : "cart_guest";
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) setCartItems(JSON.parse(savedCart));
    else setCartItems([]);
  }, [user]);

  // --- 2. Save Cart Logic (Same as before) ---
  useEffect(() => {
    const cartKey = user ? `cart_${user._id}` : "cart_guest";
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, user]);


  // --- 3. CART FUNCTIONS ---

  // Standard Add (Initial add or increase)
  const addToCart = (product) => {
    const exist = cartItems.find((x) => x._id === product._id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  // ✅ NEW: Decrease Quantity
  const decreaseQty = (id) => {
    const exist = cartItems.find((x) => x._id === id);
    if (exist) {
      if (exist.qty === 1) {
        // If qty is 1, remove the item completely
        setCartItems(cartItems.filter((x) => x._id !== id));
      } else {
        // If qty > 1, just decrease by 1
        setCartItems(
          cartItems.map((x) =>
            x._id === id ? { ...exist, qty: exist.qty - 1 } : x
          )
        );
      }
    }
  };

  // Remove Item Completely (Trash button)
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart,      // Use this for "+" button
      decreaseQty,    // Use this for "-" button
      removeFromCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;