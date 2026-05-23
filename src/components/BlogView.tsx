import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Clock, Tag } from 'lucide-react';
import { BlogPost, Product } from '../types';
import { SAMPLE_BLOGS } from '../data';

interface BlogViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export default function BlogView({ products, onSelectProduct }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeTag, setActiveTag] = useState('All');

  // Tags filter list
  const blogTags = ['All', 'Streetwear', 'Style Guide', 'Fashion Culture', 'Minimalism', 'Season Picks'];

  const filteredBlogs = SAMPLE_BLOGS.filter(post => {
    return activeTag === 'All' || post.tags.includes(activeTag);
  });

  return (
    <div id="blog-view" className="space-y-12">
      {selectedPost ? (
        // Active Editorial reader
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Editorials</span>
          </button>

          {/* Epic Header photo */}
          <div className="aspect-video overflow-hidden border border-neutral-200 shadow-sm relative">
            <img src={selectedPost.image} alt={selectedPost.title} className="h-full w-full object-cover" />
            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
              Akay Editorial
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-xs font-mono text-neutral-400">
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{selectedPost.date}</span>
              </span>
              <span>•</span>
              <span>By {selectedPost.author}</span>
            </div>

            <h1 className="text-3xl font-light tracking-tight text-neutral-900 leading-tight uppercase">
              {selectedPost.title}
            </h1>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedPost.tags.map(t => (
                <span key={t} className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-neutral-100 text-stone-700 text-[10px] font-mono rounded">
                  <Tag className="h-3 w-3 text-stone-400" />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Core Content Markdown parsing emulation */}
          <article className="prose prose-neutral text-stone-700 text-sm md:text-base leading-relaxed font-light space-y-6 pt-6 border-t border-neutral-100 whitespace-pre-line">
            {selectedPost.content}
          </article>

          {/* Complete the block suggestions */}
          <div className="border-t border-stone-200 pt-8 space-y-4">
            <span className="block font-mono text-xs uppercase tracking-wider text-black">Outfit Hacking: Styled products references</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.slice(0, 2).map(prod => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="group cursor-pointer bg-neutral-50 border border-neutral-200/60 p-3 hover:border-black transition-colors flex items-center space-x-3"
                >
                  <img src={prod.images[0]} alt={prod.name} className="h-14 w-12 object-cover border" />
                  <div>
                    <h5 className="font-light text-stone-800 text-xs tracking-tight group-hover:underline">{prod.name}</h5>
                    <span className="block font-mono text-[10px] text-zinc-900">${prod.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Hero blogs grid
        <div className="space-y-8">
          <div className="border-b border-zinc-100 pb-4">
            <span className="font-mono text-xs text-neutral-400 tracking-wider">FASHION JOURNAL</span>
            <h2 className="text-2xl font-light text-zinc-900 uppercase">Season Lookbooks & Trend Hacks</h2>
          </div>

          {/* Tags selectors bar */}
          <div className="flex flex-wrap gap-2">
            {blogTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3.5 py-1.5 text-xs font-mono transition-colors border ${
                  activeTag === tag
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-stone-600 border-neutral-200 hover:border-black'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Blogs Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBlogs.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer space-y-4 border border-zinc-100 p-4 hover:border-neutral-950 transition-colors bg-white flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-100 border">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>{post.date}</span>
                    <span className="uppercase text-stone-600 font-bold bg-neutral-100 px-1.5 py-0.5 rounded text-[9px]">{post.tags[0]}</span>
                  </div>

                  <h3 className="font-light text-xl tracking-tight text-neutral-900 uppercase group-hover:underline leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-zinc-500 font-light leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-800 uppercase tracking-widest pt-4 border-t border-stone-50 group-hover:text-black">
                  <BookOpen className="h-4 w-4" />
                  <span>Read Editorial</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
