import React from 'react';
import { Settings, Shield, AlertTriangle, RefreshCw, CheckCircle, Smartphone } from 'lucide-react';

export default function SettingsTab({
  settings = {},
  onUpdateSettings,
  onResetDefaults,
  adminStatus = {}
}) {
  const handleChange = (field, val) => {
    onUpdateSettings({
      ...settings,
      [field]: val
    });
  };

  const handleReset = () => {
    if (confirm("⚠️ CAUTION: Reset all website copy, catalog weaves, and settings back to original defaults? This cannot be undone.")) {
      onResetDefaults();
    }
  };

  return (
    <div className="cms-tab-content">
      {/* Header */}
      <div className="cms-tab-header">
        <div className="cms-tab-title-wrap">
          <Settings className="cms-tab-icon" size={20} />
          <div>
            <h3>Store Settings & Integrations</h3>
            <p>Configure brand metadata, shipping thresholds, and verify live integrations.</p>
          </div>
        </div>
      </div>

      {/* 1. Brand Identity */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Shield size={14} />
          <span>Brand Identity & Contact Info</span>
        </div>

        <div className="cms-input-row">
          <div className="cms-input-field">
            <label>Brand Name</label>
            <input
              type="text"
              data-editor-target="settings.brandName"
              value={settings.brandName || ''}
              onChange={(e) => handleChange('brandName', e.target.value)}
              className="cms-input"
            />
          </div>
          <div className="cms-input-field">
            <label>Brand Tagline</label>
            <input
              type="text"
              data-editor-target="settings.tagline"
              value={settings.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="cms-input"
            />
          </div>
        </div>

        <div className="cms-input-row">
          <div className="cms-input-field">
            <label>Primary Contact Phone</label>
            <input
              type="text"
              data-editor-target="settings.phonePrimary"
              value={settings.phonePrimary || ''}
              onChange={(e) => handleChange('phonePrimary', e.target.value)}
              className="cms-input"
            />
          </div>
          <div className="cms-input-field">
            <label>WhatsApp Desk Number (without +)</label>
            <input
              type="text"
              data-editor-target="settings.whatsappNumber"
              value={settings.whatsappNumber || ''}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              className="cms-input"
            />
          </div>
        </div>

        <div className="cms-input-field">
          <label>Customer Care Email</label>
          <input
            type="email"
            data-editor-target="settings.supportEmail"
            value={settings.supportEmail || ''}
            onChange={(e) => handleChange('supportEmail', e.target.value)}
            className="cms-input"
          />
        </div>

        <div className="cms-input-field">
          <label>Heritage Studio Address</label>
          <input
            type="text"
            data-editor-target="settings.address"
            value={settings.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="cms-input"
          />
        </div>
      </div>

      {/* 2. Shipping Rules */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <Settings size={14} />
          <span>Shipping & Delivery Rules</span>
        </div>

        <div className="cms-input-row">
          <div className="cms-input-field">
            <label>Free Shipping Threshold (₹)</label>
            <input
              type="number"
              value={settings.freeShippingThreshold || 1999}
              onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
              className="cms-input"
            />
            <small>Orders above this amount receive automatic free shipping</small>
          </div>
          <div className="cms-input-field">
            <label>Standard Shipping Fee (₹)</label>
            <input
              type="number"
              value={settings.standardShippingFee || 99}
              onChange={(e) => handleChange('standardShippingFee', Number(e.target.value))}
              className="cms-input"
            />
            <small>Applied to orders below threshold</small>
          </div>
        </div>
      </div>

      {/* 3. Integrations & Health */}
      <div className="cms-card-section">
        <div className="cms-section-label">
          <CheckCircle size={14} />
          <span>Active System Integrations</span>
        </div>

        <div className="cms-health-grid">
          <div className="cms-health-item">
            <div className="dot online"></div>
            <div>
              <strong>MongoDB Database Layer</strong>
              <p>Dual-Mode persistence (In-memory cache + MongoDB sync)</p>
            </div>
          </div>

          <div className="cms-health-item">
            <div className="dot online"></div>
            <div>
              <strong>UPI Deep Linking & Dynamic QR</strong>
              <p>Standard upi://pay gateway with automated QR code generator</p>
            </div>
          </div>

          <div className="cms-health-item">
            <div className="dot online"></div>
            <div>
              <strong>Cloudinary & Media Fallback</strong>
              <p>Cloud image CDN with automatic local public disk fallback</p>
            </div>
          </div>

          <div className="cms-health-item">
            <div className="dot online"></div>
            <div>
              <strong>Razorpay Payment Gateway</strong>
              <p>Active with seamless simulation fallback for staging</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Danger Zone */}
      <div className="cms-card-section danger">
        <div className="cms-section-label" style={{ color: '#ef4444' }}>
          <AlertTriangle size={14} />
          <span>Danger Zone</span>
        </div>
        <p className="cms-section-sub">
          Reset all site content, catalog products, and visual customizations back to initial factory defaults.
        </p>

        <button
          type="button"
          className="cms-btn-danger"
          onClick={handleReset}
        >
          <RefreshCw size={14} /> Reset Entire Store to Factory Defaults
        </button>
      </div>
    </div>
  );
}
