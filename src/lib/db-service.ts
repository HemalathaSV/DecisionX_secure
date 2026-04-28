import { collection, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { mockFraudAlerts, mockChurnCustomers, generateMockCustomers, generateMockFraudAlerts, generateMockChurnCustomers } from "./mock-generators";

// Helper to check if we're using mock DB (invalid config)
const isFirebaseReady = () => {
  return db.app.options.projectId !== "demo-project" && db.app.options.projectId != null;
};

// Fallback to localStorage if Firebase is not yet configured
export const safeSetDoc = async (col: string, id: string, data: any) => {
  if (isFirebaseReady()) {
    try {
      await setDoc(doc(db, col, id), data);
    } catch (e) {
      console.warn("Firebase save failed, saving to local", e);
      saveLocal(col, id, data);
    }
  } else {
    saveLocal(col, id, data);
  }
};

export const safeGetDocs = async (col: string) => {
  if (isFirebaseReady()) {
    try {
      const snap = await getDocs(collection(db, col));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn("Firebase fetch failed, reading local", e);
      return getLocalCol(col);
    }
  } else {
    return getLocalCol(col);
  }
};

const saveLocal = (col: string, id: string, data: any) => {
  const existing = getLocalCol(col);
  const index = existing.findIndex(e => e.id === id);
  if (index >= 0) existing[index] = { id, ...data };
  else existing.push({ id, ...data });
  localStorage.setItem(`demo_${col}`, JSON.stringify(existing));
};

const getLocalCol = (col: string): any[] => {
  try {
    const raw = localStorage.getItem(`demo_${col}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const initializeFakeDatasets = async () => {
  const customers = generateMockCustomers(100);
  const frauds = generateMockFraudAlerts(200, customers);
  const churns = generateMockChurnCustomers(100, customers);

  if (!isFirebaseReady()) {
    localStorage.setItem("demo_customers", JSON.stringify(customers));
    localStorage.setItem("demo_fraud_alerts", JSON.stringify(frauds));
    localStorage.setItem("demo_churn_users", JSON.stringify(churns));
    return { success: true, localOnly: true };
  }

  try {
    // We would do batched writes here, but loop with safeSetDoc for simplicity
    const promises = [
      ...customers.map(c => setDoc(doc(db, "customers", c.id), c)),
      ...frauds.map(f => setDoc(doc(db, "fraud_alerts", f.id), f)),
      ...churns.map(c => setDoc(doc(db, "churn_users", c.id), c))
    ];
    await Promise.all(promises);
    return { success: true, localOnly: false };
  } catch (e) {
    console.error(e);
    // fallback
    localStorage.setItem("demo_customers", JSON.stringify(customers));
    localStorage.setItem("demo_fraud_alerts", JSON.stringify(frauds));
    localStorage.setItem("demo_churn_users", JSON.stringify(churns));
    return { success: true, localOnly: true };
  }
};
