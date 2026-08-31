import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { WHATSAPP_LINK } from '../utils/constants.js';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent — we\'ll respond shortly.');
    setForm({ name: '', email: '', phone: '', message: '' });
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
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 text-sm uppercase tracking-wide font-medium mt-2"
          >
            <MessageCircle size={17} /> Chat on WhatsApp
          </a>
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label-fk" htmlFor="name">Full Name</label>
              <input id="name" name="name" required value={form.name} onChange={onChange} className="input-fk" />
            </div>
            <div>
              <label className="label-fk" htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" required value={form.phone} onChange={onChange} className="input-fk" placeholder="03XX-XXXXXXX" />
            </div>
          </div>
          <div>
            <label className="label-fk" htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={onChange} className="input-fk" />
          </div>
          <div>
            <label className="label-fk" htmlFor="message">Message</label>
            <textarea id="message" name="message" required rows={5} value={form.message} onChange={onChange} className="input-fk resize-none" />
          </div>
          <button type="submit" className="btn-primary w-full sm:w-auto">Send Message</button>
          {submitted && <p className="text-sm text-gold">Thank you — your message has been received.</p>}
        </form>
      </div>
    </div>
  );
}
