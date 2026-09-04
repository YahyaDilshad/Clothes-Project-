import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/useProductStore'; // Store import kiya
import { WHATSAPP_LINK } from '../utils/constants.js';

export default function Contact() {
  const initialFormState = { name: '', email: '', phone: '', message: '' };
  const [form, setForm] = useState(initialFormState);
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false); // Local loading state

  const { submitContactForm } = useProductStore(); // Store se action nikala

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    const result = await submitContactForm(form);
    
    if (result.success) {
      setSubmitted(true);
      setForm(initialFormState); // Form clear kar diya
      // 5 second baad success message hide karne ke liye
      setTimeout(() => setSubmitted(false), 5000);
    }
    
    setIsSending(false);
  };

  return (
    <div className="container-fk py-12 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="eyebrow mb-2">Get in Touch</p>
        <h1 className="font-display text-4xl text-charcoal">Contact Us</h1>
        <p className="text-stone text-sm mt-3">
          Questions about a fabric, an order, or bulk tailoring needs — we're happy to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-charcoal flex items-center justify-center shrink-0">
              <Phone size={18} className="text-gold" />
            </div>
            <div>
              <p className="font-medium text-charcoal">Phone</p>
              <p className="text-sm text-stone mt-0.5">+92 300 1234567</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-charcoal flex items-center justify-center shrink-0">
              <Mail size={18} className="text-gold" />
            </div>
            <div>
              <p className="font-medium text-charcoal">Email</p>
              <p className="text-sm text-stone mt-0.5">support@faisalkamir.pk</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-charcoal flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-gold" />
            </div>
            <div>
              <p className="font-medium text-charcoal">Studio</p>
              <p className="text-sm text-stone mt-0.5">Susan Road, Faisalabad, Punjab, Pakistan</p>
            </div>
          </div>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 text-sm uppercase tracking-wide font-medium mt-2 hover:bg-[#1eb956] transition-colors"
          >
            <MessageCircle size={17} /> Chat on WhatsApp
          </a>
        </div>

        {/* Contact Form */}
        <form onSubmit={onSubmit} className="lg:col-span-3 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label-fk" htmlFor="name">Full Name</label>
              <input 
                id="name" 
                name="name" 
                required 
                value={form.name} 
                onChange={onChange} 
                className="input-fk" 
                disabled={isSending}
              />
            </div>
            <div>
              <label className="label-fk" htmlFor="phone">Phone Number</label>
              <input 
                id="phone" 
                name="phone" 
                required 
                value={form.phone} 
                onChange={onChange} 
                className="input-fk" 
                placeholder="03XX-XXXXXXX" 
                disabled={isSending}
              />
            </div>
          </div>
          
          <div>
            <label className="label-fk" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              value={form.email} 
              onChange={onChange} 
              className="input-fk" 
              disabled={isSending}
            />
          </div>
          
          <div>
            <label className="label-fk" htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message" 
              required 
              rows={5} 
              value={form.message} 
              onChange={onChange} 
              className="input-fk resize-none" 
              disabled={isSending}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSending} 
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>

          {submitted && (
            <div className="p-4 bg-gold/10 border border-gold/20 text-charcoal text-sm animate-in fade-in slide-in-from-top-1">
              Thank you! Your message has been sent. We will get back to you shortly.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}