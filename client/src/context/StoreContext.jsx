import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_STORE_DATA } from '../data/defaultStoreData';
import { apiUrl } from '../config/api';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_STORE_DATA);
  const [draftContent, setDraftContent] = useState(DEFAULT_STORE_DATA);
  const [adminStatus, setAdminStatus] = useState({
    hasUnpublishedChanges: false,
    database: 'memory_ready'
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('ck_admin_token') || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isLivePreview, setIsLivePreview] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(true);

  // Helper for auth headers
  const authHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'Authorization': adminToken ? `Bearer ${adminToken}` : ''
    };
  }, [adminToken]);

  // Fetch live public content from server
  const fetchLiveContent = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/content'));
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setContent((prev) => ({
            ...DEFAULT_STORE_DATA,
            ...json.data,
            theme: { ...DEFAULT_STORE_DATA.theme, ...(json.data.theme || {}) },
            layout: { ...DEFAULT_STORE_DATA.layout, ...(json.data.layout || {}) }
          }));
        }
      }
    } catch (err) {
      console.warn('Using local fallback store data:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch admin working draft
  const fetchDraftContent = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(apiUrl('/api/admin/draft'), { headers: authHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setDraftContent(json.draft);
          setAdminStatus(json.status);
        }
      }
    } catch (err) {
      console.error('Failed to load draft:', err);
    }
  }, [adminToken, authHeaders]);

  useEffect(() => {
    fetchLiveContent();
  }, [fetchLiveContent]);

  useEffect(() => {
    if (adminToken) {
      fetchDraftContent();
    }
  }, [adminToken, fetchDraftContent]);

  // Dynamic CSS Variables Injection into Document Root
  useEffect(() => {
    const root = document.documentElement;
    const theme = content?.theme || DEFAULT_STORE_DATA.theme;
    const layout = content?.layout || DEFAULT_STORE_DATA.layout;

    if (theme?.colors) {
      if (theme.colors.accent) root.style.setProperty('--accent', theme.colors.accent);
      if (theme.colors.accentDk) root.style.setProperty('--accent-dk', theme.colors.accentDk);
      if (theme.colors.accentLt) root.style.setProperty('--accent-lt', theme.colors.accentLt);
      if (theme.colors.gold) root.style.setProperty('--gold', theme.colors.gold);
      if (theme.colors.goldLt) root.style.setProperty('--gold-lt', theme.colors.goldLt);
      if (theme.colors.bg) root.style.setProperty('--bg', theme.colors.bg);
      if (theme.colors.surface) root.style.setProperty('--surface', theme.colors.surface);
      if (theme.colors.surface2) root.style.setProperty('--surface-2', theme.colors.surface2);
      if (theme.colors.text) root.style.setProperty('--text', theme.colors.text);
      if (theme.colors.textMuted) root.style.setProperty('--text-muted', theme.colors.textMuted);
      if (theme.colors.border) root.style.setProperty('--border', theme.colors.border);
    }

    if (theme?.typography) {
      if (theme.typography.fontDisp) root.style.setProperty('--font-disp', theme.typography.fontDisp);
      if (theme.typography.fontBody) root.style.setProperty('--font-body', theme.typography.fontBody);
    }

    if (theme?.radii) {
      if (theme.radii.sm) root.style.setProperty('--r-sm', theme.radii.sm);
      if (theme.radii.md) root.style.setProperty('--r-md', theme.radii.md);
      if (theme.radii.lg) root.style.setProperty('--r-lg', theme.radii.lg);
      if (theme.radii.full) root.style.setProperty('--r-full', theme.radii.full);
    }

    if (layout?.gridColumns) {
      if (layout.gridColumns.desktop) root.style.setProperty('--prod-cols-desktop', layout.gridColumns.desktop);
      if (layout.gridColumns.tablet) root.style.setProperty('--prod-cols-tablet', layout.gridColumns.tablet);
      if (layout.gridColumns.mobile) root.style.setProperty('--prod-cols-mobile', layout.gridColumns.mobile);
    }
  }, [content]);

  // Bidirectional Live Preview PostMessage Bridge & Inspector
  useEffect(() => {
    const isInsideIframe = window.self !== window.top;
    if (!isInsideIframe) return;

    // Create floating tooltip pill for live element inspection
    let tooltipEl = document.getElementById('cms-connector-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'cms-connector-tooltip';
      tooltipEl.className = 'cms-floating-tooltip';
      tooltipEl.innerHTML = `<span class="cms-tooltip-icon">✦</span> <span class="cms-tooltip-text">Double-click to edit</span>`;
      document.body.appendChild(tooltipEl);
    }

    // Label formatter for human-readable inspector hints
    const formatTargetLabel = (key) => {
      if (!key) return 'Element';
      if (key === 'hero') return 'Hero Section';
      if (key === 'hero.label') return 'Hero Eyebrow Tag';
      if (key === 'hero.title') return 'Hero Main Heading';
      if (key === 'hero.subtitle') return 'Hero Subtitle';
      if (key === 'hero.bannerImage') return 'Hero Background Banner';
      if (key === 'hero.primaryCtaText') return 'Hero Primary Button';
      if (key === 'hero.secondaryCtaText') return 'Hero Secondary Button';
      if (key === 'announcements') return 'Announcement Marquee';
      if (key === 'festive') return 'Festive Spotlight';
      if (key === 'festive.label') return 'Festive Tag';
      if (key === 'festive.title') return 'Festive Heading';
      if (key === 'festive.description') return 'Festive Story';
      if (key.startsWith('festive.images')) return 'Festive Editorial Photo';
      if (key === 'trustStrip') return 'Trust Strip Promises';
      if (key.startsWith('trustStrip.')) {
        const idx = parseInt(key.split('.')[1], 10) + 1;
        return `Trust Promise #${idx}`;
      }
      if (key === 'whyUs') return 'Artisan Commitment Block';
      if (key.startsWith('whyUs.')) return 'Artisan Commitment Point';
      if (key === 'testimonials') return 'Customer Reviews Block';
      if (key.startsWith('testimonials.')) {
        const idx = parseInt(key.split('.')[1], 10) + 1;
        return `Customer Review #${idx}`;
      }
      if (key === 'newsletter') return 'Newsletter Strip';
      if (key.startsWith('settings.')) {
        const sub = key.split('.')[1];
        if (sub === 'brandName') return 'Brand Logo & Title';
        if (sub === 'phonePrimary') return 'Store Phone';
        if (sub === 'whatsappNumber') return 'WhatsApp Concierge';
        if (sub === 'supportEmail') return 'Support Email';
        if (sub === 'address') return 'Store Heritage Address';
        return `Store ${sub}`;
      }
      if (key === 'categories') return 'Collections Grid';
      if (key.startsWith('categories.')) {
        const parts = key.split('.');
        const idx = parseInt(parts[1], 10) + 1;
        const sub = parts[2] || '';
        if (sub === 'name') return `Collection #${idx} Title`;
        if (sub === 'image') return `Collection #${idx} Cover Photo`;
        return `Collection #${idx} Card`;
      }
      if (key === 'products') return 'Products Showcase Grid';
      if (key.startsWith('products.')) {
        const parts = key.split('.');
        const idx = parseInt(parts[1], 10) + 1;
        const sub = parts[2] || '';
        if (sub === 'name') return `Product #${idx} Name`;
        if (sub === 'price') return `Product #${idx} Price`;
        if (sub === 'image') return `Product #${idx} Photo`;
        if (sub === 'badge') return `Product #${idx} Badge`;
        return `Product #${idx} Card`;
      }
      return key;
    };

    // Hover handler
    const handleMouseOver = (e) => {
      const targetEl = e.target.closest('[data-cms-target]');
      if (targetEl && tooltipEl) {
        const targetKey = targetEl.getAttribute('data-cms-target');
        const label = formatTargetLabel(targetKey);
        const rect = targetEl.getBoundingClientRect();

        tooltipEl.querySelector('.cms-tooltip-text').textContent = `Double-click to edit ${label}`;
        tooltipEl.style.display = 'flex';

        let topPos = rect.top + window.scrollY - 34;
        if (topPos < window.scrollY + 10) topPos = rect.top + window.scrollY + 12;
        let leftPos = rect.left + window.scrollX + 12;
        if (leftPos + 260 > window.innerWidth) leftPos = window.innerWidth - 270;

        tooltipEl.style.top = `${topPos}px`;
        tooltipEl.style.left = `${leftPos}px`;
        targetEl.classList.add('cms-hover-highlight');
      }
    };

    const handleMouseOut = (e) => {
      const targetEl = e.target.closest('[data-cms-target]');
      if (targetEl) {
        targetEl.classList.remove('cms-hover-highlight');
      }
      if (!e.relatedTarget || !e.relatedTarget.closest('[data-cms-target]')) {
        if (tooltipEl) tooltipEl.style.display = 'none';
      }
    };

    // Double-click handler: sends navigation message to parent Admin Studio
    const handleDblClick = (e) => {
      const targetEl = e.target.closest('[data-cms-target]');
      if (targetEl) {
        const targetKey = targetEl.getAttribute('data-cms-target');
        const isImage = targetEl.tagName === 'IMG' || !!targetEl.querySelector('img') || targetEl.classList.contains('prod-img');

        let sectionKey = 'content';
        if (targetKey.startsWith('products')) sectionKey = 'products';
        else if (targetKey.startsWith('categories')) sectionKey = 'categories';
        else if (targetKey.startsWith('settings')) sectionKey = 'settings';
        else if (targetKey.startsWith('theme')) sectionKey = 'theme';
        else if (targetKey.startsWith('layout')) sectionKey = 'layout';

        window.parent.postMessage({
          type: 'CK_NAVIGATE_TO_ELEMENT',
          targetKey,
          sectionKey,
          isImage
        }, '*');
      }
    };

    // Message listener from Admin Studio
    const handleMessage = (event) => {
      if (!event.data) return;

      // 1. Live content sync with zero reload
      if (event.data.type === 'CK_PREVIEW_SYNC') {
        setIsLivePreview(true);
        if (event.data.payload) {
          setContent((prev) => ({
            ...prev,
            ...event.data.payload,
            theme: { ...prev.theme, ...(event.data.payload.theme || {}) },
            layout: { ...prev.layout, ...(event.data.payload.layout || {}) }
          }));
        }
      }

      // 2. Element focus & highlight from Editor
      if (event.data.type === 'CK_FOCUS_ELEMENT') {
        const { targetKey, isImage } = event.data;
        if (!targetKey) return;

        // Clear previous highlights
        document.querySelectorAll('.cms-active-text-glow, .cms-active-image-squircle, .cms-radar-ping').forEach((el) => {
          el.classList.remove('cms-active-text-glow', 'cms-active-image-squircle', 'cms-radar-ping');
        });

        // Search for exact match or parent prefix
        let el = document.querySelector(`[data-cms-target="${targetKey}"]`);
        if (!el) {
          const parts = targetKey.split('.');
          if (parts.length > 2) {
            el = document.querySelector(`[data-cms-target="${parts[0]}.${parts[1]}"]`);
          } else if (parts.length > 1) {
            el = document.querySelector(`[data-cms-target="${parts[0]}"]`);
          }
        }

        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('cms-radar-ping');
          setTimeout(() => el.classList.remove('cms-radar-ping'), 2400);

          const isImgEl = isImage || el.tagName === 'IMG' || !!el.querySelector('img') || el.classList.contains('prod-img');
          if (isImgEl) {
            const imgTarget = el.tagName === 'IMG' ? el : (el.querySelector('img') || el);
            imgTarget.classList.add('cms-active-image-squircle');
          } else {
            el.classList.add('cms-active-text-glow');
          }
        }
      }

      // 3. Clear Element Highlights
      if (event.data.type === 'CK_BLUR_ELEMENT') {
        document.querySelectorAll('.cms-active-text-glow, .cms-active-image-squircle').forEach((el) => {
          el.classList.remove('cms-active-text-glow', 'cms-active-image-squircle');
        });
      }

      // 4. Section Scroll
      if (event.data.type === 'CK_SCROLL_TO_SECTION') {
        const sectionMap = {
          hero: '#hero',
          announcements: '.ann',
          categories: '#cats',
          products: '#sarees',
          festive: '#festive',
          whyUs: '#why-us',
          testimonials: '#reviews',
          newsletter: '#newsletter',
          settings: '#contact',
          footer: '#footer'
        };
        const selector = sectionMap[event.data.section] || `#${event.data.section}`;
        const target = document.querySelector(selector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.classList.remove('cms-highlight-focus');
          void target.offsetWidth;
          target.classList.add('cms-highlight-focus');
          setTimeout(() => target.classList.remove('cms-highlight-focus'), 1800);
        }
      }

      // 5. Inspect Mode Toggle
      if (event.data.type === 'CK_SET_INSPECT_MODE') {
        setIsInspectMode(Boolean(event.data.enabled));
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('dblclick', handleDblClick);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('dblclick', handleDblClick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (tooltipEl && tooltipEl.parentNode) {
        tooltipEl.parentNode.removeChild(tooltipEl);
      }
    };
  }, []);

  // Admin Auth Handlers
  const loginAdmin = async (password) => {
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setAdminToken(data.token);
      localStorage.setItem('ck_admin_token', data.token);
      await fetchDraftContent();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logoutAdmin = () => {
    setAdminToken('');
    localStorage.removeItem('ck_admin_token');
  };

  // Update Section Draft
  const updateDraftSection = async (section, sectionData) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/draft/${section}`), {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(sectionData)
      });
      const data = await res.json();
      if (data.success) {
        setDraftContent(data.draft);
        setAdminStatus(data.status);
        return { success: true };
      }
      throw new Error(data.error || 'Update section failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update Full Draft Payload
  const updateFullDraft = async (fullData) => {
    try {
      const res = await fetch(apiUrl('/api/admin/draft'), {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(fullData)
      });
      const data = await res.json();
      if (data.success) {
        setDraftContent(data.draft);
        setAdminStatus(data.status);
        return { success: true };
      }
      throw new Error(data.error || 'Update full draft failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Publish Draft to Live Storefront
  const publishDraft = async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/publish'), {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.data);
        setDraftContent(data.data);
        setAdminStatus(data.status);
        return { success: true, message: data.message };
      }
      throw new Error(data.error || 'Publish failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Discard Working Draft
  const discardDraft = async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/discard'), {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setDraftContent(data.draft);
        setContent(data.draft);
        setAdminStatus(data.status);
        return { success: true };
      }
      throw new Error(data.error || 'Discard failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Reset to Defaults
  const resetDefaults = async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/reset-defaults'), {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.data);
        setDraftContent(data.data);
        setAdminStatus(data.status);
        return { success: true };
      }
      throw new Error(data.error || 'Reset failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Products CRUD
  const addProduct = async (productData) => {
    try {
      const res = await fetch(apiUrl('/api/admin/products'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchLiveContent();
        await fetchDraftContent();
        return { success: true, product: data.product };
      }
      throw new Error(data.error || 'Failed to add product');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/products/${id}`), {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchLiveContent();
        await fetchDraftContent();
        return { success: true, product: data.product };
      }
      throw new Error(data.error || 'Failed to update product');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/products/${id}`), {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        await fetchLiveContent();
        await fetchDraftContent();
        return { success: true };
      }
      throw new Error(data.error || 'Failed to delete product');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Categories CRUD
  const addCategory = async (categoryData) => {
    try {
      const res = await fetch(apiUrl('/api/admin/categories'), {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(categoryData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchLiveContent();
        await fetchDraftContent();
        return { success: true, category: data.category };
      }
      throw new Error(data.error || 'Failed to add category');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${id}`), {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(categoryData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchLiveContent();
        await fetchDraftContent();
        return { success: true, category: data.category };
      }
      throw new Error(data.error || 'Failed to update category');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/categories/${id}`), {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        await fetchLiveContent();
        await fetchDraftContent();
        return { success: true };
      }
      throw new Error(data.error || 'Failed to delete category');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/orders'), { headers: authHeaders() });
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (err) {
      console.error('Fetch orders error:', err);
      return [];
    }
  };

  const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      const res = await fetch(apiUrl(`/api/admin/orders/${orderId}/status`), {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ orderStatus, paymentStatus })
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error('Update order error:', err);
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        content,
        draftContent,
        adminStatus,
        adminToken,
        isLoading,
        isLivePreview,
        isInspectMode,
        isAdminLoggedIn: Boolean(adminToken),
        loginAdmin,
        logoutAdmin,
        updateDraftSection,
        updateFullDraft,
        publishDraft,
        discardDraft,
        resetDefaults,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        fetchOrders,
        updateOrderStatus,
        refreshContent: fetchLiveContent
      }}
    >
      {children}
      <style>{`
        /* Floating Inspector Tooltip in Live Preview */
        .cms-floating-tooltip {
          position: absolute;
          z-index: 999999;
          display: none;
          align-items: center;
          gap: 6px;
          background: rgba(23, 23, 23, 0.94);
          color: #f7d58b;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(200, 146, 42, 0.65);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), 0 0 12px rgba(200, 146, 42, 0.35);
          pointer-events: none;
          white-space: nowrap;
          backdrop-filter: blur(10px);
          animation: cmsTooltipIn 0.18s ease-out;
        }

        .cms-tooltip-icon {
          color: #e8c87a;
          font-size: 11px;
        }

        @keyframes cmsTooltipIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Subtle Hover Outline in Preview */
        .cms-hover-highlight {
          outline: 2px dashed rgba(200, 146, 42, 0.8) !important;
          outline-offset: 3px !important;
          cursor: pointer !important;
          transition: outline 0.15s ease !important;
        }

        /* Radar Ping Wave on Active Element */
        .cms-radar-ping {
          position: relative !important;
          animation: cmsRadarPulse 1.8s cubic-bezier(0, 0, 0.2, 1) !important;
        }

        @keyframes cmsRadarPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(200, 146, 42, 0.85), 0 0 20px rgba(200, 146, 42, 0.5);
          }
          50% {
            box-shadow: 0 0 0 16px rgba(200, 146, 42, 0.3), 0 0 35px rgba(200, 146, 42, 0.7);
          }
          100% {
            box-shadow: 0 0 0 30px rgba(200, 146, 42, 0), 0 0 15px rgba(200, 146, 42, 0);
          }
        }

        /* Section Focus Flash */
        .cms-highlight-focus {
          outline: 3px solid rgba(200, 146, 42, 0.9) !important;
          outline-offset: -3px;
          box-shadow: 0 0 30px rgba(200, 146, 42, 0.45) !important;
          transition: outline 0.3s ease, box-shadow 0.3s ease;
        }

        /* Active Text Editing Glow in Live Preview */
        .cms-active-text-glow {
          outline: 2.5px dashed #c8922a !important;
          outline-offset: 5px !important;
          background-color: rgba(200, 146, 42, 0.14) !important;
          border-radius: 6px !important;
          box-shadow: 0 0 24px rgba(200, 146, 42, 0.55) !important;
          animation: cmsPulseTextGlow 1.4s infinite alternate ease-in-out !important;
        }

        @keyframes cmsPulseTextGlow {
          0% {
            outline-color: #c8922a;
            box-shadow: 0 0 14px rgba(200, 146, 42, 0.35);
            background-color: rgba(200, 146, 42, 0.08);
          }
          100% {
            outline-color: #e8c87a;
            box-shadow: 0 0 30px rgba(200, 146, 42, 0.7);
            background-color: rgba(200, 146, 42, 0.2);
          }
        }

        /* Active Image Squircle Editing in Live Preview */
        .cms-active-image-squircle {
          border-radius: 16px !important;
          outline: 3.5px solid #c8922a !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 32px rgba(200, 146, 42, 0.75), 0 10px 28px rgba(0, 0, 0, 0.3) !important;
          transform: scale(1.02) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          animation: cmsPulseSquircle 1.5s infinite alternate ease-in-out !important;
        }

        @keyframes cmsPulseSquircle {
          0% {
            outline-color: #c8922a;
            box-shadow: 0 0 18px rgba(200, 146, 42, 0.45);
          }
          100% {
            outline-color: #fce594;
            box-shadow: 0 0 42px rgba(200, 146, 42, 0.85);
          }
        }

        /* Editor Input Flash Pulse */
        .cms-editor-highlight-flash {
          animation: cmsEditorFlash 2s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        @keyframes cmsEditorFlash {
          0% {
            box-shadow: 0 0 0 0 rgba(200, 146, 42, 0.8), 0 0 20px rgba(200, 146, 42, 0.6);
            border-color: #c8922a !important;
            background-color: rgba(200, 146, 42, 0.12) !important;
          }
          40% {
            box-shadow: 0 0 0 6px rgba(200, 146, 42, 0.3), 0 0 25px rgba(200, 146, 42, 0.4);
            border-color: #e8c87a !important;
            background-color: rgba(200, 146, 42, 0.06) !important;
          }
          100% {
            box-shadow: none;
            background-color: transparent;
          }
        }
      `}</style>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
