"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userType, setUserType] = useState(null);
  const [loanApplications, setLoanApplications] = useState([]);
  const [loanOffers, setLoanOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileStats, setProfileStats] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      if (user) {
        try {
          const q = query(collection(db, "users"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUserType(userData.userType);
            setProfileStats({
              completionPercentage: userData.completionPercentage || 0,
              eligibilityScore: userData.eligibilityScore || 0,
              pendingDocuments: userData.pendingDocuments || 0,
              savedOffers: userData.savedOffers || 0
            });
          }
        } catch (error) {
          console.error("Error fetching user type:", error);
        }
      }
    };

    fetchUserType();
  }, [user]);

  useEffect(() => {
    const fetchLoanData = async () => {
      if (user && userType) {
        try {
          if (userType === "user") {
            const q = query(collection(db, "loanApplications"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const applications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLoanApplications(applications);
          } else if (userType === "bank") {
            const q = query(collection(db, "loanOffers"), where("bankId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const offers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLoanOffers(offers);
          }
        } catch (error) {
          console.error("Error fetching loan data:", error);
        }
      }
    };

    fetchLoanData();
  }, [user, userType]);

  if (loading) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-white text-center p-10">
        <h1>Please sign in to access your dashboard</h1>
        <Link href="/login" className="text-blue-400 underline">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-4 bg-gray-900 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400">LoanSage</h1>
        <div className="text-gray-300">{user.displayName || 'User'}</div>
      </nav>

      <main className="p-6">
        <h2 className="text-xl font-bold">Welcome, {user.displayName || 'User'}!</h2>
        <p>{userType === "user" ? "Track your loans and explore offers." : "Manage loan applications and offers."}</p>
        
        {userType === "user" ? (
          <section>
            <h3 className="text-lg font-bold mt-6">Your Loan Applications</h3>
            {loanApplications.length > 0 ? (
              <ul>
                {loanApplications.map((loan) => (
                  <li key={loan.id} className="p-2 border-b border-gray-700">{loan.loanType} - {loan.status}</li>
                ))}
              </ul>
            ) : (
              <p>No loan applications found.</p>
            )}
          </section>
        ) : (
          <section>
            <h3 className="text-lg font-bold mt-6">Your Loan Offers</h3>
            {loanOffers.length > 0 ? (
              <ul>
                {loanOffers.map((offer) => (
                  <li key={offer.id} className="p-2 border-b border-gray-700">{offer.loanType} - {offer.interestRate}%</li>
                ))}
              </ul>
            ) : (
              <p>No loan offers found.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
