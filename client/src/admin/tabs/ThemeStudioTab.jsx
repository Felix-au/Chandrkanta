import React from 'react';
import { THEME_PRESETS, FONT_OPTIONS } from '../themePresets';
import { Palette, Type, Sliders, Sparkles, Check, RefreshCw } from 'lucide-react';

export default function ThemeStudioTab({
  theme,
  updateTheme,
  sendFocusToPreview,
  sendBlurToPreview
}) {
  const currentTheme = theme || THEME_PRESETS[0];
  const activePresetId = currentTheme.activePreset || 'crimson-gold';
  const colors = currentTheme.colors || THEME_PRESETS[0].colors;
  const typography = currentTheme.typography || THEME_PRESETS[0].typography;
  const radii = currentTheme.radii || THEME_PRESETS[0].radii;
  const shadow = currentTheme.shadow || 'luxury';

  const handleApplyPreset = (preset) => {
    updateTheme({
      ...preset,
      activePreset: preset.id
    });
  };

  const handleColorChange = (key, hex) => {
    updateTheme({
      ...currentTheme,
      activePreset: 'custom',
      colors: {
        ...colors,
        [key]: hex
      }
    });
  };

  const handleTypographyChange = (key, font) => {
    updateTheme({
      ...currentTheme,
      activePreset: 'custom',
      typography: {
        ...typography,
        [key]: font
      }
    });
  };

  const handleRadiusChange = (sizeName, value) => {
    updateTheme({
      ...currentTheme,
      activePreset: 'custom',
      radii: {
        ...radii,
        [sizeName]: value
      }
    });
  };

  const handlePresetRadius = (type) => {
    let newRadii = { sm: '4px', md: '8px', lg: '16px', full: '999px' };
    if (type === 'sharp') newRadii = { sm: '0px', md: '0px', lg: '2px', full: '999px' };
    if (type === 'subtle') newRadii = { sm: '4px', md: '6px', lg: '10px', full: '999px' };
    if (type === 'curved') newRadii = { sm: '6px', md: '12px', lg: '20px', full: '999px' };
    if (type === 'pill') newRadii = { sm: '8px', md: '16px', lg: '28px', full: '999px' };

    updateTheme({
      ...currentTheme,
      activePreset: 'custom',
      radii: newRadii
    });
  };

  return (
    <div className="cms-tab-content">
      {/* Tab Header */}
      <div className="cms-tab-header">
        <div className="cms-tab-title-wrap">
          <Palette className="cms-tab-icon" size={20} />
          <div>
            <h3>Luxury Theme Studio</h3>
            <p>Curate royal Indian ethnic color palettes, serif typography & elevation styling.</p>
          </div>
        </div>
      </div>

      {/* 1. Preset Themes Gallery */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Sparkles size={14} />
          <span>Curated Heritage Theme Presets</span>
        </div>

        <div className="cms-presets-grid">
          {THEME_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                className={`cms-preset-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleApplyPreset(preset)}
                role="button"
                tabIndex={0}
              >
                <div className="cms-preset-top">
                  <div className="cms-preset-swatches">
                    <span className="swatch" style={{ background: preset.colors.accent }}></span>
                    <span className="swatch" style={{ background: preset.colors.gold }}></span>
                    <span className="swatch" style={{ background: preset.colors.bg }}></span>
                    <span className="swatch" style={{ background: preset.colors.surface }}></span>
                  </div>
                  {isSelected && (
                    <span className="cms-preset-badge">
                      <Check size={11} /> Active
                    </span>
                  )}
                </div>
                <h4 className="cms-preset-name">{preset.name}</h4>
                <p className="cms-preset-sub">{preset.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Color Designer */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Palette size={14} />
          <span>Custom Palette Designer</span>
        </div>

        <div className="cms-color-grid">
          {/* Accent Color */}
          <div className="cms-color-field" data-editor-target="theme.colors.accent">
            <label>Primary Brand Accent</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.accent || '#7B1C1C'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                onFocus={() => sendFocusToPreview('hero.title')}
                onBlur={sendBlurToPreview}
              />
              <input
                type="text"
                value={colors.accent || '#7B1C1C'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="cms-hex-input"
              />
            </div>
            <small>Used for primary CTAs, announcement strip, badge pills</small>
          </div>

          {/* Accent Dark */}
          <div className="cms-color-field">
            <label>Accent Dark (Hover/Shade)</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.accentDk || '#5a1212'}
                onChange={(e) => handleColorChange('accentDk', e.target.value)}
              />
              <input
                type="text"
                value={colors.accentDk || '#5a1212'}
                onChange={(e) => handleColorChange('accentDk', e.target.value)}
                className="cms-hex-input"
              />
            </div>
          </div>

          {/* Luxury Gold */}
          <div className="cms-color-field" data-editor-target="theme.colors.gold">
            <label>Zari Gold Accent</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.gold || '#C8922A'}
                onChange={(e) => handleColorChange('gold', e.target.value)}
              />
              <input
                type="text"
                value={colors.gold || '#C8922A'}
                onChange={(e) => handleColorChange('gold', e.target.value)}
                className="cms-hex-input"
              />
            </div>
            <small>Used for luxury trims, price highlights, italic headers</small>
          </div>

          {/* Gold Light */}
          <div className="cms-color-field">
            <label>Light Gold Accent</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.goldLt || '#e8c87a'}
                onChange={(e) => handleColorChange('goldLt', e.target.value)}
              />
              <input
                type="text"
                value={colors.goldLt || '#e8c87a'}
                onChange={(e) => handleColorChange('goldLt', e.target.value)}
                className="cms-hex-input"
              />
            </div>
          </div>

          {/* Background */}
          <div className="cms-color-field">
            <label>Canvas Silk Base</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.bg || '#faf8f5'}
                onChange={(e) => handleColorChange('bg', e.target.value)}
              />
              <input
                type="text"
                value={colors.bg || '#faf8f5'}
                onChange={(e) => handleColorChange('bg', e.target.value)}
                className="cms-hex-input"
              />
            </div>
          </div>

          {/* Card Surface */}
          <div className="cms-color-field">
            <label>Product Card Surface</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.surface || '#ffffff'}
                onChange={(e) => handleColorChange('surface', e.target.value)}
              />
              <input
                type="text"
                value={colors.surface || '#ffffff'}
                onChange={(e) => handleColorChange('surface', e.target.value)}
                className="cms-hex-input"
              />
            </div>
          </div>

          {/* Primary Text */}
          <div className="cms-color-field">
            <label>Primary Text</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.text || '#171717'}
                onChange={(e) => handleColorChange('text', e.target.value)}
              />
              <input
                type="text"
                value={colors.text || '#171717'}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="cms-hex-input"
              />
            </div>
          </div>

          {/* Muted Text */}
          <div className="cms-color-field">
            <label>Muted Text</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.textMuted || '#666666'}
                onChange={(e) => handleColorChange('textMuted', e.target.value)}
              />
              <input
                type="text"
                value={colors.textMuted || '#666666'}
                onChange={(e) => handleColorChange('textMuted', e.target.value)}
                className="cms-hex-input"
              />
            </div>
          </div>

          {/* Border Color */}
          <div className="cms-color-field">
            <label>Borders & Dividers</label>
            <div className="cms-color-picker-row">
              <input
                type="color"
                value={colors.border || '#e0e0e0'}
                onChange={(e) => handleColorChange('border', e.target.value)}
              />
              <input
                type="text"
                value={colors.border || '#e0e0e0'}
                onChange={(e) => handleColorChange('border', e.target.value)}
                className="cms-hex-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Typography Customizer */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Type size={14} />
          <span>Luxury Typography Pairings</span>
        </div>

        <div className="cms-input-field">
          <label>Display & Heading Font</label>
          <select
            value={typography.fontDisp || "'Playfair Display', Georgia, serif"}
            onChange={(e) => handleTypographyChange('fontDisp', e.target.value)}
            className="cms-select"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <div className="cms-font-preview" style={{ fontFamily: typography.fontDisp }}>
            Tradition Woven in Every Thread
          </div>
        </div>

        <div className="cms-input-field" style={{ marginTop: '16px' }}>
          <label>Body Copy & Navigation Font</label>
          <select
            value={typography.fontBody || "'Mulish', 'Helvetica Neue', sans-serif"}
            onChange={(e) => handleTypographyChange('fontBody', e.target.value)}
            className="cms-select"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <div className="cms-font-preview body" style={{ fontFamily: typography.fontBody }}>
            Handpicked authentic weaves and artisanal craftsmanship across Varanasi and Kanchipuram.
          </div>
        </div>
      </div>

      {/* 4. Border Radius & Shape Styling */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Sliders size={14} />
          <span>Corner Roundness & Elevation</span>
        </div>

        <div className="cms-radius-presets">
          <button
            type="button"
            className="cms-radius-btn"
            onClick={() => handlePresetRadius('sharp')}
          >
            <div className="preview-box radius-sharp"></div>
            <span>Sharp (0px)</span>
          </button>
          <button
            type="button"
            className="cms-radius-btn"
            onClick={() => handlePresetRadius('subtle')}
          >
            <div className="preview-box radius-subtle"></div>
            <span>Subtle (6px)</span>
          </button>
          <button
            type="button"
            className="cms-radius-btn"
            onClick={() => handlePresetRadius('curved')}
          >
            <div className="preview-box radius-curved"></div>
            <span>Curved (12px)</span>
          </button>
          <button
            type="button"
            className="cms-radius-btn"
            onClick={() => handlePresetRadius('pill')}
          >
            <div className="preview-box radius-pill"></div>
            <span>Pill / Round</span>
          </button>
        </div>
      </div>
    </div>
  );
}
