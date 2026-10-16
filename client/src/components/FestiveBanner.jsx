import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function FestiveBanner({ onExplore }) {
  const { content } = useStore();
  const festive = content?.festive || {
    label: "Festive Edit 2024",
    title: "Dress for Every Celebration",
    italicWord: "Celebration",
    description: "From Diwali to Dussehra, weddings to sangeets — Chandrakanta's festive collection brings timeless tradition to every joyful occasion. Each piece is a masterpiece.",
    ctaText: "Explore Festive Edit",
    ctaLink: "#sarees",
    images: [
      "/images/suit-navy.jpg",
      "/images/saree-purple.jpg"
    ]
  };

  const renderTitle = () => {
    const titleText = festive.title || "Dress for Every Celebration";
    const italic = festive.italicWord || "Celebration";
    if (titleText.includes(italic)) {
      const parts = titleText.split(italic);
      return (
        <>
          {parts[0]}
          <em>{italic}</em>
          {parts[1]}
        </>
      );
    }
    return titleText;
  };

  const handleCta = () => {
    if (onExplore) {
      onExplore('all');
    }
    const section = document.getElementById('sarees');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="festive" id="festive" aria-labelledby="fest-h2">
      <div className="festive-in">
        <div className="festive-cnt">
          <p className="fest-label">{festive.label || "Festive Edit 2024"}</p>
          <h2 className="fest-title" id="fest-h2">
            {renderTitle()}
          </h2>
          <p className="fest-desc">
            {festive.description || "From Diwali to Dussehra, weddings to sangeets — Chandrakanta's festive collection brings timeless tradition to every joyful occasion."}
          </p>
          <button
            onClick={handleCta}
            className="btn-pri"
            id="cta-festive"
          >
            {festive.ctaText || "Explore Festive Edit"}
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div className="festive-imgs" aria-hidden="true">
          <img
            src={festive.images?.[0] || "/images/suit-navy.jpg"}
            alt="Midnight blue festive suit set"
            loading="lazy"
          />
          <img
            src={festive.images?.[1] || "/images/saree-purple.jpg"}
            alt="Royal purple Kanjivaram silk saree"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
