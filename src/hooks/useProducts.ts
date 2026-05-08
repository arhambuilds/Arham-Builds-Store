import { useState, useEffect } from 'react';
import { Product, PRODUCTS as INITIAL_PRODUCTS } from '../data';
import { getStoredProducts } from '../lib/adminUtils';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    const data = getStoredProducts(INITIAL_PRODUCTS);
    setProducts(data);
    setLoading(false);

    // Listen for storage changes (updates from admin area)
    const handleStorageChange = () => {
      setProducts(getStoredProducts(INITIAL_PRODUCTS));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simplified manual refresh helper
  const refreshProducts = () => {
    setProducts(getStoredProducts(INITIAL_PRODUCTS));
  };

  return { products, loading, refreshProducts };
};
