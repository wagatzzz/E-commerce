import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/Button';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('pesapal');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const shippingCost = total >= 50 ? 0 : 5.99;
  const finalTotal = total + shippingCost;

  const handleShippingSubmit = (data) => {
    setShippingInfo(data);
    setStep(2);
  };

  const handlePaymentSubmit = () => {
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Use checkout endpoint which handles cart-based orders
      const checkoutResponse = await api.post('/checkout', {
        shippingAddress: shippingInfo,
        paymentMethod,
      });

      if (checkoutResponse.data.redirect_url) {
        // Redirect to Pesapal payment page
        window.location.href = checkoutResponse.data.redirect_url;
      } else {
        // For cash on delivery or other payment methods
        await clearCart();
        navigate(`/orders/${checkoutResponse.data.order._id}?success=true`);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= stepNumber
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step > stepNumber ? 'bg-black' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Shipping</span>
            <span className="text-sm text-gray-600">Payment</span>
            <span className="text-sm text-gray-600">Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg p-6">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Shipping Information
                </h2>
                <form onSubmit={handleSubmit(handleShippingSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="Full Name"
                      required
                      {...register('fullName', {
                        required: 'Full name is required',
                      })}
                      error={errors.fullName?.message}
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      required
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      error={errors.email?.message}
                    />
                    
                    <Input
                      label="Phone Number"
                      required
                      {...register('phone', {
                        required: 'Phone number is required',
                      })}
                      error={errors.phone?.message}
                    />
                    
                    <Input
                      label="Address"
                      required
                      {...register('address', {
                        required: 'Address is required',
                      })}
                      error={errors.address?.message}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        required
                        {...register('city', {
                          required: 'City is required',
                        })}
                        error={errors.city?.message}
                      />
                      
                      <Input
                        label="Postal Code"
                        required
                        {...register('postalCode', {
                          required: 'Postal code is required',
                        })}
                        error={errors.postalCode?.message}
                      />
                    </div>
                    
                    <Input
                      label="Country"
                      required
                      {...register('country', {
                        required: 'Country is required',
                      })}
                      error={errors.country?.message}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Continue to Payment</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pesapal"
                        checked={paymentMethod === 'pesapal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Pesapal Payment</div>
                        <div className="text-sm text-gray-600">
                          Pay securely with credit card, mobile money, or bank transfer
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">
                          Pay when you receive your order
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between pt-6">
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    Back to Shipping
                  </Button>
                  <Button onClick={handlePaymentSubmit}>Continue to Review</Button>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Review Your Order
                </h2>
                
                {/* Shipping Details */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                    <p>{shippingInfo.country}</p>
                    <p>Phone: {shippingInfo.phone}</p>
                    <p>Email: {shippingInfo.email}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      {paymentMethod === 'pesapal' 
                        ? 'Pesapal Payment' 
                        : 'Cash on Delivery'
                      }
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="border rounded-lg divide-y">
                    {items.map((item) => (
                      <div key={item.product._id} className="p-4 flex justify-between">
                        <div>
                          <p className="font-medium">{item.product.title || item.product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping:</span>
                    <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="secondary" onClick={() => setStep(2)}>
                    Back to Payment
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    loading={loading}
                    disabled={loading}
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items ({itemCount}):</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;