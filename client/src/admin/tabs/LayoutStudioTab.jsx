import React from 'react';
import {
  Layout,
  Columns,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles
} from 'lucide-react';


export default function LayoutStudioTab({ layout, updateLayout, scrollPreviewToSection }) {
  const currentLayout = layout || {
    gridColumns: { desktop: 4, tablet: 2, mobile: 2 },
    heroVariant: 'center',
    headerVariant: 'sticky',
    categoryStyle: 'cards',
    visibleSections: {
      announcementBar: true,
      hero: true,
      trustStrip: true,
      categories: true,
      featuredProducts: true,
      festiveBanner: true,
      whyUs: true,
      testimonials: true,
      newsletter: true,
      footer: true,
      floatingMobileBar: true,
    },
    sectionOrder: [
      'hero', 'trustStrip', 'categories', 'featuredProducts',
      'festiveBanner', 'whyUs', 'testimonials', 'newsletter',
    ],
  };

  const gridColumns = currentLayout.gridColumns || { desktop: 4, tablet: 2, mobile: 2 };
  const visibleSections = currentLayout.visibleSections || {};
  const sectionOrder = currentLayout.sectionOrder || [
    'hero', 'trustStrip', 'categories', 'featuredProducts',
    'festiveBanner', 'whyUs', 'testimonials', 'newsletter',
  ];

  const handleGridChange = (device, cols) => {
    updateLayout({ ...currentLayout, gridColumns: { ...gridColumns, [device]: Number(cols) } });
  };

  const handleToggleSection = (sectionKey) => {
    updateLayout({
      ...currentLayout,
      visibleSections: {
        ...visibleSections,
        [sectionKey]: visibleSections[sectionKey] === false ? true : false,
      },
    });
  };

  const handleHeroVariant = (variant) => {
    updateLayout({ ...currentLayout, heroVariant: variant });
    scrollPreviewToSection('hero');
  };

  const handleHeaderVariant = (variant) => {
    updateLayout({ ...currentLayout, headerVariant: variant });
  };

  const handleCategoryStyle = (style) => {
    updateLayout({ ...currentLayout, categoryStyle: style });
    scrollPreviewToSection('categories');
  };

  const handleMoveSection = (index, direction) => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    updateLayout({ ...currentLayout, sectionOrder: newOrder });
  };

  const sectionLabels = {
    hero: 'Hero Banner',
    trustStrip: 'Value Promises Strip',
    categories: 'Collections Category Grid',
    featuredProducts: 'Featured Products Showcase',
    festiveBanner: 'Festive Editorial Spotlight',
    whyUs: 'Artisan Commitment & Why Us',
    testimonials: 'Customer Reviews & Testimonials',
    newsletter: 'Newsletter Subscription Strip',
  };

  return (
    <div className="cms-tab-content">
      {/* Header */}
      <div className="cms-tab-header">
        <div className="cms-tab-title-wrap">
          <Layout className="cms-tab-icon" size={20} />
          <div>
            <h3>Layout Studio &amp; Responsive Controls</h3>
            <p>Customize device grids, header &amp; hero presets, section visibility and order.</p>
          </div>
        </div>
      </div>


      {/* ── Product Grid Density ── */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Columns size={14} />
          <span>Product Grid Density per Device</span>
        </div>

        <div className="cms-device-columns-grid">
          {/* Desktop */}
          <div className="cms-column-control-card">
            <div className="cms-col-title">
              <Monitor size={15} />
              <span>Desktop Viewport</span>
            </div>
            <div className="cms-button-pills">
              <button type="button" className={`cms-pill ${gridColumns.desktop === 3 ? 'active' : ''}`} onClick={() => handleGridChange('desktop', 3)}>3 Columns</button>
              <button type="button" className={`cms-pill ${gridColumns.desktop === 4 ? 'active' : ''}`} onClick={() => handleGridChange('desktop', 4)}>4 Columns (Standard)</button>
            </div>
          </div>

          {/* Tablet */}
          <div className="cms-column-control-card">
            <div className="cms-col-title">
              <Tablet size={15} />
              <span>Tablet Viewport</span>
            </div>
            <div className="cms-button-pills">
              <button type="button" className={`cms-pill ${gridColumns.tablet === 2 ? 'active' : ''}`} onClick={() => handleGridChange('tablet', 2)}>2 Columns (Balanced)</button>
              <button type="button" className={`cms-pill ${gridColumns.tablet === 3 ? 'active' : ''}`} onClick={() => handleGridChange('tablet', 3)}>3 Columns (Dense)</button>
            </div>
          </div>

          {/* Mobile */}
          <div className="cms-column-control-card">
            <div className="cms-col-title">
              <Smartphone size={15} />
              <span>Mobile Viewport</span>
            </div>
            <div className="cms-button-pills">
              <button type="button" className={`cms-pill ${gridColumns.mobile === 1 ? 'active' : ''}`} onClick={() => handleGridChange('mobile', 1)}>1 Column (Editorial)</button>
              <button type="button" className={`cms-pill ${gridColumns.mobile === 2 ? 'active' : ''}`} onClick={() => handleGridChange('mobile', 2)}>2 Columns (App-Dense)</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Banner Presets ── */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Sparkles size={14} />
          <span>Hero Banner Presentation Style</span>
        </div>
        <p className="cms-section-sub">Select the hero presentation format. Live changes reflect immediately in the preview canvas.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {[
            { key: 'center',  label: 'Centered Classic Luxury',  desc: 'Full-width hero with centered copy & dual CTAs.' },
            { key: 'split',   label: 'Split 50/50 Editorial',    desc: 'Dual-column with large portrait focus.' },
            { key: 'minimal', label: 'Minimalist Atelier',       desc: 'Refined typographic focus & clean whitespace.' },
          ].map(({ key, label, desc }) => {
            const isActive = currentLayout.heroVariant === key;
            return (
              <div
                key={key}
                onClick={() => handleHeroVariant(key)}
                onKeyDown={(e) => e.key === 'Enter' && handleHeroVariant(key)}
                role="button"
                tabIndex={0}
                style={{
                  cursor: 'pointer',
                  border: isActive ? '2px solid #c8922a' : '1px solid #272a36',
                  borderRadius: 8,
                  padding: '12px 14px',
                  background: isActive ? 'rgba(200,146,42,0.12)' : '#111216',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#c8922a' : '#f4f4f5' }}>{label}</span>
                  {isActive && <span style={{ fontSize: 10, color: '#c8922a', fontWeight: 700 }}>✓ Active</span>}
                </div>
                <div style={{ fontSize: 11, color: '#71717a', lineHeight: 1.35 }}>{desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Header Navigation Preset ── */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Layout size={14} />
          <span>Header Navigation Preset</span>
        </div>

        <div className="cms-button-pills" style={{ marginTop: 8 }}>
          <button type="button" className={`cms-pill ${currentLayout.headerVariant === 'sticky'   ? 'active' : ''}`} onClick={() => handleHeaderVariant('sticky')}>Solid Sticky Navbar</button>
          <button type="button" className={`cms-pill ${currentLayout.headerVariant === 'floating' ? 'active' : ''}`} onClick={() => handleHeaderVariant('floating')}>Floating Glassmorphic</button>
          <button type="button" className={`cms-pill ${currentLayout.headerVariant === 'minimal'  ? 'active' : ''}`} onClick={() => handleHeaderVariant('minimal')}>Minimalist Centered Logo</button>
        </div>


      </div>

      {/* ── Section Visibility ── */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Eye size={14} />
          <span>Homepage Section Visibility</span>
        </div>

        <div className="cms-visibility-list">
          {[
            { key: 'announcementBar',  label: 'Announcement Marquee Strip' },
            { key: 'hero',             label: 'Hero Banner Section' },
            { key: 'trustStrip',       label: 'Value Promises Strip' },
            { key: 'categories',       label: 'Collections Category Grid' },
            { key: 'featuredProducts', label: 'Featured Products Showcase' },
            { key: 'festiveBanner',    label: 'Festive Editorial Spotlight' },
            { key: 'whyUs',            label: 'Artisan Commitment Block' },
            { key: 'testimonials',     label: 'Customer Reviews & Testimonials' },
            { key: 'newsletter',       label: 'Newsletter Subscriber Strip' },
            { key: 'footer',           label: 'Store Footer' },
            { key: 'floatingMobileBar',label: 'Mobile Floating Sticky Action Bar' },
          ].map((sec) => {
            const isVisible = visibleSections[sec.key] !== false;
            return (
              <div key={sec.key} className="cms-visibility-row">
                <span className="cms-vis-name">{sec.label}</span>
                <button
                  type="button"
                  className={`cms-vis-toggle-btn ${isVisible ? 'on' : 'off'}`}
                  onClick={() => handleToggleSection(sec.key)}
                >
                  {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section Reorder ── */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <ArrowUp size={14} />
          <span>Homepage Narrative Section Order</span>
        </div>
        <p className="cms-section-sub">
          Click arrows to rearrange the vertical flow of your storefront homepage.
        </p>

        <div className="cms-order-list">
          {sectionOrder.map((secKey, idx) => (
            <div key={secKey} className="cms-order-row">
              <span className="cms-order-num">#{idx + 1}</span>
              <span className="cms-order-title">{sectionLabels[secKey] || secKey}</span>
              <div className="cms-order-actions">
                <button
                  type="button"
                  className="cms-order-btn"
                  disabled={idx === 0}
                  onClick={() => handleMoveSection(idx, 'up')}
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  className="cms-order-btn"
                  disabled={idx === sectionOrder.length - 1}
                  onClick={() => handleMoveSection(idx, 'down')}
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

