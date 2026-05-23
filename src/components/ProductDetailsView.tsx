import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, ShoppingBag, Heart, Shield, RefreshCw, Upload, Sparkles, Wand2, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onAddToCart: (p: Product, q: number, s: string, c: { name: string; hex: string }) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Product[];
}

export default function ProductDetailsView({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onToggleWishlist,
  wishlist
}: ProductDetailsViewProps) {
  // Gallery state
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)', transformOrigin: 'center' });

  // Input states
  const [selectedSize, setSelectedSize] = useState(product.variants.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.variants.colors[0] || { name: 'Default', hex: '#333' });
  const [quantity, setQuantity] = useState(1);

  // AI & Interactive sections state
  const [activeTab, setActiveTab] = useState<'fabric' | 'tryon' | 'shipping'>('tryon');
  const [aiSuggestions, setAiSuggestions] = useState<Product[]>([]);
  const [aiAdvisory, setAiAdvisory] = useState('');
  const [loadingAiOutfit, setLoadingAiOutfit] = useState(false);

  // Try-on states
  const [userSelfie, setUserSelfie] = useState<string | null>(null);
  const [tryOnText, setTryOnText] = useState('');
  const [loadingTryOn, setLoadingTryOn] = useState(false);

  // Fetch AI Outfit recommendations ("Complete the Look")
  useEffect(() => {
    setActiveImg(product.images[0]);
    setSelectedSize(product.variants.sizes[0] || 'M');
    setSelectedColor(product.variants.colors[0] || { name: 'Default', hex: '#333' });
    setQuantity(1);

    setLoadingAiOutfit(true);
    fetch('/api/gemini/outfit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAiAdvisory(data.stylingAdvisory);
          const matchedItems = allProducts.filter(p => data.recommendedIds.includes(p.id));
          setAiSuggestions(matchedItems.length ? matchedItems : allProducts.filter(p => p.id !== product.id).slice(0, 3));
        } else {
          setAiSuggestions(allProducts.filter(p => p.id !== product.id).slice(0, 3));
        }
      })
      .catch(() => {
        setAiSuggestions(allProducts.filter(p => p.id !== product.id).slice(0, 3));
      })
      .finally(() => setLoadingAiOutfit(false));
  }, [product, allProducts]);

  // Image zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center'
    });
  };

  // Selfie processing
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds our maximum file resolution of 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUserSelfie(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit to Gemini Virtual Try-On
  const handleTriggerTryOnExclusion = () => {
    setLoadingTryOn(true);
    fetch('/api/gemini/tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: userSelfie,
        productId: product.id,
        userComment: `Draping selected for color: ${selectedColor.name}`
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setTryOnText(data.analysisText);
        } else {
          setTryOnText('Failed to sync. Please try again.');
        }
      })
      .catch(() => {
        setTryOnText('Connection timeout. Initializing rule-based mirror backup.');
      })
      .finally(() => setLoadingTryOn(false));
  };

  const isWish = wishlist.some(w => w.id === product.id);

  // Find related products
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div id="product-detail-view" className="space-y-16">
      {/* Navigation bar Header */}
      <div className="flex border-b border-neutral-100 pb-4">
        <button
          onClick={onBack}
          className="group flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Main product showcase section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images Column */}
        <div className="space-y-4">
          {/* Main Large Viewer with Magnifying Zoom */}
          <div
            className="relative aspect-[3/4] bg-neutral-50 overflow-hidden cursor-crosshair border border-neutral-100 shadow-sm"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={activeImg}
              alt={product.name}
              style={zoomStyle}
              className="h-full w-full object-cover transition-transform duration-200"
            />
          </div>

          {/* Inline Gallery Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImg(img)}
                className={`relative aspect-[3/4] overflow-hidden bg-stone-50 border transition-all ${
                  activeImg === img ? 'border-neutral-900 opacity-100 scale-95' : 'border-neutral-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Product Video Showcase */}
          {product.video && (
            <div className="pt-4">
              <span className="block text-xs font-mono uppercase text-neutral-400 mb-2">Runway Presentation</span>
              <div className="relative aspect-video bg-black overflow-hidden border border-neutral-200">
                <video
                  src={product.video}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Custom Controls / Buying Panel */}
        <div className="space-y-8">
          {/* Product Header */}
          <div className="space-y-2">
            <span className="font-mono text-xs text-neutral-400 tracking-wider">AKAY SPECIALTIES</span>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900">{product.name}</h1>
            
            <div className="flex justify-between items-center bg-neutral-50 p-2 border border-neutral-100">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-xs font-mono font-medium text-neutral-800">{product.rating}</span>
                <span className="text-neutral-400 text-xs font-light">({product.reviewsCount} reviews)</span>
              </div>
              <span className="text-2xl font-light text-neutral-950">${product.price}</span>
            </div>
          </div>

          {/* Variants and sizes selectors */}
          <div className="space-y-5">
            {/* 1. Size control */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-neutral-600">Select Size:</span>
                <button
                  onClick={() => alert('Scent ratios are exact. Choose your normal chest width.')}
                  className="text-neutral-400 hover:text-black hover:underline"
                >
                  Size Chart Guide
                </button>
              </div>
              <div className="flex gap-2">
                {product.variants.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 px-4 text-xs font-mono transition-colors border ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Color picker */}
            <div className="space-y-2">
              <span className="block text-xs font-mono text-neutral-600">Color Variant: <strong className="text-black">{selectedColor.name}</strong></span>
              <div className="flex space-x-3 items-center">
                {product.variants.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color.hex }}
                    className={`h-7 w-7 rounded-full border-2 transition-transform shadow-inner ${
                      selectedColor.name === color.name ? 'border-neutral-900 scale-125' : 'border-white hover:scale-110'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Tracker & Stock Warnings */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-neutral-200 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-neutral-100 text-sm font-mono text-neutral-500 hover:text-black"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-mono text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-neutral-100 text-sm font-mono text-neutral-500 hover:text-black"
                >
                  +
                </button>
              </div>

              <div className="text-xs">
                {product.stock > 10 ? (
                  <span className="text-zinc-600 font-mono">In Stock ({product.stock} units)</span>
                ) : (
                  <span className="text-red-500 font-mono bg-red-50 border border-red-100 px-2.5 py-1">Limited: Only {product.stock} items remaining!</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons (Add to Bag / Wishlist) */}
          <div className="flex space-x-3">
            <button
              onClick={() => onAddToCart(product, quantity, selectedSize, selectedColor)}
              className="flex-1 bg-neutral-950 text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Shopping Bag</span>
            </button>
            <button
              onClick={() => onToggleWishlist(product)}
              className="px-4 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-colors flex items-center justify-center text-zinc-600 hover:text-black"
            >
              <Heart className={`h-5 w-5 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {/* Details / Interactive Try-On tab panel */}
          <div className="space-y-4">
            <div className="flex border-b border-neutral-100 text-xs font-mono uppercase tracking-wider divide-x divide-neutral-100">
              <button
                onClick={() => setActiveTab('tryon')}
                className={`py-2 px-3 text-left font-semibold ${activeTab === 'tryon' ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'}`}
              >
                <span className="flex items-center space-x-1.5">
                  <Wand2 className="h-3.5 w-3.5 text-indigo-500 animate-spin" />
                  <span>3D Virtual Try-On</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`py-2 px-3 ${activeTab === 'fabric' ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'}`}
              >
                Couture Material
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-2 px-3 ${activeTab === 'shipping' ? 'text-black border-b-2 border-black' : 'text-neutral-400 hover:text-black'}`}
              >
                Secure Delivery
              </button>
            </div>

            <div className="text-xs text-neutral-600 leading-relaxed font-light min-h-[120px]">
              {activeTab === 'fabric' && (
                <div className="space-y-2 bg-neutral-50/50 p-4 border border-neutral-100">
                  <p><strong>Fabric profile:</strong> {product.fabric}</p>
                  <p>{product.description}</p>
                  <div className="pt-2">
                    <strong>Care instruction:</strong> Gentle wash inside out. Dry flat. Iron low weight. Do not bleach.
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-3 bg-neutral-50/50 p-4 border border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>Complimentary express global delivery for purchases tiering above $100.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                    <span>Humble 14-days convenient return policies with custom home pickups.</span>
                  </div>
                </div>
              )}

              {activeTab === 'tryon' && (
                <div className="space-y-4 bg-purple-50/20 p-4 border border-indigo-100 text-neutral-800">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <div>
                      <p className="font-semibold text-neutral-900 uppercase tracking-wide text-[10px]">Akay Vision Try-On Lab</p>
                      <p className="text-stone-500 text-[11px]">Upload a headshot/outfit portrait, and let our Gemini-enabled stylistic models analyze your physical fit and render a detailed size coordination review!</p>
                    </div>
                  </div>

                  {/* Selfie controller */}
                  <div className="flex items-center space-x-3 pt-2">
                    <label className="cursor-pointer bg-white border border-indigo-200 px-3 py-2 text-[10px] uppercase font-mono tracking-wider hover:bg-neutral-50 flex items-center space-x-1.5 transition-colors">
                      <Upload className="h-3.5 w-3.5 text-neutral-500" />
                      <span>Upload Selfie (Max 10MB)</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>

                    {userSelfie && (
                      <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 font-mono">Photo Attached ✅</span>
                    )}
                  </div>

                  {userSelfie && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 border border-indigo-100">
                      <img src={userSelfie} alt="Selfie" className="h-16 w-16 object-cover rounded border border-neutral-200" />
                      <button
                        onClick={handleTriggerTryOnExclusion}
                        disabled={loadingTryOn}
                        className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 text-[10px] uppercase font-mono tracking-wider hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {loadingTryOn ? 'Analyzing fabric symbiosis...' : 'Simulate Fitting'}
                      </button>
                    </div>
                  )}

                  {/* Review return panel */}
                  {tryOnText && (
                    <div className="bg-white p-3.5 border border-indigo-100 rounded text-stone-700 whitespace-pre-wrap text-[11px] font-light leading-relaxed italic border-l-4 border-l-indigo-500">
                      {tryOnText}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look AI recommendations */}
      <section className="bg-neutral-50/50 p-6 md:p-8 rounded-none border border-neutral-100 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
            <h3 className="text-sm font-semibold tracking-wider font-mono uppercase text-neutral-900">“Complete the Look” AI outfit suggestions</h3>
          </div>
          <span className="p-1 px-2.5 bg-neutral-900 text-white font-mono text-[9px] uppercase tracking-widest rounded-full">
            Gemini Synthesizer
          </span>
        </div>

        {loadingAiOutfit ? (
          <div className="text-center py-6">
            <span className="inline-block animate-bounce h-2 w-2 rounded-full bg-neutral-400 mr-1" />
            <span className="inline-block animate-bounce h-2 w-2 rounded-full bg-neutral-400 mr-1 delay-100" />
            <span className="inline-block animate-bounce h-2 w-2 rounded-full bg-neutral-400 delay-200" />
            <p className="text-xs text-neutral-500 font-mono mt-2">Deducing coordinate luxury matches...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {aiAdvisory && (
              <p className="text-xs text-stone-600 leading-relaxed font-light italic border-l-2 border-neutral-300 pl-3">
                {aiAdvisory}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {aiSuggestions.map(rec => (
                <div
                  key={rec.id}
                  onClick={() => {
                    setActiveImg(rec.images[0]);
                    window.location.hash = '#product-detail-view'; // reset view scroll
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                    // Swap product view
                    const matched = allProducts.find(p => p.id === rec.id);
                    if (matched) {
                      // Trigger callback
                      const url = document.getElementById('product-detail-view');
                      if (url) url.scrollIntoView({ behavior: 'smooth' });
                      // Force selectedProduct parent update if we can
                      // We will handle navigation inside our parent reducer
                      window.location.href = `./?p=${rec.id}`;
                    }
                  }}
                  className="group cursor-pointer bg-white p-3 border border-neutral-200/60 hover:border-neutral-950 transition-colors flex items-center space-x-3.5"
                >
                  <img src={rec.images[0]} alt={rec.name} className="h-14 w-12 object-cover border" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs text-neutral-800 font-light truncate group-hover:underline">{rec.name}</h4>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-tight">{rec.category}</p>
                    <span className="text-[11px] font-semibold font-mono text-zinc-900">${rec.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Relational products suggestions */}
      <section className="space-y-6">
        <h3 className="text-sm font-semibold tracking-wider font-mono uppercase text-neutral-900 border-b pb-2">More in Catalogs</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map(rel => (
            <div
              key={rel.id}
              onClick={() => {
                window.location.href = `./?p=${rel.id}`;
              }}
              className="group cursor-pointer space-y-2"
            >
              <div className="aspect-[3/4] bg-neutral-100 overflow-hidden border">
                <img src={rel.images[0]} alt={rel.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <h4 className="text-neutral-800 font-light truncate max-w-[80%]">{rel.name}</h4>
                <span className="font-mono text-neutral-900">${rel.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
