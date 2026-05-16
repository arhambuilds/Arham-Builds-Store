import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  currentPrice: number;
  originalPrice: number;
  thumbnailUrl: string;
  section: 'Templates' | 'Freebies' | 'Editing Assets';
  categories: string[];
  badge?: string;
  features?: { name: string; description: string }[];
  productAccessUrl?: string;
  productAccessInstructions?: string;
}

export async function fetchProductsFromFirestore(section?: string) {
  try {
    let q = query(collection(db, 'products'));
    if (section) {
      q = query(q, where('section', '==', section));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return [];
  }
}

export async function fetchProductById(id: string) {
  try {
    const snapshot = await getDocs(query(collection(db, 'products'), where('id', '==', id)));
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
    }
    // Try by Firestore generated ID
    const snapById = await getDocs(collection(db, 'products'));
    const found = snapById.docs.find(doc => doc.id === id);
    if (found) {
      return { id: found.id, ...found.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}
