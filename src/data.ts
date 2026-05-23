import { Product, BlogPost, Coupon } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Akay Classic Oversized Hoodie',
    price: 89,
    rating: 4.8,
    reviewsCount: 124,
    category: 'Hoodies',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-man-wearing-a-hoodie-standing-looking-at-camera-39732-large.mp4',
    variants: {
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Matte Black', hex: '#111111' },
        { name: 'Sand Beige', hex: '#D2B48C' },
        { name: 'Slate Gray', hex: '#708090' }
      ],
      style: ['Urban Streetwear', 'Minimal Lounge']
    },
    description: 'Elevate your off-duty styling with this heavy-knit organic cotton oversized hoodie. Crafted with dropped shoulders, raw-edge stitching, and double-lined hood for the ultimate drape and structural integrity.',
    fabric: '85% Organic Cotton, 15% Recycled Polyester (450 GSM French Terry)',
    stock: 45,
    isTrending: true,
    isNew: false,
    isSeasonal: true
  },
  {
    id: 'p2',
    name: 'Stealth Aviator Bomber Jacket',
    price: 185,
    rating: 4.9,
    reviewsCount: 89,
    category: 'Jackets',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800'
    ],
    variants: {
      sizes: ['M', 'L', 'XL'],
      colors: [
        { name: 'Midnight Charcoal', hex: '#2C3539' },
        { name: 'Combat Olive', hex: '#3B4E43' }
      ],
      style: ['High-Street Utility']
    },
    description: 'Our heritage bomber reimagined with a high-density, water-resistant nylon shell. Features technical arm pockets, contrast luxury inner quilted lining, and premium gunmetal zippers.',
    fabric: 'Waterproof Flight Nylon shell with eco-down padding.',
    stock: 12,
    isTrending: true,
    isNew: true,
    isSeasonal: false
  },
  {
    id: 'p3',
    name: 'Akay Slouchy Oversized Tee',
    price: 48,
    rating: 4.7,
    reviewsCount: 215,
    category: 'Oversized T-shirts',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800'
    ],
    variants: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Off-White', hex: '#FAF9F6' },
        { name: 'Washed Earth', hex: '#7E6D5B' },
        { name: 'Obsidian Black', hex: '#0B0C10' }
      ],
      style: ['Boxy Unisex']
    },
    description: 'A luxurious foundation. This boxy, high-collar oversized tee offers a heavy drape that looks immaculate layered or as a standalone centerpiece. Soft but structured.',
    fabric: '100% Supreme Combed Cotton (280 GSM Interlock Knit)',
    stock: 98,
    isTrending: false,
    isNew: true,
    isSeasonal: true
  },
  {
    id: 'p4',
    name: 'Streetwear Cargo Denim Jogger',
    price: 110,
    rating: 4.6,
    reviewsCount: 76,
    category: 'Streetwear',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800'
    ],
    variants: {
      sizes: ['30', '32', '34', '36'],
      colors: [
        { name: 'Vintage Wash Indigo', hex: '#4F738E' },
        { name: 'Acid Washed Black', hex: '#353839' }
      ]
    },
    description: 'Engineered pants featuring side bellowing utility cargo pockets, a comfortable elastic drawcord waist, and custom adjustable ankle ties for multiple styling variations.',
    fabric: '98% Premium Cotton Denim, 2% Elastane Blend detailing',
    stock: 24,
    isTrending: true,
    isNew: false,
    isSeasonal: false
  },
  {
    id: 'p5',
    name: 'Akay Retro Volt Sneakers',
    price: 160,
    rating: 4.9,
    reviewsCount: 310,
    category: 'Sneakers',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800'
    ],
    variants: {
      sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
      colors: [
        { name: 'Volt Red Blend', hex: '#E63946' },
        { name: 'Tan Suede', hex: '#C2B280' }
      ]
    },
    description: 'Premium craft meets high-intensity colors. These trainers offer multi-layer suede panels combined with highly breathable memory mesh and responsive aerodynamic sole elements.',
    fabric: 'Genuine Leather, Recycled Polyester Mesh, Vibram rubber outsoles',
    stock: 18,
    isTrending: true,
    isNew: false,
    isSeasonal: false
  },
  {
    id: 'p6',
    name: 'Minimalist Signature Leather Tote',
    price: 240,
    rating: 4.9,
    reviewsCount: 42,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800'
    ],
    variants: {
      sizes: ['One Size'],
      colors: [
        { name: 'Saddle Tan', hex: '#964B00' },
        { name: 'Absolute Black', hex: '#000000' }
      ]
    },
    description: 'Timeless luxury designed for everyday functionality. Hand-stitched full grain leather featuring magnetic brass lock tabs, secret laptop compartment, and micro-brushed brass hardware.',
    fabric: 'Aistudio-sourced Full Grain Bovine Leather with Brushed Brass Fittings',
    stock: 8,
    isTrending: false,
    isNew: true,
    isSeasonal: false
  },
  {
    id: 'p7',
    name: 'Octane Polarized Sunglasses',
    price: 65,
    rating: 4.5,
    reviewsCount: 93,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800'
    ],
    variants: {
      sizes: ['Regular'],
      colors: [
        { name: 'Champagne Gold', hex: '#F1E5AC' },
        { name: 'Glossy Black', hex: '#1C1C1C' }
      ]
    },
    description: 'Striking a balance between bold editorial framing and advanced outdoor functionality, the Octane glasses deliver 100% UV400 blocking with reinforced anti-scratch alloy hinges.',
    fabric: 'Stainless Steel Accents, Polarized Scratch-Resistant Lenses',
    stock: 36,
    isTrending: true,
    isNew: false,
    isSeasonal: true
  },
  {
    id: 'p8',
    name: 'Akay Asymmetric Pleated Dress',
    price: 145,
    rating: 4.8,
    reviewsCount: 61,
    category: 'Women\'s Fashion',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800'
    ],
    variants: {
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [
        { name: 'Deep Emerald', hex: '#0B6623' },
        { name: 'Coral Rose', hex: '#E9967A' },
        { name: 'Silk Sand', hex: '#EEDC82' }
      ]
    },
    description: 'Exude refined charm with our signature pleated dress, cut with a fluid asymmetrical hem and elegant cowl neckline. This garment floats in movement with a brilliant reflective finish.',
    fabric: '100% Satin Tencel Silk',
    stock: 14,
    isTrending: true,
    isNew: true,
    isSeasonal: true
  }
];

