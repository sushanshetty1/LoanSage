// utils/loanUtils.js
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function fetchLoans(preferences) {
  try {
    const loansRef = collection(db, "loans");
    let q = query(loansRef);
    
    if(preferences.amount) {
      q = query(q, where("minAmount", "<=", preferences.amount));
      q = query(q, where("maxAmount", ">=", preferences.amount));
    }
    if(preferences.tenure) {
      q = query(q, where("tenure", "==", preferences.tenure));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching loans:", error);
    return [];
  }
}

export async function saveUserPreferences(userId, preferences) {
  try {
    await updateDoc(doc(db, "users", userId), {
      preferences: {
        loanAmount: preferences.amount,
        preferredTenure: preferences.tenure,
        maxInterestRate: preferences.interestRate,
        lastUpdated: new Date()
      }
    });
    return true;
  } catch (error) {
    console.error("Error saving preferences:", error);
    return false;
  }
}