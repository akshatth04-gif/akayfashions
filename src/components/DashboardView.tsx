import React, { useState, useEffect } from 'react';
import { User, Package, Heart, MapPin, CreditCard, ChevronRight, Award, Share2, Clipboard, Download, RefreshCw, CheckCircle } from 'lucide-react';
import { Product, Order, UserProfile, Address } from '../types';

interface DashboardViewProps {
  wishlist: Product[];
  onSelectProduct: (p: Product) => void;
  onNavigate: (view: string) => void;
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

export default function DashboardView({
  wishlist,
  onSelectProduct,
  onNavigate,
  profile,
  onUpdateProfile
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>('orders');
  
  // Orders history
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Address modal/inputs
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', zip: '', phone: '' });

  // Invoice display
  const [activeInvoice, setActiveInvoice] = useState<Order | null>(null);

  // Fetch orders
  const fetchOrders = () => {
    setLoadingOrders(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update profile handler
  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Akay Profiles Updated Safely.');
  };

  // Add Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;
    const added: Address = {
      id: 'addr-' + Math.floor(Math.random() * 1000),
      ...newAddress
    };
    onUpdateProfile({
      ...profile,
      addresses: [...profile.addresses, added]
    });
    setNewAddress({ name: '', street: '', city: '', zip: '', phone: '' });
    setShowAddressForm(false);
  };

  // Process return ticket
  const handleRequestReturn = (id: string) => {
    fetch('/api/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id, status: 'Returned' })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          alert('Return ticket generated. Post labels will be dispatched, and balance refunded inside 48 hours.');
          fetchOrders();
        }
      });
  };

