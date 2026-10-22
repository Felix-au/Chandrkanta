import React from 'react';
import { Award, ShieldCheck, RotateCcw, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const icons = [Award, ShieldCheck, RotateCcw, Truck];

export default function WhyUs() {
  const { content } = useStore();
  const visible = content?.layout?.visibleSections?.whyUs !== false;

  const whyUs = content?.whyUs || {
    label: "Our Promise",
    title: "Why Chandrakanta?",
    description: "We believe every woman deserves to feel like royalty. Here's our commitment to you.",
    items: [
      {
        id: 1,
        title: "Handcrafted Quality",
        description: "Every saree is woven by master artisans using age-old techniques passed down through generations across Varanasi and Kanchipuram."
      },
      {
        id: 2,
        title: "Authentic Weaves",
        description: "Sourced directly from Varanasi, Kanchipuram & Lucknow. 100% genuine silk, cotton, and georgette. No imitations, ever."
      },
      {
        id: 3,
        title: "Hassle-Free Returns",
        description: "Not satisfied? Return within 7 days for a full refund. No questions asked. We stand behind every piece we sell."
      },
      {
        id: 4,
        title: "Pan-India Delivery",
        description: "Fast, tracked shipping to every corner of India. Free delivery above ₹1999. Cash on Delivery available nationwide."
      }
    ]
  };

  if (!visible) return null;

  return (
    <section className="why" id="why-us" aria-labelledby="why-h2" data-cms-target="whyUs">
      <div className="why-in">
        <div className="sec-hdr">
          <p className="sec-label" data-cms-target="whyUs.label">{whyUs.label || "Our Promise"}</p>
          <h2 className="sec-title" id="why-h2" data-cms-target="whyUs.title">{whyUs.title || "Why Chandrakanta?"}</h2>
          <p className="sec-desc" data-cms-target="whyUs.description">
            {whyUs.description || "We believe every woman deserves to feel like royalty. Here's our commitment to you."}
          </p>
        </div>

        <div className="why-grid">
          {(whyUs.items || []).map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div className="why-card" key={item.id || idx} data-cms-target={`whyUs.${idx}`}>
                <div className="why-icon" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className="why-ttl" data-cms-target={`whyUs.${idx}.title`}>{item.title}</h3>
                <p className="why-dsc" data-cms-target={`whyUs.${idx}.description`}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
