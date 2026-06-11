"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ChevronRight, Heart } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://e-commerce-backend-production-ebd6.up.railway.app/api/v1';

export default function ProductDetailClient({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`)
      .then(r => {
        setProduct(r.data);
        setActiveImage(r.data.main_image_url);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addItem(id, quantity);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    setAdding(true);
    await addItem(id, quantity);
    setAdding(false);
    router.push('/checkout');
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!product) return (
    <div className="text-center py-20 text-gray-500">
      Product not found. <a href="/" className="amazon-link">Go back</a>
    </div>
  );

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const isWished = isWishlisted(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4 flex-wrap">
        <a href="/" className="amazon-link">Home</a>
        <ChevronRight className="w-3 h-3" />
        {product.Category && (
          <>
            <a href={`/?category=${product.Category.name}`} className="amazon-link">{product.Category.name}</a>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-gray-800 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Image Carousel */}
        <div className="md:col-span-5 flex flex-col gap-3">
          {/* Main Active Image */}
          <div className="bg-white p-4 rounded border border-gray-200 flex items-center justify-center relative shadow-sm transition-opacity" style={{ minHeight: 400 }}>
            <img
              src={activeImage || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="max-h-80 w-full object-contain"
            />
          </div>
          
          {/* Thumbnails */}
          {product.image_urls && product.image_urls.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button 
                onClick={() => setActiveImage(product.main_image_url)}
                className={`w-16 h-16 shrink-0 border-2 rounded ${activeImage === product.main_image_url ? 'border-yellow-500 shadow-md' : 'border-gray-200 hover:border-blue-400'}`}
              >
                <img src={product.main_image_url} className="w-full h-full object-contain p-1 bg-white rounded" />
              </button>
              {product.image_urls.map((url, idx) => {
                if (url === product.main_image_url) return null;
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(url)}
                    className={`w-16 h-16 shrink-0 border-2 rounded ${activeImage === url ? 'border-yellow-500 shadow-md' : 'border-gray-200 hover:border-blue-400'}`}
                  >
                    <img src={url} className="w-full h-full object-contain p-1 bg-white rounded" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-5 bg-white p-4 rounded border border-gray-200">
          <h1 className="text-xl font-medium text-gray-900 leading-snug mb-2">{product.name}</h1>

          {product.Category && (
            <p className="text-sm mb-2">
              <span className="text-gray-500">Category: </span>
              <a href={`/?category=${product.Category.name}`} className="amazon-link font-medium">{product.Category.name}</a>
            </p>
          )}

          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
            <StarRating rating={parseFloat(product.rating)} reviewCount={product.review_count} size="md" />
          </div>

          {/* Price */}
          <div className="mb-4">
            {product.original_price && (
              <p className="text-sm text-gray-500">M.R.P.: <span className="line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</span></p>
            )}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-medium" style={{ color: '#B12704' }}>₹{Number(product.price).toLocaleString('en-IN')}</span>
              {discount && <span className="text-green-700 font-medium">Save {discount}%</span>}
            </div>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
            {product.is_prime && (
              <div className="flex items-center gap-1 mt-2">
                <span className="prime-badge text-lg">prime</span>
                <span className="text-sm text-gray-600">FREE Delivery on eligible orders</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">{product.description}</p>

          <p className="text-lg font-medium mb-3" style={{ color: product.stock_quantity > 0 ? '#007600' : '#B12704' }}>
            {product.stock_quantity > 0 ? 'In Stock' : 'Currently unavailable'}
          </p>
        </div>

        {/* Buy box */}
        <div className="md:col-span-2 bg-white p-4 rounded border border-gray-200 self-start">
          <p className="text-xl font-medium text-gray-900 mb-2">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </p>
          {product.is_prime && <p className="prime-badge text-sm mb-2">prime FREE Delivery</p>}
          <p className="text-sm mb-3" style={{ color: '#007600' }}>In Stock</p>

          <div className="mb-3">
            <label className="text-xs text-gray-500">Qty:</label>
            <select
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock_quantity === 0}
            className="btn-amazon-primary mb-2 rounded-full disabled:opacity-60"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={adding || product.stock_quantity === 0}
            className="w-full py-2 rounded-full text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: '#ff9900' }}
          >
            Buy Now
          </button>

          <button
            onClick={() => toggleWishlist(product.id)}
            className="mt-3 w-full flex items-center justify-center gap-1 text-sm py-1 rounded border border-gray-300 hover:bg-gray-50"
          >
            <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            {isWished ? 'Saved to Wishlist' : 'Add to Wish List'}
          </button>
        </div>
      </div>
    </div>
  );
}
