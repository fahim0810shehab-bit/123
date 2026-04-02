import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Load Firebase configuration
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig;
try {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (error) {
  console.error("Failed to load firebase-applet-config.json. Ensure the file exists in the root directory.");
  throw error;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface HistoryItem {
  id: string; // Changed from number to string for Firestore
  email: string;
  timestamp: number;
  program: string;
  level: number;
  fileName: string;
  result: string;
}

export const getHistory = async (email: string, limitCount = 50): Promise<HistoryItem[]> => {
  const q = query(
    collection(db, 'history'),
    where('email', '==', email),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HistoryItem));
};

export const addHistory = async (item: Omit<HistoryItem, 'id'>) => {
  const docRef = await addDoc(collection(db, 'history'), item);
  return docRef.id;
};

export const deleteHistory = async (id: string) => {
  // In a production app, we should verify the email matches the document owner
  // before deleting. For simplicity, we just delete by ID here.
  await deleteDoc(doc(db, 'history', id));
};

export const addLoginHistory = async (email: string, timestamp: string, ip?: string) => {
  try {
    await addDoc(collection(db, 'logins'), {
      email,
      timestamp,
      ip: ip || 'unknown',
    });
  } catch (error) {
    console.error("Failed to log login history:", error);
  }
};

export default db;
