import React from 'react';

export default function ContentTab({ content, onChange }) {
  return (
    <div className="content-tab">
      <h3>Storefront Copy & Content</h3>
      <div style={{ marginTop: '16px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Hero Headline</label>
        <input type="text" value={content?.hero?.title || ''} onChange={e => onChange?.('hero.title', e.target.value)} style={{ width: '100%', padding: '8px', margin: '8px 0 16px' }} />
        <label style={{ display: 'block', fontWeight: 'bold' }}>Hero Subtitle</label>
        <textarea value={content?.hero?.subtitle || ''} onChange={e => onChange?.('hero.subtitle', e.target.value)} style={{ width: '100%', padding: '8px', margin: '8px 0 16px' }} />
      </div>
    </div>
  );
}
