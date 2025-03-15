"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase"; // Import your Firestore instance
import { collection, getDocs } from "firebase/firestore";

const UserDash = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Function to fetch users from Firestore
    const fetchUsers = async () => {
      try {
        // Reference to the "users" collection
        const usersCollection = collection(db, "users");
        // Fetch documents from the collection
        const querySnapshot = await getDocs(usersCollection);

        // Map through the documents and extract data
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Document ID
          ...doc.data(), // Document data
        }));

        console.log("Fetched users:", usersData); // Log fetched data
        setUsers(usersData);
        setLoading(false); // Set loading to false
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
        setLoading(false); // Set loading to false
      }
    };

    // Call the fetch function
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold">User ID: {user.id}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Age: {user.age || "N/A"}</p>
                <p className="text-gray-600">Employment Type: {user.employmentType || "N/A"}</p>
                <p className="text-gray-600">Years of Experience: {user.yearsOfExperience || "N/A"}</p>
                <p className="text-gray-600">Industry Type: {user.industryType || "N/A"}</p>
                <p className="text-gray-600">Employer Category: {user.employerCategory || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Monthly Income: ₹{user.monthlyIncome || "N/A"}</p>
                <p className="text-gray-600">Existing EMI: ₹{user.existingEMI || "N/A"}</p>
                <p className="text-gray-600">Credit Score: {user.creditScore || "N/A"}</p>
                <p className="text-gray-600">Bank Balance: ₹{user.bankBalance || "N/A"}</p>
                <p className="text-gray-600">Loan Purpose: {user.loanPurpose || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Requested Loan Amount: ₹{user.requestedLoanAmount || "N/A"}</p>
                <p className="text-gray-600">Preferred Repayment Period: {user.preferredRepaymentPeriod || "N/A"} years</p>
                <p className="text-gray-600">Willingness for Collateral: {user.willingnessForCollateral ? "Yes" : "No"}</p>
                <p className="text-gray-600">Fixed Expenses: ₹{user.fixedExpenses || "N/A"}</p>
                <p className="text-gray-600">Variable Expenses: ₹{user.variableExpenses || "N/A"}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">Spending Behavior: {user.spendingBehavior || "N/A"}</p>
              <p className="text-gray-600">Investment Strategy: {user.investmentStrategy || "N/A"}</p>
              <p className="text-gray-600">Financial Stability: {user.financialStability || "N/A"}</p>
              <p className="text-gray-600">Payment Consistency: {user.paymentConsistency || "N/A"}</p>
              <p className="text-gray-600">Financial Adaptability: {user.financialAdaptability || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDash;