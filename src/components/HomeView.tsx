import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, ArrowLeftRight, Flame, Sparkles, Heart } from 'lucide-react';
import { Product } from '../types';
import { BRAND_STORY } from '../data';

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onNavigate: (view: string) => void;
  onToggleWishlist: (p: Product) => void;
  wishlist: Product[];
}

export default function HomeView({ products, onSelectProduct, onNavigate, onToggleWishlist, wishlist }: HomeViewProps) {
  const trendingProducts = products.filter(p => p.isTrending);
  const newArrivals = products.filter(p => p.isNew);

  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const heroBanners = [
    {
      title: 'AKAY HAUTE COUTURE',
      sub: 'Earthy silhouettes built with raw architecture and organic fibers.',
      tag: 'COLLECTION 01 / HEAVYWEIGHTS',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200'
    },
    {
      title: 'UTILITY STREETWEAR',
      sub: 'Multi-pocket tactical drapes and 450 GSM French Terries.',
      tag: 'NEW DROPS',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200'
    }
  ];

  const [heroIdx, setHeroIdx] = useState(0);

  const reviews = [
    { name: 'Alessia V.', rating: 5, comment: 'The weight of the 450 GSM Oversized Hoodie is absolutely premium. It drapes unlike anything else in my closet.', city: 'Milan, Italy' },
    { name: 'Kaelen M.', rating: 5, comment: 'Highly functional cargo pants and incredible customer service chatbot. Kept track of my premium shipping and delivered within 2 days.', city: 'New York, USA' },
    { name: 'Siddharth R.', rating: 5, comment: 'Truly Zara and Nike caliber. Highly interactive try-on simulator and elegant branding.', city: 'New Delhi, India' }
  ];

  const lookbook = [
    { img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600', style: 'Stealth Pilot Active' },
    { img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600', style: 'Loungewear Draping' },
    { img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600', style: 'Asymmetric Satin' }
  ];

  const instaFeed = [
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400'
  ];

  return (
    <div id="home-view" className="space-y-16">
      {/* 1. Hero Dynamic Banner Slider */}
      <section className="relative h-[80vh] min-h-[500px] w-full overflow-hidden bg-neutral-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanners[heroIdx].image}
            alt="Hero Banner"
            className="h-full w-full object-cover object-center opacity-40 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50" />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block tracking-widest text-xs font-mono text-neutral-400 border-b border-neutral-600 pb-1">
              {heroBanners[heroIdx].tag}
            </span>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
              {heroBanners[heroIdx].title}
            </h1>
            <p className="text-neutral-300 text-sm md:text-base font-light">
              {heroBanners[heroIdx].sub}
            </p>
            <div className="flex space-x-4 pt-4">
              <button
                id="btn-hero-shop"
                onClick={() => onNavigate('shop')}
                className="group flex items-center space-x-2 bg-white text-black px-6 py-3 text-sm font-medium tracking-wider hover:bg-neutral-200 transition-colors uppercase"
              >
                <span>Discover Shop</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="btn-hero-story"
                onClick={() => {
                  const el = document.getElementById('brand-story');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-white/40 hover:border-white text-white px-6 py-3 text-sm font-medium tracking-wider bg-black/20 backdrop-blur-md transition-colors uppercase"
              >
                Our philosophy
              </button>
            </div>
          </div>
        </div>

        {/* Hero Toggles */}
        <div className="absolute bottom-6 right-6 z-20 flex space-x-2">
          {heroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIdx(idx)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                heroIdx === idx ? 'w-8 bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex justify-between items-end border-b border-neutral-100 pb-4">
          <div>
            <span className="font-mono text-xs text-neutral-400 tracking-wider">CURATED SELECTIONS</span>
            <h2 className="text-2xl font-light tracking-tight text-neutral-900 uppercase">New Arrivals</h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="group text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-black flex items-center space-x-1"
          >
            <span>View All Products</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.slice(0, 4).map(product => {
            const isWish = wishlist.some(w => w.id === product.id);
            return (
              <div key={product.id} className="group relative space-y-3">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 border border-neutral-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.isTrending && (
                    <span className="absolute top-3 left-3 bg-white text-black px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest flex items-center space-x-1 shadow-sm">
                      <Flame className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
                      <span>Hot</span>
                    </span>
                  )}
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-neutral-600 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <Heart className={`h-4 w-4 ${isWish ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="w-full py-2 bg-white text-black text-xs font-medium uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div className="max-w-[80%]">
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-light tracking-tight text-neutral-800 hover:text-black hover:underline cursor-pointer truncate"
                    >
                      {product.name}
                    </h3>
                    <p className="font-mono text-xs text-neutral-400 capitalize">{product.category}</p>
                  </div>
                  <span className="font-mono text-neutral-900">${product.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Seasonal Promotion */}
      <section className="bg-neutral-50 py-16 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden border border-neutral-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800"
              alt="Seasonal lookbook"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-mono text-[10px] tracking-widest uppercase">
              Limited Edition Drops
            </div>
          </div>
          <div className="space-y-6">
            <span className="font-mono text-xs text-neutral-400 tracking-wider">LIMITED TIME ACTIVE</span>
            <h2 className="text-3xl font-light tracking-tight text-neutral-900 uppercase">Season 01: Elements</h2>
            <p className="text-neutral-600 text-sm leading-relaxed font-light">
              Crafted in limited-run numbers, our elements campaign focuses on high-density structural forms, water-repelling flight-grade textiles, and modular draping fits designed to transition flawlessly between spring humidity and cold evenings.
            </p>
            <div className="flex items-center space-x-6 text-sm font-mono text-neutral-500">
              <span className="flex items-center space-x-1.5 border-r border-neutral-200 pr-4">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Premium Quality Guarantee</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                <span>Modular Layering</span>
              </span>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="px-6 py-3 bg-neutral-900 text-white text-xs font-medium tracking-wider uppercase hover:bg-neutral-800 transition-colors rounded-none"
            >
              Secure Early Access
            </button>
          </div>
        </div>
      </section>

      {/* 4. Lookbook Carousel */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs text-neutral-400 tracking-wider">COUTURE STORYBOARD</span>
          <h2 className="text-2xl font-light tracking-tight text-neutral-900 uppercase">Structural Silhouette Lookbook</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lookbook.map((lb, idx) => (
            <div key={idx} className="group relative h-96 overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={lb.img}
                alt={lb.style}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-mono text-neutral-300 tracking-widest uppercase">Style {idx + 1}</span>
                <h4 className="text-lg font-light text-white tracking-widest uppercase">{lb.style}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Brand Story Section */}
      <section id="brand-story" className="max-w-4xl mx-auto px-4 text-center space-y-8 py-8 border-t border-neutral-100">
        <div className="space-y-4">
          <span className="font-mono text-xs text-neutral-400 tracking-widest uppercase">Our Story & Craft</span>
          <h2 className="text-3xl font-light tracking-tight text-neutral-900 uppercase">AkayFashions</h2>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light italic">
            "{BRAND_STORY.philosophy}"
          </p>
          <p className="text-neutral-900 text-xs font-mono uppercase tracking-widest pt-2">
            — {BRAND_STORY.founderQuote}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-4">
          {BRAND_STORY.achievements.map((item, idx) => (
            <div key={idx} className="border border-neutral-100 p-4 bg-neutral-50/50">
              <span className="block text-2xl font-light text-neutral-900 tracking-tight">{item.count}</span>
              <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Customer Review Carousel */}
      <section className="bg-neutral-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <span className="font-mono text-xs text-neutral-400 tracking-widest uppercase">Aesthetic Reviews</span>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReviewIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-center space-x-1 text-amber-500">
                {Array.from({ length: reviews[activeReviewIdx].rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-lg md:text-xl font-light italic text-neutral-200">
                "{reviews[activeReviewIdx].comment}"
              </p>
              <div className="space-y-1">
                <h5 className="font-mono text-xs font-medium tracking-wider text-white uppercase">{reviews[activeReviewIdx].name}</h5>
                <p className="font-mono text-[10px] text-neutral-400">{reviews[activeReviewIdx].city}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider controls */}
          <div className="flex justify-center space-x-3 pt-4">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIdx(idx)}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  activeReviewIdx === idx ? 'w-6 bg-white' : 'bg-neutral-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Instagram-Style Feed */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs text-neutral-400 tracking-wider">INSTAGRAM EDITORIALS</span>
          <h2 className="text-2xl font-light tracking-tight text-neutral-900 uppercase">#AkayInSociety</h2>
          <p className="text-neutral-500 text-xs font-light">Tag @AkayFashions to be framed on our central feed grid.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {instaFeed.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-neutral-100 group">
              <img
                src={img}
                alt="Insta grid"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs font-mono">
                @akayfashions
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter Subscription */}
      <section className="bg-neutral-50 border border-neutral-100 p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-xs text-neutral-400 tracking-wider uppercase">EXCLUSIVE SOCIETY ENTREE</span>
          <h3 className="text-xl font-light tracking-tight text-neutral-900 uppercase">Join the Akay Cult</h3>
          <p className="text-neutral-500 text-xs font-light max-w-md mx-auto">
            Subscribe for early drop keys, members-only couture lookbooks, and high-fashion style guides directly to your mailbox twice monthly. No advertising clutter.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Welcome keys dispatched. Check your mailbox shortly.');
          }}
          className="flex flex-col sm:flex-row max-w-md mx-auto space-y-3 sm:space-y-0 sm:space-x-2"
        >
          <input
            type="email"
            placeholder="Introduce your email Address..."
            required
            className="flex-1 px-4 py-3 bg-white border border-neutral-200 text-xs outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            className="bg-neutral-900 text-white text-[11px] uppercase font-mono tracking-wider px-6 py-3 sm:py-2 hover:bg-neutral-800 transition-colors"
          >
            Dispatch Invite
          </button>
        </form>
      </section>
    </div>
  );
}
