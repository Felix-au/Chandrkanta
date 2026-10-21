import React from 'react';
import { useStore } from '../context/StoreContext';

export default function AnnouncementBar() {
  const { content } = useStore();
  const visible = content?.layout?.visibleSections?.announcementBar !== false;
  const announcements = content?.announcements || [
    "Free Shipping Above ₹1999",
    "New Festive Collection — Now Live",
    "Banarasi & Kanjivaram Sarees Handcrafted",
    "Unstitched Suit Sets from ₹799",
    "COD Available Across India",
    "Easy 7-Day Returns"
  ];

  if (!visible) return null;

  return (
    <div className="ann" role="marquee" aria-label="Promotions and offers" data-cms-target="announcements">
      <div className="ann-track" aria-hidden="true">
        {/* Render twice for continuous infinite marquee loop */}
        {announcements.map((item, idx) => (
          <span key={`a1-${idx}`}>{item}</span>
        ))}
        {announcements.map((item, idx) => (
          <span key={`a2-${idx}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
