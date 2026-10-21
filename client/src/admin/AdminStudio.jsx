import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { apiUrl } from '../config/api';
import PreviewCanvas from './components/PreviewCanvas';
import ThemeStudioTab from './tabs/ThemeStudioTab';
import LayoutStudioTab from './tabs/LayoutStudioTab';
import ContentTab from './tabs/ContentTab';
import ProductsTab from './tabs/ProductsTab';
import CategoriesTab from './tabs/CategoriesTab';
import OrdersTab from './tabs/OrdersTab';
import SettingsTab from './tabs/SettingsTab';

import {
  Palette,
  Layout,
  FileText,
  ShoppingBag,
  Layers,
  Package,
  Settings,
  Save,
  RotateCcw,
  LogOut,
  X,
  Lock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminStudio({ onClose }) {
  const {
    adminToken,
    loginAdmin,
    logoutAdmin,
    content,
    draftContent,
    adminStatus,
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
    updateOrderStatus
  } = useStore();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active studio tab
  const [activeTab, setActiveTab] = useState('theme');

  // Studio working draft state
  const [studioDraft, setStudioDraft] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  // Preview canvas state
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isInspectMode, setIsInspectMode] = useState(true);

  // Orders
  const [orders, setOrders] = useState([]);

  const iframeRef = useRef(null);

  // Initialize studioDraft from draftContent or content
  useEffect(() => {
    if (draftContent && !studioDraft) {
      setStudioDraft(JSON.parse(JSON.stringify(draftContent)));
    } else if (content && !studioDraft) {
      setStudioDraft(JSON.parse(JSON.stringify(content)));
    }
  }, [draftContent, content, studioDraft]);

  // Load orders when authenticated
  useEffect(() => {
    if (adminToken) {
      fetchOrders().then((data) => setOrders(data || []));
    }
  }, [adminToken, fetchOrders]);

  // Broadcast updated draft to preview iframe via postMessage
  const broadcastToPreview = useCallback((data) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'CK_PREVIEW_SYNC', payload: data },
        '*'
      );
    }
  }, []);

  // Smooth scroll preview to target section
  const scrollPreviewToSection = useCallback((section) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'CK_SCROLL_TO_SECTION', section },
        '*'
      );
    }
  }, []);

  // Focus & highlight element in preview
  const sendFocusToPreview = useCallback((targetKey, isImage = false) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'CK_FOCUS_ELEMENT', targetKey, isImage },
        '*'
      );
    }
  }, []);

  // Clear focus in preview
  const sendBlurToPreview = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'CK_BLUR_ELEMENT' },
        '*'
      );
    }
  }, []);

  // Toggle inspect mode in preview
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'CK_SET_INSPECT_MODE', enabled: isInspectMode },
        '*'
      );
    }
  }, [isInspectMode]);

  // Listen for double-click element picking messages from preview iframe
  useEffect(() => {
    const handleWindowMessage = (event) => {
      if (!event.data) return;

      if (event.data.type === 'CK_NAVIGATE_TO_ELEMENT') {
        const { targetKey, sectionKey } = event.data;
        if (sectionKey) {
          setActiveTab(sectionKey);
        }
        setSaveNotice(`Editing: ${targetKey}`);
        setTimeout(() => setSaveNotice(''), 3000);

        // Allow tab switch DOM render, then scroll to input field
        setTimeout(() => {
          let editorTarget = document.querySelector(`[data-editor-target="${targetKey}"]`);
          if (!editorTarget && targetKey) {
            const parts = targetKey.split('.');
            if (parts.length > 2) {
              editorTarget = document.querySelector(`[data-editor-target="${parts[0]}.${parts[1]}"]`);
            }
          }

          if (editorTarget) {
            editorTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (typeof editorTarget.focus === 'function') {
              editorTarget.focus();
            }
            editorTarget.classList.remove('cms-editor-highlight-flash');
            void editorTarget.offsetWidth;
            editorTarget.classList.add('cms-editor-highlight-flash');
            setTimeout(() => editorTarget.classList.remove('cms-editor-highlight-flash'), 2200);
          }
        }, 160);
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    const res = await loginAdmin(passwordInput);
    if (!res.success) {
      setAuthError(res.error || 'Invalid password. Try chandrakanta2026');
    }
    setIsLoggingIn(false);
  };

  // Draft Updater: updates local studio draft, flags dirty state, and broadcasts live to preview
  const updateStudioDraft = (updater) => {
    setStudioDraft((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      broadcastToPreview(updated);
      setHasChanges(true);
      return updated;
    });
  };

  // Theme Updater
  const handleUpdateTheme = (newTheme) => {
    updateStudioDraft((prev) => ({
      ...prev,
      theme: newTheme
    }));
    setSaveNotice('Theme updated & applied live');
    setTimeout(() => setSaveNotice(''), 2500);
  };

  // Layout Updater
  const handleUpdateLayout = (newLayout) => {
    updateStudioDraft((prev) => ({
      ...prev,
      layout: newLayout
    }));
    setSaveNotice('Layout updated & applied live');
    setTimeout(() => setSaveNotice(''), 2500);
  };

  // Content Updater
  const handleUpdateContent = (newContent) => {
    updateStudioDraft(newContent);
    setSaveNotice('Content updated & synced to preview');
    setTimeout(() => setSaveNotice(''), 2500);
  };

  // Products CRUD
  const handleAddProduct = async (productData) => {
    const res = await addProduct(productData);
    if (res.success) {
      updateStudioDraft((prev) => ({
        ...prev,
        products: [...(prev.products || []), res.product]
      }));
      setSaveNotice('Product added to catalog');
      setTimeout(() => setSaveNotice(''), 2500);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    const res = await updateProduct(id, productData);
    if (res.success) {
      updateStudioDraft((prev) => ({
        ...prev,
        products: (prev.products || []).map((p) => (p.id === id ? res.product : p))
      }));
      setSaveNotice('Product updated');
      setTimeout(() => setSaveNotice(''), 2500);
    }
  };

  const handleDeleteProduct = async (id) => {
    const res = await deleteProduct(id);
    if (res.success) {
      updateStudioDraft((prev) => ({
        ...prev,
        products: (prev.products || []).filter((p) => p.id !== id)
      }));
      setSaveNotice('Product deleted');
      setTimeout(() => setSaveNotice(''), 2500);
    }
  };

  // Categories CRUD
  const handleAddCategory = async (catData) => {
    const res = await addCategory(catData);
    if (res.success) {
      updateStudioDraft((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), res.category]
      }));
      setSaveNotice('Collection added');
      setTimeout(() => setSaveNotice(''), 2500);
    }
  };

  const handleUpdateCategory = async (id, catData) => {
    const res = await updateCategory(id, catData);
    if (res.success) {
      updateStudioDraft((prev) => ({
        ...prev,
        categories: (prev.categories || []).map((c) => (c.id === id ? res.category : c))
      }));
      setSaveNotice('Collection updated');
      setTimeout(() => setSaveNotice(''), 2500);
    }
  };

  const handleDeleteCategory = async (id) => {
    const res = await deleteCategory(id);
    if (res.success) {
      updateStudioDraft((prev) => ({
        ...prev,
        categories: (prev.categories || []).filter((c) => c.id !== id)
      }));
      setSaveNotice('Collection deleted');
      setTimeout(() => setSaveNotice(''), 2500);
    }
  };

  // Settings Updater
  const handleUpdateSettings = (newSettings) => {
    updateStudioDraft((prev) => ({
      ...prev,
      settings: newSettings
    }));
  };

  // Orders Updater
  const handleUpdateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    const success = await updateOrderStatus(orderId, orderStatus, paymentStatus);
    if (success) {
      const refreshed = await fetchOrders();
      setOrders(refreshed || []);
      setSaveNotice(`Order #${orderId} updated to ${orderStatus}`);
      setTimeout(() => setSaveNotice(''), 3000);
    }
  };

  // One-Click Publish to Live Store & MongoDB
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Push working draft to backend first
      await fetch(apiUrl('/api/admin/draft'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(studioDraft)
      });

      // Call publish endpoint
      const res = await publishDraft();
      if (res.success) {
        setHasChanges(false);
        setSaveNotice('✨ Published live to storefront successfully!');
        setTimeout(() => setSaveNotice(''), 3500);
      }
    } catch (err) {
      alert('Publish failed: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Discard draft
  const handleDiscard = async () => {
    if (!confirm('Discard all unsaved edits and revert back to live published store?')) return;
    const res = await discardDraft();
    if (res.success) {
      setStudioDraft(JSON.parse(JSON.stringify(res.draft || content)));
      broadcastToPreview(res.draft || content);
      setHasChanges(false);
      setSaveNotice('Draft discarded. Reverted to live content.');
      setTimeout(() => setSaveNotice(''), 3000);
    }
  };

  // Reset to original brand defaults
  const handleResetDefaults = async () => {
    const res = await resetDefaults();
    if (res.success) {
      setStudioDraft(JSON.parse(JSON.stringify(content)));
      broadcastToPreview(content);
      setHasChanges(false);
      setSaveNotice('Reset all store content to factory defaults.');
      setTimeout(() => setSaveNotice(''), 3000);
    }
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    if (studioDraft) {
      broadcastToPreview(studioDraft);
    }
  };

  // Refresh preview
  const handleRefreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = '/';
    }
  };

  // ═══════════════════════════════════════════
  // 1. LOGIN SCREEN (If unauthenticated)
  // ═══════════════════════════════════════════
  if (!adminToken) {
    return (
      <div className="cms-auth-modal-backdrop">
        <div className="cms-auth-card">
          <div className="cms-auth-top">
            <div className="cms-auth-badge">
              <Sparkles size={16} />
              <span>Chandrakanta Luxury Handlooms</span>
            </div>
            <h2>Visual Admin Studio</h2>
            <p>Enter the store administrator key to launch the live site designer & catalog suite.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="cms-auth-form">
            <div className="cms-auth-field">
              <Lock size={16} className="field-icon" />
              <input
                type="password"
                placeholder="Enter admin password (chandrakanta2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                required
              />
            </div>

            {authError && <div className="cms-auth-error">{authError}</div>}

            <div className="cms-auth-actions">
              <button
                type="button"
                className="cms-btn-secondary"
                onClick={onClose}
              >
                Back to Store
              </button>
              <button
                type="submit"
                className="cms-btn-primary"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Verifying...' : 'Launch Visual Studio'}
              </button>
            </div>
          </form>
        </div>

        {/* Auth screen self-contained styles — main <style> only renders when logged in */}
        <style>{`
          * { box-sizing: border-box; }
          .cms-auth-modal-backdrop {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 99999;
            background: #0f1013;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .cms-auth-card {
            background: #181920;
            border: 1px solid #272a38;
            border-radius: 14px;
            width: 100%;
            max-width: 460px;
            padding: 36px 32px;
            box-shadow: 0 25px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(200,146,42,0.07);
          }
          .cms-auth-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 700;
            color: #c8922a;
            background: rgba(200,146,42,0.12);
            padding: 5px 12px;
            border-radius: 999px;
            margin-bottom: 16px;
            border: 1px solid rgba(200,146,42,0.25);
            letter-spacing: 0.01em;
          }
          .cms-auth-top h2 {
            font-size: 24px;
            font-weight: 800;
            color: #f4f4f5;
            line-height: 1.2;
            margin: 0;
          }
          .cms-auth-top p {
            font-size: 13px;
            color: #a1a1aa;
            margin-top: 10px;
            line-height: 1.6;
          }
          .cms-auth-form {
            margin-top: 26px;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .cms-auth-field {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #111216;
            border: 1px solid #282b3a;
            border-radius: 9px;
            padding: 13px 16px;
            color: #71717a;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .cms-auth-field:focus-within {
            border-color: #c8922a;
            box-shadow: 0 0 0 2px rgba(200,146,42,0.18);
            color: #c8922a;
          }
          .cms-auth-field input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #f4f4f5;
            font-size: 14px;
            font-family: inherit;
          }
          .cms-auth-field input::placeholder { color: #52525b; }
          .cms-auth-error {
            font-size: 12px;
            color: #ef4444;
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.2);
            padding: 10px 14px;
            border-radius: 7px;
          }
          .cms-auth-actions {
            display: flex;
            gap: 10px;
            margin-top: 4px;
          }
          .cms-auth-actions button {
            flex: 1;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            border: none;
            font-family: inherit;
            transition: all 0.2s ease;
            letter-spacing: 0.02em;
          }
          .cms-btn-secondary {
            background: #23252d;
            color: #a1a1aa;
            border: 1px solid #2e3040 !important;
          }
          .cms-btn-secondary:hover { background: #2b2e38; color: #e4e4e7; }
          .cms-btn-primary {
            background: linear-gradient(135deg, #7B1C1C 0%, #962222 100%);
            color: #ffffff;
            box-shadow: 0 4px 18px rgba(123,28,28,0.45);
          }
          .cms-btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #921f1f 0%, #b02828 100%);
            box-shadow: 0 6px 26px rgba(123,28,28,0.65);
            transform: translateY(-1px);
          }
          .cms-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // 2. MAIN SPLIT-VIEW VISUAL STUDIO
  // ═══════════════════════════════════════════
  return (
    <div className="cms-studio-root">
      {/* Top Studio Bar */}
      <header className="cms-studio-topbar">
        {/* Left Brand Badge */}
        <div className="cms-topbar-brand">
          <div className="brand-dot"></div>
          <strong>Chandrakanta</strong>
          <span className="studio-tag">Visual Studio</span>
          {saveNotice && <span className="cms-save-toast">{saveNotice}</span>}
        </div>

        {/* Center Publication Status */}
        <div className="cms-topbar-center">
          <span className={`cms-pub-pill ${hasChanges ? 'dirty' : 'clean'}`}>
            {hasChanges ? '● Unpublished Changes' : '✓ Store Published Live'}
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="cms-topbar-actions">
          {hasChanges && (
            <button
              type="button"
              className="cms-btn-topbar-discard"
              onClick={handleDiscard}
              title="Discard draft and revert to live store"
            >
              <RotateCcw size={14} />
              <span>Discard</span>
            </button>
          )}

          <button
            type="button"
            className="cms-btn-topbar-publish"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            <Save size={14} />
            <span>{isPublishing ? 'Publishing...' : 'Publish to Live Store'}</span>
          </button>

          <button
            type="button"
            className="cms-icon-btn"
            onClick={logoutAdmin}
            title="Sign out of Studio"
          >
            <LogOut size={16} />
          </button>

          <button
            type="button"
            className="cms-icon-btn close"
            onClick={onClose}
            title="Exit Studio"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Studio Body (Split: Left Dock, Right Canvas) */}
      <div className="cms-studio-main">
        {/* Left Customizer Dock */}
        <aside className="cms-studio-dock">
          {/* Tabs Navigation Strip */}
          <nav className="cms-dock-nav" role="tablist">
            <button
              type="button"
              className={`cms-dock-tab ${activeTab === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveTab('theme')}
              title="Theme Studio & Color Presets"
            >
              <Palette size={16} />
              <span>Themes</span>
            </button>

            <button
              type="button"
              className={`cms-dock-tab ${activeTab === 'layout' ? 'active' : ''}`}
              onClick={() => setActiveTab('layout')}
              title="Layout Studio & Responsive Controls"
            >
              <Layout size={16} />
              <span>Layout</span>
            </button>

            <button
              type="button"
              className={`cms-dock-tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
              title="Store Marketing Copy & Banners"
            >
              <FileText size={16} />
              <span>Content</span>
            </button>

            <button
              type="button"
              className={`cms-dock-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
              title="Product Catalog & Inventory"
            >
              <ShoppingBag size={16} />
              <span>Catalog</span>
            </button>

            <button
              type="button"
              className={`cms-dock-tab ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
              title="Collections & Categories"
            >
              <Layers size={16} />
              <span>Collections</span>
            </button>

            <button
              type="button"
              className={`cms-dock-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
              title="Orders & Fulfillment"
            >
              <Package size={16} />
              <span>Orders</span>
            </button>

            <button
              type="button"
              className={`cms-dock-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
              title="Settings & Policies"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Active Tab Scrollable Content */}
          <div className="cms-dock-scroll">
            {activeTab === 'theme' && (
              <ThemeStudioTab
                theme={studioDraft?.theme}
                updateTheme={handleUpdateTheme}
                sendFocusToPreview={sendFocusToPreview}
                sendBlurToPreview={sendBlurToPreview}
              />
            )}

            {activeTab === 'layout' && (
              <LayoutStudioTab
                layout={studioDraft?.layout}
                updateLayout={handleUpdateLayout}
                scrollPreviewToSection={scrollPreviewToSection}
              />
            )}

            {activeTab === 'content' && (
              <ContentTab
                content={studioDraft}
                updateContent={handleUpdateContent}
                token={adminToken}
                sendFocusToPreview={sendFocusToPreview}
                sendBlurToPreview={sendBlurToPreview}
                scrollPreviewToSection={scrollPreviewToSection}
              />
            )}

            {activeTab === 'products' && (
              <ProductsTab
                products={studioDraft?.products || []}
                categories={studioDraft?.categories || []}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                token={adminToken}
                sendFocusToPreview={sendFocusToPreview}
                sendBlurToPreview={sendBlurToPreview}
                scrollPreviewToSection={scrollPreviewToSection}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesTab
                categories={studioDraft?.categories || []}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                token={adminToken}
                sendFocusToPreview={sendFocusToPreview}
                sendBlurToPreview={sendBlurToPreview}
                scrollPreviewToSection={scrollPreviewToSection}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onRefreshOrders={async () => {
                  const data = await fetchOrders();
                  setOrders(data || []);
                }}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                settings={studioDraft?.settings || {}}
                onUpdateSettings={handleUpdateSettings}
                onResetDefaults={handleResetDefaults}
                adminStatus={adminStatus}
              />
            )}
          </div>
        </aside>

        {/* Right Live Preview Canvas */}
        <main className="cms-studio-canvas">
          <PreviewCanvas
            iframeRef={iframeRef}
            previewDevice={previewDevice}
            setPreviewDevice={setPreviewDevice}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            isInspectMode={isInspectMode}
            setIsInspectMode={setIsInspectMode}
            onIframeLoad={handleIframeLoad}
            onRefresh={handleRefreshPreview}
          />
        </main>
      </div>

      {/* Embedded Master Studio Styling */}
      <style>{`
        /* ═══════════════════════════════════════════
           CHANDRAKANTA VISUAL ADMIN STUDIO CSS
           ═══════════════════════════════════════════ */
        .cms-studio-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99999;
          background: #0f1013;
          color: #e4e4e7;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          user-select: none;
        }

        /* Top Studio Bar */
        .cms-studio-topbar {
          height: 48px;
          background: #14151a;
          border-bottom: 1px solid #23252d;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          gap: 16px;
          flex-shrink: 0;
        }

        .cms-topbar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }

        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c8922a;
          box-shadow: 0 0 10px #c8922a;
        }

        .studio-tag {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          background: rgba(200, 146, 42, 0.15);
          color: #e8c87a;
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid rgba(200, 146, 42, 0.3);
        }

        .cms-save-toast {
          margin-left: 12px;
          font-size: 11px;
          color: #a1a1aa;
          background: #1f2128;
          padding: 3px 8px;
          border-radius: 4px;
          animation: fadeIn 0.2s ease;
        }

        .cms-pub-pill {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .cms-pub-pill.clean {
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .cms-pub-pill.dirty {
          background: rgba(234, 179, 8, 0.12);
          color: #facc15;
          border: 1px solid rgba(234, 179, 8, 0.3);
        }

        .cms-topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cms-btn-topbar-publish {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #7B1C1C;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid rgba(200, 146, 42, 0.4);
          box-shadow: 0 2px 10px rgba(123, 28, 28, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cms-btn-topbar-publish:hover:not(:disabled) {
          background: #962222;
          box-shadow: 0 4px 16px rgba(123, 28, 28, 0.6);
        }

        .cms-btn-topbar-discard {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #23252d;
          color: #e4e4e7;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #323540;
          cursor: pointer;
        }

        .cms-btn-topbar-discard:hover {
          background: #2b2e38;
        }

        .cms-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          color: #a1a1aa;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .cms-icon-btn:hover {
          color: #ffffff;
          background: #23252d;
        }

        .cms-icon-btn.close:hover {
          background: #7B1C1C;
          color: #ffffff;
        }

        /* Main Body Split */
        .cms-studio-main {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        /* Left Dock */
        .cms-studio-dock {
          width: 480px;
          max-width: 520px;
          background: #14151a;
          border-right: 1px solid #23252d;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          overflow: hidden;
        }

        .cms-dock-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: #111216;
          border-bottom: 1px solid #23252d;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .cms-dock-nav::-webkit-scrollbar {
          display: none;
        }

        .cms-dock-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #a1a1aa;
          background: transparent;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .cms-dock-tab:hover {
          color: #ffffff;
          background: #1c1d24;
        }

        .cms-dock-tab.active {
          color: #e8c87a;
          background: rgba(200, 146, 42, 0.12);
          border: 1px solid rgba(200, 146, 42, 0.35);
        }

        .cms-dock-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 18px;
          scrollbar-width: thin;
          scrollbar-color: #2b2e38 #14151a;
        }

        /* Right Canvas */
        .cms-studio-canvas {
          flex: 1;
          background: #090a0c;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        /* Canvas Top Bar */
        .cms-canvas-topbar {
          height: 40px;
          background: #111216;
          border-bottom: 1px solid #23252d;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          gap: 12px;
          flex-shrink: 0;
        }

        .cms-device-group {
          display: flex;
          align-items: center;
          background: #191b22;
          padding: 3px;
          border-radius: 6px;
          border: 1px solid #282b36;
          gap: 2px;
        }

        .cms-device-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #a1a1aa;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cms-device-btn:hover {
          color: #ffffff;
        }

        .cms-device-btn.active {
          color: #e8c87a;
          background: #252834;
        }

        .cms-inspect-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          color: #a1a1aa;
          background: #191b22;
          border: 1px solid #2b2e3a;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cms-inspect-toggle.active {
          color: #e8c87a;
          background: rgba(200, 146, 42, 0.14);
          border-color: rgba(200, 146, 42, 0.45);
          box-shadow: 0 0 12px rgba(200, 146, 42, 0.3);
        }

        .cms-canvas-right-acts {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cms-zoom-group {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #191b22;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #282b36;
          font-size: 11px;
        }

        .cms-zoom-label {
          min-width: 38px;
          text-align: center;
          color: #d4d4d8;
        }

        .cms-canvas-icon-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a1a1aa;
          border-radius: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .cms-canvas-icon-btn:hover {
          color: #ffffff;
          background: #1f212a;
        }

        /* Canvas Viewport Body */
        .cms-canvas-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .cms-canvas-viewport.cms-canvas-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100000;
          background: #090a0c;
        }

        .cms-canvas-body {
          flex: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          min-height: 0;
          position: relative;
        }

        .cms-frame-wrapper {
          display: flex;
          flex-direction: column;
          background: #faf8f5;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          overflow: hidden;
        }

        .cms-frame-wrapper.cms-frame-desktop {
          width: 100%;
          height: 100%;
        }

        .cms-frame-wrapper.cms-frame-boxed {
          border-radius: 18px;
          border: 3px solid #2d303d;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .cms-iframe-container {
          flex: 1;
          width: 100%;
          height: calc(100% - 32px);
          overflow: hidden;
          position: relative;
        }

        .cms-mock-chrome {
          height: 32px;
          background: #1e2028;
          border-bottom: 1px solid #2d303d;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          flex-shrink: 0;
        }

        .cms-mock-dots {
          display: flex;
          gap: 6px;
        }

        .cms-mock-dots .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .dot-red { background: #ef4444; }
        .dot-yellow { background: #eab308; }
        .dot-green { background: #22c55e; }

        .cms-mock-url {
          font-size: 10px;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cms-mock-url .domain {
          color: #f4f4f5;
          font-weight: 600;
        }

        .cms-mock-badge {
          font-size: 9px;
          font-weight: 700;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.15);
          padding: 1px 6px;
          border-radius: 3px;
          letter-spacing: 0.05em;
        }

        .cms-preview-frame {
          flex: 1;
          width: 100%;
          border: none;
          background: #faf8f5;
        }

        /* ═══════════════════════════════════════════
           TAB CONTENT & CARD STYLING
           ═══════════════════════════════════════════ */
        .cms-tab-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cms-tab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .cms-tab-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cms-tab-title-wrap h3 {
          font-size: 15px;
          font-weight: 700;
          color: #f4f4f5;
        }

        .cms-tab-title-wrap p {
          font-size: 11px;
          color: #71717a;
          margin-top: 2px;
        }

        .cms-card-section {
          background: #181920;
          border: 1px solid #242732;
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cms-card-section.danger {
          border-color: rgba(239, 68, 68, 0.35);
          background: rgba(239, 68, 68, 0.04);
        }

        .cms-section-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #e4e4e7;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cms-section-sub {
          font-size: 11px;
          color: #a1a1aa;
          line-height: 1.4;
        }

        /* Input Elements */
        .cms-input-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .cms-input-field label {
          font-size: 11px;
          font-weight: 600;
          color: #a1a1aa;
        }

        .cms-input, .cms-textarea, .cms-select {
          width: 100%;
          background: #111216;
          border: 1px solid #2a2d3a;
          border-radius: 6px;
          color: #f4f4f5;
          font-size: 12px;
          font-family: inherit;
          padding: 7px 10px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .cms-input:focus, .cms-textarea:focus, .cms-select:focus {
          border-color: #c8922a;
          box-shadow: 0 0 0 2px rgba(200, 146, 42, 0.2);
        }

        .cms-input-row {
          display: flex;
          gap: 10px;
        }

        .cms-input-row .cms-input-field {
          flex: 1;
        }

        /* Sub Nav */
        .cms-sub-nav {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .cms-sub-nav-btn {
          font-size: 11px;
          font-weight: 600;
          color: #a1a1aa;
          background: #181920;
          border: 1px solid #272a38;
          padding: 4px 10px;
          border-radius: 999px;
          white-space: nowrap;
          cursor: pointer;
        }

        .cms-sub-nav-btn:hover {
          color: #ffffff;
        }

        .cms-sub-nav-btn.active {
          color: #e8c87a;
          background: rgba(200, 146, 42, 0.15);
          border-color: rgba(200, 146, 42, 0.4);
        }

        /* Presets Grid */
        .cms-presets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .cms-preset-card {
          background: #111216;
          border: 1px solid #272a36;
          border-radius: 8px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cms-preset-card:hover {
          border-color: #3e4254;
          transform: translateY(-1px);
        }

        .cms-preset-card.active {
          border-color: #c8922a;
          background: rgba(200, 146, 42, 0.08);
          box-shadow: 0 0 14px rgba(200, 146, 42, 0.2);
        }

        .cms-preset-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .cms-preset-swatches {
          display: flex;
          gap: 4px;
        }

        .cms-preset-swatches .swatch {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .cms-preset-badge {
          font-size: 9px;
          font-weight: 700;
          color: #e8c87a;
          background: rgba(200, 146, 42, 0.2);
          padding: 1px 6px;
          border-radius: 3px;
        }

        .cms-preset-name {
          font-size: 11px;
          font-weight: 700;
          color: #f4f4f5;
        }

        .cms-preset-sub {
          font-size: 10px;
          color: #71717a;
          margin-top: 2px;
        }

        /* Color Customizer Grid */
        .cms-color-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .cms-color-field label {
          font-size: 10px;
          font-weight: 600;
          color: #a1a1aa;
          display: block;
          margin-bottom: 4px;
        }

        .cms-color-picker-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #111216;
          border: 1px solid #272a36;
          border-radius: 6px;
          padding: 4px 8px;
        }

        .cms-color-picker-row input[type="color"] {
          width: 22px;
          height: 22px;
          border: none;
          background: none;
          cursor: pointer;
        }

        .cms-hex-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #f4f4f5;
          font-size: 11px;
          font-family: monospace;
          outline: none;
        }

        .cms-font-preview {
          background: #111216;
          border: 1px solid #272a36;
          border-radius: 6px;
          padding: 10px;
          font-size: 16px;
          color: #f4f4f5;
          margin-top: 4px;
        }

        .cms-font-preview.body {
          font-size: 12px;
          line-height: 1.5;
          color: #a1a1aa;
        }

        .cms-radius-presets {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .cms-radius-btn {
          background: #111216;
          border: 1px solid #272a36;
          border-radius: 6px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #a1a1aa;
          font-size: 10px;
          cursor: pointer;
        }

        .cms-radius-btn:hover {
          color: #ffffff;
          border-color: #3e4254;
        }

        .preview-box {
          width: 28px;
          height: 28px;
          border: 2px solid #c8922a;
        }

        .radius-sharp { border-radius: 0; }
        .radius-subtle { border-radius: 5px; }
        .radius-curved { border-radius: 10px; }
        .radius-pill { border-radius: 999px; }

        /* Button Pills */
        .cms-button-pills {
          display: flex;
          gap: 6px;
        }

        .cms-pill {
          flex: 1;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #a1a1aa;
          background: #111216;
          border: 1px solid #272a36;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cms-pill.active {
          color: #e8c87a;
          background: rgba(200, 146, 42, 0.15);
          border-color: rgba(200, 146, 42, 0.4);
        }

        /* Visibility List */
        .cms-visibility-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cms-visibility-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #111216;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #222530;
          font-size: 12px;
        }

        .cms-vis-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .cms-vis-toggle-btn.on {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .cms-vis-toggle-btn.off {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        /* Order Reordering */
        .cms-order-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cms-order-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #111216;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #222530;
          font-size: 12px;
        }

        .cms-order-num {
          font-size: 10px;
          color: #71717a;
          min-width: 20px;
        }

        .cms-order-title {
          flex: 1;
        }

        .cms-order-actions {
          display: flex;
          gap: 4px;
        }

        .cms-order-btn {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a1a1aa;
          background: #1c1d24;
          border: 1px solid #292d3b;
          cursor: pointer;
        }

        .cms-order-btn:hover:not(:disabled) {
          color: #ffffff;
          background: #252834;
        }

        .cms-order-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Product & Category Cards List */
        .cms-filter-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cms-search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #111216;
          border: 1px solid #272a36;
          border-radius: 6px;
          padding: 6px 10px;
          color: #71717a;
        }

        .cms-search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: #f4f4f5;
          font-size: 12px;
          width: 100%;
        }

        .cms-count-pill {
          font-size: 10px;
          font-weight: 700;
          color: #a1a1aa;
          background: #181920;
          padding: 5px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }

        .cms-prods-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cms-prod-row-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #181920;
          border: 1px solid #242732;
          border-radius: 8px;
          padding: 8px 12px;
          transition: border-color 0.15s ease;
        }

        .cms-prod-row-card:hover {
          border-color: #383c4e;
        }

        .cms-prod-row-thumb {
          width: 48px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }

        .cms-prod-row-info {
          flex: 1;
          min-width: 0;
        }

        .cms-prod-row-top {
          display: flex;
          gap: 6px;
          margin-bottom: 2px;
        }

        .cms-tag-pill {
          font-size: 9px;
          font-weight: 700;
          color: #c8922a;
          background: rgba(200, 146, 42, 0.12);
          padding: 1px 5px;
          border-radius: 3px;
        }

        .cms-badge-pill {
          font-size: 9px;
          font-weight: 700;
          color: #22c55e;
          background: rgba(34, 197, 94, 0.15);
          padding: 1px 5px;
          border-radius: 3px;
        }

        .cms-prod-row-name {
          font-size: 12px;
          font-weight: 700;
          color: #f4f4f5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cms-prod-row-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          margin-top: 2px;
        }

        .cms-price { color: #f4f4f5; }
        .cms-was { color: #71717a; text-decoration: line-through; }
        .cms-off { color: #22c55e; font-weight: 700; }
        .cms-stock { color: #a1a1aa; font-size: 10px; }

        .cms-prod-swatches-strip {
          display: flex;
          gap: 4px;
          margin-top: 4px;
        }

        .cms-dot-swatch {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cms-prod-row-actions {
          display: flex;
          gap: 4px;
        }

        .cms-action-icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          background: #111216;
          border: 1px solid #272a36;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .cms-action-icon-btn:hover {
          color: #ffffff;
          background: #252834;
        }

        .cms-action-icon-btn.delete:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
        }

        /* Category Card Row */
        .cms-category-row-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #181920;
          border: 1px solid #242732;
          border-radius: 8px;
          padding: 8px 12px;
        }

        .cms-category-thumb {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: 6px;
        }

        .cms-category-info {
          flex: 1;
        }

        .cms-category-info h4 {
          font-size: 13px;
          font-weight: 700;
          color: #f4f4f5;
        }

        .cms-category-info p {
          font-size: 11px;
          color: #c8922a;
        }

        .cms-category-info small {
          font-size: 10px;
          color: #71717a;
        }

        .cms-category-actions {
          display: flex;
          gap: 4px;
        }

        /* Orders Table */
        .cms-orders-table-wrapper {
          background: #181920;
          border: 1px solid #242732;
          border-radius: 8px;
          overflow-x: auto;
        }

        .cms-orders-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          text-align: left;
        }

        .cms-orders-table th {
          background: #111216;
          color: #a1a1aa;
          padding: 10px 12px;
          border-bottom: 1px solid #242732;
          font-weight: 600;
        }

        .cms-orders-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #1f212a;
          color: #e4e4e7;
        }

        .cms-metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .cms-metric-box {
          background: #181920;
          border: 1px solid #242732;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          flex-direction: column;
        }

        .cms-metric-num {
          font-size: 18px;
          font-weight: 800;
          color: #f4f4f5;
        }

        .cms-metric-lbl {
          font-size: 10px;
          color: #71717a;
          margin-top: 2px;
        }

        .cms-status-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .badge-placed { background: rgba(234, 179, 8, 0.15); color: #facc15; }
        .badge-confirmed { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .badge-shipped { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
        .badge-delivered { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .badge-cancelled { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        .cms-pay-status.paid { color: #4ade80; font-weight: 700; }
        .cms-pay-status.pending { color: #facc15; }

        .cms-view-order-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #252834;
          color: #e4e4e7;
          border: 1px solid #323545;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          cursor: pointer;
        }

        /* Common Buttons */
        .cms-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #7B1C1C;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 7px 14px;
          border-radius: 6px;
          border: 1px solid rgba(200, 146, 42, 0.4);
          cursor: pointer;
        }

        .cms-btn-primary:hover {
          background: #962222;
        }

        .cms-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1c1d24;
          color: #e4e4e7;
          font-size: 11px;
          font-weight: 600;
          padding: 7px 12px;
          border-radius: 6px;
          border: 1px solid #2a2d3a;
          cursor: pointer;
        }

        .cms-btn-secondary:hover {
          background: #242732;
        }

        .cms-btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          font-size: 11px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 6px;
          border: 1px solid rgba(239, 68, 68, 0.35);
          cursor: pointer;
        }

        .cms-btn-danger:hover {
          background: #ef4444;
          color: #ffffff;
        }

        .cms-btn-add {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #111216;
          border: 1px dashed #2e3242;
          color: #c8922a;
          font-size: 11px;
          font-weight: 600;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
        }

        .cms-btn-add:hover {
          border-color: #c8922a;
          background: rgba(200, 146, 42, 0.08);
        }

        /* Image Uploader Styles */
        .cms-uploader-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cms-uploader-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cms-field-label {
          font-size: 11px;
          font-weight: 600;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cms-link-toggle {
          font-size: 10px;
          color: #c8922a;
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .cms-url-input-row {
          display: flex;
          gap: 6px;
        }

        .cms-btn-apply {
          background: #7B1C1C;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0 12px;
          cursor: pointer;
        }

        .cms-preview-card {
          background: #111216;
          border: 1px solid #272a36;
          border-radius: 8px;
          overflow: hidden;
        }

        .cms-thumb-box {
          position: relative;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }

        .cms-thumb-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }

        .cms-thumb-actions {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: flex;
          gap: 6px;
        }

        .cms-thumb-change-btn, .cms-thumb-remove-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 700;
          background: rgba(20, 21, 26, 0.85);
          backdrop-filter: blur(8px);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
        }

        .cms-thumb-remove-btn {
          background: rgba(239, 68, 68, 0.85);
        }

        .cms-dropzone {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed #272a36;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .cms-dropzone:hover {
          border-color: #c8922a;
          background: rgba(200, 146, 42, 0.04);
        }

        .cms-dropzone-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #a1a1aa;
        }

        .cms-dropzone-empty small {
          font-size: 9px;
          color: #71717a;
        }

        /* Swatches Manager */
        .cms-swatches-manager {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cms-active-swatches {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .cms-swatch-chip {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #fff;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }

        .cms-add-swatch-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cms-add-swatch-row input[type="color"] {
          width: 28px;
          height: 28px;
          border: none;
          background: none;
          cursor: pointer;
        }

        /* Modals */
        .cms-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100000;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cms-modal-window {
          background: #181920;
          border: 1px solid #2d3140;
          border-radius: 12px;
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
        }

        .cms-modal-header {
          padding: 14px 18px;
          border-bottom: 1px solid #242732;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cms-modal-header h3 {
          font-size: 14px;
          font-weight: 700;
          color: #f4f4f5;
        }

        .cms-modal-close {
          background: none;
          border: none;
          color: #a1a1aa;
          cursor: pointer;
        }

        .cms-modal-form {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cms-modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        /* Auth Screen */
        .cms-auth-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99999;
          background: #0f1013;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .cms-auth-card {
          background: #181920;
          border: 1px solid #272a38;
          border-radius: 14px;
          width: 100%;
          max-width: 440px;
          padding: 28px;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.7);
        }

        .cms-auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #c8922a;
          background: rgba(200, 146, 42, 0.12);
          padding: 4px 10px;
          border-radius: 999px;
          margin-bottom: 12px;
        }

        .cms-auth-top h2 {
          font-size: 20px;
          font-weight: 800;
          color: #f4f4f5;
        }

        .cms-auth-top p {
          font-size: 12px;
          color: #a1a1aa;
          margin-top: 6px;
          line-height: 1.5;
        }

        .cms-auth-form {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cms-auth-field {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #111216;
          border: 1px solid #282b3a;
          border-radius: 8px;
          padding: 10px 14px;
          color: #71717a;
        }

        .cms-auth-field input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #f4f4f5;
          font-size: 13px;
        }

        .cms-auth-error {
          font-size: 11px;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 8px 12px;
          border-radius: 6px;
        }

        .cms-auth-actions {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .cms-auth-actions button {
          flex: 1;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin-slow {
          animation: spin 6s linear infinite;
        }

        /* Order Details */
        .cms-order-detail-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cms-order-section-box {
          background: #111216;
          border: 1px solid #242732;
          border-radius: 8px;
          padding: 12px;
        }

        .cms-box-hdr {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #e4e4e7;
          margin-bottom: 8px;
        }

        .cms-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          font-size: 11px;
          color: #a1a1aa;
        }

        .cms-info-grid strong {
          color: #d4d4d8;
        }

        .cms-order-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cms-order-item-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
        }

        .cms-order-item-row img {
          width: 36px;
          height: 44px;
          object-fit: cover;
          border-radius: 4px;
        }

        .cms-order-item-row .item-txt {
          flex: 1;
          color: #a1a1aa;
        }

        .cms-order-item-row .item-txt strong {
          color: #f4f4f5;
        }

        .item-color-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .cms-pricing-summary {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #242732;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 11px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          color: #a1a1aa;
        }

        .price-row.total {
          color: #f4f4f5;
          font-size: 13px;
          font-weight: 700;
          margin-top: 4px;
        }

        .cms-status-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .status-btn {
          padding: 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          background: #1e2028;
          color: #a1a1aa;
          border: 1px solid #2a2d3a;
          cursor: pointer;
        }

        .status-btn.active {
          background: #2563eb;
          color: #fff;
          border-color: #3b82f6;
        }

        .status-btn.cancel.active {
          background: #dc2626;
          color: #fff;
          border-color: #ef4444;
        }

        /* Health Grid */
        .cms-health-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cms-health-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #111216;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 11px;
        }

        .cms-health-item .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .cms-health-item .dot.online {
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
        }
      `}</style>
    </div>
  );
}

