import { Product } from '../data';

const STORAGE_KEY = 'arham_store_products';
const ADMIN_SESSION_KEY = 'arham_admin_session';

const ADMIN_CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'arhamadib@admin.in',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'admin@2728',
  secretCode: import.meta.env.VITE_ADMIN_SECRET_CODE || '271211'
};

export const getStoredProducts = (initialProducts: Product[]): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialProducts;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return initialProducts;
  }
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const verifyPin = (pin: string): boolean => {
  return pin === ADMIN_CREDENTIALS.secretCode;
};

export const isAdminAuthenticated = (): boolean => {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  
  try {
    const { expiry } = JSON.parse(session);
    return Date.now() < expiry;
  } catch (e) {
    return false;
  }
};

export const loginAdmin = (username: string, password: string, pin: string): boolean => {
  if (
    username === ADMIN_CREDENTIALS.username && 
    password === ADMIN_CREDENTIALS.password && 
    pin === ADMIN_CREDENTIALS.secretCode
  ) {
    const session = {
      authenticated: true,
      username,
      password,
      expiry: Date.now() + 1000 * 60 * 60 * 24 // 24 hours
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const saveProductsToServer = async (products: Product[]): Promise<{ success: boolean; message?: string }> => {
  const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!sessionStr) return { success: false, message: 'Session expired. Please logout and login again.' };

  try {
    const { username, password } = JSON.parse(sessionStr);
    const response = await fetch('/api/admin/save-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        secretCode: ADMIN_CREDENTIALS.secretCode,
        products
      })
    });
    
    const result = await response.json();
    if (result.success) {
      saveProducts(products); // Also sync local storage for immediate UI update
      return { success: true };
    }
    return { success: false, message: result.message || 'Server error' };
  } catch (e: any) {
    console.error('Save to server failed:', e);
    return { success: false, message: e.message };
  }
};
