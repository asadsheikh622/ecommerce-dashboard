import React, { useState, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { AnimatedPrice } from '../components/common/AnimatedPrice';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import { INITIAL_STOREFRONT } from '../data/mockData';
import {
  Globe,
  Store,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Save,
  CheckCircle2,
  Sliders,
  Eye,
} from 'lucide-react';

export const StorefrontPage: React.FC<{ onMobileMenuToggle: () => void }> = ({ onMobileMenuToggle }) => {
  const { storefront, storefrontConfig = storefront, updateStorefront, updateStorefrontConfig = updateStorefront, products = [], addToast } = useStore();
  const { currency } = useCurrency();

  const activeConfig = storefrontConfig || storefront || INITIAL_STOREFRONT;

  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings');

  // Form State with safe fallbacks
  const [storeName, setStoreName] = useState(activeConfig?.storeName || 'AURUM STUDIO');
  const [tagline, setTagline] = useState(activeConfig?.tagline || 'Modern Elegance & Minimalist Essentials');
  const [announcement, setAnnouncement] = useState(activeConfig?.announcement || activeConfig?.announcementBar?.text || '⚡ FREE EXPRESS SHIPPING ACROSS PAKISTAN');
  const [announcementEnabled, setAnnouncementEnabled] = useState(activeConfig?.announcementEnabled ?? activeConfig?.announcementBar?.enabled ?? true);
  const [heroHeading, setHeroHeading] = useState(activeConfig?.heroHeading || activeConfig?.hero?.title || 'Architectural Silhouettes & Heavyweight Essentials');
  const [heroSubtitle, setHeroSubtitle] = useState(activeConfig?.heroSubtitle || activeConfig?.hero?.description || 'Meticulously crafted menswear inspired by brutalist geometry.');
  const [contactEmail, setContactEmail] = useState(activeConfig?.contactEmail || 'concierge@aurumstudio.pk');
  const [contactPhone, setContactPhone] = useState(activeConfig?.contactPhone || '+92 300 1234567');
  const [address, setAddress] = useState(activeConfig?.address || 'Gulberg III, Lahore, Pakistan');

  // Synchronize with activeConfig when it updates (e.g., after a reset)
  useEffect(() => {
    if (activeConfig) {
      setStoreName(activeConfig.storeName || 'AURUM STUDIO');
      setTagline(activeConfig.tagline || 'Modern Elegance & Minimalist Essentials');
      setAnnouncement(activeConfig.announcement || activeConfig.announcementBar?.text || '');
      setAnnouncementEnabled(activeConfig.announcementEnabled ?? activeConfig.announcementBar?.enabled ?? true);
      setHeroHeading(activeConfig.heroHeading || activeConfig.hero?.title || '');
      setHeroSubtitle(activeConfig.heroSubtitle || activeConfig.hero?.description || '');
      setContactEmail(activeConfig.contactEmail || '');
      setContactPhone(activeConfig.contactPhone || '');
      setAddress(activeConfig.address || '');
    }
  }, [activeConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updater = updateStorefrontConfig || updateStorefront;
    if (updater) {
      updater({
        storeName,
        tagline,
        announcement,
        announcementEnabled,
        announcementBar: {
          enabled: announcementEnabled,
          text: announcement,
        },
        heroHeading,
        heroSubtitle,
        hero: {
          badge: 'NEW FALL / WINTER DROP 2026',
          title: heroHeading,
          description: heroSubtitle,
          buttonText: 'Explore Collection',
          buttonLink: '/products/all',
          image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop&q=80',
        },
        contactEmail,
        contactPhone,
        address,
      });
    }
  };

  const featuredProducts = products.filter((p) => !p.isDeleted && (p.featured || p.status === 'Active'));

  return (
    <div className="space-y-6">
      <Header
        breadcrumbs={[{ label: 'Dashboard' }, { label: 'Storefront' }]}
        title="Storefront Configuration"
        subtitle="Manage public buyer branding, announcements and live catalog display"
        actionButton={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'settings' ? 'preview' : 'settings')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-xl border border-zinc-700 transition-all cursor-pointer"
            >
              {activeTab === 'settings' ? <Eye className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
              <span>{activeTab === 'settings' ? 'Live Buyer Preview' : 'Store Settings'}</span>
            </button>
          </div>
        }
        onMobileMenuToggle={onMobileMenuToggle}
      />

      {activeTab === 'settings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings Form (2 Cols) - Bento Card */}
          <div className="lg:col-span-2 rounded-[2rem] bg-zinc-900 border border-zinc-800 p-6 shadow-xl">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                    Identity & Visuals
                  </span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-white" />
                    <span>General Branding & Hero Section</span>
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Auto-synced</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 font-medium"
                  />
                </div>
              </div>

              {/* Announcement Banner Section */}
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Top Announcement Bar</span>
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementEnabled}
                      onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>

                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. Free delivery nationwide on orders above Rs. 3,500"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Hero Banner text */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Hero Section Headline
                  </label>
                  <input
                    type="text"
                    value={heroHeading}
                    onChange={(e) => setHeroHeading(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Customer Support & Footer Info
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Helpline / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Store Location / Hub
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Storefront Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Side Info / Quick Status Bento Card */}
          <div className="space-y-4">
            <div className="rounded-[2rem] bg-zinc-900 border border-zinc-800 p-6 shadow-xl space-y-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Storefront Health
              </span>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-xs font-bold">Online & Serving</p>
                  <p className="text-[10px] text-zinc-400">Ready to accept orders in PKR & USD</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>Catalogue Items:</span>
                  <span className="text-white font-bold">{products.length}</span>
                </div>
                <div className="flex justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>Featured for Showcase:</span>
                  <span className="text-white font-bold">
                    {products.filter((p) => p.featured).length}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Default Shopper Currency:</span>
                  <span className="text-white font-bold font-mono">{currency}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Interactive Shopper View</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Live Shopper View Simulator - Bento Browser Container */
        <div className="rounded-[2rem] bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Mock Browser Header */}
          <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-[11px] font-mono text-zinc-400 ml-2">
                https://store.minimalist.pk (Shopper Simulation)
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">Currency: {currency}</span>
          </div>

          {/* Announcement Bar */}
          {(activeConfig?.announcementEnabled ?? activeConfig?.announcementBar?.enabled) && (
            <div className="bg-zinc-800 text-white text-[11px] font-bold text-center py-2 px-4 tracking-wide border-b border-zinc-700">
              {activeConfig?.announcement || activeConfig?.announcementBar?.text}
            </div>
          )}

          {/* Store Navbar */}
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md">
            <div>
              <span className="text-base font-extrabold text-white tracking-tight">
                {activeConfig?.storeName || 'AURUM STUDIO'}
              </span>
              <span className="text-[10px] text-zinc-400 block">{activeConfig?.tagline}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-300 font-medium cursor-pointer hover:text-white">Shop</span>
              <span className="text-xs text-zinc-300 font-medium cursor-pointer hover:text-white">Lookbook</span>
              <span className="text-xs text-zinc-300 font-medium cursor-pointer hover:text-white">About</span>
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative py-16 px-6 sm:px-12 text-center bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                New Season 2026 Collection
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {activeConfig?.heroHeading || activeConfig?.hero?.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
                {activeConfig?.heroSubtitle || activeConfig?.hero?.description}
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Featured Catalogue Items</h3>
              <span className="text-xs text-zinc-400 font-medium">All prices in {currency}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden group hover:border-zinc-600 transition-all shadow-md"
                >
                  <div className="h-44 w-full bg-zinc-800 overflow-hidden relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                      {p.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-sm font-extrabold text-white">
                        <AnimatedPrice amountUSD={p.sellingPrice} />
                      </div>
                      <button
                        type="button"
                        onClick={() => addToast('success', `Added ${p.name} to mock bag`)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-950 text-center text-xs text-zinc-500">
            <p>
              © 2026 {activeConfig?.storeName || 'AURUM STUDIO'}. {activeConfig?.address || 'Gulberg III, Lahore, Pakistan'} • Contact:{' '}
              {activeConfig?.contactEmail || 'concierge@aurumstudio.pk'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
