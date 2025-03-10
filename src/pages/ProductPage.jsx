import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { ShoppingCart, ArrowLeft, Star, Truck, Clock, Shield, Heart } from 'lucide-react';

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setImageError(false);
        
        const { data, error } = await supabase
          .from('Products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setProduct(data);
        
        // Fetch image
        if (data && data.name) {
          // Convert product name to match storage naming convention
          const productNameNormalized = data.name
            .toLowerCase()
            .replace(/\.(jpg|jpeg|png)$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          // Get image from Supabase storage
          const { data: imageData } = supabase.storage.from("images").getPublicUrl(productNameNormalized);
          
          if (imageData?.publicUrl) {
            setImageUrl(imageData.publicUrl);
          } else {
            setImageError(true);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details. Please try again later.');
        setImageError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const productWithQuantity = { ...product, quantity };
      addToCart(productWithQuantity);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-pulse w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-xl text-red-500 mb-6">{error || 'Product not found'}</p>
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate discount percentage
  const discountPercentage = product.price && product.final_price && product.price > product.final_price
    ? Math.round(((product.price - product.final_price) / product.price) * 100)
    : 0;
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            {product.category && (
              <>
                <span className="hover:text-blue-600 transition-colors">{product.category}</span>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-gray-700 font-medium truncate">{product.name}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 relative">
              <div className="p-8 h-96 md:h-full flex items-center justify-center bg-gray-50">
                {imageError ? (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mb-3" />
                    <p className="text-gray-400">No image available</p>
                  </div>
                ) : (
                  <img 
                    src={imageUrl} 
                    alt={product.name}
                    className="object-contain max-h-full max-w-full"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
              
              {/* Favorite button */}
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
              </button>
              
              {/* Discount badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg z-10">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              {/* Category and ratings */}
              <div className="flex items-center mb-4">
                {product.category && (
                  <span className="text-gray-500 mr-4">{product.category}</span>
                )}
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-1">
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                  <span className="text-xs text-gray-500">(4.0) 48 reviews</span>
                </div>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                {product.price !== product.final_price ? (
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-gray-800 mr-3">₹{product.final_price}</span>
                    <span className="line-through text-gray-400 text-lg mr-3">₹{product.price}</span>
                    <span className="text-green-600 text-sm font-semibold">
                      {discountPercentage}% off
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-800">₹{product.final_price}</span>
                )}
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>
              
              {/* Quantity selector
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    onClick={decrementQuantity}
                    className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center border border-gray-300 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300">
                    {quantity}
                  </div>
                  <button 
                    onClick={incrementQuantity}
                    className="w-10 h-10 bg-gray-100 rounded-r-lg flex items-center justify-center border border-gray-300 hover:bg-gray-200"
                  >
                    +
                  </button>
                  <span className="ml-4 text-gray-500">kg</span>
                </div>
              </div> */}
              
              {/* Add to cart button */}
              <button 
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center transition-colors duration-300 mb-6"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm">Free delivery on orders above ₹499</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm">Delivery within 2 hours</span>
                </div>
                <div className="flex items-center col-span-1 md:col-span-2">
                  <Shield className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-sm">100% fresh or refund guarantee</span>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                <p className="text-gray-600">
                  {product.description || 'Fresh and high-quality product sourced directly from farms. Guaranteed freshness and prompt delivery to your doorstep.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;