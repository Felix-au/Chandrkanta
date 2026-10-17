import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function Newsletter() {
  const { content } = useStore();
  const nl = content?.newsletter || {
    label: "Stay Connected",
    title: "First to Know, First to Glow",
    description: "Subscribe for exclusive access to new arrivals, festive offers and insider styling tips — straight to your inbox.",
    buttonText: "Subscribe",
    placeholder: "Your email address"
  };

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <section className="nl" aria-labelledby="nl-h2">
      <div className="nl-in">
        <p className="nl-label">{nl.label || "Stay Connected"}</p>
        <h2 className="nl-title" id="nl-h2">{nl.title || "First to Know, First to Glow"}</h2>
        <p className="nl-desc">
          {nl.description || "Subscribe for exclusive access to new arrivals, festive offers and insider styling tips — straight to your inbox."}
        </p>

        <form className="nl-form" onSubmit={handleSubmit} aria-label="Newsletter signup">
          <label htmlFor="nl-email" className="sr-only">Your email address</label>
          <input
            type="email"
            id="nl-email"
            className="nl-input"
            placeholder={nl.placeholder || "Your email address"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button
            type="submit"
            className="nl-btn"
            style={subscribed ? { background: '#2d6b2d' } : {}}
          >
            {subscribed ? '✓ Subscribed!' : (nl.buttonText || 'Subscribe')}
          </button>
        </form>
      </div>
    </section>
  );
}
