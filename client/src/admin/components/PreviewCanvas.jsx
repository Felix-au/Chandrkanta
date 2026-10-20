import React, { useState } from 'react';

export default function PreviewCanvas({ children, previewUrl = '/' }) {
  const [device, setDevice] = useState('desktop');

  return (
    <div className="preview-canvas-wrapper" style={{ padding: '16px', background: '#1a1a2e', borderRadius: '12px' }}>
      <div className="preview-toolbar" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button type="button" onClick={() => setDevice('desktop')} style={{ padding: '6px 12px', background: device === 'desktop' ? '#c8922a' : '#2a2a40', color: '#fff', border: 'none', borderRadius: '4px' }}>Desktop</button>
        <button type="button" onClick={() => setDevice('tablet')} style={{ padding: '6px 12px', background: device === 'tablet' ? '#c8922a' : '#2a2a40', color: '#fff', border: 'none', borderRadius: '4px' }}>Tablet</button>
        <button type="button" onClick={() => setDevice('mobile')} style={{ padding: '6px 12px', background: device === 'mobile' ? '#c8922a' : '#2a2a40', color: '#fff', border: 'none', borderRadius: '4px' }}>Mobile</button>
      </div>
      <div className={`preview-frame preview-${device}`} style={{ transition: 'all 0.3s ease', margin: '0 auto', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
