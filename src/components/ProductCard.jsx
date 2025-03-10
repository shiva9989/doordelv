import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { ShoppingCart, Star, Heart, Info, Check, Clock } from "lucide-react";
import { Link } from "react-router-dom";

function ProductCard({ product, addToCart, isListView = false }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Stock level simulation
  const stockLevel = Math.floor(Math.random() * 3); // 0: low, 1: medium, 2: high

  useEffect(() => {
    const fetchImageUrl = async () => {
      setIsLoading(true);
      setImageError(false);
      
      try {
        if (!product.name) {
          setImageError(true);
          setIsLoading(false);
          return;
        }
        
        // Convert product name to match storage naming convention
        const productNameNormalized = product.name
          .toLowerCase()
          .replace(/\.(jpg|jpeg|png)$/i, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Get image from Supabase storage
        const { data } = supabase.storage.from("images").getPublicUrl(productNameNormalized);
        
        if (data?.publicUrl) {
          setImageUrl(data.publicUrl);
        } else {
          setImageError(true);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageUrl();
  }, [product.name]);

  // Calculate discount percentage
  const discountPercentage = product.price && product.final_price && product.price > product.final_price
    ? Math.round(((product.price - product.final_price) / product.price) * 100)
    : 0;
    
  // Handle add to cart with animation
  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };
  
  // Get stock level indicator text and color
  const getStockIndicator = () => {
    switch(stockLevel) {
      case 0: 
        return { text: "Low Stock", color: "text-orange-500" };
      case 1: 
        return { text: "In Stock", color: "text-green-600" };
      case 2: 
        return { text: "Well Stocked", color: "text-green-600" };
      default: 
        return { text: "In Stock", color: "text-green-600" };
    }
  };
  
  const stockIndicator = getStockIndicator();

  // If in list view mode, render just the image part
  if (isListView) {
    return (
      <div className="h-full w-full relative overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="animate-pulse w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : imageError ? (
          <div className="flex items-center justify-center h-full w-full bg-gray-100">
            <div className="text-gray-400 text-center p-2">
              <ShoppingCart className="h-8 w-8 mx-auto mb-1 opacity-30" />
              <p className="text-xs">No image</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={product.name}
            className="object-cover h-full w-full"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        
        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
    );
  }

  // Default grid view
  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gray-50" style={{ height: "220px" }}>
        <Link to={`/product/${product.id}`} className="block h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full w-full">
              <div className="animate-pulse w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : imageError ? (
            <div className="flex items-center justify-center h-full w-full bg-gray-100">
              <div className="text-gray-400 text-center p-4">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No image available</p>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full p-4 flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="object-contain h-full max-h-full w-auto max-w-full mx-auto transition-transform duration-700 ease-in-out group-hover:scale-110"
                onError={() => setImageError(true)}
                loading="lazy"
              />
              
              {/* Quick view overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-600 hover:text-white transition-colors transform hover:scale-105">
                  Quick View
                </button>
              </div>
            </div>
          )}
        </Link>
        
        {/* Actions Bar */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Favorite button */}
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
          </button>
          
          {/* Info button */}
          <Link to={`/product/${product.id}`} className="block">
            <button className="bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100">
              <Info className="h-5 w-5 text-gray-500" />
            </button>
          </Link>
        </div>
        
        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              {discountPercentage}% OFF
            </div>
          )}
          
          {/* Featured/New badge */}
          {product.id % 5 === 0 && (
            <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
              NEW
            </div>
          )}
          
          {/* Organic/Premium badge */}
          {product.id % 7 === 0 && (
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
              ORGANIC
            </div>
          )}
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-4">
        {/* Category tag */}
        {product.category && (
          <div className="mb-2">
            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        )}
        
        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 min-h-12 mb-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Ratings */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400" />
            <Star className="h-4 w-4 text-gray-300" />
          </div>
          <span className="ml-1 text-xs text-gray-500">(4.0)</span>
        </div>
        
        {/* Stock indicator */}
        <div className="flex items-center mb-3">
          {stockLevel === 0 ? (
            <Clock className="h-4 w-4 text-orange-500 mr-1" />
          ) : (
            <Check className="h-4 w-4 text-green-600 mr-1" />
          )}
          <span className={`text-xs ${stockIndicator.color}`}>{stockIndicator.text}</span>
        </div>
        
        {/* Price and Add to cart */}
        <div className="mt-auto flex justify-between items-center">
          <div>
            {product.price !== product.final_price ? (
              <div className="flex flex-col">
                <span className="line-through text-gray-400 text-xs">₹{product.price}</span>
                <span className="font-bold text-lg text-gray-900">₹{product.final_price}</span>
                <span className="text-xs text-gray-500">{product.unit}</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900">₹{product.final_price}</span>
                <span className="text-xs text-gray-500">{product.unit}</span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            className={`${
              addedToCart 
                ? 'bg-green-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 shadow-md`}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedToCart ? (
              <>
                <Check className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;