// src/pages/CheckoutPage.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Info, Truck, Shield } from 'lucide-react';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';

function CheckoutPage({ cart, updateQuantity, removeFromCart, clearCart }) {
  const isCartEmpty = cart.length === 0;
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">Checkout</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {isCartEmpty ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to continue with checkout.</p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart and Order Summary (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back to shopping link */}
              <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Continue Shopping
              </Link>
              
              {/* Cart Items */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold">Shopping Cart</h2>
                </div>
                <div className="p-6">
                  <Cart 
                    cart={cart} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                </div>
              </div>
              
              {/* Benefits */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-medium mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  Why Shop With Us
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Free delivery on orders above ₹499</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span>100% fresh or refund guarantee on all orders</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Checkout Form (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <Checkout cart={cart} clearCart={clearCart} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;