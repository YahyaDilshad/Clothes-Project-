import { useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast('Thanks for subscribing — welcome to Faisal Kamir.');
    setEmail('');
  };

  return (
    <section className="bg-charcoal text-ivory py-16">
      <div className="container-fk text-center max-w-xl">
        <p className="eyebrow mb-3">Stay in the loop</p>
        <h2 className="section-title text-ivory">Join the Faisal Kamir List</h2>
        <p className="text-ivory/60 text-sm mt-3">
          New arrivals, seasonal fabric drops and members-only offers — straight to your inbox.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 mt-7">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 bg-transparent border border-ivory/30 px-4 py-3.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold"
          />
          <button type="submit" className="btn-gold">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
