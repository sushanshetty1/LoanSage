"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userType, setUserType] = useState(null);
  const [loanApplications, setLoanApplications] = useState([]);
  const [loanOffers, setLoanOffers] = useState([]);
  const [profileStats, setProfileStats] = useState(null);
  const [userData, setUserData] = useState(null); // State to store user data
  const [formData, setFormData] = useState({}); // State to store form data
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message

  // Fetch user data on component load
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Hardcoded data for testing
          const hardcodedData = {
            age: 30,
            employmentType: "Full-time",
            yearsOfExperience: 5,
            industryType: "IT",
            employerCategory: "Corporate",
            monthlyIncome: 80000,
            existingEMI: 15000,
            creditScore: 750,
            bankBalance: 200000,
            loanPurpose: "Home Loan",
            requestedLoanAmount: 5000000,
            preferredRepaymentPeriod: 20,
            willingnessForCollateral: true,
            fixedExpenses: 30000,
            variableExpenses: 20000,
            spendingBehavior: "Disciplined",
            investmentStrategy: "Moderate",
            financialStability: "Stable",
            paymentConsistency: "Consistent",
            financialAdaptability: "High"
          };

          console.log("Using hardcoded data:", hardcodedData); // Log hardcoded data
          setUserData({ id: "hardcodedId", ...hardcodedData });
          setFormData(hardcodedData);
          setUserType("user");
          setProfileStats({
            completionPercentage: 100,
            eligibilityScore: 90,
            pendingDocuments: 0,
            savedOffers: 0
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Fetch loan data based on user type
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) return;

    try {
      const userDocRef = doc(db, "users", userData.id); // Reference to the user document
      await updateDoc(userDocRef, formData); // Update the document with form data
      setUserData({ ...userData, ...formData }); // Update local state
      console.log("Personal details updated successfully!");

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Error updating personal details:", error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="p-4 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">LoanSage</h1>
          <div className="text-gray-300">{user.displayName || 'User'}</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-lg border border-gray-800/50 shadow-lg"
        >
          <h2 className="text-2xl font-bold">Welcome, {user.displayName || 'User'}!</h2>
          <p className="text-gray-300 mt-2">
            {userType === "user" ? "Track your loans and explore offers." : "Manage loan applications and offers."}
          </p>
        </motion.div>

        {/* Personal Details Form */}
        {userData && Object.keys(formData).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <h3 className="text-xl font-bold mb-4">Personal Details</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(formData).map(([key, value]) => {
                if (key === "id" || key === "uid" || key === "userType") return null; // Skip non-editable fields
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-800/70 transition-all"
                  >
                    <label className="text-gray-300 text-sm">{key}</label>
                    <input
                      type="text"
                      name={key}
                      value={value || ""}
                      onChange={handleInputChange}
                      className="w-full mt-2 p-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </motion.div>
                );
              })}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="col-span-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Save Personal Details
              </motion.button>
            </form>

            {/* Success Message */}
            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 p-4 bg-green-600/50 border border-green-700/50 rounded-lg text-white text-center"
              >
                Personal details saved successfully!
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Loan Applications/Offers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          {userType === "user" ? (
            <section>
              <h3 className="text-xl font-bold mb-4">Your Loan Applications</h3>
              {loanApplications.length > 0 ? (
                <div className="space-y-4">
                  {loanApplications.map((loan) => (
                    <motion.div
                      key={loan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-800/70 transition-all"
                    >
                      <h4 className="text-lg font-semibold">{loan.loanType}</h4>
                      <p className="text-gray-300">Status: {loan.status}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No loan applications found.</p>
              )}
            </section>
          ) : (
            <section>
              <h3 className="text-xl font-bold mb-4">Your Loan Offers</h3>
              {loanOffers.length > 0 ? (
                <div className="space-y-4">
                  {loanOffers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-gray-800/70 transition-all"
                    >
                      <h4 className="text-lg font-semibold">{offer.loanType}</h4>
                      <p className="text-gray-300">Interest Rate: {offer.interestRate}%</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No loan offers found.</p>
              )}
            </section>
          )}
        </motion.div>
      </main>
    </div>
  );
}