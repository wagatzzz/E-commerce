import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Modal from '../components/Modal';

const Cart = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, removeFromCart, clearCart, isLoading } = useCart();
  const [removingItem, setRemovingItem] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Debug log to see cart items structure
  console.log('Cart items:', items);
  console.log('Cart total:', total);

  const handleRemoveItem = async (productId) => {
    setRemovingItem(productId);
    const result = await removeFromCart(productId);
    
    if (!result.success) {
      alert(result.error || 'Failed to remove item');
    }
    
    setRemovingItem(null);
  };

  const handleClearCart = async () => {
    setClearing(true);
    const result = await clearCart();
    
    if (result.success) {
      setShowClearModal(false);
    } else {
      alert(result.error || 'Failed to clear cart');
    }
    
    setClearing(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading cart..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {items.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="btn-ghost text-red-600 hover:bg-red-50"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart Items ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  // Get data from the populated product field
                  const product = item.product;
                  const itemPrice = product?.price || 0;
                  const itemName = product?.title || product?.name || 'Product';
                  const itemImage = product?.image;
                  const itemCategory = product?.category;
                  
                  return (
                    <div key={item._id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={itemImage || '/api/placeholder/100/100'}
                          alt={itemName}
                          className="w-16 h-16 object-cover rounded-md bg-gray-200"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              <Link
                                to={`/products/${product?._id}`}
                                className="hover:text-gray-600"
                              >
                                {itemName}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {itemCategory && `Category: ${itemCategory}`}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(itemPrice * item.quantity)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCurrency(itemPrice)} each
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Remove */}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(product?._id)}
                            disabled={removingItem === product?._id}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            {removingItem === product?._id ? (
                              <span className="flex items-center">
                                <div className="spinner w-4 h-4 mr-2"></div>
                                Removing...
                              </span>
                            ) : (
                              'Remove'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {total >= 50 ? 'Free' : formatCurrency(5.99)}
                  </span>
                </div>
                
                {total < 50 && (
                  <p className="text-sm text-gray-500">
                    Add {formatCurrency(50 - total)} more for free shipping
                  </p>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(total + (total >= 50 ? 0 : 5.99))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button onClick={handleCheckout} className="w-full">
                  Proceed to Checkout
                </Button>
                
                <Link to="/products" className="btn-secondary w-full text-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Clear Cart Modal */}
        <Modal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          title="Clear Cart"
        >
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-center">
              <Button
                variant="secondary"
                onClick={() => setShowClearModal(false)}
                disabled={clearing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearCart}
                loading={clearing}
                disabled={clearing}
                className="bg-red-600 hover:bg-red-700"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Cart;