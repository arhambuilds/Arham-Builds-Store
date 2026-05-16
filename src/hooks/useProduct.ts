import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Product, PRODUCTS } from '../data';

export function useProduct(idOrSlug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First, try finding in static PRODUCTS as fallback/initial
    const staticProduct = PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    
    // Then listen to Firestore
    const unsubscribe = onSnapshot(doc(db, 'products', idOrSlug), (snapshot) => {
      if (snapshot.exists()) {
        setProduct({ ...snapshot.data(), id: snapshot.id } as Product);
      } else {
        // If not found by ID, it might be a slug or doesn't exist yet
        setProduct(staticProduct || null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Firestore single fetch error:', error);
      setProduct(staticProduct || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [idOrSlug]);

  return { product, loading };
}
