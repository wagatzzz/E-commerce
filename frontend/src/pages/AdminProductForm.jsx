import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import Input from '../components/Input';

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (isEdit) {
      fetchProduct();
    }
  }, [user, navigate, isEdit, id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      const product = response.data;
      
      // Populate form with existing product data
      setValue('name', product.title || product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('category', product.category);
      setValue('stock', product.inventory);
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);

      const productData = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        inventory: parseInt(data.stock),
      };

      if (isEdit) {
        await productsAPI.update(id, productData);
      } else {
        await productsAPI.create(productData);
      }

      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
      setError(err.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && isEdit) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Button onClick={fetchProduct}>Try Again</Button>
            <Button variant="secondary" onClick={() => navigate('/admin/products')}>
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-400 hover:text-gray-500"
              >
                Dashboard
              </button>
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
              <button
                onClick={() => navigate('/admin/products')}
                className="text-gray-400 hover:text-gray-500"
              >
                Products
              </button>
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
                {isEdit ? 'Edit Product' : 'Add Product'}
              </span>
            </li>
          </ol>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit 
            ? 'Update the product information below.'
            : 'Fill in the product details to add it to your catalog.'
          }
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Product Name"
            required
            {...register('name', {
              required: 'Product name is required',
              minLength: {
                value: 2,
                message: 'Product name must be at least 2 characters',
              },
            })}
            error={errors.name?.message}
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', {
                required: 'Product description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter product description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price"
              type="number"
              step="0.01"
              min="0"
              required
              {...register('price', {
                required: 'Price is required',
                min: {
                  value: 0.01,
                  message: 'Price must be greater than 0',
                },
              })}
              error={errors.price?.message}
            />

            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              required
              {...register('stock', {
                required: 'Stock quantity is required',
                min: {
                  value: 0,
                  message: 'Stock cannot be negative',
                },
              })}
              error={errors.stock?.message}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              {...register('category', {
                required: 'Category is required',
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Toys & Games">Toys & Games</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Automotive">Automotive</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/products')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting}
            >
              {isEdit ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;