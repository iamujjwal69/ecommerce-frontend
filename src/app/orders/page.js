"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Package, ChevronRight, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://e-commerce-backend-production-ebd6.up.railway.app/api/v1';

export default function Orders() {
  const { token } = useCart();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return setLoading(false);
    axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <h1 className="text-2xl font-medium text-gray-900 mb-4">Your Orders</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#f3a847' }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-10 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-4">You haven't placed any orders yet. Start shopping!</p>
          <a href="/" className="btn-amazon px-6 py-2 inline-block rounded-full">Start Shopping</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded overflow-hidden">
              {/* Order header */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Order placed</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Total</p>
                  <p className="font-medium">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Ship to</p>
                  <p className="font-medium amazon-link cursor-pointer line-clamp-1">{user ? `${user.first_name} ${user.last_name}` : 'Registered User'}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Order #</p>
                  <p className="font-mono text-xs">{order.id}</p>
                </div>
              </div>

              {/* Order items */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: '#007600' }}>
                    {(order.order_status || order.status || 'pending').charAt(0).toUpperCase() + (order.order_status || order.status || 'pending').slice(1)}
                  </span>
                  <span className="text-sm text-gray-600">Arriving in 2–5 business days</span>
                </div>
                <div className="space-y-4">
                  {(order.items || order.OrderItems || []).map(item => (
                    <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-20 h-20 border border-gray-100 rounded shrink-0 bg-white">
                        <img 
                          src={item.Product?.main_image_url || 'https://via.placeholder.com/60'} 
                          alt={item.Product?.name} 
                          className="w-full h-full object-contain p-1" 
                        />
                      </div>
                      <div className="flex-1">
                        <a href={`/product/${item.product_id}`} className="text-sm font-medium text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2">
                          {item.Product?.name || 'Product Details Unavailable'}
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                          Quantity: <span className="font-bold text-gray-700">{item.quantity}</span>
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          ₹{Number(item.price_at_time || item.Product?.price || 0).toLocaleString('en-IN')}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button className="btn-amazon text-xs py-1 px-3">Buy it again</button>
                          <button className="btn-amazon text-xs py-1 px-3">View your item</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
