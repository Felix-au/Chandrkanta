import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Hero({ onFilterCategory }) {
  const { content } = useStore();
  const hero = content?.hero || {
    label: "New Festive Collection 2024",
    title: "Tradition Woven in Every Thread",
    italicWord: "Every Thread",
    subtitle: "Discover Chandrakanta's exquisite handcrafted sarees and unstitched suit sets — where heritage meets elegance.",
    primaryCtaText: "Shop Sarees",
    primaryCtaLink: "#sarees",
    secondaryCtaText: "Explore Suit Sets",
    secondaryCtaLink: "#suits",
    bannerImage: "/images/hero.jpg",
    altText: "Elegant woman in a rich Chandrakanta silk saree amid golden bokeh lights"
  };

  const handleCtaClick = (category) => {
    if (onFilterCategory) {
      onFilterCategory(category);
    }
    const section = document.getElementById(category === 'suits' ? 'sarees' : 'sarees');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // Render title with optional italicized phrase
  const renderTitle = () => {
    const titleText = hero.title || "Tradition Woven in Every Thread";
    const italicWord = hero.italicWord || "Every Thread";

    if (titleText.includes(italicWord)) {
      const parts = titleText.split(italicWord);
      return (
        <>
          {parts[0]}
          <em>{italicWord}</em>
          {parts[1]}
        </>
      );
    }
    return titleText;
  };

  return (
    <section className="hero" id="hero" aria-labelledby="hero-h1">
      <img
        src={hero.bannerImage || "/images/hero.jpg"}
        alt={hero.altText || "Chandrakanta Luxury Handloom Collection"}
        loading="eager"
      />
      <div className="hero-ov" aria-hidden="true"></div>

      <div className="hero-cnt">
        <div className="hero-box">
          <p className="h-label">{hero.label || "New Festive Collection 2024"}</p>
          <h1 className="h-title" id="hero-h1">
            {renderTitle()}
          </h1>
          <p className="h-sub">
            {hero.subtitle || "Discover Chandrakanta's exquisite handcrafted sarees and unstitched suit sets — where heritage meets elegance."}
          </p>
          <div className="h-btns">
            <button
              onClick={() => handleCtaClick('sarees')}
              className="btn-pri"
              id="cta-sarees"
            >
              {hero.primaryCtaText || "Shop Sarees"}
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => handleCtaClick('suits')}
              className="btn-ghost-wh"
              id="cta-suits"
            >
              {hero.secondaryCtaText || "Explore Suit Sets"}
            </button>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <ChevronDown size={18} strokeWidth={2} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
