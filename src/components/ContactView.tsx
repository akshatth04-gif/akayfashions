import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import { FAQ_DATA } from '../data';

export default function ContactView() {
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);
  
  // Submit contact form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketBody) return;
    setIsSubmitted(true);
    setTimeout(() => {
      alert('Your customer inquiry has been cataloged. Our styling coordinators will reach out inside 4 business hours.');
    }, 200);
  };

  return (
    <div id="contact-view" className="space-y-12 max-w-4xl mx-auto">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4 text-center space-y-1">
        <span className="font-mono text-xs text-neutral-400 tracking-wider">SUPPORT PIPELINE</span>
        <h2 className="text-2xl font-light text-zinc-900 uppercase">Contact & Support Desk</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left column: FAQ accordion & Info */}
        <div className="space-y-8 text-neutral-800">
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-black pb-1.5 border-b flex items-center space-x-1.5 font-bold">
              <HelpCircle className="h-4.5 w-4.5 text-zinc-500" />
              <span>Frequently Queried Questions</span>
            </h3>

            <div className="divide-y divide-neutral-100 space-y-2">
              {FAQ_DATA.map((faq, idx) => (
                <div key={idx} className="pt-2.5">
                  <button
                    onClick={() => setActiveFaqIdx(activeFaqIdx === idx ? null : idx)}
                    className="w-full flex justify-between items-center text-xs font-semibold py-1.5 text-left text-neutral-900 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="font-mono font-bold">{activeFaqIdx === idx ? '−' : '+'}</span>
                  </button>

                  {activeFaqIdx === idx && (
                    <p className="text-xs text-neutral-500 leading-relaxed font-light py-2 bg-neutral-50 px-3 border border-stone-100 italic transition-all duration-300">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-black pb-1.5 border-b font-bold">HQ Operations</h3>
            <div className="space-y-2 text-xs text-stone-600 font-light">
              <p className="flex items-center space-x-2.5">
                <MapPin className="h-4 w-4 text-neutral-400" />
                <span>Suite 45, 12 Luxury Boulevard, San Francisco, CA 94105</span>
              </p>
              <p className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-neutral-400" />
                <span>society@akayfashions.com</span>
              </p>
              <p className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-neutral-400" />
                <span>+1 555-839-2018 (Mon - Sat 9:00 - 18:00 UTC)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Form & Messenger Launchers */}
        <div className="space-y-6">
          <div className="bg-indigo-50/15 border border-indigo-100 p-4 space-y-3.5">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-emerald-500 fill-emerald-500" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600">WhatsApp direct assistance</h4>
            </div>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Skip tickets! Contact our live luxury fashion advisory directly via WhatsApp for size coordinates, materials reviews, or dispatch tracking corrections.
            </p>
            <button
              onClick={() => {
                alert('Launching secure WhatsApp gateway mock: Connected to coordinator Elsa Lindqvist.');
              }}
              className="w-full bg-emerald-600 text-white font-mono text-[10px] uppercase font-bold py-2.5 hover:bg-emerald-700 transition-colors tracking-widest flex items-center justify-center space-x-2"
            >
              <span>Launch WhatsApp live chat</span>
            </button>
          </div>

          {/* Contact tickets form */}
          <div className="bg-white border rounded p-6 shadow-sm">
            <h4 className="font-mono text-xs uppercase tracking-wider text-black border-b pb-2 mb-4">Launch Customer Ticket</h4>

            {isSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto animate-pulse" />
                <p className="text-xs font-mono text-green-600 uppercase">Support ticket registered safely!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-stone-400">Your registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. patrons@domain.com"
                    className="w-full border p-2.5 bg-neutral-50 outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-stone-400">Ticket Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Size changes request"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    className="w-full border p-2.5 bg-neutral-50 outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-stone-400">Describe your inquiry</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about colors, ordering IDs or returns..."
                    value={ticketBody}
                    onChange={e => setTicketBody(e.target.value)}
                    className="w-full border p-2.5 bg-neutral-50 outline-none focus:border-black focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-950 text-white hover:bg-neutral-800 py-3 text-[10px] uppercase font-mono font-bold tracking-wider flex items-center justify-center space-x-1"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
