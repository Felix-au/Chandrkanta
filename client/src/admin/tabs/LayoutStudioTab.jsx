import React from 'react';

export default function LayoutStudioTab({ layout, onChange }) {
  return (
    <div className="layout-studio-tab">
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Header & Hero Layout Options</h3>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Header Variant</label>
        <select value={layout?.headerVariant || 'standard'} onChange={e => onChange?.('headerVariant', e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px' }}>
          <option value="standard">Standard Navigation</option>
          <option value="floating">Floating Pill Navbar</option>
          <option value="minimal">Minimal Top Bar</option>
        </select>
      </div>
      <div>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Hero Section Style</label>
        <select value={layout?.heroVariant || 'banner'} onChange={e => onChange?.('heroVariant', e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px' }}>
          <option value="banner">Fullwidth Festive Banner</option>
          <option value="split">Split Card Layout</option>
        </select>
      </div>
    </div>
  );
}
