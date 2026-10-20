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

  // Auth header helper
  const authHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'Authorization': adminToken ? `Bearer ${adminToken}` : ''
    };
  }, [adminToken]);

  // Fetch live public content
  const fetchLiveContent = useCallback(async () => {
    try {
      const res = await fetch(apiUrl('/api/content'));
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setContent(json.data);
        }
      }
    } catch (err) {
      console.warn('Using local fallback store data:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch admin draft
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

  // Inject theme custom properties into document root
  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme?.colors?.accent) root.style.setProperty("--accent", activeTheme.colors.accent);
    if (activeTheme?.colors?.bg) root.style.setProperty("--bg", activeTheme.colors.bg);
  }, [activeTheme]);

  // Dynamic theme and layout resolution
  const activeTheme = content?.theme || DEFAULT_STORE_DATA?.theme;
  const activeLayout = content?.layout || DEFAULT_STORE_DATA?.layout;

  // Admin Login
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

  // Update a specific draft section
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

  // Publish Draft to Live
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

  // Discard Draft
  const discardDraft = async () => {
    try {
      const res = await fetch(apiUrl('/api/admin/discard'), {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setDraftContent(data.draft);
        setAdminStatus(data.status);
        return { success: true };
      }
      throw new Error(data.error || 'Discard failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Reset Defaults
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

  // Product CRUD
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

  // Category CRUD
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
        isAdminLoggedIn: Boolean(adminToken),
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
        updateOrderStatus,
        refreshContent: fetchLiveContent
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
