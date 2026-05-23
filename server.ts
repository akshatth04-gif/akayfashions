import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Deep copy of our initial products to manage backend state dynamically
const INITIAL_PRODUCTS = [
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

// Backend state containers (Active while dev server runs)
let productsDb = [...INITIAL_PRODUCTS];
let globalOrders: any[] = [
  {
    id: 'ORD-9843-K',
    date: '2026-05-18T14:30:00Z',
    items: [
      {
        product: { id: 'p1', name: 'Akay Classic Oversized Hoodie', price: 89, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'] },
        quantity: 1,
        selectedSize: 'M',
        selectedColor: { name: 'Matte Black', hex: '#111111' }
      }
    ],
    subtotal: 89,
    discount: 0,
    tax: 7.12,
    shipping: 10,
    total: 106.12,
    status: 'Shipped' as const,
    trackingNumber: 'TRK-AKAY-3819201',
    address: {
      id: 'a1',
      name: 'Shyam Khatu',
      street: '12 Luxury Boulevard',
      city: 'San Francisco',
      zip: '94105',
      phone: '+1 555-839-2018'
    }
  }
];

let globalCoupons = [
  { code: 'AKAYFASHION20', discountPercent: 20, minSpend: 100, description: '20% off on premium orders above $100' },
  { code: 'FIRSTCHIC10', discountPercent: 10, minSpend: 0, description: '10% sitewide discount for early access patrons' },
  { code: 'LUXESTREET30', discountPercent: 30, minSpend: 200, description: '30% massive reward discount on purchases tiering above $200' }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enforce standard body parsers for JSON and Base64 uploads
  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: true, limit: '12mb' }));

  // --- Initialize Gemini safely with our recommended settings ---
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log('Gemini AI successfully initialized server-side.');
    } catch (e) {
      console.error('Failed to initialize Gemini Client:', e);
    }
  }

  // Helper to extract text safely from response Candidates
  const getCleanText = (response: any): string => {
    return response?.text || '';
  };

  // ===========================
  // BRAND API ENDPOINTS
  // ===========================

  // 1. Get products list
  app.get('/api/products', (req, res) => {
    res.json({ success: true, products: productsDb });
  });

  // 2. Add/Edit product (Admin action)
  app.post('/api/products', (req, res) => {
    const item = req.body;
    if (!item.name || !item.price) {
      return res.status(400).json({ success: false, message: 'Invalid product details' });
    }

    if (item.id) {
      // Edit
      const idx = productsDb.findIndex(p => p.id === item.id);
      if (idx !== -1) {
        productsDb[idx] = { ...productsDb[idx], ...item };
        return res.json({ success: true, product: productsDb[idx] });
      }
    }

    // Add
    const newId = 'p-' + Math.floor(Math.random() * 9000 + 1000);
    const newProduct = {
      id: newId,
      rating: 5.0,
      reviewsCount: 1,
      variants: {
        sizes: item.variants?.sizes || ['S', 'M', 'L', 'XL'],
        colors: item.variants?.colors || [{ name: 'Absolute Charcoal', hex: '#333333' }]
      },
      fabric: item.fabric || '100% Combed Heavy Cotton',
      isTrending: item.isTrending || false,
      isNew: item.isNew || true,
      isSeasonal: item.isSeasonal || false,
      ...item
    };
    productsDb.push(newProduct);
    res.json({ success: true, product: newProduct });
  });

  // 3. Delete product (Admin action)
  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const initialLen = productsDb.length;
    productsDb = productsDb.filter(p => p.id !== id);
    if (productsDb.length < initialLen) {
      res.json({ success: true, message: 'Item deleted safely' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  });

  // 4. Coupons management
  app.get('/api/coupons', (req, res) => {
    res.json({ success: true, coupons: globalCoupons });
  });

  app.post('/api/coupons', (req, res) => {
    const { code, discountPercent, minSpend, description } = req.body;
    if (!code || !discountPercent) {
      return res.status(400).json({ success: false, message: 'Code and discount value required' });
    }
    const idx = globalCoupons.findIndex(c => c.code.toLowerCase() === code.toLowerCase());
    const newCoupon = { code: code.toUpperCase(), discountPercent: Number(discountPercent), minSpend: Number(minSpend || 0), description };
    if (idx !== -1) {
      globalCoupons[idx] = newCoupon;
    } else {
      globalCoupons.push(newCoupon);
    }
    res.json({ success: true, coupons: globalCoupons });
  });

  // 5. Orders API
  app.get('/api/orders', (req, res) => {
    res.json({ success: true, orders: globalOrders });
  });

  app.post('/api/orders', (req, res) => {
    const { items, subtotal, discount, tax, shipping, total, address } = req.body;
    const newOrder = {
      id: 'ORD-' + Math.floor(Math.random() * 90000 + 10000) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      date: new Date().toISOString(),
      items,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      status: 'Pending' as const,
      trackingNumber: 'TRK-AKAY-' + Math.floor(Math.random() * 9000000 + 1000000),
      address
    };

    // Deduct stock levels dynamically
    items.forEach((item: any) => {
      const match = productsDb.find(p => p.id === item.product.id);
      if (match) {
        match.stock = Math.max(0, match.stock - item.quantity);
      }
    });

    globalOrders.unshift(newOrder);
    res.json({ success: true, order: newOrder });
  });

  // Change order status (Admin function)
  app.post('/api/orders/update-status', (req, res) => {
    const { orderId, status } = req.body;
    const ord = globalOrders.find(o => o.id === orderId);
    if (!ord) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    ord.status = status;
    res.json({ success: true, order: ord });
  });

  // 6. Payment Simulators
  app.post('/api/payments/razorpay', (req, res) => {
    const { amount, couponCode } = req.body;
    // Captures order amount, completes secure server simulation
    const transactionId = 'pay_rzr_' + Math.floor(Math.random() * 900000000 + 100000000);
    const signature = 'sig_' + Math.floor(Math.random() * 900000000 + 100000000);
    res.json({
      success: true,
      gateway: 'Razorpay',
      transactionId,
      signature,
      amountPaid: amount,
      currency: 'USD',
      status: 'captured'
    });
  });

  app.post('/api/payments/stripe', (req, res) => {
    const { amount } = req.body;
    const sessionId = 'cs_test_' + Math.floor(Math.random() * 900000000 + 100000000);
    res.json({
      success: true,
      gateway: 'Stripe',
      sessionId,
      checkoutUrl: '#success-checkout-mock',
      amountPaid: amount,
      status: 'succeeded'
    });
  });

  // 7. Sales Analytics Endpoint (Admin Panel Dashboard)
  app.get('/api/admin/analytics', (req, res) => {
    const totalRevenue = globalOrders
      .filter(o => o.status !== 'Returned')
      .reduce((sum, o) => sum + o.total, 0);

    const productsStock = productsDb.reduce((sum, p) => sum + p.stock, 0);

    // Sales by Category
    const categoryStats: { [key: string]: number } = {};
    productsDb.forEach(p => {
      categoryStats[p.category] = (categoryStats[p.category] || 0) + p.stock;
    });

    res.json({
      success: true,
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: globalOrders.length,
        liveVisitsCount: Math.floor(Math.random() * 45 + 12),
        averageCartValue: globalOrders.length ? Math.round((totalRevenue / globalOrders.length) * 100) / 100 : 0,
        totalInventory: productsStock
      },
      categoryStats,
      recentActivity: globalOrders.slice(0, 5).map(o => ({
        id: o.id,
        customer: o.address.name,
        amount: o.total,
        status: o.status,
        date: o.date
      }))
    });
  });

  // ==========================================
  // GEMINI POWERED SMART CUSTOMER ASSISTANCE
  // ==========================================

  // A. Smart chatbot assistant with absolute catalog context
  app.post('/api/gemini/chat', async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const brandInstruction = `You are a highly premium, elite, AI Fashion Stylist and brand ambassador named "Akay Stylist" for AkayFashions, modeled like elite stylists for Zara, Nike, & H&M.
Your tone is incredibly polished, minimal, helpful, and sophisticated.
Your system instructions dictate that you MUST ONLY suggest real products that exist in AkayFashions inventory, avoiding fake suggestions.

Here is the current active inventory at AkayFashions:
${JSON.stringify(productsDb.map(p => ({ id: p.id, name: p.name, price: `$${p.price}`, category: p.category, description: p.description, colors: p.variants.colors.map(c => c.name), sizes: p.variants.sizes })))}

Style Guidelines & Store Operations Support:
- Address users with high fashion courtesy. Suggest layering ideas.
- Free shipping on custom premium orders above $100. Over 14-days returns.
- Always recommend complementary pairs (e.g. if dressing with a hoodie, recommend our Volt retro sneakers or modern cargo denim joggers).
- If the user asks general styling questions, answer with high-fashion expertise and quote our catalog. Keep responses stylishly concise (under 120 words).`;

    // 1. Check if Gemini AI client is active
    if (!ai) {
      // Seamless luxury simulation fallback
      return res.json({
        success: true,
        text: getStylistLocalResponse(message),
        isAI: false
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${brandInstruction}\nUser query: ${message}` }] }
        ]
      });

      const responseText = getCleanText(response);
      res.json({
        success: true,
        text: responseText || 'Our stylus is reflecting on this beautiful look. Could you share more details?',
        isAI: true
      });
    } catch (err: any) {
      console.error('Gemini generateContent error in chat:', err);
      res.json({
        success: true,
        text: getStylistLocalResponse(message),
        isAI: false
      });
    }
  });

  // B. AI Outfit Recommendation ("Complete the Look")
  app.post('/api/gemini/outfit', async (req, res) => {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    const sourceProduct = productsDb.find(p => p.id === productId);
    if (!sourceProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const recommendationInstruction = `You are the premium AI Stylist engine for AkayFashions.
Given a user viewing product: "${sourceProduct.name}" (Category: ${sourceProduct.category}, Color theme: ${JSON.stringify(sourceProduct.variants.colors)}).

Assess other products from our selection and recommend exactly 2-3 matching products for a coordinated luxury outfit look ("Complete the Look").
Explain the fashion synergy briefly in a premium style, recommending specific items in our selection.
Only recommend actual items in this selection:
${JSON.stringify(productsDb.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price })))}

Return your styling guides and pairings back to the client. Keep it ultra premium and aesthetically focused. Please output your response.`;

    if (!ai) {
      // Highly dynamic rule-based styling fallback
      const recommendations = getLocalMatchingOutfit(sourceProduct);
      return res.json({
        success: true,
        stylingAdvisory: `A complementary curation styled around your choice of ${sourceProduct.name}. Elevate this silhouette through texture contrast: combining structured heavy lines with soft fluid drops.`,
        recommendedIds: recommendations,
        isAI: false
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: recommendationInstruction
      });

      const advisory = getCleanText(response) || 'A custom styling combination prepared with attention to shape, weight, and volume.';
      const recommendedIds = getLocalMatchingOutfit(sourceProduct);

      res.json({
        success: true,
        stylingAdvisory: advisory,
        recommendedIds,
        isAI: true
      });
    } catch (err) {
      const recommendations = getLocalMatchingOutfit(sourceProduct);
      res.json({
        success: true,
        stylingAdvisory: `A complimentary pairing assembled with our organic selection. Style this ${sourceProduct.category} signature look with high-density materials to anchor the silhouette.`,
        recommendedIds: recommendations,
        isAI: false
      });
    }
  });

  // C. Simulated Multimodal "Virtual Try-On" Analyst
  app.post('/api/gemini/tryon', async (req, res) => {
    const { imageBase64, productId, userComment } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product selection required for Virtual Try-on' });
    }

    const selectedProduct = productsDb.find(p => p.id === productId);
    if (!selectedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // If we have a luxury image from user, use Gemini Multi-modal to write styling fit analysis!
    if (ai && imageBase64) {
      try {
        const imagePart = {
          inlineData: {
            mimeType: 'image/png',
            data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
          },
        };
        const promptPart = {
          text: `You are the Virtual Try-On Stylist for AkayFashions.
Analyze this user physical portrait and render a professional fit styling report for trying on the: "${selectedProduct.name}" (${selectedProduct.fabric}, ${selectedProduct.description}).
Comment elegantly on:
1. Proportions & Shoulder/height alignment based on their clothing silhouette.
2. Color contrast analysis between their skin/hair tone and the product colors.
3. Size recommendation (e.g., S, M, or L) to achieve the premium slouchy/oversized draping.
4. Tips for coordinating sunglasses or footwear to finalize the look.

Be detailed, complimentary, and ultra professional, utilizing high fashion vocabulary.`
        };

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: { parts: [imagePart, promptPart] }
        });

        const analysis = getCleanText(response);
        return res.json({
          success: true,
          analysisText: analysis || 'Drape calibrated on perspective. Fits excellently across the crown.',
          isAI: true
        });
      } catch (err) {
        console.error('Gemini TryOn multimodal failed, falling back to beautiful simulation:', err);
      }
    }

    // Rule-based try-on stylist feedback
    const baseFallbackAnalysis = `### VIRTUAL TRY-ON REPORT: ${selectedProduct.name.toUpperCase()}

* **Fit & Symmetry**: Structured calibration of dropped shoulders. The 3D model simulation confirms the fabric has an immaculate drape over your upper torso.
* **Palette Symbiosis**: The solid colorways offer rich visual harmony, enhancing your natural profile contrasts with a classic editorial energy.
* **Pro Size Recommendation**: We suggest choosing your normal size for an avant-garde relaxed drape, or down-size once for a clean tailored fit.
* **Styling Verdict**: Completed with heavy accent jewelry and raw canvas footwear to lock in a modern high-street silhouette.`;

    res.json({
      success: true,
      analysisText: baseFallbackAnalysis,
      isAI: false
    });
  });

  // LOCAL BRAIN UTILITIES (Elegant rule systems to make the chatbot fully functional even without keys)
  function getStylistLocalResponse(msg: string): string {
    const text = msg.toLowerCase();
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return "Welcome to AkayFashions Luxury Advisory. I am your Akay Stylist. Looking to craft an impeccable look? We carry premium Hoodies, Tech Jackets, Oversized tees, Joggers, and accessories like our Gold Polarized Sunglasses and Suede Trainers. Let me know what you are looking for!";
    }
    if (text.includes('hoodie') || text.includes('oversized') || text.includes('sweater')) {
      return "Our 'Akay Classic Oversized Hoodie' is a brand masterpiece crafted from a heavyweight 450 GSM French Terry fabric. It frames the shoulders beautifully. I recommend pairing it with our Cargo Denim Jogger and Volt Sneakers for a classic high-street luxury look. Need help selecting a size?";
    }
    if (text.includes('size') || text.includes('fit')) {
      return "Our garments are designed with premium, runway-inspired relaxed and oversized silhouettes. For a true luxury slouch drape, go with your standard size. If you prefer a sharper, more traditional look, we recommend sizing down one level. Standard measurements fit chest sizes S: 36-38\", M: 40-42\", L: 44-46\".";
    }
    if (text.includes('shipping') || text.includes('delivery')) {
      return "AkayFashions provides complimentary express shipping worldwide on all orders exceeding $100. For orders under $100, we offer comfortable flat-rate shipping for $10. Tracking numbers are generated immediately upon dispatch.";
    }
    if (text.includes('return') || text.includes('refund')) {
      return "We accept returns of unworn items in original packaging within 14 days of delivery. You can initiate a return directly from your Customer Dashboard. Refunds are processed back to your original payment within 2-3 business days.";
    }
    if (text.includes('discount') || text.includes('coupon') || text.includes('promo')) {
      return "Certainly! We have active luxury promos right now: Use 'AKAYFASHION20' for 20% off all premium collections over $100, or 'LUXESTREET30' for 30% off massive curations above $200. Apply them at checkout!";
    }
    return "Fascinating choice. To best capture the AkayFashions signature structural silhouette, I recommend layering our 280 GSM Slouchy Oversized Cotton Tee under the Flight flight-bomber, balanced below with vintage-wash denim cargos.";
  }

  function getLocalMatchingOutfit(prod: any): string[] {
    const list: string[] = [];
    if (prod.category === 'Hoodies' || prod.category === 'Oversized T-shirts') {
      list.push('p4'); // Cargo Pants
      list.push('p5'); // Sneakers
      list.push('p7'); // Glasses
    } else if (prod.category === 'Sneakers') {
      list.push('p1'); // Hoodie
      list.push('p4'); // Pants
    } else if (prod.category === 'Women\'s Fashion') {
      list.push('p6'); // Leather Bag
      list.push('p7'); // Sunglasses
    } else {
      list.push('p3'); // Tee
      list.push('p5'); // Sneakers
    }
    return list;
  }

  // Vite integration / Production asset serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static bundle from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AkayFashions Server successfully listening on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Critical failure during server startup:', err);
});
