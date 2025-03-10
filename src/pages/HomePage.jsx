import { useState, useEffect, useRef } from 'react';
import ProductList from '../components/ProductList';
import { ChevronRight } from 'lucide-react';

function HomePage({ addToCart }) {
  const [categories, setCategories] = useState([
    'All Products', 'Vegetables', 'Meat', 'Groceries', 'Fruits', 'Dairy', 'Bakery', 'Beverages'
  ]);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const productListRef = useRef(null);
  
  // Featured items section would typically fetch from API
  const featuredItems = [
    { id: 1, title: "Free Delivery", description: "On orders above ₹499", icon: "🚚" },
    { id: 2, title: "Fresh Guarantee", description: "100% fresh or refund", icon: "🥦" },
    { id: 3, title: "Fast Delivery", description: "Within 30 minutes", icon: "⏱️" },
    { id: 4, title: "24/7 Support", description: "Always here to help", icon: "📞" }
  ];

  // Smooth scroll function for "Shop Now" button
  const scrollToProducts = () => {
    productListRef.current?.scrollIntoView({ 
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-green-400 text-white py-16">
        <div className="container mx-auto px-4 flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Fresh Groceries Delivered to Your Door</h1>
            <p className="text-xl mb-8 opacity-90">Get fresh, high-quality groceries delivered in under 2 hours.</p>
            <button 
              onClick={scrollToProducts} 
              className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
            >
              Shop Now
            </button>
          </div>
          <div className="hidden md:block ml-auto">
            <img src="../.././doordelv2.jpeg" alt="Delivery person" className="h-64 rounded-lg shadow-lg" />
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="hidden md:block absolute right-10 bottom-0 w-64 h-64 bg-white opacity-10 rounded-full transform -translate-y-1/3"></div>
        <div className="hidden md:block absolute right-40 top-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      </div>

      {/* Featured Items */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Service Highlight */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img src="../.././doordelv.jpeg" alt="Delivery Service" className="rounded-lg shadow-lg max-w-full mx-auto" />
            </div>
            <div className="md:w-1/2 md:pl-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Door Delv Delivery Service</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-500 text-white p-2 rounded-full mr-4">✓</div>
                  <p className="text-lg">Fast delivery within 30 minutes</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 text-white p-2 rounded-full mr-4">✓</div>
                  <p className="text-lg">100% fresh produce guarantee</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 text-white p-2 rounded-full mr-4">✓</div>
                  <p className="text-lg">Contactless delivery options</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 text-white p-2 rounded-full mr-4">✓</div>
                  <p className="text-lg">Real-time order tracking</p>
                </div>
              </div>
              <button 
                onClick={scrollToProducts} 
                className="mt-8 bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-full transition-colors"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="container mx-auto px-4 mb-8 pt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Our Products</h2>
          <a href="#pro" className="text-blue-600 hover:text-blue-700 flex items-center font-medium">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        
        <div className="flex overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-6 py-3 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  activeCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div id='pro' ref={productListRef} className="container mx-auto px-4 pb-16">
        <ProductList addToCart={addToCart} category={activeCategory} />
      </div>
      
      {/* Newsletter */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get 10% off your first order</h2>
            <p className="text-blue-100 mb-6">Sign up for our newsletter and receive exclusive offers and updates.</p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 rounded-full flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-full transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default HomePage;