  return (
    <div id="dashboard-view" className="space-y-10">
      {/* Account Hero Card */}
      <section className="bg-neutral-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between border border-neutral-800">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
            <User className="h-6 w-6 text-neutral-300" />
          </div>
          <div>
            <h2 className="text-xl font-light tracking-tight">{profile.name}</h2>
            <p className="text-xs font-mono text-neutral-400">{profile.email}</p>
          </div>
        </div>

        {/* Loyalty & Referrals */}
        <div className="flex space-x-6 mt-6 md:mt-0 border-t md:border-t-0 border-neutral-800 pt-4 md:pt-0">
          <div className="space-y-1">
            <span className="flex items-center space-x-1 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>Loyalty Points</span>
            </span>
            <p className="text-2xl font-light tracking-tight text-white">{profile.loyaltyPoints} PTS</p>
          </div>
          <div className="space-y-1">
            <span className="flex items-center space-x-1 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
              <Share2 className="h-3.5 w-3.5 text-blue-400" />
              <span>Akay Referral</span>
            </span>
            <div className="flex items-center space-x-2 bg-neutral-800 px-2 py-1 border border-neutral-700">
              <span className="font-mono text-xs font-medium text-blue-300">{profile.referralCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(profile.referralCode);
                  alert('Referral key copied! Share to unlock 10% cash back values.');
                }}
                className="text-white hover:text-blue-300"
              >
                <Clipboard className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation and Cabinet Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left: Tab selectors */}
        <div className="space-y-1 md:col-span-1">
          <button
            id="tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 text-xs uppercase font-mono tracking-wider transition-colors border ${
              activeTab === 'orders' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-stone-700 hover:bg-neutral-50 border-neutral-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Order History</span>
            </div>
            <ChevronRight className="h-3 w-3" />
          </button>

          <button
            id="tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3 text-xs uppercase font-mono tracking-wider transition-colors border ${
              activeTab === 'profile' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-stone-700 hover:bg-neutral-50 border-neutral-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>User Profile</span>
            </div>
            <ChevronRight className="h-3 w-3" />
          </button>

          <button
            id="tab-wishlist"
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between p-3 text-xs uppercase font-mono tracking-wider transition-colors border ${
              activeTab === 'wishlist' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-stone-700 hover:bg-neutral-50 border-neutral-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Saved Wishlist ({wishlist.length})</span>
            </div>
            <ChevronRight className="h-3 w-3" />
          </button>

          <button
            id="tab-addresses"
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3 text-xs uppercase font-mono tracking-wider transition-colors border ${
              activeTab === 'addresses' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-stone-700 hover:bg-neutral-50 border-neutral-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Saved Addresses</span>
            </div>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Right Tab workspace content */}
        <div className="md:col-span-3 min-h-[300px]">
          {/* Order history */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-neutral-900 border-b pb-2">Active Order logbook</h3>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs font-mono text-neutral-400">Syncing database collections...</div>
              ) : orders.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {orders.map((ord, i) => (
                    <div key={ord.id} className="py-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 bg-neutral-50 p-4 border border-stone-100">
                        <div>
                          <p className="font-mono uppercase text-[11px]"><strong>Order ID:</strong> {ord.id}</p>
                          <p className="text-neutral-400 font-mono text-[10px]">{new Date(ord.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`px-2 py-0.5 font-mono text-[10px] uppercase font-bold rounded ${
                            ord.status === 'Delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                            ord.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            ord.status === 'Returned' ? 'bg-stone-100 text-purple-700' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}>
                            {ord.status}
                          </span>
                          <button
                            onClick={() => setActiveTrackingOrder(ord)}
                            className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
                          >
                            Track Package
                          </button>
                          <button
                            onClick={() => setActiveInvoice(ord)}
                            className="hover:text-black text-neutral-500 font-mono text-[10px] uppercase tracking-widest flex items-center space-x-1"
                          >
                            <Download className="h-3 w-3" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="grid grid-cols-1 gap-2 pl-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs text-neutral-700 py-1">
                            <div className="flex items-center space-x-3">
                              <img src={it.product.images[0]} alt={it.product.name} className="h-10 w-9 object-cover border" />
                              <div>
                                <p className="font-normal">{it.product.name}</p>
                                <p className="text-[10px] text-neutral-400 font-mono">
                                  Color: {it.selectedColor.name} | Size: {it.selectedSize} | Qty: {it.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono text-neutral-900">${it.product.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end space-x-4 border-t pt-3 text-xs font-mono">
                        <span>Subtotal: ${ord.subtotal}</span>
                        <span>Tax: ${ord.tax}</span>
                        <span className="text-neutral-900 font-semibold">Total paid: ${ord.total}</span>
                      </div>

                      {/* Return actions */}
                      {ord.status === 'Delivered' && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleRequestReturn(ord.id)}
                            className="text-stone-500 hover:text-red-500 font-mono text-[10px] uppercase tracking-wider border-b border-dashed border-stone-300"
                          >
                            Request Refund / Return
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-neutral-200">
                  <p className="text-xs text-neutral-400 font-mono uppercase pb-3">No active orders found.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="bg-neutral-950 text-white text-[10px] font-mono uppercase tracking-widest px-4 py-2"
                  >
                    Browse Catalogs
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateInfo} className="space-y-6">
              <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-neutral-900 border-b pb-2">User Profile credentials</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-neutral-500 font-mono text-[10px] uppercase">Account holder Name</label>
                  <input
                    type="text"
                    defaultValue={profile.name}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:bg-white focus:border-black"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-neutral-500 font-mono text-[10px] uppercase">Primary Email</label>
                  <input
                    type="email"
                    defaultValue={profile.email}
                    disabled
                    className="w-full bg-neutral-100 border border-neutral-200 px-3 py-2 text-stone-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-neutral-500 font-mono text-[10px] uppercase">Phone number reference</label>
                  <input
                    type="text"
                    defaultValue={profile.phone}
                    className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 outline-none focus:bg-white focus:border-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider px-6 py-2.5"
              >
                Save update changes
              </button>
            </form>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-neutral-900 border-b pb-2">Active Saved Elements</h3>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {wishlist.map(product => (
                    <div key={product.id} className="group cursor-pointer space-y-2 text-xs border border-neutral-100 p-2.5">
                      <div className="aspect-[3/4] overflow-hidden bg-neutral-50 cursor-pointer" onClick={() => onSelectProduct(product)}>
                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover rounded" />
                      </div>
                      <div>
                        <h4 className="font-light tracking-tight text-neutral-800 truncate" onClick={() => onSelectProduct(product)}>{product.name}</h4>
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="font-mono text-zinc-900">${product.price}</span>
                          <button
                            onClick={() => onSelectProduct(product)}
                            className="font-mono text-[10px] uppercase text-indigo-500 hover:underline"
                          >
                            Explore →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-neutral-200">
                  <p className="text-xs text-neutral-400 font-mono uppercase pb-3">Your Wishlist is currently clean.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="bg-neutral-950 text-white text-[10px] font-mono uppercase tracking-widest px-4 py-2"
                  >
                    Add custom items
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Addresses list */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-neutral-900">Registered shipping address books</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="font-mono text-[11px] uppercase tracking-wider text-indigo-500 hover:underline"
                >
                  + Add New Address
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="space-y-4 bg-neutral-50 p-4 border border-neutral-200 text-xs">
                  <span className="block font-mono text-[10px] uppercase text-neutral-500">Address Details</span>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Receiver Name"
                      required
                      value={newAddress.name}
                      onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="bg-white border p-2 col-span-2 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      value={newAddress.street}
                      onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="bg-white border p-2 col-span-2 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={newAddress.city}
                      onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="bg-white border p-2 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Zip Code"
                      required
                      value={newAddress.zip}
                      onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })}
                      className="bg-white border p-2 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Telephone Contact"
                      value={newAddress.phone}
                      onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="bg-white border p-2 col-span-2 outline-none"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="bg-neutral-900 text-white font-mono text-[10px] px-4 py-2 uppercase">
                      Register
                    </button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="text-neutral-500 font-mono text-[10px] px-3">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.addresses.map(addr => (
                  <div key={addr.id} className="border border-neutral-100 p-4 bg-neutral-50/50 space-y-2 text-xs relative">
                    <span className="absolute top-3 right-3 bg-white text-neutral-400 text-[9px] font-mono border px-1">ACTIVE</span>
                    <p className="font-semibold text-neutral-900">{addr.name}</p>
                    <p className="text-neutral-600 font-light">{addr.street}</p>
                    <p className="text-neutral-600 font-light">{addr.city}, {addr.zip}</p>
                    <p className="font-mono text-[10px] text-neutral-400">T: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Tracking simulation modal block */}
      {activeTrackingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 border border-neutral-300 space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-black">Order Tracking System: {activeTrackingOrder.id}</h4>
              <button onClick={() => setActiveTrackingOrder(null)} className="text-neutral-400 hover:text-black font-mono font-bold text-sm">×</button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <p><strong>Courier Ref:</strong> DHL Global Express</p>
              <p><strong>Tracking Number:</strong> {activeTrackingOrder.trackingNumber || 'TRK-AKAY-PENDING'}</p>
              <p><strong>Carrier Route Estimate:</strong> 2-3 business days.</p>
            </div>

            {/* Tracking Flowchart */}
            <div className="border-t pt-4 space-y-4">
              <span className="block font-semibold font-mono text-[10px] uppercase text-neutral-400 pb-2">Real-time Carrier Route Status</span>
              
              <div className="relative flex justify-between items-center pl-4 pr-4">
                <div className="absolute top-2 w-[85%] bg-neutral-200 h-0.5 z-0 left-[10%]" />
                
                {/* Stage 1 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-5 w-5 bg-black text-white text-[10px] font-mono font-bold flex items-center justify-center rounded-full">✓</div>
                  <span className="font-mono text-[9px] uppercase tracking-wide pt-1 text-black">Authorized</span>
                </div>

                {/* Stage 2 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`h-5 w-5 text-[10px] font-mono font-bold flex items-center justify-center rounded-full border ${
                    activeTrackingOrder.status === 'Shipped' || activeTrackingOrder.status === 'Delivered' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                  }`}>✓</div>
                  <span className={`font-mono text-[9px] uppercase tracking-wide pt-1 ${
                    activeTrackingOrder.status === 'Shipped' || activeTrackingOrder.status === 'Delivered' ? 'text-black' : 'text-neutral-400'
                  }`}>In Transit</span>
                </div>

                {/* Stage 3 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`h-5 w-5 text-[10px] font-mono font-bold flex items-center justify-center rounded-full border ${
                    activeTrackingOrder.status === 'Delivered' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                  }`}>✓</div>
                  <span className={`font-mono text-[9px] uppercase tracking-wide pt-1 ${
                    activeTrackingOrder.status === 'Delivered' ? 'text-black font-bold' : 'text-neutral-400'
                  }`}>Out for Delivery</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => setActiveTrackingOrder(null)}
                className="bg-neutral-900 text-white font-mono text-[10px] uppercase tracking-wider px-4 py-2"
              >
                Close Tracking Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Invoice modal block */}
      {activeInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl p-8 border border-neutral-300 space-y-6 text-xs text-neutral-800">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-lg font-light tracking-widest text-[#111] uppercase font-mono">AkayFashions</h3>
                <p className="text-neutral-400 font-mono text-[9px]">Couture Society. Registered Tax No. AK-83492819-K</p>
              </div>
              <div className="text-right">
                <span className="block font-mono text-zinc-400 text-[10px]">TAX INVOICE RECORD</span>
                <p className="font-mono">{activeInvoice.id}</p>
                <p className="font-mono text-[9px] text-neutral-400">{new Date(activeInvoice.date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Users credentials */}
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 border border-stone-100">
              <div>
                <span className="block text-neutral-400 font-mono text-[9px] uppercase tracking-wide mb-1">Delivered details</span>
                <p className="font-semibold text-black">{activeInvoice.address.name}</p>
                <p className="font-light">{activeInvoice.address.street}</p>
                <p className="font-light">{activeInvoice.address.city}, {activeInvoice.address.zip}</p>
                <p className="font-mono text-[9px] pt-1">T: {activeInvoice.address.phone}</p>
              </div>
              <div className="text-right">
                <span className="block text-neutral-400 font-mono text-[9px] uppercase tracking-wide mb-1">Financial record</span>
                <span className="block text-[10px] font-mono">Gateway: Razorpay SIM</span>
                <span className="block text-[10px] font-mono">Status: Cleared capture</span>
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between font-mono text-neutral-400 text-[9px] uppercase border-b pb-1">
                <span>Description</span>
                <div className="flex space-x-8">
                  <span>Qty</span>
                  <span>Amount</span>
                </div>
              </div>

              {activeInvoice.items.map((item, id) => (
                <div key={id} className="flex justify-between text-stone-700 py-1.5 border-b border-stone-50">
                  <div>
                    <p className="font-normal text-stone-900">{item.product.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono">Color: {item.selectedColor.name} | Size: {item.selectedSize}</p>
                  </div>
                  <div className="flex space-x-12 items-center">
                    <span className="font-mono">{item.quantity}</span>
                    <span className="font-mono font-medium">${item.product.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost summations */}
            <div className="flex flex-col items-end space-y-1 pt-2 font-mono text-stone-600">
              <p>Subtotal: ${activeInvoice.subtotal}</p>
              <p>Discount: -${activeInvoice.discount}</p>
              <p>Tax (calculated): ${activeInvoice.tax}</p>
              <p>Shipping duty: ${activeInvoice.shipping}</p>
              <p className="text-black font-semibold text-sm border-t pt-1.5 W-32 text-right">TOTAL RECORDED: ${activeInvoice.total}</p>
            </div>

            <div className="pt-6 border-t flex justify-between items-center text-[10px] text-zinc-400">
              <span>Thank you for being part of AkayFashions Society.</span>
              <div className="space-x-2">
                <button
                  onClick={() => alert('Dispatched virtual print queue signal.')}
                  className="bg-black text-white px-3.5 py-1.5 font-mono uppercase tracking-wider"
                >
                  Print PDF
                </button>
                <button
                  onClick={() => setActiveInvoice(null)}
                  className="bg-neutral-100 hover:bg-neutral-200 text-stone-700 px-3.5 py-1.5 font-mono uppercase tracking-wider"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
