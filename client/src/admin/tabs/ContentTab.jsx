import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import { 
  FileText, 
  Sparkles, 
  Eye, 
  Plus, 
  Trash2, 
  Star, 
  Megaphone, 
  Award, 
  Heart, 
  ShieldCheck 
} from 'lucide-react';

export default function ContentTab({
  content,
  updateContent,
  token,
  sendFocusToPreview,
  sendBlurToPreview,
  scrollPreviewToSection
}) {
  const [activeSub, setActiveSub] = useState('hero');

  const hero = content?.hero || {};
  const announcements = content?.announcements || [];
  const festive = content?.festive || {};
  const trustStrip = content?.trustStrip || [];
  const whyUs = content?.whyUs || { items: [] };
  const testimonials = content?.testimonials || { items: [] };
  const newsletter = content?.newsletter || {};

  // Hero Handlers
  const handleHeroChange = (field, val) => {
    updateContent({
      ...content,
      hero: {
        ...hero,
        [field]: val
      }
    });
  };

  // Announcements Handlers
  const handleAddAnnouncement = () => {
    updateContent({
      ...content,
      announcements: [...announcements, "Special Offer • Shop Now"]
    });
  };

  const handleUpdateAnnouncement = (index, val) => {
    const copy = [...announcements];
    copy[index] = val;
    updateContent({
      ...content,
      announcements: copy
    });
  };

  const handleDeleteAnnouncement = (index) => {
    updateContent({
      ...content,
      announcements: announcements.filter((_, i) => i !== index)
    });
  };

  // Festive Handlers
  const handleFestiveChange = (field, val) => {
    updateContent({
      ...content,
      festive: {
        ...festive,
        [field]: val
      }
    });
  };

  const handleFestiveImageChange = (index, url) => {
    const copy = [...(festive.images || ['/images/suit-navy.jpg', '/images/saree-purple.jpg'])];
    copy[index] = url;
    updateContent({
      ...content,
      festive: {
        ...festive,
        images: copy
      }
    });
  };

  // Testimonials Handlers
  const handleAddTestimonial = () => {
    const newItem = {
      id: Date.now(),
      rating: 5,
      quote: "The weave quality was extraordinary. Felt genuinely regal!",
      name: "Radhika Sen",
      location: "Bengaluru, Karnataka",
      avatarLetter: "R"
    };
    updateContent({
      ...content,
      testimonials: {
        ...testimonials,
        items: [...(testimonials.items || []), newItem]
      }
    });
  };

  const handleUpdateTestimonial = (index, field, val) => {
    const copy = [...(testimonials.items || [])];
    copy[index] = { ...copy[index], [field]: val };
    updateContent({
      ...content,
      testimonials: {
        ...testimonials,
        items: copy
      }
    });
  };

  const handleDeleteTestimonial = (index) => {
    const copy = (testimonials.items || []).filter((_, i) => i !== index);
    updateContent({
      ...content,
      testimonials: {
        ...testimonials,
        items: copy
      }
    });
  };

  return (
    <div className="cms-tab-content">
      {/* Header */}
      <div className="cms-tab-header">
        <div className="cms-tab-title-wrap">
          <FileText className="cms-tab-icon" size={20} />
          <div>
            <h3>Store Copy & Brand Editorial</h3>
            <p>Directly customize marketing headlines, promotional banners, and customer reviews.</p>
          </div>
        </div>
      </div>

      {/* Sub Navigation Strip */}
      <div className="cms-sub-nav">
        {[
          { id: 'hero', label: 'Hero Banner' },
          { id: 'announcements', label: 'Announcement Marquee' },
          { id: 'festive', label: 'Festive Spotlight' },
          { id: 'trust', label: 'Trust Strip' },
          { id: 'whyUs', label: 'Artisan Commitment' },
          { id: 'testimonials', label: 'Customer Reviews' },
          { id: 'newsletter', label: 'Newsletter' }
        ].map((sub) => (
          <button
            key={sub.id}
            type="button"
            className={`cms-sub-nav-btn ${activeSub === sub.id ? 'active' : ''}`}
            onClick={() => {
              setActiveSub(sub.id);
              scrollPreviewToSection(sub.id === 'trust' ? 'trustStrip' : sub.id);
            }}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* 1. HERO BANNER */}
      {activeSub === 'hero' && (
        <div className="cms-card-section">
          <div className="cms-section-label">
            <Sparkles size={14} />
            <span>Hero Banner Customizer</span>
          </div>

          <div className="cms-input-field">
            <label>Eyebrow Badge Tag</label>
            <input
              type="text"
              data-editor-target="hero.label"
              value={hero.label || ''}
              onFocus={() => sendFocusToPreview('hero.label')}
              onBlur={sendBlurToPreview}
              onChange={(e) => handleHeroChange('label', e.target.value)}
              className="cms-input"
            />
          </div>

          <div className="cms-input-field">
            <label>Hero Main Heading</label>
            <input
              type="text"
              data-editor-target="hero.title"
              value={hero.title || ''}
              onFocus={() => sendFocusToPreview('hero.title')}
              onBlur={sendBlurToPreview}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              className="cms-input"
            />
          </div>

          <div className="cms-input-field">
            <label>Italicized Accent Phrase in Title</label>
            <input
              type="text"
              value={hero.italicWord || ''}
              onChange={(e) => handleHeroChange('italicWord', e.target.value)}
              className="cms-input"
              placeholder="e.g. Every Thread"
            />
            <small>Words matching this string will be italicized in gold luxury serif.</small>
          </div>

          <div className="cms-input-field">
            <label>Hero Subtitle Narrative</label>
            <textarea
              data-editor-target="hero.subtitle"
              value={hero.subtitle || ''}
              onFocus={() => sendFocusToPreview('hero.subtitle')}
              onBlur={sendBlurToPreview}
              onChange={(e) => handleHeroChange('subtitle', e.target.value)}
              className="cms-textarea"
              rows={3}
            />
          </div>

          <div className="cms-input-row">
            <div className="cms-input-field">
              <label>Primary Button Label</label>
              <input
                type="text"
                data-editor-target="hero.primaryCtaText"
                value={hero.primaryCtaText || ''}
                onFocus={() => sendFocusToPreview('hero.primaryCtaText')}
                onBlur={sendBlurToPreview}
                onChange={(e) => handleHeroChange('primaryCtaText', e.target.value)}
                className="cms-input"
              />
            </div>
            <div className="cms-input-field">
              <label>Secondary Button Label</label>
              <input
                type="text"
                data-editor-target="hero.secondaryCtaText"
                value={hero.secondaryCtaText || ''}
                onFocus={() => sendFocusToPreview('hero.secondaryCtaText')}
                onBlur={sendBlurToPreview}
                onChange={(e) => handleHeroChange('secondaryCtaText', e.target.value)}
                className="cms-input"
              />
            </div>
          </div>

          {/* Hero Image Uploader */}
          <ImageUploader
            label="Hero Full-Bleed Background Photo"
            value={hero.bannerImage || '/images/hero.jpg'}
            onChange={(url) => handleHeroChange('bannerImage', url)}
            token={token}
            targetKey="hero.bannerImage"
            onFocus={() => sendFocusToPreview('hero.bannerImage', true)}
            onBlur={sendBlurToPreview}
            folder="chandrakanta/hero"
          />
        </div>
      )}

      {/* 2. ANNOUNCEMENT MARQUEE */}
      {activeSub === 'announcements' && (
        <div className="cms-card-section">
          <div className="cms-section-label">
            <Megaphone size={14} />
            <span>Announcement Strip Phrases ({announcements.length})</span>
          </div>

          <div className="cms-items-list">
            {announcements.map((item, idx) => (
              <div key={idx} className="cms-item-row" data-editor-target="announcements">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleUpdateAnnouncement(idx, e.target.value)}
                  onFocus={() => sendFocusToPreview('announcements')}
                  onBlur={sendBlurToPreview}
                  className="cms-input"
                />
                <button
                  type="button"
                  className="cms-delete-btn"
                  onClick={() => handleDeleteAnnouncement(idx)}
                  title="Remove phrase"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="cms-btn-add"
            onClick={handleAddAnnouncement}
          >
            <Plus size={14} /> Add Announcement Phrase
          </button>
        </div>
      )}

      {/* 3. FESTIVE EDITORIAL SPOTLIGHT */}
      {activeSub === 'festive' && (
        <div className="cms-card-section">
          <div className="cms-section-label">
            <Sparkles size={14} />
            <span>Festive Editorial Spotlight</span>
          </div>

          <div className="cms-input-field">
            <label>Festive Tag</label>
            <input
              type="text"
              data-editor-target="festive.label"
              value={festive.label || ''}
              onFocus={() => sendFocusToPreview('festive.label')}
              onBlur={sendBlurToPreview}
              onChange={(e) => handleFestiveChange('label', e.target.value)}
              className="cms-input"
            />
          </div>

          <div className="cms-input-field">
            <label>Spotlight Title</label>
            <input
              type="text"
              data-editor-target="festive.title"
              value={festive.title || ''}
              onFocus={() => sendFocusToPreview('festive.title')}
              onBlur={sendBlurToPreview}
              onChange={(e) => handleFestiveChange('title', e.target.value)}
              className="cms-input"
            />
          </div>

          <div className="cms-input-field">
            <label>Editorial Description</label>
            <textarea
              data-editor-target="festive.description"
              value={festive.description || ''}
              onFocus={() => sendFocusToPreview('festive.description')}
              onBlur={sendBlurToPreview}
              onChange={(e) => handleFestiveChange('description', e.target.value)}
              className="cms-textarea"
              rows={3}
            />
          </div>

          <div className="cms-input-field">
            <label>CTA Button Label</label>
            <input
              type="text"
              data-editor-target="festive.ctaText"
              value={festive.ctaText || ''}
              onFocus={() => sendFocusToPreview('festive.ctaText')}
              onBlur={sendBlurToPreview}
              onChange={(e) => handleFestiveChange('ctaText', e.target.value)}
              className="cms-input"
            />
          </div>

          <div className="cms-input-row" style={{ marginTop: '16px' }}>
            <ImageUploader
              label="Spotlight Photo 1 (Suit Set)"
              value={festive.images?.[0] || '/images/suit-navy.jpg'}
              onChange={(url) => handleFestiveImageChange(0, url)}
              token={token}
              targetKey="festive.images.0"
              onFocus={() => sendFocusToPreview('festive.images.0', true)}
              onBlur={sendBlurToPreview}
              folder="chandrakanta/festive"
            />
            <ImageUploader
              label="Spotlight Photo 2 (Saree)"
              value={festive.images?.[1] || '/images/saree-purple.jpg'}
              onChange={(url) => handleFestiveImageChange(1, url)}
              token={token}
              targetKey="festive.images.1"
              onFocus={() => sendFocusToPreview('festive.images.1', true)}
              onBlur={sendBlurToPreview}
              folder="chandrakanta/festive"
            />
          </div>
        </div>
      )}

      {/* 4. TRUST PROMISES */}
      {activeSub === 'trust' && (
        <div className="cms-card-section">
          <div className="cms-section-label">
            <ShieldCheck size={14} />
            <span>Value Promises & Trust Badges</span>
          </div>

          <div className="cms-items-list">
            {trustStrip.map((item, idx) => (
              <div key={idx} className="cms-item-card" data-editor-target={`trustStrip.${idx}`}>
                <div className="cms-input-row">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const copy = [...trustStrip];
                      copy[idx].title = e.target.value;
                      updateContent({ ...content, trustStrip: copy });
                    }}
                    onFocus={() => sendFocusToPreview(`trustStrip.${idx}`)}
                    onBlur={sendBlurToPreview}
                    className="cms-input"
                  />
                  <select
                    value={item.icon || 'ShieldCheck'}
                    onChange={(e) => {
                      const copy = [...trustStrip];
                      copy[idx].icon = e.target.value;
                      updateContent({ ...content, trustStrip: copy });
                    }}
                    className="cms-select"
                    style={{ width: '160px' }}
                  >
                    <option value="Truck">Truck (Shipping)</option>
                    <option value="ShieldCheck">ShieldCheck (Authentic)</option>
                    <option value="RotateCcw">RotateCcw (Returns)</option>
                    <option value="Banknote">Banknote (COD)</option>
                    <option value="Headphones">Headphones (Support)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ARTISAN COMMITMENT (WHY US) */}
      {activeSub === 'whyUs' && (
        <div className="cms-card-section">
          <div className="cms-section-label">
            <Award size={14} />
            <span>Artisan Commitment & Why Us</span>
          </div>

          <div className="cms-input-field">
            <label>Section Heading</label>
            <input
              type="text"
              data-editor-target="whyUs.title"
              value={whyUs.title || ''}
              onFocus={() => sendFocusToPreview('whyUs.title')}
              onBlur={sendBlurToPreview}
              onChange={(e) => updateContent({
                ...content,
                whyUs: { ...whyUs, title: e.target.value }
              })}
              className="cms-input"
            />
          </div>

          <div className="cms-input-field">
            <label>Section Subtitle</label>
            <textarea
              data-editor-target="whyUs.description"
              value={whyUs.description || ''}
              onFocus={() => sendFocusToPreview('whyUs.description')}
              onBlur={sendBlurToPreview}
              onChange={(e) => updateContent({
                ...content,
                whyUs: { ...whyUs, description: e.target.value }
              })}
              className="cms-textarea"
              rows={2}
            />
          </div>

          <div className="cms-items-list" style={{ marginTop: '16px' }}>
            {(whyUs.items || []).map((it, idx) => (
              <div key={idx} className="cms-item-card" data-editor-target={`whyUs.${idx}`}>
                <div className="cms-input-field">
                  <label>Commitment #{idx + 1} Title</label>
                  <input
                    type="text"
                    value={it.title}
                    onChange={(e) => {
                      const copy = [...whyUs.items];
                      copy[idx].title = e.target.value;
                      updateContent({ ...content, whyUs: { ...whyUs, items: copy } });
                    }}
                    className="cms-input"
                  />
                </div>
                <div className="cms-input-field">
                  <label>Commitment #{idx + 1} Narrative</label>
                  <textarea
                    value={it.description}
                    onChange={(e) => {
                      const copy = [...whyUs.items];
                      copy[idx].description = e.target.value;
                      updateContent({ ...content, whyUs: { ...whyUs, items: copy } });
                    }}
                    className="cms-textarea"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TESTIMONIALS */}
      {activeSub === 'testimonials' && (
        <div className="cms-card-section">
          <div className="cms-section-label">
            <Heart size={14} />
            <span>Customer Reviews & Quotes ({(testimonials.items || []).length})</span>
          </div>

          <div className="cms-items-list">
            {(testimonials.items || []).map((review, idx) => (
              <div key={review.id || idx} className="cms-item-card" data-editor-target={`testimonials.${idx}`}>
                <div className="cms-item-card-header">
                  <strong>#{idx + 1} {review.name}</strong>
                  <button
                    type="button"
                    className="cms-delete-btn"
                    onClick={() => handleDeleteTestimonial(idx)}
                    title="Remove review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="cms-input-field">
                  <label>Customer Quote</label>
                  <textarea
                    value={review.quote}
                    onChange={(e) => handleUpdateTestimonial(idx, 'quote', e.target.value)}
                    onFocus={() => sendFocusToPreview(`testimonials.${idx}`)}
                    onBlur={sendBlurToPreview}
                    className="cms-textarea"
                    rows={2}
                  />
                </div>

                <div className="cms-input-row">
                  <div className="cms-input-field">
                    <label>Customer Name</label>
                    <input
                      type="text"
                      value={review.name}
                      onChange={(e) => handleUpdateTestimonial(idx, 'name', e.target.value)}
                      className="cms-input"
                    />
                  </div>
                  <div className="cms-input-field">
                    <label>Location (City, State)</label>
                    <input
                      type="text"
                      value={review.location}
                      onChange={(e) => handleUpdateTestimonial(idx, 'location', e.target.value)}
                      className="cms-input"
                    />
                  </div>
                  <div className="cms-input-field" style={{ maxWidth: '100px' }}>
                    <label>Rating (1-5)</label>
                    <select
                      value={review.rating || 5}
                      onChange={(e) => handleUpdateTestimonial(idx, 'rating', Number(e.target.value))}
                      className="cms-select"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="cms-btn-add"
            onClick={handleAddTestimonial}
          >
            <Plus size={14} /> Add Customer Review
          </button>
        </div>
      )}

      {/* 7. NEWSLETTER */}
      {activeSub === 'newsletter' && (
        <div className="cms-card-section">
          <div className="cms-section-label">
            <Sparkles size={14} />
            <span>Newsletter Subscription Strip</span>
          </div>

          <div className="cms-input-field">
            <label>Newsletter Title</label>
            <input
              type="text"
              data-editor-target="newsletter.title"
              value={newsletter.title || ''}
              onFocus={() => sendFocusToPreview('newsletter.title')}
              onBlur={sendBlurToPreview}
              onChange={(e) => updateContent({
                ...content,
                newsletter: { ...newsletter, title: e.target.value }
              })}
              className="cms-input"
            />
          </div>

          <div className="cms-input-field">
            <label>Incentive Description</label>
            <textarea
              data-editor-target="newsletter.description"
              value={newsletter.description || ''}
              onFocus={() => sendFocusToPreview('newsletter.description')}
              onBlur={sendBlurToPreview}
              onChange={(e) => updateContent({
                ...content,
                newsletter: { ...newsletter, description: e.target.value }
              })}
              className="cms-textarea"
              rows={2}
            />
          </div>

          <div className="cms-input-field">
            <label>Subscribe Button Text</label>
            <input
              type="text"
              data-editor-target="newsletter.buttonText"
              value={newsletter.buttonText || ''}
              onFocus={() => sendFocusToPreview('newsletter.buttonText')}
              onBlur={sendBlurToPreview}
              onChange={(e) => updateContent({
                ...content,
                newsletter: { ...newsletter, buttonText: e.target.value }
              })}
              className="cms-input"
            />
          </div>
        </div>
      )}
    </div>
  );
}
