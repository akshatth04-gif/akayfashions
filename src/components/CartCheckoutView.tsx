import React, { useState } from 'react';
import { Trash2, AlertCircle, ShoppingBag, ShieldCheck, Ticket, CreditCard, Sparkles, Send } from 'lucide-react';
import { CartItem, Coupon, Address, Product } from '../types';

interface CartCheckoutViewProps {
  cart: CartItem[];
  onUpdateCartItemQuantity: (id: string, size: string, colorHex: string, q: number) => void;
  onRemoveFromCart: (id: string, size: string, colorHex: string) => void;
  onNavigate: (view: string) => void;
  onClearCart: () => void;
}

export default function CartCheckoutView({
  cart,
  onUpdateCartItemQuantity,
  onRemoveFromCart,
  onNavigate,
  onClearCart
}: CartCheckoutViewProps) {
  // Steps state: cart -> checkout -> success
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  // Shipping details state
  const [address, setAddress] = useState<Address>({
    id: 'temp',
    name: '',
    street: '',
    city: '',
    zip: '94105',
    phone: ''
  });

  // Selected payment gateway state
  const [gateway, setGateway] = useState<'Razorpay' | 'Stripe'>('Razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');

  // Confirmation email stimulation state
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  // Calculate Subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Apply discount percent
  const discountAmount = activeCoupon && subtotal >= activeCoupon.minSpend
    ? Math.round((subtotal * activeCoupon.discountPercent / 100) * 100) / 100
    : 0;

  // Regional Tax calculation based on entered ZIP code (defaults to 8% or smaller based on state)
  const zipFactor = Number(address.zip) || 94105;
  const taxPercent = zipFactor % 2 === 0 ? 0.08 : 0.065;
  const taxAmount = Math.round((subtotal - discountAmount) * taxPercent * 100) / 100;

  // Shipping cost: free above $100
  const shippingCharge = subtotal - discountAmount >= 100 ? 0 : 10;

  // Total amount
  const grandTotal = Math.round((subtotal - discountAmount + taxAmount + shippingCharge) * 100) / 100;

  // Verify Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    fetch('/api/coupons')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const match = data.coupons.find((c: Coupon) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
          if (match) {
            if (subtotal < match.minSpend) {
              setCouponError(`Spend minimum of $${match.minSpend} to lock this reward.`);
              setActiveCoupon(null);
            } else {
              setActiveCoupon(match);
              setCouponError('');
            }
          } else {
            setCouponError('This coupon is no longer valid or mistyped.');
            setActiveCoupon(null);
          }
        }
      });
  };

  // Checkout capture simulation
  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.street || !address.city || !address.zip) {
      alert('Please fill out all mandatory shipping details.');
      return;
    }

    setIsProcessingPayment(true);

    const apiPath = gateway === 'Razorpay' ? '/api/payments/razorpay' : '/api/payments/stripe';
    
    // Simulate API call to the backend payments secure controller
    fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: grandTotal, couponCode: activeCoupon?.code })
    })
      .then(res => res.json())
      .then(paymentData => {
        if (paymentData.success) {
          // Creating Order in DB
          return fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart.map(item => ({
                product: { id: item.product.id, name: item.product.name, price: item.product.price, images: item.product.images },
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor
              })),
              subtotal,
              discount: discountAmount,
              tax: taxAmount,
              shipping: shippingCharge,
              total: grandTotal,
              address
            })
          });
        } else {
          throw new Error('Payment gateway verification error');
        }
      })
      .then(r => r.json())
      .then(orderResult => {
        if (orderResult.success) {
          setNewOrderId(orderResult.order.id);
          setStep('success');
          onClearCart();
        } else {
          alert('Failed to register order.');
        }
      })
      .catch((err) => {
        alert('Payment verification failure. Check gateway connections.');
      })
      .finally(() => {
        setIsProcessingPayment(false);
      });
  };

  const handleSimulateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) return;
    setIsEmailSent(true);
    setTimeout(() => {
      alert(`Luxurious confirmation invoice successfully dispatched to ${customerEmail}!`);
    }, 400);
  };

  return (
    <div id="cart-checkout-view" className="space-y-10">
      {/* Visual Navigation Steps tracker */}
      <div className="flex justify-center text-xs font-mono uppercase tracking-widest border-b pb-4 text-center divide-x divide-neutral-200">
        <span className={`px-4 ${step === 'cart' ? 'text-black font-semibold' : 'text-neutral-400'}`}>01 / Bag</span>
        <span className={`px-4 ${step === 'checkout' ? 'text-black font-semibold' : 'text-neutral-400'}`}>02 / Checkout</span>
        <span className={`px-4 ${step === 'success' ? 'text-green-600 font-semibold' : 'text-neutral-400'}`}>03 / Success</span>
      </div>

      {step === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold font-mono uppercase text-neutral-900 border-b pb-2 flex items-center space-x-1.5">
              <ShoppingBag className="h-4.5 w-4.5" />
              <span>Shopping Bag ({cart.length} items)</span>
            </h3>

            {cart.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {cart.map((item, idx) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`} className="py-4 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center space-x-4">
                      <img src={item.product.images[0]} alt={item.product.name} className="h-16 w-14 object-cover border" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-neutral-900">{item.product.name}</h4>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-400">
                          <span style={{ backgroundColor: item.selectedColor.hex }} className="h-3.5 w-3.5 rounded-full border shadow-inner" inline-style="" />
                          <span>{item.selectedColor.name}</span>
                          <span>|</span>
                          <span>Size: {item.selectedSize}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onUpdateCartItemQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, Math.max(1, item.quantity - 1))}
                            className="text-neutral-400 hover:text-black font-semibold font-mono text-xs px-1 hover:bg-neutral-50 border"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs text-neutral-900">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateCartItemQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity + 1)}
                            className="text-neutral-400 hover:text-black font-semibold font-mono text-xs px-1 hover:bg-neutral-50 border"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className="font-mono font-medium text-stone-900">${item.product.price * item.quantity}</span>
                      <button
                        onClick={() => onRemoveFromCart(item.product.id, item.selectedSize, item.selectedColor.hex)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-neutral-200">
                <p className="text-xs font-mono text-neutral-400 uppercase pb-4">Your fashion bundle is empty.</p>
                <button
                  onClick={() => onNavigate('shop')}
                  className="bg-neutral-950 text-white font-mono text-[10px] uppercase tracking-wider px-6 py-2.5 hover:bg-neutral-800 transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            )}
          </div>

          {/* Checkout Summary panel */}
          <div className="space-y-6">
            <div className="bg-neutral-50 p-6 border border-neutral-200/60 text-xs">
              <h4 className="font-mono font-bold uppercase tracking-wider text-neutral-900 mb-4 border-b pb-2">Bag Summary</h4>
              <div className="space-y-2 text-stone-600 font-light border-b pb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium text-stone-900">${subtotal}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Coupon Reward:</span>
                  <span className="font-mono font-medium">-${discountAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duty Tax (ZIP estimated):</span>
                  <span className="font-mono font-medium text-stone-900">${taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-mono font-medium text-stone-900">
                    {shippingCharge === 0 ? <strong className="text-green-600 font-semibold text-[10px] uppercase">Free</strong> : `$${shippingCharge}`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm font-mono pt-4 text-neutral-900">
                <span className="font-semibold text-xs tracking-wider">BAG TOTAL:</span>
                <span className="text-md font-bold">${grandTotal}</span>
              </div>
            </div>

            {/* Coupons system */}
            {cart.length > 0 && (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">Apply Akay Privilege Promos</span>
                <div className="flex items-center border border-neutral-200">
                  <Ticket className="h-4 w-4 text-neutral-400 ml-2" />
                  <input
                    type="text"
                    placeholder="Enter Coupon code..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-transparent border-0 text-xs p-2.5 outline-none placeholder:text-stone-300"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-950 text-white font-mono text-[10px] uppercase tracking-wider h-full px-4 py-2.5"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] font-mono text-red-500"><AlertCircle className="h-3 w-3 inline mr-1" />{couponError}</p>}
                {activeCoupon && <p className="text-[10px] font-mono text-green-600 bg-green-50 p-1 px-2 border rounded border-green-100">Applied: {activeCoupon.discountPercent}% off activated!</p>}
              </form>
            )}

            {cart.length > 0 && (
              <button
                onClick={() => setStep('checkout')}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs py-3.5 uppercase tracking-wider"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'checkout' && (
        <form onSubmit={handleProcessCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Shipping Address Forms */}
          <div className="space-y-6 text-xs text-neutral-700">
            <h3 className="text-sm font-semibold font-mono uppercase text-neutral-900 border-b pb-2">01 / Shipping Address details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="font-mono text-[10px] text-zinc-500 uppercase">Receiver Name (Full Legal)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shyam Khatu"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className="w-full border border-neutral-200 p-2.5 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="font-mono text-[10px] text-zinc-500 uppercase">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, suite, block, suite..."
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full border border-neutral-200 p-2.5 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-zinc-500 uppercase">Town / City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border border-neutral-200 p-2.5 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-zinc-500 uppercase">Postal Zip Code (Tax calculation)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 94105"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full border border-neutral-200 p-2.5 outline-none focus:border-black focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="font-mono text-[10px] text-zinc-500 uppercase">Receiver Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+1 555-019-2819"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full border border-neutral-200 p-2.5 outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Secure Payment gateways selection */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold font-mono uppercase text-neutral-900 border-b pb-2">02 / Secure payment gateways</h3>

            <div className="space-y-4">
              {/* Razorpay selector */}
              <div
                onClick={() => setGateway('Razorpay')}
                className={`border p-4 flex items-center justify-between cursor-pointer transition-colors ${
                  gateway === 'Razorpay' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-black bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-[#2C82C9]" />
                  <div>
                    <p className="font-semibold text-xs uppercase font-mono tracking-wider text-[#1d1d1f]">Merchant Razorpay gateway</p>
                    <p className="text-[10px] text-neutral-400 font-mono">100% Secure debit, UPI processing & credit capture</p>
                  </div>
                </div>
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${gateway === 'Razorpay' ? 'bg-black border-black' : 'border-neutral-300'}`}>
                  {gateway === 'Razorpay' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Stripe selector */}
              <div
                onClick={() => setGateway('Stripe')}
                className={`border p-4 flex items-center justify-between cursor-pointer transition-colors ${
                  gateway === 'Stripe' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-black bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-[#6772E5]" />
                  <div>
                    <p className="font-semibold text-xs uppercase font-mono tracking-wider text-[#1d1d1f]">Stripe digital link</p>
                    <p className="text-[10px] text-neutral-400 font-mono">Accept Apple Pay, global cards and modern checks</p>
                  </div>
                </div>
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${gateway === 'Stripe' ? 'bg-black border-black' : 'border-neutral-300'}`}>
                  {gateway === 'Stripe' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            {/* Sum stats list card */}
            <div className="bg-neutral-950 text-white p-6 space-y-4">
              <span className="block font-mono text-[9px] text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-1">Final Invoice Metrics</span>
              <div className="font-mono text-xs space-y-1.5 text-stone-300">
                <div className="flex justify-between">
                  <span>Bag Subtotal:</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-yellow-500 font-bold">
                  <span>Promocode Discount:</span>
                  <span>-${discountAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zone Duty Tax:</span>
                  <span>${taxAmount}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-sm pt-2 border-t border-neutral-800">
                  <span className="text-xs">TOTAL TO BE CAPTURED:</span>
                  <span>${grandTotal}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-neutral-400 bg-white/5 p-2 rounded">
                <ShieldCheck className="h-4.5 w-4.5 text-green-500" />
                <span>SSL Encrypted transactions proxied anonymously on server. API secrets are safe.</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="px-4 py-3 bg-neutral-100 font-mono text-xs text-neutral-800 uppercase"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isProcessingPayment}
                className="flex-1 bg-neutral-950 font-mono text-xs text-white uppercase tracking-wider py-3 disabled:opacity-50 inline-block font-bold"
              >
                {isProcessingPayment ? `Connecting private ${gateway} API...` : `Submit secure $${grandTotal} payment`}
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 'success' && (
        <div className="max-w-xl mx-auto text-center space-y-8 py-10 bg-green-50/10 border border-green-100 p-8">
          <div className="inline-flex h-16 w-16 bg-green-50 border border-green-200 rounded-full items-center justify-center text-green-600 shadow shadow-green-100 animate-bounce">
            <ShoppingBag className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-green-600 tracking-wider font-semibold uppercase">PAYMENT AUTHORIZED</span>
            <h2 className="text-2xl font-light text-neutral-900 uppercase">Couture Elements Locked IN!</h2>
            <p className="text-neutral-500 text-xs font-light max-w-md mx-auto">
              Your billing total has been authorized and captured safely. Order reference <strong>{newOrderId}</strong> has been cataloged under active transit trackers.
            </p>
          </div>

          {/* Email Confirmation stimulator */}
          <div className="bg-white p-6 border border-neutral-200/60 max-w-md mx-auto space-y-4">
            <p className="text-[11px] font-mono text-neutral-400 uppercase">Dispatch Order Confirmation invoice</p>
            
            {isEmailSent ? (
              <div className="text-green-600 text-xs font-mono bg-green-50/50 p-2.5 border border-green-100 flex items-center justify-center space-x-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Couture statement dispatched to inbox!</span>
              </div>
            ) : (
              <form onSubmit={handleSimulateEmail} className="flex items-center border">
                <input
                  type="email"
                  required
                  placeholder="Confirm mail address..."
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border-0 outline-none placeholder:text-stone-300"
                />
                <button type="submit" className="bg-neutral-950 text-white font-mono text-xs p-2 uppercase hover:bg-neutral-800">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>

          <div className="flex justify-center space-x-3 pt-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-neutral-900 text-white font-mono text-xs uppercase px-6 py-2.5 tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Order Tracking dashboard
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="bg-white text-stone-700 border border-zinc-200 font-mono text-xs uppercase px-6 py-2.5 tracking-wider hover:bg-zinc-50"
            >
              Keep Styling
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
