import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function useContent<T>(collectionName: string, documentId: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData({ ...initialData, ...docSnap.data() } as T);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [collectionName, documentId]);

  return { data, loading, error };
}
