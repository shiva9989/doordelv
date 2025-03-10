// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { ShoppingCart, Filter, RefreshCw, AlertCircle, Search, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';

function ProductList({ addToCart, category = 'All Products' }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [viewType, setViewType] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Function to get placeholder image based on category
  const getProductImage = (product) => {
    const category = product.category?.toLowerCase() || '';
    
    // Return appropriate placeholder image based on category
    if (category === 'vegetables') return "/api/placeholder/400/320";
    if (category === 'fruits') return "/api/placeholder/400/320";
    if (category === 'meat') return "/api/placeholder/400/320";
    if (category === 'dairy') return "/api/placeholder/400/320";
    if (category === 'bakery') return "/api/placeholder/400/320";
    if (category === 'groceries') return "/api/placeholder/400/320";
    
    // Default placeholder
    return "/api/placeholder/400/320";
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from('Products').select('*');
        
        // Apply category filter if not showing all products
        if (category !== 'All Products') {
          query = query.eq('category', category.toLowerCase());
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category]);

  // Apply filtering and sorting whenever dependencies change
  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter(product => 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Sort products based on selected option
    let sorted = [...filtered];
    if (sortBy === 'name') {
      sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'price-low') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    setFilteredProducts(sorted);
  }, [products, searchQuery, sortBy]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading products...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <p className="text-lg text-red-500 font-medium mb-2">Oops! Something went wrong</p>
        <p className="text-gray-600 max-w-md">{error}</p>
      </div>
    );
  }
  
  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-8 text-center">
        <img src="/api/placeholder/200/120" alt="No products" className="mb-4 opacity-60" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500 mb-4">We couldn't find any products matching your criteria.</p>
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with category title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">{category}</h2>
      </div>
      
      {/* Filter, Sort and Search Controls */}
      <div className="bg-white rounded-lg p-4 mb-2 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Products count */}
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">{filteredProducts.length} Products</span>
              {category !== 'All Products' && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {category}
                </span>
              )}
            </div>
            
            {/* View toggle */}
            <div className="bg-gray-100 rounded-lg p-1 hidden md:flex">
              <button 
                className={`p-1 rounded ${viewType === 'grid' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setViewType('grid')}
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                className={`p-1 rounded ${viewType === 'list' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setViewType('list')}
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Sort dropdown */}
            <div className="relative min-w-40">
              <select 
                className="block w-full bg-gray-100 border-0 text-gray-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name: A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Filter button (mobile only) */}
            <button 
              onClick={toggleFilter}
              className="md:hidden flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        {/* Mobile filters panel (expandable) */}
        {isFilterOpen && (
          <div className="mt-4 p-4 border-t border-gray-200 md:hidden">
            <h3 className="font-medium text-gray-900 mb-2">View</h3>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mobile-view"
                  checked={viewType === 'grid'}
                  onChange={() => setViewType('grid')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Grid</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="mobile-view"
                  checked={viewType === 'list'}
                  onChange={() => setViewType('list')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">List</span>
              </label>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">Sort by</h3>
            <div className="space-y-2">
              {['name', 'price-low', 'price-high'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="mobile-sort"
                    value={option}
                    checked={sortBy === option}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    {option === 'name' ? 'Name: A-Z' : 
                    option === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Products Grid View */}
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        /* Products List View - Using ProductCard with a custom wrapper */
        <div className="flex flex-col gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="list-view-card">
              {/* Use the same ProductCard component but style it for list view with a wrapping div */}
              <div className="flex bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="w-32 sm:w-48 flex-shrink-0">
                  {/* This is just a container - the ProductCard handles actual image loading */}
                  <ProductCard 
                    product={product}
                    addToCart={addToCart}
                    isListView={true} // Pass a prop to indicate this is being used in list view
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">{product.category}</div>
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {/* <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <Star className="h-4 w-4 text-gray-300" /> */}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">(4.0)</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-gray-800">₹{product.final_price}</span>
                      {product.price > product.final_price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
                      )}
                      <span className="ml-2 text-sm text-gray-600">/{product.unit}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;