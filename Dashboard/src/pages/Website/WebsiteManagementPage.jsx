import React, { useState } from 'react';
import { Image as ImageIcon, Save, Share2, Megaphone, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export const WebsiteManagementPage = () => {
    const { websiteContent, updateWebsiteContent, collections, showToast } = useApp();
    const [announcementText, setAnnouncementText] = useState(websiteContent.announcementBar.text);
    const [announcementEnabled, setAnnouncementEnabled] = useState(websiteContent.announcementBar.enabled);
    const [heroHeading, setHeroHeading] = useState(websiteContent.heroBanners[0]?.heading || '');
    const [heroSubheading, setHeroSubheading] = useState(websiteContent.heroBanners[0]?.subheading || '');
    const [heroCtaText, setHeroCtaText] = useState(websiteContent.heroBanners[0]?.ctaText || '');
    const [heroCtaLink, setHeroCtaLink] = useState(websiteContent.heroBanners[0]?.ctaLink || '');
    const [heroImageUrl, setHeroImageUrl] = useState(websiteContent.heroBanners[0]?.image || '');
    const [instagram, setInstagram] = useState(websiteContent.socialLinks.instagram);
    const [facebook, setFacebook] = useState(websiteContent.socialLinks.facebook);
    const [whatsapp, setWhatsapp] = useState(websiteContent.socialLinks.whatsapp);
    const [tiktok, setTiktok] = useState(websiteContent.socialLinks.tiktok);
    const handleSave = (e) => {
        e.preventDefault();
        updateWebsiteContent({
            announcementBar: {
                text: announcementText,
                enabled: announcementEnabled,
            },
            heroBanners: [
                {
                    id: 'hero-1',
                    heading: heroHeading,
                    subheading: heroSubheading,
                    ctaText: heroCtaText,
                    ctaLink: heroCtaLink,
                    image: heroImageUrl,
                    active: true,
                },
            ],
            socialLinks: {
                instagram,
                facebook,
                whatsapp,
                tiktok,
            },
        });
        showToast('Storefront Updated', 'Website homepage content and banners updated successfully.');
    };
    return (<div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Website Storefront CMS</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Configure homepage hero sliders, promotional banner ribbons, and brand contact links.
          </p>
        </div>

        <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
          <Save className="w-4 h-4"/>
          <span>Save Website Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Announcement Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2">
              <Megaphone className="w-4 h-4"/>
              <span>Top Announcement Ribbon</span>
            </h3>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={announcementEnabled} onChange={(e) => setAnnouncementEnabled(e.target.checked)} className="rounded border-neutral-300 text-neutral-900"/>
              <span className="font-semibold text-neutral-800">Show on Website</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Banner Announcement Text
            </label>
            <input type="text" value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} placeholder="e.g. FREE DELIVERY ON ALL ORDERS ABOVE PKR 5,000" className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900 focus:outline-hidden"/>
          </div>

          {/* Live Preview of Top Ribbon */}
          {announcementEnabled && (<div className="p-2.5 bg-neutral-900 text-white text-center rounded-xl font-bold tracking-wider text-[11px] shadow-xs">
              {announcementText}
            </div>)}
        </div>

        {/* Hero Banner Section */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2 border-b border-neutral-100 pb-3">
            <ImageIcon className="w-4 h-4"/>
            <span>Primary Homepage Hero Slider</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Main Heading</label>
                <input type="text" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900"/>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Subheading</label>
                <textarea rows={2} value={heroSubheading} onChange={(e) => setHeroSubheading(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs text-neutral-900"/>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Button CTA Text</label>
                  <input type="text" value={heroCtaText} onChange={(e) => setHeroCtaText(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-semibold text-neutral-900"/>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Button Link URL</label>
                  <input type="text" value={heroCtaLink} onChange={(e) => setHeroCtaLink(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-mono text-xs text-neutral-900"/>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Banner Image URL</label>
                <input type="text" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900"/>
              </div>
            </div>

            {/* Live Visual Preview */}
            <div className="rounded-2xl overflow-hidden border border-neutral-200 relative aspect-4/3 bg-neutral-950 flex flex-col justify-end p-5 text-white shadow-xs">
              <img src={heroImageUrl} alt="Banner Preview" className="absolute inset-0 w-full h-full object-cover opacity-60"/>
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-neutral-950/60 px-2 py-0.5 rounded">
                  Live Preview
                </span>
                <h4 className="text-lg font-bold font-serif leading-tight">{heroHeading}</h4>
                <p className="text-[11px] text-neutral-200 line-clamp-2">{heroSubheading}</p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1.5 bg-white text-neutral-900 font-bold rounded-lg text-xs shadow-md">
                    {heroCtaText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & WhatsApp Links */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <h3 className="font-bold uppercase tracking-wider text-neutral-900 text-xs flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Share2 className="w-4 h-4"/>
            <span>Brand Social Accounts & WhatsApp Support</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Instagram Profile</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/naveedandco" className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                WhatsApp Customer Support (Pakistani Format)
              </label>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+92 300 1234567" className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Facebook Page</label>
              <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="https://facebook.com/naveedandco" className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900"/>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">TikTok Channel</label>
              <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="https://tiktok.com/@naveedandco" className="w-full px-3 py-2 border border-neutral-200 rounded-xl font-medium text-neutral-900"/>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors">
            Publish Website Updates
          </button>
        </div>
      </form>
    </div>);
};
