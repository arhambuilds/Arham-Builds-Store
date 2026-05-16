import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Product, PRODUCTS } from '../data';

export function useProducts(section?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'products'), orderBy('updatedAt', 'desc'));
    
    if (section && section !== 'All') {
      q = query(collection(db, 'products'), where('section', '==', section));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Product[];
      
      // If Firestore is empty, fallback to static data (only for the initial setup)
      if (docs.length === 0) {
        setProducts(section && section !== 'All' 
          ? PRODUCTS.filter(p => p.section === section)
          : PRODUCTS
        );
      } else {
        setProducts(docs);
      }
      setLoading(false);
    }, (error) => {
      console.error('Firestore fallback to static:', error);
      setProducts(section && section !== 'All' 
        ? PRODUCTS.filter(p => p.section === section)
        : PRODUCTS
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [section]);

  return { products, loading };
}
