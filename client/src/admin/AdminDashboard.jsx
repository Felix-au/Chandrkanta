import React, { useState, useEffect } from 'react';
import {
  X, Shield, Save, RefreshCw, Undo2, RotateCcw,
  Package, LayoutGrid, ShoppingCart, Sliders, Image,
  Plus, Trash2, Edit3, Check, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminDashboard({ onClose }) {
  const {
    content,
    draftContent,
    adminStatus,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    updateDraftSection,
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
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('ui'); // 'ui', 'products', 'categories', 'orders'
  const [notification, setNotification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Local draft state for editing UI sections
  const [localDraft, setLocalDraft] = useState(draftContent || content);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Product modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductForm, setNewProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'sarees',
    type: 'Banarasi Silk',
    price: 2999,
    originalPrice: 4500,
    discount: '33% off',
    badge: 'New',
    image: '/images/saree-teal.jpg',
    stock: 15,
    description: '',
    swatches: '#1a6b6b, #7B1C1C, #2c3e6b'
  });

  // Category modal state
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    count: '100+ Styles',
    image: '/images/cat-saree.jpg'
  });

  useEffect(() => {
    if (draftContent) {
      setLocalDraft(draftContent);
    }
  }, [draftContent]);

  useEffect(() => {
    if (isAdminLoggedIn && activeTab === 'orders') {
      loadOrders();
    }
  }, [isAdminLoggedIn, activeTab]);

  const loadOrders = async () => {
    const list = await fetchOrders();
    setOrders(list);
  };

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Auth Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsProcessing(true);
    const res = await loginAdmin(passwordInput);
    setIsProcessing(false);
    if (!res.success) {
      setLoginError(res.error || 'Invalid admin password');
    } else {
      showToast('Logged into Chandrakanta Admin Studio');
    }
  };

  // UI Draft Save
  const handleSaveSectionDraft = async (section) => {
    setIsProcessing(true);
    const res = await updateDraftSection(section, localDraft[section]);
    setIsProcessing(false);
    if (res.success) {
      showToast(`Section '${section}' saved to working draft`);
    } else {
      showToast(res.error, 'error');
    }
  };

  // Publish
  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish the draft to the live storefront?')) return;
    setIsProcessing(true);
    const res = await publishDraft();
    setIsProcessing(false);
    if (res.success) {
      showToast('🎉 All draft changes are now live on the storefront!');
    } else {
      showToast(res.error, 'error');
    }
  };

  // Discard
  const handleDiscard = async () => {
    if (!window.confirm('Discard all unpublished changes and revert to current live state?')) return;
    setIsProcessing(true);
    const res = await discardDraft();
    setIsProcessing(false);
    if (res.success) {
      showToast('Draft discarded. Reverted to live content.');
    }
  };

  // Reset Defaults
  const handleReset = async () => {
    if (!window.confirm('Reset all website content, products, and categories to pristine seed data?')) return;
    setIsProcessing(true);
    const res = await resetDefaults();
    setIsProcessing(false);
    if (res.success) {
      showToast('Reset to original factory defaults.');
    }
  };

  // Product CRUD
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const swatchesArray = typeof productFormData.swatches === 'string'
      ? productFormData.swatches.split(',').map(s => s.trim()).filter(Boolean)
      : productFormData.swatches;

    const payload = {
      ...productFormData,
      price: Number(productFormData.price),
      originalPrice: Number(productFormData.originalPrice) || undefined,
      stock: Number(productFormData.stock),
      swatches: swatchesArray
    };

    let res;
    if (editingProduct) {
      res = await updateProduct(editingProduct.id, payload);
    } else {
      res = await addProduct(payload);
    }
    setIsProcessing(false);

    if (res.success) {
      showToast(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      setEditingProduct(null);
      setNewProductForm(false);
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    setIsProcessing(true);
    const res = await deleteProduct(id);
    setIsProcessing(false);
    if (res.success) {
      showToast('Product removed');
    }
  };

  // Category CRUD
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    let res;
    if (editingCategory) {
      res = await updateCategory(editingCategory.id, categoryFormData);
    } else {
      res = await addCategory(categoryFormData);
    }
    setIsProcessing(false);
    if (res.success) {
      showToast('Category saved');
      setEditingCategory(null);
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    setIsProcessing(true);
    const res = await deleteCategory(id);
    setIsProcessing(false);
    if (res.success) {
      showToast('Category removed');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setIsProcessing(true);
    const ok = await updateOrderStatus(orderId, newStatus, newStatus === 'DELIVERED' ? 'COMPLETED' : undefined);
    setIsProcessing(false);
    if (ok) {
      showToast(`Order #${orderId} updated to ${newStatus}`);
      await loadOrders();
    }
  };

  // If not logged in, render Admin Lockscreen
  if (!isAdminLoggedIn) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-box"
          style={{ maxWidth: '420px', padding: '36px 32px', textAlign: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(123,28,28,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--accent)' }}>
            <Shield size={28} />
          </div>

          <h2 style={{ fontFamily: 'var(--font-disp)', fontSize: '22px', color: 'var(--text)', marginBottom: '6px' }}>
            Chandrakanta Admin Studio
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Enter your management password to modify website visuals, products, and view customer orders.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <input
                type="password"
                placeholder="Admin Password (default: chandrakanta2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              {loginError && (
                <p style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '6px', textAlign: 'left' }}>
                  {loginError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-pri"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isProcessing ? 'Verifying...' : 'Unlock Admin Studio'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        background: 'rgba(15,10,8,.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn .2s ease'
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--accent)" />
            <span style={{ fontFamily: 'var(--font-disp)', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
              Chandrakanta Studio
            </span>
          </div>

          {/* Unpublished Badge */}
          {adminStatus?.hasUnpublishedChanges ? (
            <span style={{ background: 'rgba(200,146,42,.15)', border: '1px solid var(--gold)', color: '#8a6012', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)' }}>
              ● Draft Changes Pending
            </span>
          ) : (
            <span style={{ background: 'rgba(45,107,45,.1)', border: '1px solid #2d6b2d', color: '#2d6b2d', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)' }}>
              ✓ Storefront Synchronized
            </span>
          )}
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleDiscard}
            className="btn-pri"
            style={{ background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)', padding: '8px 16px', fontSize: '11px' }}
            title="Discard current draft"
          >
            <Undo2 size={13} /> Discard Draft
          </button>

          <button
            onClick={handlePublish}
            className="btn-pri"
            style={{ background: '#2d6b2d', borderColor: '#2d6b2d', padding: '8px 18px', fontSize: '11px' }}
            title="Publish all changes live"
          >
            <Save size={13} /> Publish to Live
          </button>

          <button
            onClick={handleReset}
            style={{ color: 'var(--text-light)', padding: '6px' }}
            title="Reset Defaults"
          >
            <RotateCcw size={16} />
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }} />

          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '6px' }}
            title="Close Admin (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Nav */}
        <aside
          style={{
            width: '240px',
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            padding: '20px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <button
            onClick={() => setActiveTab('ui')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--r-sm)',
              fontSize: '13px',
              fontWeight: 600,
              background: activeTab === 'ui' ? 'rgba(123,28,28,.08)' : 'transparent',
              color: activeTab === 'ui' ? 'var(--accent)' : 'var(--text)'
            }}
          >
            <Sliders size={16} /> Storefront Visuals
          </button>

          <button
            onClick={() => setActiveTab('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--r-sm)',
              fontSize: '13px',
              fontWeight: 600,
              background: activeTab === 'products' ? 'rgba(123,28,28,.08)' : 'transparent',
              color: activeTab === 'products' ? 'var(--accent)' : 'var(--text)'
            }}
          >
            <Package size={16} /> Products &amp; Catalog
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--r-sm)',
              fontSize: '13px',
              fontWeight: 600,
              background: activeTab === 'categories' ? 'rgba(123,28,28,.08)' : 'transparent',
              color: activeTab === 'categories' ? 'var(--accent)' : 'var(--text)'
            }}
          >
            <LayoutGrid size={16} /> Categories
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              borderRadius: 'var(--r-sm)',
              fontSize: '13px',
              fontWeight: 600,
              background: activeTab === 'orders' ? 'rgba(123,28,28,.08)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--accent)' : 'var(--text)'
            }}
          >
            <ShoppingCart size={16} /> Customer Orders
          </button>

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <button
              onClick={logoutAdmin}
              style={{ fontSize: '12px', color: 'var(--text-light)', width: '100%', textAlign: 'left', padding: '8px' }}
            >
              Sign out of Admin
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: 'var(--bg)' }}>
          {/* Notification Toast */}
          {notification && (
            <div
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 3500,
                background: notification.type === 'error' ? 'var(--accent)' : '#1a140b',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: 'var(--r-sm)',
                boxShadow: '0 8px 30px rgba(0,0,0,.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              <Check size={16} color="var(--gold-lt)" />
              {notification.message}
            </div>
          )}

          {/* TAB 1: STOREFRONT VISUALS */}
          {activeTab === 'ui' && (
            <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-disp)', fontSize: '26px', color: 'var(--text)', marginBottom: '6px' }}>
                  Storefront Visual Customizer
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Modify marquee announcements, hero headlines, festive banners, and customer guarantees. Save to draft and publish whenever ready.
                </p>
              </div>

              {/* SECTION: HERO */}
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                    Hero Banner &amp; Headline
                  </h3>
                  <button
                    onClick={() => handleSaveSectionDraft('hero')}
                    className="btn-pri"
                    style={{ padding: '8px 16px', fontSize: '11px' }}
                  >
                    Save Hero Draft
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Top Gold Label
                    </label>
                    <input
                      type="text"
                      value={localDraft.hero?.label || ''}
                      onChange={(e) => setLocalDraft({
                        ...localDraft,
                        hero: { ...localDraft.hero, label: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Hero Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={localDraft.hero?.bannerImage || ''}
                      onChange={(e) => setLocalDraft({
                        ...localDraft,
                        hero: { ...localDraft.hero, bannerImage: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Main Display Headline
                  </label>
                  <input
                    type="text"
                    value={localDraft.hero?.title || ''}
                    onChange={(e) => setLocalDraft({
                      ...localDraft,
                      hero: { ...localDraft.hero, title: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={localDraft.hero?.subtitle || ''}
                    onChange={(e) => setLocalDraft({
                      ...localDraft,
                      hero: { ...localDraft.hero, subtitle: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={localDraft.hero?.primaryCtaText || ''}
                      onChange={(e) => setLocalDraft({
                        ...localDraft,
                        hero: { ...localDraft.hero, primaryCtaText: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Secondary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={localDraft.hero?.secondaryCtaText || ''}
                      onChange={(e) => setLocalDraft({
                        ...localDraft,
                        hero: { ...localDraft.hero, secondaryCtaText: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: ANNOUNCEMENTS */}
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                    Announcement Marquee Messages
                  </h3>
                  <button
                    onClick={() => handleSaveSectionDraft('announcements')}
                    className="btn-pri"
                    style={{ padding: '8px 16px', fontSize: '11px' }}
                  >
                    Save Marquee Draft
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(localDraft.announcements || []).map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={msg}
                        onChange={(e) => {
                          const updated = [...localDraft.announcements];
                          updated[idx] = e.target.value;
                          setLocalDraft({ ...localDraft, announcements: updated });
                        }}
                        style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px' }}
                      />
                      <button
                        onClick={() => {
                          const updated = localDraft.announcements.filter((_, i) => i !== idx);
                          setLocalDraft({ ...localDraft, announcements: updated });
                        }}
                        style={{ color: 'var(--accent)', padding: '8px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setLocalDraft({
                        ...localDraft,
                        announcements: [...(localDraft.announcements || []), 'New Special Festive Offer']
                      });
                    }}
                    className="btn-pri"
                    style={{ alignSelf: 'flex-start', background: 'transparent', color: 'var(--accent)', borderColor: 'var(--accent)', padding: '8px 16px', fontSize: '11px', marginTop: '6px' }}
                  >
                    <Plus size={14} /> Add Announcement
                  </button>
                </div>
              </div>

              {/* SECTION: FESTIVE EDITORIAL */}
              <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                    Festive Spotlight Section
                  </h3>
                  <button
                    onClick={() => handleSaveSectionDraft('festive')}
                    className="btn-pri"
                    style={{ padding: '8px 16px', fontSize: '11px' }}
                  >
                    Save Festive Draft
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Label
                    </label>
                    <input
                      type="text"
                      value={localDraft.festive?.label || ''}
                      onChange={(e) => setLocalDraft({
                        ...localDraft,
                        festive: { ...localDraft.festive, label: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Headline
                    </label>
                    <input
                      type="text"
                      value={localDraft.festive?.title || ''}
                      onChange={(e) => setLocalDraft({
                        ...localDraft,
                        festive: { ...localDraft.festive, title: e.target.value }
                      })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={localDraft.festive?.description || ''}
                    onChange={(e) => setLocalDraft({
                      ...localDraft,
                      festive: { ...localDraft.festive, description: e.target.value }
                    })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: '13px', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div style={{ maxWidth: '980px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-disp)', fontSize: '26px', color: 'var(--text)', marginBottom: '4px' }}>
                    Catalog &amp; Product Management
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Add new handcrafted sarees, suit sets, and lehengas. Manage prices, inventory, and color swatches.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductFormData({
                      name: '',
                      category: 'sarees',
                      type: 'Banarasi Silk',
                      price: 2999,
                      originalPrice: 4500,
                      discount: '33% off',
                      badge: 'New',
                      image: '/images/saree-teal.jpg',
                      stock: 15,
                      description: '',
                      swatches: '#1a6b6b, #7B1C1C, #2c3e6b'
                    });
                    setNewProductForm(true);
                  }}
                  className="btn-pri"
                >
                  <Plus size={16} /> Add Product
                </button>
              </div>

              {/* Product Edit / Add Modal */}
              {newProductForm && (
                <div className="modal-backdrop" onClick={() => setNewProductForm(false)}>
                  <div className="modal-box" style={{ maxWidth: '640px', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
                    <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '20px', marginBottom: '18px' }}>
                      {editingProduct ? 'Edit Product' : 'Add New Handcrafted Product'}
                    </h3>

                    <form onSubmit={handleSaveProduct}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Product Title *</label>
                          <input
                            type="text"
                            required
                            value={productFormData.name}
                            onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Category *</label>
                          <select
                            value={productFormData.category}
                            onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}
                          >
                            <option value="sarees">Sarees</option>
                            <option value="suits">Suit Sets</option>
                            <option value="bridal">Bridal Lehengas</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Sale Price (₹) *</label>
                          <input
                            type="number"
                            required
                            value={productFormData.price}
                            onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Original MRP (₹)</label>
                          <input
                            type="number"
                            value={productFormData.originalPrice}
                            onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Badge (e.g. Bestseller)</label>
                          <input
                            type="text"
                            value={productFormData.badge}
                            onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Image URL *</label>
                        <input
                          type="text"
                          required
                          value={productFormData.image}
                          onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Color Hex Swatches (comma-separated)</label>
                        <input
                          type="text"
                          value={productFormData.swatches}
                          onChange={(e) => setProductFormData({ ...productFormData, swatches: e.target.value })}
                          placeholder="#1a6b6b, #7B1C1C, #2c3e6b"
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)' }}
                        />
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Description</label>
                        <textarea
                          rows={3}
                          value={productFormData.description}
                          onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', fontFamily: 'inherit' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setNewProductForm(false)} className="btn-pri" style={{ background: 'transparent', color: 'var(--text)', borderColor: 'var(--border)' }}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-pri">
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '14px 18px' }}>Product</th>
                      <th style={{ padding: '14px 18px' }}>Category</th>
                      <th style={{ padding: '14px 18px' }}>Price</th>
                      <th style={{ padding: '14px 18px' }}>Stock</th>
                      <th style={{ padding: '14px 18px' }}>Badge</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(content?.products || []).map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={p.image} alt={p.name} style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div>
                            <strong style={{ color: 'var(--text)' }}>{p.name}</strong>
                            <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>{p.type}</p>
                          </div>
                        </td>
                        <td style={{ padding: '12px 18px', textTransform: 'capitalize' }}>{p.category}</td>
                        <td style={{ padding: '12px 18px' }}><strong>₹{p.price?.toLocaleString('en-IN')}</strong></td>
                        <td style={{ padding: '12px 18px' }}>{p.stock || 10}</td>
                        <td style={{ padding: '12px 18px' }}>
                          {p.badge && <span className="badge" style={{ position: 'static' }}>{p.badge}</span>}
                        </td>
                        <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductFormData({
                                ...p,
                                swatches: Array.isArray(p.swatches) ? p.swatches.join(', ') : p.swatches || ''
                              });
                              setNewProductForm(true);
                            }}
                            style={{ color: 'var(--text-muted)', padding: '6px', marginRight: '6px' }}
                            title="Edit Product"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{ color: 'var(--accent)', padding: '6px' }}
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-disp)', fontSize: '26px', color: 'var(--text)', marginBottom: '4px' }}>
                    Category Management
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Organize your store collections with custom cover banners and styles counters.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {(content?.categories || []).map((cat) => (
                  <div
                    key={cat.id}
                    style={{
                      background: 'var(--surface)',
                      borderRadius: 'var(--r-md)',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)' }}>{cat.count}</p>
                      <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '18px', color: 'var(--text)', margin: '4px 0 12px' }}>
                        {cat.name}
                      </h3>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="btn-pri"
                        style={{ background: 'transparent', color: 'var(--accent)', borderColor: 'var(--accent)', padding: '6px 12px', fontSize: '11px' }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & FULFILLMENT */}
          {activeTab === 'orders' && (
            <div style={{ maxWidth: '980px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-disp)', fontSize: '26px', color: 'var(--text)', marginBottom: '4px' }}>
                  Customer Orders &amp; Fulfillment
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Track incoming customer orders, delivery addresses, payment methods, and update shipment status.
                </p>
              </div>

              <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '14px 18px' }}>Order ID</th>
                      <th style={{ padding: '14px 18px' }}>Customer</th>
                      <th style={{ padding: '14px 18px' }}>Items</th>
                      <th style={{ padding: '14px 18px' }}>Total</th>
                      <th style={{ padding: '14px 18px' }}>Payment</th>
                      <th style={{ padding: '14px 18px' }}>Status</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          No orders placed yet. Test the checkout flow on the storefront to see orders appear here!
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o.orderId} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '14px 18px' }}>
                            <strong style={{ color: 'var(--accent)' }}>#{o.orderId}</strong>
                            <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                              {new Date(o.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <p style={{ fontWeight: 600 }}>{o.customer?.name}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.customer?.phone}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>{o.customer?.city}, {o.customer?.state}</p>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            {(o.items || []).map((it, idx) => (
                              <p key={idx} style={{ fontSize: '12px' }}>
                                {it.quantity}x {it.name}
                              </p>
                            ))}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <strong>₹{o.pricing?.total?.toLocaleString('en-IN')}</strong>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: o.paymentMethod === 'COD' ? 'rgba(200,146,42,.15)' : 'rgba(45,107,45,.15)', color: o.paymentMethod === 'COD' ? '#8a6012' : '#2d6b2d' }}>
                              {o.paymentMethod}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o.orderId, e.target.value)}
                              style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}
                            >
                              <option value="PLACED">Placed</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <button
                              onClick={() => setSelectedOrder(o)}
                              style={{ color: 'var(--accent)', fontSize: '12px', fontWeight: 600 }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Order Detail Modal */}
              {selectedOrder && (
                <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
                  <div className="modal-box" style={{ padding: '28px' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <h3 style={{ fontFamily: 'var(--font-disp)', fontSize: '20px' }}>
                        Order #{selectedOrder.orderId}
                      </h3>
                      <button onClick={() => setSelectedOrder(null)}><X size={18} /></button>
                    </div>

                    <div style={{ marginBottom: '16px', fontSize: '13px', lineHeight: 1.6 }}>
                      <p><strong>Customer:</strong> {selectedOrder.customer?.name} ({selectedOrder.customer?.phone})</p>
                      <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                      <p><strong>Address:</strong> {selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}</p>
                      <p><strong>Payment:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
                    </div>

                    <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Items</h4>
                    <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '10px 0', marginBottom: '16px' }}>
                      {(selectedOrder.items || []).map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                          <span>{it.quantity}x {it.name}</span>
                          <strong>₹{(it.price * it.quantity).toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>
                      <span>Total:</span>
                      <span>₹{selectedOrder.pricing?.total?.toLocaleString('en-IN')}</span>
                    </div>

                    <button onClick={() => setSelectedOrder(null)} className="btn-pri" style={{ width: '100%', justifyContent: 'center' }}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
