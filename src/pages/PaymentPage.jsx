import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { load } from '@cashfreepayments/cashfree-js';

// Context
import CartContext from '../context/CartContext';

// --- HELPER FUNCTIONS ---

// Function to load external scripts dynamically (Used for Razorpay)
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// --- SUB-COMPONENTS ---

const StripeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Stripe Payment Success!");
      // Handle post-payment logic here (e.g., clear cart, redirect)
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button 
        disabled={loading || !stripe || !elements} 
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : "Pay via Stripe"}
      </button>
    </form>
  );
};

// --- MAIN COMPONENT ---

const PaymentPage = () => {
  const { cartItems } = useContext(CartContext);
  const [method, setMethod] = useState('stripe'); // 'stripe', 'razorpay', 'cashfree'

  // --- CALCULATIONS ---
  // Ensure cartItems exists to prevent crash
  const safeCartItems = cartItems || [];
  const totalAmount = safeCartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  // Currency Conversions (Hardcoded for demo, ideally fetch from API)
  const amountInCents = Math.round(totalAmount * 100); // For Stripe (USD)
  const amountInINR = Math.round(totalAmount * 83);    // For Razorpay/Cashfree (INR)

  // --- STATE ---
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState("");
  const [cashfree, setCashfree] = useState(null);

  // --- INITIALIZATION EFFECTS ---
  
  useEffect(() => {
    // 1. Load Stripe Public Key
    axios.get("/api/payment/config/stripe")
      .then((r) => setStripePromise(loadStripe(r.data.publishableKey)))
      .catch((err) => console.error("Failed to load Stripe key", err));

    // 2. Load Cashfree SDK
    load({ mode: "sandbox" }) // Change to "production" when live
      .then((sdk) => setCashfree(sdk))
      .catch((err) => console.error("Failed to load Cashfree SDK", err));
  }, []);

  // Effect to load Stripe Payment Intent when method is Stripe
  useEffect(() => {
    if (method === 'stripe' && totalAmount > 0) {
      const createStripeIntent = async () => {
        try {
          const { data } = await axios.post("/api/payment/create-payment-intent", { amount: amountInCents });
          setStripeClientSecret(data.clientSecret);
        } catch (error) {
          console.error("Stripe Intent Error:", error);
          toast.error("Failed to initialize Stripe payment");
        }
      };
      createStripeIntent();
    }
  }, [method, totalAmount, amountInCents]);

  // --- HANDLERS ---

  // 1. Razorpay Handler
  const handleRazorpayPayment = async () => {
    // A. Load Script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // B. Create Order on Backend
    try {
      const { data } = await axios.post("/api/payment/razorpay-order", { 
        amount: amountInINR // Razorpay takes amount in paise
      });

      const options = {
        key: data.keyId, 
        amount: data.amount,
        currency: data.currency,
         order_id: data.id,
         remember_customer: false, 
         send_sms_hash: false,
         name: "ShopMate",
        description: "Transaction",
       
       
        handler: function (response) {
          toast.success(`Payment ID: ${response.razorpay_payment_id}`);
          // Add your success redirect logic here
        },
        prefill: {
          name: "User Name", // Dynamic data recommended here
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // C. Open Razorpay
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
    console.error("Code:", response.error.code);
    console.error("Description:", response.error.description);
    console.error("Source:", response.error.source);
    console.error("Step:", response.error.step);
    console.error("Reason:", response.error.reason);
    alert("Error: " + response.error.description);
});
      rzp1.open();
      
    } catch (error) {
      console.error("Razorpay Error:", error);
      toast.error("Something went wrong with Razorpay.");
    }
  };

  // 2. Cashfree Handler
  const handleCashfreePayment = async () => {
    if (!cashfree) return toast.error("Cashfree SDK failed to load");

    try {
      const { data } = await axios.post("/api/payment/cashfree-order", { 
        amount: amountInINR,
        customerId: "user_123", // Replace with actual User ID
      });

      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self", // "_self" or "_modal"
      });
    } catch (error) {
      console.error("Cashfree Error:", error);
      toast.error("Failed to initiate Cashfree payment");
    }
  };

  // --- RENDER ---

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Payment Method</h2>
      <p className="text-center mb-6 text-gray-500 font-medium">
        Total: ${totalAmount} <span className="text-xs text-gray-400">(~₹{amountInINR})</span>
      </p>

      {/* SELECTION TABS */}
      <div className="flex gap-2 mb-6">
        {['stripe', 'razorpay', 'cashfree'].map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 py-2 capitalize border rounded text-sm font-semibold transition-colors ${
              method === m 
                ? 'bg-gray-800 text-white border-gray-800' 
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[200px] flex flex-col justify-center">
        
        {/* STRIPE RENDER */}
        {method === 'stripe' && (
          stripePromise && stripeClientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
              <StripeForm />
            </Elements>
          ) : (
             <div className="text-center text-gray-400">Loading Stripe...</div>
          )
        )}

        {/* RAZORPAY RENDER */}
        {method === 'razorpay' && (
          <div className="text-center">
            <p className="mb-4 text-sm text-gray-600">
              Pay securely using UPI, Cards, or Netbanking.
            </p>
            <button 
              onClick={handleRazorpayPayment}
              className="w-full bg-[#3399cc] text-white py-3 rounded font-bold hover:bg-[#2b82ad] transition"
            >
              Pay ₹{amountInINR} with Razorpay
            </button>
          </div>
        )}

        {/* CASHFREE RENDER */}
        {method === 'cashfree' && (
          <div className="text-center">
            <p className="mb-4 text-sm text-gray-600">
              Fast and secure payments via Cashfree.
            </p>
            <button 
              onClick={handleCashfreePayment}
              className="w-full bg-orange-500 text-white py-3 rounded font-bold hover:bg-orange-600 transition"
            >
              Pay ₹{amountInINR} with Cashfree
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;