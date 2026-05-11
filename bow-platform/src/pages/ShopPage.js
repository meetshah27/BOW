import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  X,
  Plus,
  Minus,
  CheckCircle,
  Loader,
  Star,
  Heart,
  Music,
  Users,
  Tag,
  Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../config/api';
import RevealOnScroll from '../components/common/RevealOnScroll';
import SquareOrderForm from '../components/shop/SquareOrderForm';
import HeroSection from '../components/common/HeroSection';

const ShopPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [aboutPageContent, setAboutPageContent] = useState({ logo: '' });
  const [loadingLogo, setLoadingLogo] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🛒 Fetching products from backend...');
        setLoading(true);
        const response = await api.get('/products');
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Fetched ${data.length} products`);
          // Only show active products
          setProducts(data.filter(p => p.isActive));
        }
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    const fetchAboutPageContent = async () => {
      try {
        const res = await api.get('/about-page');
        if (res.ok) {
          const data = await res.json();
          setAboutPageContent(data);
        }
      } catch (error) {
        console.error('Error fetching about page content:', error);
      } finally {
        setLoadingLogo(false);
      }
    };

    fetchProducts();
    fetchAboutPageContent();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Only ${product.stock} items available in stock.`);
          return prev;
        }
        toast.success(`${product.name} quantity updated!`);
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      if (product.stock <= 0) {
        toast.error(`Sorry, ${product.name} is out of stock.`);
        return prev;
      }
      toast.success(`${product.name} added to cart!`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty > item.stock) {
          toast.error(`Only ${item.stock} items available in stock.`);
          return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckoutSuccess = (orderData) => {
    setCart([]);
    setShowCheckout(false);
    setOrderComplete(true);
  };

  const handleCheckout = () => {
    console.log('💳 Initiating checkout...');
    
    // Check if user is logged in
    if (!currentUser) {
      toast.error('Please log in to complete your purchase');
      const currentPath = window.location.pathname;
      navigate('/login', { 
        state: { from: { pathname: currentPath } },
        replace: false 
      });
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setShowCheckout(true);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>Shop - Beats of Washington</title>
        <meta name="description" content="Support Beats of Washington by purchasing our exclusive merchandise and apparel." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Official <span className="text-secondary-300">Merchandise</span>
          </>
        }
        description="Support our community building through music by rocking official BOW apparel and accessories."
        badge="🛍️ Welcome to Our Shop 🛍️"
        logoUrl={aboutPageContent.logo}
        showLogo={true}
        floatingElements={[
          { icon: ShoppingBag, position: 'top-10 left-10', animation: 'animate-float-slow' },
          { icon: Tag, position: 'top-20 right-32', animation: 'animate-float-slow-reverse' },
          { icon: Gift, position: 'bottom-20 left-32', animation: 'animate-float-slow' },
          { icon: Star, position: 'bottom-32 right-10', animation: 'animate-float-slow-reverse' }
        ]}
        interactiveElements={[
          { icon: ShoppingBag, label: 'Quality', color: 'text-orange-300' },
          { icon: Heart, label: 'Community', color: 'text-red-300' },
          { icon: Star, label: 'Premium', color: 'text-yellow-300' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center mb-12">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                  ? 'bg-primary-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowCart(true)}
            className="relative p-3 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all flex-shrink-0"
          >
            <ShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Curating our best items for you...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <RevealOnScroll key={product.id} delay={idx * 0.1}>
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-primary-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />)}
                      <span className="text-[10px] text-gray-400 ml-1">(0 reviews)</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-2xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                        <div className="mt-1">
                          {product.stock > 0 ? (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                              {product.stock} in stock
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                              Out of stock
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={`p-3 rounded-2xl shadow-lg transition-all transform active:scale-90 ${
                          product.stock > 0 
                            ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-200' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none active:scale-100'
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-inner border border-dashed border-gray-300">
            <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-400">No items found</h2>
            <p className="text-gray-500">Try a different search term or category.</p>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Fast Shipping", desc: "Quick delivery to your doorstep within 3-5 business days." },
            { icon: ShieldCheck, title: "Secure Checkout", desc: "Safe and encrypted transactions powered by Square." },
            { icon: CreditCard, title: "Community Driven", desc: "100% of proceeds go back into community music programs." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-md text-center border border-gray-50">
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ShoppingCart className="w-6 h-6 mr-2 text-primary-600" />
                  Your Cart
                </h2>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length > 0 ? (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <ShoppingBag className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-primary-600 font-bold mb-3">${item.price.toFixed(2)}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-lg border border-gray-200">
                              <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-primary-600"><Minus className="w-4 h-4" /></button>
                              <span className="font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-primary-600"><Plus className="w-4 h-4" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 text-xs font-semibold">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <p className="text-gray-500 font-medium">Your cart is feeling a bit light.</p>
                    <button 
                      onClick={() => setShowCart(false)}
                      className="mt-4 text-primary-600 font-bold hover:underline"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary-600">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-primary-600 to-orange-500 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform active:scale-95 flex items-center justify-center"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Checkout Now
                  </button>
                  <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">
                    Payments secured by Square
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowCheckout(false)}></div>
          <div className="relative z-10 w-full flex justify-center">
            <SquareOrderForm 
              amount={cartTotal} 
              items={cart} 
              user={currentUser}
              onSuccess={handleCheckoutSuccess}
              onCancel={() => setShowCheckout(false)}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderComplete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl"></div>
          <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center relative z-10 animate-fade-in shadow-2xl">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Order Confirmed!</h2>
            <p className="text-gray-600 mb-10 text-lg">
              Thank you for your purchase! Your order has been received and we'll start preparing it shortly. 
              You will receive a confirmation email with your order details.
            </p>
            <button 
              onClick={() => setOrderComplete(false)}
              className="w-full bg-primary-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-primary-700 transition-all shadow-xl hover:shadow-primary-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
