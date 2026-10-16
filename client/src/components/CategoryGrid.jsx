import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CategoryGrid({ onSelectCategory }) {
  const { content } = useStore();
  const categories = content?.categories || [
    {
      id: "sarees",
      name: "Sarees",
      count: "200+ Styles",
      image: "/images/cat-saree.jpg"
    },
    {
      id: "suits",
      name: "Suit Sets",
      count: "150+ Styles",
      image: "/images/cat-suits.jpg"
    },
    {
      id: "bridal",
      name: "Bridal Lehengas",
      count: "80+ Styles",
      image: "/images/cat-bridal.jpg"
    }
  ];

  const handleClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const section = document.getElementById('sarees');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="cats" id="categories" aria-labelledby="cat-h2">
      <div className="sec-hdr">
        <p className="sec-label">Our Collections</p>
        <h2 className="sec-title" id="cat-h2">Shop by Category</h2>
        <p className="sec-desc">
          Handpicked weaves and craftsmanship for every occasion — festive celebrations to everyday elegance.
        </p>
      </div>

      <div className="cats-grid">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="cat-card"
            onClick={() => handleClick(cat.id)}
            role="button"
            tabIndex={0}
            aria-label={`Shop ${cat.name} — ${cat.count}`}
          >
            <img
              src={cat.image || "/images/cat-saree.jpg"}
              alt={cat.name}
              loading="lazy"
            />
            <div className="cat-ov">
              <div className="cat-info">
                <p className="cat-count">{cat.count}</p>
                <h3 className="cat-name">{cat.name}</h3>
                <span className="cat-link">
                  Shop Now <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
