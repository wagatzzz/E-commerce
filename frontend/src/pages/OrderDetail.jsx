import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(id);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', completed: true },
      { key: 'processing', label: 'Processing', completed: false },
      { key: 'shipped', label: 'Shipped', completed: false },
      { key: 'delivered', label: 'Delivered', completed: false },
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Button onClick={fetchOrder}>Try Again</Button>
            <Button variant="secondary" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/orders" className="text-gray-400 hover:text-gray-500">
                Orders
              </Link>
            </li>
            <li>
              <svg
                className="w-5 h-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <span className="text-gray-500">
                Order #{order._id.slice(-8).toUpperCase()}
              </span>
            </li>
          </ol>
        </nav>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex space-x-4">
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusColor(
                order.paymentStatus
              )}`}
            >
              Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Tracking */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {trackingSteps.map((step, stepIdx) => (
                  <li key={step.key}>
                    <div className="relative pb-8">
                      {stepIdx !== trackingSteps.length - 1 ? (
                        <span
                          className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              step.completed
                                ? 'bg-green-500'
                                : step.current
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                          >
                            {step.completed ? (
                              <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span className="text-white text-sm font-medium">
                                {stepIdx + 1}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p
                            className={`text-sm font-medium ${
                              step.completed || step.current
                                ? 'text-gray-900'
                                : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {item.productId?.name || 'Product'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {item.productId?.description || 'No description available'}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </span>
                      <span className="text-sm text-gray-600">
                        Price: {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {order.totalAmount > order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                    ? formatCurrency(order.totalAmount - order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
                    : 'Free'}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                <p>Email: {order.shippingAddress.email}</p>
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-medium text-gray-900">Method:</span>{' '}
                {order.paymentMethod === 'pesapal' ? 'Pesapal Payment' : 'Cash on Delivery'}
              </p>
              <p>
                <span className="font-medium text-gray-900">Status:</span>{' '}
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </p>
              {order.paymentId && (
                <p>
                  <span className="font-medium text-gray-900">Transaction ID:</span>{' '}
                  {order.paymentId}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-3">
              {order.status === 'delivered' && (
                <Button className="w-full">
                  Reorder Items
                </Button>
              )}
              {order.status === 'pending' && (
                <Button variant="secondary" className="w-full">
                  Cancel Order
                </Button>
              )}
              <Link to="/orders" className="block">
                <Button variant="secondary" className="w-full">
                  Back to Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;