// src/components/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { CreditCard, MapPin, User, Phone, Send, Check, AlertTriangle } from 'lucide-react';

function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});
  const [productImages, setProductImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch product images when cart changes
  useEffect(() => {
    const fetchProductImages = async () => {
      const imagesObj = {};
      
      for (const item of cart) {
        if (!item.name) continue;
        
        try {
          // Normalize product name to match storage naming convention
          const productNameNormalized = item.name
            .toLowerCase()
            .replace(/\.(jpg|jpeg|png)$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          // Get image from Supabase storage
          const { data } = supabase.storage.from("images").getPublicUrl(productNameNormalized);
          
          if (data?.publicUrl) {
            imagesObj[item.id] = data.publicUrl;
          }
        } catch (error) {
          console.error(`Error fetching image for ${item.name}:`, error);
        }
      }
      
      setProductImages(imagesObj);
    };
    
    fetchProductImages();
  }, [cart]);
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.final_price * item.quantity), 0);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    const total = calculateTotal();
    return subtotal - total;
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const sendToWhatsApp = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Format the cart items for WhatsApp message
    const cartItems = cart.map(item => 
      `${item.name} (${item.quantity} x ₹${item.final_price}) = ₹${(item.quantity * item.final_price).toFixed(2)}`
    ).join('\n');
    
    const total = calculateTotal().toFixed(2);
    
    // Create the WhatsApp message
    const message = `
*New Order*
*Name:* ${name}
*Phone:* ${phone}
*Address:* ${address}

*Order Details:*
${cartItems}

*Total Amount:* ₹${total}
`;
    
    // Replace this with your WhatsApp number
    const whatsappNumber = '919542078141'; // Format: country code + number without +
    
    // Create WhatsApp URL with the message
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Clear the cart and navigate back to home
    clearCart();
    navigate('/');
  };
  
  const hasDiscount = calculateDiscount() > 0;
  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const discount = calculateDiscount();
  const deliveryFee = total < 499 ? 40 : 0;
  const finalTotal = total + deliveryFee;
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Customer Information</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'} transition-colors`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              {errors.name}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'} transition-colors`}
            placeholder="10-digit mobile number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              {errors.phone}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="address" className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            Delivery Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
            className={`w-full px-4 py-2.5 border rounded-lg ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'} transition-colors`}
            placeholder="Enter your complete delivery address"
          ></textarea>
          {errors.address && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              {errors.address}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            {hasDiscount && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Discount
                </span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              {deliveryFee > 0 ? (
                <span>₹{deliveryFee.toFixed(2)}</span>
              ) : (
                <span className="text-green-600">FREE</span>
              )}
            </div>
            
            {deliveryFee > 0 && (
              <div className="text-xs text-gray-500 pl-4">
                Free delivery on orders above ₹499
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={sendToWhatsApp}
        disabled={isSubmitting}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-md"
      >
        <Send className="h-5 w-5 mr-2" />
        {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
      </button>
      
      <div className="text-center text-xs text-gray-500 mt-4">
        By placing this order, you agree to the terms and conditions.
      </div>
    </div>
  );
}

export default Checkout;