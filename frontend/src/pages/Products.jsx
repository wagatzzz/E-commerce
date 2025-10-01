import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { formatCurrency, debounce } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import Input from '../components/Input';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, sortBy, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(sortBy && { sort: sortBy }),
        ...(minPrice && { minPrice: parseFloat(minPrice) }),
        ...(maxPrice && { maxPrice: parseFloat(maxPrice) }),
      };
      
      const response = await productsAPI.getAll(params);
      console.log('API Response:', response); // Debug log
      console.log('Response data:', response.data); // Debug log
      
      // Check if data is nested (e.g., response.data.products or response.data.data)
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (response.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else {
        console.warn('Unexpected API response structure:', response.data);
        productsData = [];
      }
      
      console.log('Final products data:', productsData); // Debug log
      setProducts(productsData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(productsData.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <Input
                type="text"
                placeholder="Search products..."
                onChange={handleSearchChange}
                className="w-full"
              />
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Sort By</option>
                <option value="name">Name A-Z</option>
                <option value="-name">Name Z-A</option>
                <option value="price">Price Low to High</option>
                <option value="-price">Price High to Low</option>
              </select>
              
              {/* Clear Filters */}
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="0.01"
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner text="Loading products..." />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {Array.isArray(products) ? products.length : 0} {Array.isArray(products) && products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {Array.isArray(products) && products.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden block max-w-[200px]"
                  >
                    {/* Image Container */}
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.image || '/api/placeholder/200/200'}
                        alt={product.title || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {product.title || product.name}
                      </h3>
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
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;