import React from 'react';
import { THEME_PRESETS } from '../themePresets';

export default function ThemeStudioTab({ theme, onChange }) {
  return (
    <div className="theme-studio-tab">
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Theme Presets</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {Object.entries(THEME_PRESETS || {}).map(([key, preset]) => (
          <div key={key} onClick={() => onChange?.(preset)} style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
            <h4>{preset.name}</h4>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: preset.colors?.primary }} />
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: preset.colors?.accent }} />
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: preset.colors?.bg }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
