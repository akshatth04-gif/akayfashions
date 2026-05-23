import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, User, Settings2, Sparkles, MessageCircle, Info, Menu, X, ArrowUpRight } from 'lucide-react';
import { Product, CartItem, UserProfile } from './types';
import { INITIAL_PRODUCTS } from './data';

// Components imports
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import ProductDetailsView from './components/ProductDetailsView';
import DashboardView from './components/DashboardView';
import CartCheckoutView from './components/CartCheckoutView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import AdminPanel from './components/AdminPanel';
import AIChatBot from './components/AIChatBot';

export default function App() {
  // Navigation active view states
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Products state loaded from Express API
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Shopping Bag and saved lists state with local storage persistency
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('akay_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('akay_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('akay_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Shyam Khatu',
      email: 'shyamjikhatu17@gmail.com',
      phone: '+1 555-839-2018',
      addresses: [
        { id: 'a1', name: 'Shyam Khatu', street: '12 Luxury Boulevard', city: 'San Francisco', zip: '94105', phone: '+1 555-839-2018' }
      ],
      loyaltyPoints: 120,
      referralCode: 'AKAY-LUXE-SHYAM'
    };
  });

  // Mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Save changes to storage
  useEffect(() => {
    localStorage.setItem('akay_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('akay_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('akay_profile', JSON.stringify(profile));
  }, [profile]);

  // Sync products catalog from server on initial boot
  const loadProductsList = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.products?.length) {
          setProducts(data.products);
          // Parse initial URL query parameters to load active product details instantly if linked!
          const params = new URLSearchParams(window.location.search);
          const pId = params.get('p');
          if (pId) {
            const match = data.products.find((p: Product) => p.id === pId);
            if (match) {
              setSelectedProduct(match);
              setActiveView('product-details');
            }
          }
        }
      })
      .catch(() => {
        console.log('API Server inactive. Booting rule-based local simulation.');
      });
  };

  useEffect(() => {
    loadProductsList();
  }, []);

  // Listen for query parameters changes
  useEffect(() => {
    const handleUrlStateLoad = () => {
      const params = new URLSearchParams(window.location.search);
      const pId = params.get('p');
      if (pId) {
        const match = products.find(p => p.id === pId);
        if (match) {
          setSelectedProduct(match);
          setActiveView('product-details');
        }
      }
    };
    window.addEventListener('popstate', handleUrlStateLoad);
    return () => window.removeEventListener('popstate', handleUrlStateLoad);
  }, [products]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, size: string, color: { name: string; hex: string }) => {
    setCart(prev => {
      const idx = prev.findIndex(item =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor.hex === color.hex
      );

      if (idx !== -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });

    // Provide user feedback and open cart automatically
    alert(`Added ${quantity} units of [${product.name}] to your shopping bag!`);
    setActiveView('cart');
  };

  const handleUpdateCartItemQuantity = (id: string, size: string, colorHex: string, q: number) => {
    setCart(prev => prev.map(item =>
      item.product.id === id && item.selectedSize === size && item.selectedColor.hex === colorHex
        ? { ...item, quantity: q }
        : item
    ));
  };

  const handleRemoveFromCart = (id: string, size: string, colorHex: string) => {
    setCart(prev => prev.filter(item =>
      !(item.product.id === id && item.selectedSize === size && item.selectedColor.hex === colorHex)
    ));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const match = prev.find(p => p.id === product.id);
      if (match) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    // Push parameter to URL for natural back navigations
    const newUrl = `${window.location.pathname}?p=${product.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setActiveView('product-details');
  };

  const handleNavigateDirect = (viewName: string) => {
    setActiveView(viewName);
    setSelectedProduct(null);
    setMobileMenuOpen(false);
    // Clear route parameters cleanly
    const cleanUrl = window.location.pathname;
    window.history.pushState({ path: cleanUrl }, '', cleanUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccessClearBag = () => {
    setCart([]);
    // Increment loyalty points by 15PTS on orders completions
    setProfile(p => ({
      ...p,
      loyaltyPoints: p.loyaltyPoints + 15
    }));
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-950 selection:text-white flex flex-col justify-between">
      {/* 1. TOP MARQUEE BANNER */}
      <div className="bg-neutral-950 text-white p-2 text-center text-[10px] font-mono tracking-widest uppercase relative z-40 border-b border-neutral-900 flex justify-center items-center space-x-1.5">
        <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
        <span>Free express worldwide delivery over orders of $100 • Code: AKAYFASHION20</span>
      </div>

      {/* 2. CHIC HEADER BAR */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex justify-between items-center">
          
          {/* Logo / Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-zinc-600 hover:text-black focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <h1
              onClick={() => handleNavigateDirect('home')}
              className="text-lg md:text-xl font-light tracking-[0.2em] uppercase font-mono cursor-pointer text-neutral-950 select-none hover:opacity-80 transition-opacity"
            >
              AkayFashions
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[11px] font-mono uppercase tracking-widest text-[#1d1d1f]">
            <button
              id="nav-home"
              onClick={() => handleNavigateDirect('home')}
              className={`hover:text-black border-b pb-0.5 transition-colors ${activeView === 'home' ? 'text-black border-black font-semibold' : 'text-neutral-500 border-transparent'}`}
            >
              Home
            </button>
            <button
              id="nav-shop"
              onClick={() => handleNavigateDirect('shop')}
              className={`hover:text-black border-b pb-0.5 transition-colors ${activeView === 'shop' || activeView === 'product-details' ? 'text-black border-black font-semibold' : 'text-neutral-500 border-transparent'}`}
            >
              Shop Elements
            </button>
            <button
              id="nav-blog"
              onClick={() => handleNavigateDirect('blog')}
              className={`hover:text-black border-b pb-0.5 transition-colors ${activeView === 'blog' ? 'text-black border-black font-semibold' : 'text-neutral-500 border-transparent'}`}
            >
              Journals
            </button>
            <button
              id="nav-contact"
              onClick={() => handleNavigateDirect('contact')}
              className={`hover:text-black border-b pb-0.5 transition-colors ${activeView === 'contact' ? 'text-black border-black font-semibold' : 'text-neutral-500 border-transparent'}`}
            >
              Support
            </button>
          </nav>

          {/* Dynamic Utility Controls Icons */}
          <div className="flex items-center space-x-4 ml-4 md:ml-0 text-zinc-700">
            {/* Admin control panel link */}
            <button
              id="nav-admin"
              onClick={() => handleNavigateDirect('admin')}
              className={`p-1 hover:text-black relative rounded transition-colors ${activeView === 'admin' ? 'text-black bg-stone-50' : 'text-neutral-400'}`}
              title="Admin Board"
            >
              <Settings2 className="h-4.5 w-4.5" />
            </button>

            {/* Profile Cabinet link */}
            <button
              id="nav-cabinet"
              onClick={() => handleNavigateDirect('dashboard')}
              className={`p-1 hover:text-black rounded transition-colors flex items-center space-x-1 ${activeView === 'dashboard' ? 'text-black font-semibold' : 'text-neutral-500'}`}
              title="Customer Cabinet"
            >
              <User className="h-4.5 w-4.5" />
              <span className="hidden sm:inline font-mono text-[9px] tracking-tight">{profile.loyaltyPoints} PTS</span>
            </button>

            {/* Wishlist Link */}
            <button
              id="nav-wish"
              onClick={() => handleNavigateDirect('dashboard')}
              className="p-1 hover:text-black relative transition-colors"
              title="Wishlist Collections"
            >
              <Heart className={`h-4.5 w-4.5 ${wishlist.length ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-[8px] font-mono font-bold leading-none h-3.5 w-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Drawer Link */}
            <button
              id="nav-bag"
              onClick={() => handleNavigateDirect('cart')}
              className={`p-1 hover:text-black relative rounded transition-colors flex items-center space-x-1 ${activeView === 'cart' ? 'text-black' : 'text-neutral-500'}`}
              title="Your Bag"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cart.length > 0 && (
                <span className="bg-neutral-900 text-white text-[8px] font-mono leading-none h-3.5 w-3.5 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Panels */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white border-b border-zinc-100 flex flex-col p-4 space-y-3 font-mono text-xs uppercase tracking-widest text-[#1d1d1f] animate-in slide-in-from-top-4 duration-200">
            <button onClick={() => handleNavigateDirect('home')} className="text-left font-semibold py-1 hover:text-black">Home</button>
            <button onClick={() => handleNavigateDirect('shop')} className="text-left font-semibold py-1 hover:text-black">Shop Elements</button>
            <button onClick={() => handleNavigateDirect('blog')} className="text-left font-semibold py-1 hover:text-black">Journals</button>
            <button onClick={() => handleNavigateDirect('contact')} className="text-left font-semibold py-1 hover:text-black">Support Desk</button>
          </nav>
        )}
      </header>

      {/* 3. CORE VIEWPORT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView + (selectedProduct?.id || '')}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {activeView === 'home' && (
              <HomeView
                products={products}
                onSelectProduct={handleSelectProduct}
                onNavigate={handleNavigateDirect}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            )}

            {activeView === 'shop' && (
              <ShopView
                products={products}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {activeView === 'product-details' && selectedProduct && (
              <ProductDetailsView
                product={selectedProduct}
                allProducts={products}
                onBack={() => handleNavigateDirect('shop')}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            )}

            {activeView === 'dashboard' && (
              <DashboardView
                wishlist={wishlist}
                onSelectProduct={handleSelectProduct}
                onNavigate={handleNavigateDirect}
                profile={profile}
                onUpdateProfile={setProfile}
              />
            )}

            {activeView === 'cart' && (
              <CartCheckoutView
                cart={cart}
                onUpdateCartItemQuantity={handleUpdateCartItemQuantity}
                onRemoveFromCart={handleRemoveFromCart}
                onNavigate={handleNavigateDirect}
                onClearCart={handleSuccessClearBag}
              />
            )}

            {activeView === 'blog' && (
              <BlogView
                products={products}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {activeView === 'contact' && (
              <ContactView />
            )}

            {activeView === 'admin' && (
              <AdminPanel
                products={products}
                onRefreshProducts={loadProductsList}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. GLOBAL FLOATING AI CHATBOT BAR */}
      <AIChatBot />

      {/* 5. BRAND FOOTER WRAP */}
      <footer className="bg-neutral-950 text-white pt-16 pb-8 border-t border-neutral-900 mt-20 font-mono text-[11px] tracking-wide">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono">AkayFashions</h4>
            <p className="text-zinc-400 font-light leading-relaxed">
              Elevating contemporary silhouettes with heavy-knitted textiles, raw construction margins, and Gemini-driven interactive styling parameters.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono">Elements Range</h4>
            <ul className="space-y-2 text-zinc-400 font-light">
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigateDirect('shop')}>Oversized Hoodies</li>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigateDirect('shop')}>Oversized T-Tees</li>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigateDirect('shop')}>Premium Sneakers</li>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigateDirect('shop')}>Tactical Utility Cargos</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[#eee] text-xs font-bold uppercase tracking-widest font-mono">Customer Society</h4>
            <ul className="space-y-2 text-neutral-400 font-light">
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigateDirect('dashboard')}>Account Cabinet</li>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigateDirect('dashboard')}>Parcel Tracking</li>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigateDirect('contact')}>Support FAQ</li>
              <li className="cursor-pointer hover:text-white" onClick={() => handleNavigateDirect('blog')}>Fashion Journals</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest font-mono">HQ Coordinates</h4>
            <p className="text-neutral-400 leading-relaxed font-light">
              Suite 45, 12 Luxury Boulevard,<br />
              San Francisco, CA 94105<br />
              Mon - Sat: 09:00 - 18:00 UTC
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 border-t border-neutral-900 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-stone-500 gap-4">
          <p>© 2026 AkayFashions. Pure Organic Fabric Architecture. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#github" className="hover:text-white flex items-center space-x-0.5"><span>GitHub</span> <ArrowUpRight className="h-3 w-3" /></a>
            <a href="#instagram" className="hover:text-white flex items-center space-x-0.5"><span>Instagram</span> <ArrowUpRight className="h-3 w-3" /></a>
            <a href="#discord" className="hover:text-white flex items-center space-x-0.5"><span>Couture Society</span> <ArrowUpRight className="h-3 w-3" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