export const SAMPLE_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Rise of Luxury Streetwear Culture',
    summary: 'How hoodies and sneakers transitioned from skate subcultures to the runways of Milan and Paris.',
    content: `Streetwear is no longer a niche subculture; it has become the dominant force in global high fashion. Brands that once ignored hoodies and sneakers are now dedicating entire luxury collections to oversized silhouettes, graphics, and functional utility wear. 

At AkayFashions, we build outerwear that bridges the gap: heavy 450 GSM organic French Terry cotton that retains its premium drape while delivering high-street aesthetic excellence. 

### Key Elements of Modern Streetwear Styling:
1. **The Dropped Shoulder**: Provides relaxed elegance and comfortable laying options.
2. **Contrast of Weights**: Wear heavy cargo pants with minimalist structured accessories to balance proportions.
3. **Pops of Tech**: Incorporat polarized alloy fittings or multi-texture trainers to anchor a basic sweatshirt layout.

Discover how these micro-investments unlock a wardrobe full of high-low styling expressions.`,
    author: 'Akay Design Team',
    date: 'May 16, 2026',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800',
    tags: ['Streetwear', 'Style Guide', 'Fashion Culture']
  },
  {
    id: 'b2',
    title: 'Seasonal Palette: Mastering Earthy Neutrals',
    summary: 'Learn how to layer sand, charcoal, and warm clay hues for a rich, minimal everyday look.',
    content: `A neutral wardrobe is anything but boring. The secret to mastering minimalist monochromatic styling lies in microtexture variations and slight shifts in shade and material thickness.

Combining a matte washed-cotton oversized tee with an indigo or acid-washed denim cargo pant creates a narrative about volume and texture that demands attention without screaming for it.

### Your Earth-Tone Recipe:
* **The Suede Anchor**: Use a warm suede tan footwear or backpack to introduce raw visual warmth.
* **The High-Collar Tee**: A 280 GSM thick interlock collar helps frame your face, especially when peaking out from a zip-up bomber jacket.
* **Satin Silks**: Don't shy away from pairing high-sheen satin draped layers under coarse tech-nylon. The friction is where elegance lives.

Earthy tones emphasize craftsmanship, stitching, and high-end fabrics, rather than transient graphics.`,
    author: 'Emma Lindqvist, Head Stylist',
    date: 'May 12, 2026',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
    tags: ['Styling Tips', 'Minimalism', 'Season Picks']
  }
];

export const SAMPLE_COUPONS: Coupon[] = [
  { code: 'AKAYFASHION20', discountPercent: 20, minSpend: 100, description: '20% off on premium orders above $100' },
  { code: 'FIRSTCHIC10', discountPercent: 10, minSpend: 0, description: '10% sitewide discount for early access patrons' },
  { code: 'LUXESTREET30', discountPercent: 30, minSpend: 200, description: '30% massive reward discount on purchases tiering above $200' }
];

export const BRAND_STORY = {
  philosophy: 'AkayFashions represents the intersection of structural tailoring and high-density, raw-edge street aesthetics. Born in the heart of urban design hubs, we craft timeless items prioritizing custom mills, non-industrial weights, and a deep design language of geometry and drape.',
  founderQuote: 'We do not build clothes to cover, we structure pieces to frame. Fabric is architecture for the human form.',
  achievements: [
    { title: 'Organic Mills Only', count: '100%' },
    { title: 'Global Delivery Hubs', count: '45 countries' },
    { title: 'Loyalty Rewards Points', count: '10k+ active' }
  ]
};

export const FAQ_DATA = [
  { q: 'How does your AI Outfit suggestion system work?', a: 'Our server-side AI model utilizes Gemini to analyze your product page, user browsing profile, and styling tags to generate an authentic fashion recommendation list (e.g. suggesting custom cargos, matching accessories, and footwears) to deliver "Complete the Look" combos.' },
  { q: 'What are the delivery times and dynamic taxes?', a: 'Standard shipping takes 3-5 business days. Express overnight is available at checkout. Local taxes are computed in live based on county zip codes (calculated securely under 8% at Checkout).' },
  { q: 'Can I request refunds or returns directly?', a: 'Our intuitive Customer Dashboard lets you issue return tickets instantly within 14 days of delivery. On confirmation, your balance is fully credited/refunded.' }
];
