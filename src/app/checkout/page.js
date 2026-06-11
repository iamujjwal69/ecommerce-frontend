"use client"
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { CheckCircle2, ShieldCheck, MapPin, CreditCard } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://e-commerce-backend-production-ebd6.up.railway.app/api/v1';

export default function Checkout() {
  const { cart, token, loadCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('123, MG Road, Bengaluru, Karnataka — 560001');
  const [email, setEmail] = useState(user ? user.email : '');
  const [isPlacing, setIsPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [localCart, setLocalCart] = useState(null); // snapshot for success screen

  useEffect(() => {
    if (user?.email) {
      setEmail(prev => prev || user.email);
    }
  }, [user]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isPlacing || success) return;
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address for order updates.');
      return;
    }
    if (!address.trim()) {
      alert('Please enter a valid shipping address.');
      return;
    }
    setIsPlacing(true);
    try {
      // Snapshot cart before it clears
      const cartSnapshot = cart;
      const res = await axios.post(`${API_URL}/orders`, {
        shipping_address: address,
        payment_method: 'card',
        email: email
      }, { headers: { Authorization: `Bearer ${token}` } });

      setOrderId(res.data?.order?.id || res.data?.order_id || ('ORD' + Date.now()));
      setLocalCart(cartSnapshot);
      // Refresh cart from backend so it shows empty
      await loadCart();
      setSuccess(true);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || 'Unknown error';
      alert('Failed to place order: ' + msg);
    } finally {
      setIsPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded p-8 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-2">Thank you for shopping with Amazon.in</p>
          <p className="text-sm text-gray-400 mb-6">
            Order ID: <span className="font-mono font-bold text-gray-700">#{orderId}</span>
          </p>
          <div className="flex gap-3 justify-center">
            <a href="/orders" className="btn-amazon px-6 py-2 inline-block rounded-full">View Orders</a>
            <a href="/" className="btn-amazon px-6 py-2 inline-block rounded-full">Continue Shopping</a>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <a href="/" className="btn-amazon px-6 py-2 inline-block rounded-full">Browse Products</a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-medium text-gray-900 mb-4 pb-3 border-b border-gray-300">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left */}
        <div className="lg:col-span-2 space-y-4">
          {/* Address and Contact */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">1</span>
              <h3 className="font-bold text-gray-800 flex items-center gap-1"><MapPin className="w-4 h-4" /> Shipping Address & Contact</h3>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email for Order Updates</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={3}
                required
                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Delivering to: <span className="font-medium text-gray-700">{user ? `${user.first_name} ${user.last_name}` : 'Guest User (Sign in to add address)'}</span></p>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">2</span>
              <h3 className="font-bold text-gray-800 flex items-center gap-1"><CreditCard className="w-4 h-4" /> Payment Method</h3>
            </div>
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded bg-yellow-50">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">Demo Mode — No real payment required</p>
                <p className="text-xs text-gray-500">UPI / Card / Net Banking / EMI (simulated)</p>
              </div>
            </div>
          </div>

          {/* Items review */}
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">3</span>
              <h3 className="font-bold text-gray-800">Review Items and Delivery</h3>
            </div>
            <div className="space-y-3">
              {cart.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.main_image_url || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-14 h-14 object-contain border border-gray-100 rounded bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-xs font-medium text-green-700">In Stock · FREE Delivery</p>
                  </div>
                  <p className="text-sm font-bold shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded p-4 sticky top-20">
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing || success}
              className="btn-amazon-primary rounded-full mb-4 disabled:opacity-60"
              style={{ fontSize: 16, padding: '12px' }}
            >
              {isPlacing ? '⏳ Processing...' : 'Place your order'}
            </button>

            <p className="text-xs text-gray-500 mb-3">
              By placing your order, you agree to Amazon's privacy notice and conditions of use.
            </p>
            <div className="border-t border-gray-200 pt-3">
              <h4 className="font-bold text-sm text-gray-800 mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items ({cart.items.reduce((a, b) => a + b.quantity, 0)}):</span>
                  <span>₹{Number(cart.total).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="text-green-700 font-medium">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-gray-200 mt-2">
                  <span>Order Total:</span>
                  <span>₹{Number(cart.total).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
