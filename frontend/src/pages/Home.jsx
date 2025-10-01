import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 8 });
      console.log('Home API Response:', response); // Debug log
      console.log('Home Response data:', response.data); // Debug log
      
      // Check if data is nested (e.g., response.data.products or response.data.data)
      let products = [];
      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        products = response.data.products;
      } else if (response.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        products = [];
      }
      
      console.log('Final featured products:', products); // Debug log
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setFeaturedProducts([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to Our Store
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover amazing products at unbeatable prices. Quality you can trust, 
              service you can count on.
            </p>
            <Link to="/products" className="btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Products
        </h2>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.isArray(featuredProducts) && featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden block max-w-[200px]"
              >
                {/* Image Container */}
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image || '/api/placeholder/200/200'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                {/* Product Info */}
                <div className="p-2">
                  <h3 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    {product.inventory > 0 ? (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    ) : (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 truncate block">
                    {product.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && Array.isArray(featuredProducts) && featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products available at the moment.</p>
            <p className="text-sm text-gray-500">Check back later for new arrivals!</p>
          </div>
        )}

        {Array.isArray(featuredProducts) && featuredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/products" className="btn-secondary">
              View All Products
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 text-white">📦</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50. Fast delivery nationwide.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 text-white">🔒</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is always safe and secure.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 text-white">✓</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">30-day return policy. Quality products you can trust.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;