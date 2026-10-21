import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Hero({ onFilterCategory }) {
  const { content } = useStore();
  const visible = content?.layout?.visibleSections?.hero !== false;
  const layout = content?.layout || {};
  const heroVariant = layout.heroVariant || 'center';

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

  if (!visible) return null;

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

  const heroSectionClass = `hero hero-variant-${heroVariant}`;

  return (
    <section className={heroSectionClass} id="hero" aria-labelledby="hero-h1" data-cms-target="hero">
      <img
        src={hero.bannerImage || "/images/hero.jpg"}
        alt={hero.altText || "Chandrakanta Luxury Handloom Collection"}
        loading="eager"
        data-cms-target="hero.bannerImage"
      />
      <div className="hero-ov" aria-hidden="true"></div>

      <div className="hero-cnt">
        <div className={`hero-box ${heroVariant === 'split' ? 'hero-box-split' : ''}`}>
          <p className="h-label" data-cms-target="hero.label">{hero.label || "New Festive Collection 2024"}</p>
          <h1 className="h-title" id="hero-h1" data-cms-target="hero.title">
            {renderTitle()}
          </h1>
          <p className="h-sub" data-cms-target="hero.subtitle">
            {hero.subtitle || "Discover Chandrakanta's exquisite handcrafted sarees and unstitched suit sets — where heritage meets elegance."}
          </p>
          <div className="h-btns">
            <button
              onClick={() => handleCtaClick('sarees')}
              className="btn-pri"
              id="cta-sarees"
              data-cms-target="hero.primaryCtaText"
            >
              <span>{hero.primaryCtaText || "Shop Sarees"}</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => handleCtaClick('suits')}
              className="btn-ghost-wh"
              id="cta-suits"
              data-cms-target="hero.secondaryCtaText"
            >
              <span>{hero.secondaryCtaText || "Explore Suit Sets"}</span>
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
