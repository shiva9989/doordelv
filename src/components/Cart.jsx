import { useState, useEffect } from "react";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { supabase } from "../utils/supabaseClient";

function Cart({ cart, updateQuantity, removeFromCart }) {
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchImageUrls = async () => {
      const urls = {};

      for (const item of cart) {
        try {
          if (!item.name) continue;

          // Normalize product name
          const productNameNormalized = item.name
            .toLowerCase()
            .replace(/\.(jpg|jpeg|png)$/i, "")
            .replace(/\s+/g, " ")
            .trim();

          // Fetch image from Supabase
          const { data } = supabase.storage.from("images").getPublicUrl(productNameNormalized);

          if (data?.publicUrl) {
            urls[item.id] = data.publicUrl;
          }
        } catch (error) {
          console.error(`Error fetching image for ${item.name}:`, error);
        }
      }

      setImageUrls(urls);
    };

    fetchImageUrls();
  }, [cart]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.final_price * item.quantity, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Add some products to your cart to see them here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <ShoppingBag className="h-5 w-5 mr-2" />
        Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
      </h2>

      <div className="space-y-5">
        {cart.map((item) => (
          <div key={item.id} className="flex items-start border-b pb-5">
            {/* Product Image */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4 bg-gray-50 flex items-center justify-center">
              {imageUrls[item.id] ? (
                <img
                  src={imageUrls[item.id]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={() => console.error(`Failed to load image: ${imageUrls[item.id]}`)}
                />
              ) : (
                <span className="text-xs text-gray-400">Loading...</span>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-grow">
              <h3 className="text-base font-medium text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {item.category && `${item.category} • `}₹{item.final_price} per kg
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-200"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-200"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3 w-3" />
                </button>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-right ml-4">
              <p className="font-semibold text-gray-800">₹{(item.final_price * item.quantity).toFixed(2)}</p>
              {item.price !== item.final_price && (
                <p className="text-xs text-gray-500 line-through">₹{(item.price * item.quantity).toFixed(2)}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">{calculateTotal() >= 499 ? "Free" : "₹40.00"}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>₹{(calculateTotal() >= 499 ? calculateTotal() : calculateTotal() + 40).toFixed(2)}</span>
        </div>
        <p className="text-xs text-green-600 mt-2 text-right">
          {calculateTotal() >= 499
            ? "Free delivery applied!"
            : `Add ₹${(499 - calculateTotal()).toFixed(2)} more for free delivery`}
        </p>
      </div>
    </div>
  );
}

export default Cart;
