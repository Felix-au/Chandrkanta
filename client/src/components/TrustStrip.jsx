import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Banknote, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const iconMap = {
  Truck: Truck,
  ShieldCheck: ShieldCheck,
  RotateCcw: RotateCcw,
  Banknote: Banknote,
  Headphones: Headphones
};

export default function TrustStrip() {
  const { content } = useStore();
  const visible = content?.layout?.visibleSections?.trustStrip !== false;
  const items = content?.trustStrip || [
    { id: 1, title: "Free Shipping above ₹1999", icon: "Truck" },
    { id: 2, title: "100% Authentic Handloom", icon: "ShieldCheck" },
    { id: 3, title: "7-Day Easy Returns", icon: "RotateCcw" },
    { id: 4, title: "Cash on Delivery Available", icon: "Banknote" },
    { id: 5, title: "24/7 Customer Support", icon: "Headphones" }
  ];

  if (!visible) return null;

  return (
    <div className="trust" aria-label="Brand promises" data-cms-target="trustStrip">
      <div className="trust-in">
        {items.map((it, idx) => {
          const IconComp = iconMap[it.icon] || ShieldCheck;
          return (
            <div className="trust-item" key={it.id || it.title} data-cms-target={`trustStrip.${idx}`}>
              <IconComp size={20} strokeWidth={2} />
              <span>{it.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
