import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Grid3X3, Flame, Star, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ShopViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ShopView({ products, onSelectProduct }: ShopViewProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(300);
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('trending'); // trending, price-asc, price-desc, popularity, rating, latest
  const [showFilters, setShowFilters] = useState(false);

  // Categories extraction
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  // Handle Search input live suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  }, [searchTerm, products]);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Search match
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Category match
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

        // Price range
        const matchesPrice = product.price <= maxPrice;

        // Size matches
        const matchesSize = selectedSize === 'All' || product.variants.sizes.includes(selectedSize);

        return matchesSearch && matchesCategory && matchesPrice && matchesSize;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'popularity') return b.reviewsCount - a.reviewsCount;
        if (sortBy === 'latest') return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
        // Default: trending
        return a.isTrending === b.isTrending ? 0 : a.isTrending ? -1 : 1;
      });
  }, [products, searchTerm, selectedCategory, maxPrice, selectedSize, sortBy]);

  const sizesList = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'US 8', 'US 9', 'US 10', 'US 11'];

  return (
    <div id="shop-view" className="space-y-10">
      {/* Search and Quick Filters bar */}
      <div className="relative bg-neutral-50 p-6 border border-neutral-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input with autocomplete suggestions */}
        <div className="relative flex-1 max-w-xl">
          <div className="flex items-center bg-white border border-neutral-200 px-3 py-2.5 focus-within:border-black transition-colors">
            <Search className="h-4 w-4 text-neutral-400 mr-2" />
            <input
              type="text"
              id="shop-search"
              placeholder="Search products, fabrics, styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-800 outline-none placeholder:text-neutral-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-neutral-400 hover:text-black text-xs font-mono px-1 rounded hover:bg-neutral-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete suggestions dropdown */}
          {searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-neutral-200 shadow-lg z-50 py-2 divide-y divide-neutral-50">
              <div className="px-3 py-1 text-[10px] uppercase font-mono text-neutral-400 tracking-wider bg-neutral-50">Suggestions</div>
              {searchSuggestions.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSearchTerm(item.name);
                    setSelectedCategory('All');
                  }}
                  className="px-3 py-2 text-xs text-stone-800 hover:bg-neutral-50 flex justify-between items-center cursor-pointer"
                >
                  <span className="font-light truncate">{item.name}</span>
                  <span className="font-mono text-[10px] text-neutral-400 uppercase bg-stone-100 px-1.5 py-0.5 rounded capitalize">{item.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Toggles for Filters Panel and Sorters */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-1.5 border px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              showFilters ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center bg-white border border-neutral-200 px-3 py-2 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400 mr-2" />
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none text-neutral-800 cursor-pointer font-mono text-[11px] uppercase tracking-wider"
            >
              <option value="trending">Trending Styles</option>
              <option value="latest">Latest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="popularity">Popular Choice</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters Drawer/Panel */}
      {showFilters && (
        <div className="bg-white p-6 border border-neutral-100 grid grid-cols-1 md:grid-cols-3 gap-8 py-8 shadow-sm">
          {/* Category Filter */}
          <div className="space-y-3">
            <span className="block text-xs font-mono uppercase tracking-wider text-neutral-400 border-b pb-1">Categories</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs tracking-wide transition-colors ${
                    selectedCategory === cat
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <span className="block text-xs font-mono uppercase tracking-wider text-neutral-400 border-b pb-1">Filter by Size</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sizesList.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                    selectedSize === sz
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Max Spend</span>
              <span className="text-xs font-mono font-medium text-neutral-900">${maxPrice}</span>
            </div>
            <div className="pt-3 space-y-1">
              <input
                type="range"
                min="30"
                max="300"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black cursor-pointer bg-neutral-200 h-1.5 rounded-full"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>$30</span>
                <span>$300</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Count & Applied Filters Tag */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-neutral-500">
          Showing <strong className="text-black font-semibold">{filteredProducts.length}</strong> creations
        </span>
        <div className="space-x-1.5">
          {selectedCategory !== 'All' && (
            <span className="inline-block px-2.5 py-1 bg-stone-100 text-neutral-800 text-[10px] font-mono rounded-full uppercase">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} className="ml-1.5 font-bold hover:text-black">×</button>
            </span>
          )}
          {selectedSize !== 'All' && (
            <span className="inline-block px-2.5 py-1 bg-stone-100 text-neutral-800 text-[10px] font-mono rounded-full uppercase">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize('All')} className="ml-1.5 font-bold hover:text-black">×</button>
            </span>
          )}
          {maxPrice < 300 && (
            <span className="inline-block px-2.5 py-1 bg-stone-100 text-neutral-800 text-[10px] font-mono rounded-full uppercase">
              Under: ${maxPrice}
              <button onClick={() => setMaxPrice(300)} className="ml-1.5 font-bold hover:text-black">×</button>
            </span>
          )}
        </div>
      </div>

      {/* Main Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer space-y-3 relative"
            >
              {/* Product Visual */}
              <div className="relative aspect-[3/4] bg-neutral-50 border border-stone-100 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hot/New Tags */}
                {product.isTrending && (
                  <span className="absolute top-2.5 left-2.5 bg-neutral-900 text-white text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 shadow-sm">
                    Hot Pick
                  </span>
                )}
                {product.isNew && !product.isTrending && (
                  <span className="absolute top-2.5 left-2.5 bg-green-50 text-green-800 border border-green-200 text-[9px] uppercase font-mono tracking-wider px-2 py-0.5">
                    Fresh drop
                  </span>
                )}

                {/* Micro Details overlay on Hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="w-full bg-white text-black py-2.5 text-center text-[10px] uppercase font-mono tracking-widest font-semibold shadow shadow-black/15 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Couture Specs
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-light tracking-tight text-stone-800 truncate pr-2 group-hover:text-black">
                    {product.name}
                  </h3>
                  <span className="font-mono text-stone-900">${product.price}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase capitalize">{product.category}</span>
                  <div className="flex items-center space-x-1 text-stone-500">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-mono text-zinc-600">{product.rating}</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 font-light truncate">
                  {product.fabric}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-neutral-200 space-y-3">
          <p className="text-neutral-500 text-sm font-light">
            No fashion elements matching the requested filter combinations are currently in active stock.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedSize('All');
              setMaxPrice(300);
            }}
            className="text-xs font-mono uppercase bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
