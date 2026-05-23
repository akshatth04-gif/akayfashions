import React, { useState, useEffect } from 'react';
import { DollarSign, Eye, ShoppingCart, Loader2, Save, Trash2, Edit2, AlertCircle, PlusCircle, CheckCircle, BarChart3, Tag, FileText } from 'lucide-react';
import { Product, Order, Coupon } from '../types';

interface AdminPanelProps {
  products: Product[];
  onRefreshProducts: () => void;
}

export default function AdminPanel({ products, onRefreshProducts }: AdminPanelProps) {
  // Analytical stats
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Active sub-sections
  const [adminTab, setAdminTab] = useState<'analytics' | 'products' | 'orders' | 'coupons'>('analytics');

  // Product CRUD states
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Coupons states
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercent: '', minSpend: '', description: '' });

  // Orders loop
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  // Load metrics and active server arrays
  const loadAdminMetrics = () => {
    setLoadingStats(true);
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAnalytics(data);
        }
      })
      .catch(() => {});

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLocalOrders(data.orders);
        }
      })
      .catch(() => {});

    fetch('/api/coupons')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCoupons(data.coupons);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  };

  useEffect(() => {
    loadAdminMetrics();
  }, [products]);

  // Handle Save product action
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct?.name || !editProduct?.price) {
      alert('Product name and pricing calculations are mandatory.');
      return;
    }

    setIsSavingProduct(true);
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editProduct)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Inventory updated successfully.');
          onRefreshProducts();
          setShowProductForm(false);
          setEditProduct(null);
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(() => alert('Failed to sync. Server timeout.'))
      .finally(() => setIsSavingProduct(false));
  };

  // Handle Delete Product action
  const handleDeleteProduct = (id: string) => {
    if (!confirm('Are you absolutely certain you want to purge this premium item from active storefront collections?')) return;

    fetch(`/api/products/${id}`, {
      method: 'DELETE'
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          alert('Product purged safely.');
          onRefreshProducts();
        } else {
          alert('Error purging item.');
        }
      });
  };

  // Add Coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountPercent) return;
    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCoupon)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Coupon code verified and published.');
          setNewCoupon({ code: '', discountPercent: '', minSpend: '', description: '' });
          loadAdminMetrics();
        }
      });
  };

  // Update order status on backend
  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    fetch('/api/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(`Order parcel updated to status: ${newStatus}`);
          loadAdminMetrics();
        }
      });
  };

  return (
    <div id="admin-panel" className="space-y-8 bg-zinc-50 p-6 md:p-8 rounded border border-zinc-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-zinc-200">
        <div>
          <span className="font-mono text-xs text-neutral-400 tracking-wider">SECURE BRAND MASTER PANEL</span>
          <h2 className="text-2xl font-light text-zinc-900 uppercase">AkayFashions Administrative Board</h2>
        </div>
        <button
          onClick={loadAdminMetrics}
          className="bg-white hover:bg-neutral-50 px-4 py-2 text-xs font-mono uppercase tracking-wider border text-neutral-700 flex items-center space-x-1.5"
        >
          {loadingStats ? <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" /> : <Eye className="h-3.5 w-3.5" />}
          <span>Refresh state streams</span>
        </button>
      </div>

      {/* Admin Tab selection menu */}
      <div className="flex bg-neutral-900 text-white font-mono text-[11px] uppercase tracking-wider overflow-x-auto divide-x divide-neutral-800">
        <button
          onClick={() => setAdminTab('analytics')}
          className={`py-3 px-4 flex items-center space-x-2 ${adminTab === 'analytics' ? 'bg-neutral-800 text-amber-400 font-bold' : 'hover:bg-neutral-800 text-neutral-300'}`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Sales & Analytics</span>
        </button>
        <button
          onClick={() => setAdminTab('products')}
          className={`py-3 px-4 flex items-center space-x-2 ${adminTab === 'products' ? 'bg-neutral-800 text-amber-400 font-bold' : 'hover:bg-neutral-800 text-neutral-300'}`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Product Catalogs ({products.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('orders')}
          className={`py-3 px-4 flex items-center space-x-2 ${adminTab === 'orders' ? 'bg-neutral-800 text-amber-400 font-bold' : 'hover:bg-neutral-800 text-neutral-300'}`}
        >
          <FileText className="h-4 w-4" />
          <span>Active Orders ({localOrders.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('coupons')}
          className={`py-3 px-4 flex items-center space-x-2 ${adminTab === 'coupons' ? 'bg-neutral-800 text-amber-400 font-bold' : 'hover:bg-neutral-800 text-neutral-300'}`}
        >
          <Tag className="h-4 w-4" />
          <span>Promotions & Coupons</span>
        </button>
      </div>

      {/* Tabs panels */}
      <div className="min-h-[400px]">
        {/* 1. Analytics & Sales */}
        {adminTab === 'analytics' && (
          <div className="space-y-8">
            {/* Quick Metrics numbers row */}
            {analytics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="font-mono text-[9px] uppercase tracking-wide">Gross Sales Revenue</span>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-light text-zinc-950">${analytics.metrics?.totalRevenue}</p>
                </div>

                <div className="bg-white p-5 border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="font-mono text-[9px] uppercase tracking-wide">Total Order counts</span>
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-light text-zinc-950">{analytics.metrics?.totalOrders}</p>
                </div>

                <div className="bg-white p-5 border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="font-mono text-[9px] uppercase tracking-wide">Average Ticket worth</span>
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-light text-zinc-950">${analytics.metrics?.averageCartValue}</p>
                </div>

                <div className="bg-white p-5 border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="font-mono text-[9px] uppercase tracking-wide">Dynamic Live traffic</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-light text-green-600 animate-pulse">{analytics.metrics?.liveVisitsCount} ACTIVE</p>
                </div>
              </div>
            )}

            {/* Visual graph summary box with pure CSS layout bento blocks for elegance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-stone-700">
              <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
                <h4 className="font-semibold font-mono text-[10px] uppercase tracking-wide text-black border-b pb-1">Segment inventory weight calculations</h4>
                {analytics && (
                  <div className="space-y-3.5">
                    {Object.entries(analytics.categoryStats || {}).map(([cat, count]: [string, any]) => (
                      <div key={cat} className="space-y-1 font-mono">
                        <div className="flex justify-between">
                          <span>{cat}</span>
                          <strong>{count} items</strong>
                        </div>
                        <div className="w-full bg-zinc-100 h-2 rounded border">
                          <div style={{ width: `${Math.min(100, (count / 100) * 100)}%` }} className="bg-neutral-900 h-full transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 border border-zinc-200 shadow-sm space-y-4">
                <h4 className="font-semibold font-mono text-[10px] uppercase tracking-wide text-black border-b pb-1">Recent active customer logs</h4>
                <div className="divide-y divide-zinc-100 space-y-2 max-h-[300px] overflow-y-auto">
                  {analytics?.recentActivity?.map((act: any) => (
                    <div key={act.id} className="pt-2 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-black uppercase">{act.id}</p>
                        <p className="text-zinc-400 font-mono text-[9px]">{act.customer}</p>
                      </div>
                      <div className="text-right font-mono text-[10px]">
                        <span className="block font-bold text-black">${act.amount}</span>
                        <span className="text-[10px] text-zinc-400">{act.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Product Inventories Management */}
        {adminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-xs uppercase text-stone-600">Active storefront catalogs list</h3>
              <button
                onClick={() => {
                  setEditProduct({
                    name: '',
                    price: 49,
                    category: 'Streetwear',
                    description: '',
                    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800'],
                    variants: { sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Urban Onyx', hex: '#1C1C1C' }] }
                  });
                  setShowProductForm(true);
                }}
                className="bg-black hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider px-3.5 py-2 flex items-center space-x-1"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Publish Item</span>
              </button>
            </div>

            {/* Product form builder */}
            {showProductForm && editProduct && (
              <form onSubmit={handleSaveProduct} className="bg-white p-6 border border-zinc-200 rounded space-y-4 text-xs">
                <span className="block font-mono text-[10px] uppercase text-zinc-400 border-b pb-1">Product Details spec sheets</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">Item name</label>
                    <input
                      type="text"
                      required
                      value={editProduct.name || ''}
                      onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                      className="w-full border p-2 bg-neutral-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">Item Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      value={editProduct.price || 0}
                      onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                      className="w-full border p-2 bg-neutral-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">Category</label>
                    <input
                      type="text"
                      required
                      value={editProduct.category || ''}
                      placeholder="Hoodies, Sneakers, Accessories..."
                      onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                      className="w-full border p-2 bg-neutral-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1 col-span-3">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">Interactive visual photo URLs (comma split)</label>
                    <input
                      type="text"
                      required
                      value={editProduct.images?.join(', ') || ''}
                      onChange={e => setEditProduct({ ...editProduct, images: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full border p-2 bg-neutral-50 outline-none font-mono text-[11px]"
                    />
                  </div>
                  <div className="space-y-1 col-span-3">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">Item Fashion descriptions</label>
                    <textarea
                      rows={3}
                      required
                      value={editProduct.description || ''}
                      placeholder="Tell customers about the premium drape, tailoring, or silhouette shapes..."
                      onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                      className="w-full border p-2 bg-neutral-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">Fabric weight profiles</label>
                    <input
                      type="text"
                      value={editProduct.fabric || ''}
                      placeholder="e.g. 100% Cotton, 450 GSM"
                      onChange={e => setEditProduct({ ...editProduct, fabric: e.target.value })}
                      className="w-full border p-2 bg-neutral-50 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">Initial inventory Stock counts</label>
                    <input
                      type="number"
                      value={editProduct.stock || 0}
                      onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                      className="w-full border p-2 bg-neutral-50 outline-none"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] px-6 py-2.5 uppercase text-stone-100 flex items-center space-x-1"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSavingProduct ? 'Registering...' : 'Lock and publish'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditProduct(null);
                    }}
                    className="text-neutral-500 font-mono text-[10px] px-4"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Inventory table line list */}
            <div className="bg-white border rounded overflow-hidden text-neutral-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100 font-mono text-[10px] uppercase text-stone-500 border-b">
                    <th className="p-3">Item</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Pricing</th>
                    <th className="p-3">Inventory Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-light">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-50/50">
                      <td className="p-3 font-normal flex items-center space-x-3">
                        <img src={p.images[0]} alt="p" className="h-8 w-7 object-cover border" />
                        <span>{p.name}</span>
                      </td>
                      <td className="p-3 font-mono text-[10px] uppercase">{p.category}</td>
                      <td className="p-3 font-mono font-semibold">${p.price}</td>
                      <td className="p-3">
                        {p.stock <= 10 ? (
                          <span className="text-red-500 font-mono bg-red-50 p-1 rounded font-bold">LIMITED {p.stock}</span>
                        ) : (
                          <span className="text-zinc-600 font-mono bg-zinc-50 p-1 rounded">{p.stock} units</span>
                        )}
                      </td>
                      <td className="p-3 flex items-center space-x-4">
                        <button
                          onClick={() => {
                            setEditProduct(p);
                            setShowProductForm(true);
                          }}
                          className="text-blue-500 hover:text-black"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-stone-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Orders history loop */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-mono text-xs uppercase text-zinc-500">Live Customer Order Trackers log</h3>

            <div className="bg-white border rounded overflow-hidden">
              <table className="w-full text-left text-xs text-neutral-800 border-collapse">
                <thead>
                  <tr className="bg-neutral-100 font-mono text-[10px] text-zinc-400 uppercase">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Receiver details</th>
                    <th className="p-3">Totals amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Track Route Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-light">
                  {localOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-zinc-50/50">
                      <td className="p-3 font-mono font-bold uppercase">{ord.id}</td>
                      <td className="p-3">
                        <p className="font-normal">{ord.address.name}</p>
                        <p className="text-[10px] text-zinc-400">{ord.address.city}, {ord.address.zip}</p>
                      </td>
                      <td className="p-3 font-mono font-bold text-zinc-900">${ord.total}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${
                          ord.status === 'Delivered' ? 'bg-green-50 text-green-700 border' :
                          ord.status === 'Shipped' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-neutral-50 px-2 py-1 outline-none text-[10px] border"
                        >
                          <option value="Pending">Authorize (Pending)</option>
                          <option value="Shipped">Dispatched (Shipped)</option>
                          <option value="Delivered">Arrived (Delivered)</option>
                          <option value="Returned">Refunding (Returned)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Coupons management */}
        {adminTab === 'coupons' && (
          <div className="space-y-6">
            <h3 className="font-mono text-xs uppercase text-zinc-500">Configure promotional coupons codes</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form loader */}
              <form onSubmit={handleAddCoupon} className="bg-white p-5 border shadow-sm rounded text-xs space-y-4 lg:col-span-1 border-zinc-200">
                <span className="block font-mono text-[10px] uppercase text-zinc-400 border-b pb-1">Create Coupon</span>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-zinc-400 uppercase">Coupon code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LUXEHOLIDAY"
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className="w-full border p-2 bg-neutral-50 outline-none focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-zinc-400 uppercase">Discount Percent (%)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 20"
                    value={newCoupon.discountPercent}
                    onChange={e => setNewCoupon({ ...newCoupon, discountPercent: e.target.value })}
                    className="w-full border p-2 bg-neutral-50 outline-none focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-zinc-400 uppercase">Minimum Spend Threshold ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newCoupon.minSpend}
                    onChange={e => setNewCoupon({ ...newCoupon, minSpend: e.target.value })}
                    className="w-full border p-2 bg-neutral-50 outline-none focus:bg-white"
                  />
                </div>
                <div className="space-y-1 col-span-3">
                  <label className="font-mono text-[9px] text-zinc-400 uppercase">Display descriptions</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% off active streetwear items"
                    value={newCoupon.description}
                    onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    className="w-full border p-2 bg-neutral-50 outline-none focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 text-white font-mono text-xs uppercase py-2 tracking-wider"
                >
                  Publish Promo code
                </button>
              </form>

              {/* Coupons list */}
              <div className="bg-white border rounded overflow-hidden lg:col-span-2 text-stone-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 font-mono text-[10px] text-zinc-400 uppercase border-b">
                      <th className="p-3">Discount Code</th>
                      <th className="p-3">Reward Rate</th>
                      <th className="p-3">Minimum spend</th>
                      <th className="p-3">Operational labels</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-light">
                    {coupons.map((c, i) => (
                      <tr key={i} className="hover:bg-zinc-50/50">
                        <td className="p-3 font-mono font-bold text-neutral-900 border px-1 bg-neutral-50 flex items-center justify-center w-36 uppercase rounded">{c.code}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600">{c.discountPercent}% OFF</td>
                        <td className="p-3 font-mono">${c.minSpend || 0}</td>
                        <td className="p-3 text-neutral-500 font-light">{c.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
