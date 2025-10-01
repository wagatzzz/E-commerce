import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Input from '../components/Input';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);
    
    if (result.success) {
      // Show success message or redirect
      alert('Product added to cart!');
    } else {
      alert(result.error || 'Failed to add to cart');
    }
    
    setAddingToCart(false);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.inventory) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700"
              >
                Home
              </button>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <button
                onClick={() => navigate('/products')}
                className="text-gray-500 hover:text-gray-700"
              >
                Products
              </button>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <span className="text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-6">
            <img
              src={product.image || '/api/placeholder/500/500'}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg bg-gray-200"
            />
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                Category: {product.category}
              </p>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {formatCurrency(product.price)}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inventory > 0 ? (
                <div className="flex items-center">
                  <span className="badge bg-gray-100 text-gray-800 mr-3">
                    ✓ In Stock ({product.inventory} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="badge bg-red-50 text-red-700">
                    ✗ Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Add to Cart Section */}
            {product.inventory > 0 && (
              <div className="border-t pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max={product.inventory}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    loading={addingToCart}
                    disabled={addingToCart}
                    className="flex-grow"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/products')}
                  >
                    Continue Shopping
                  </Button>
                </div>

                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 mt-3">
                    <button
                      onClick={() => navigate('/login')}
                      className="text-black hover:underline"
                    >
                      Sign in
                    </button>
                    {' '}to add items to your cart
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;