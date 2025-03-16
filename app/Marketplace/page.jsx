"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRightCircle,
  Check,
  CreditCard,
  ChevronRight,
  MessageCircle,
  BarChart,
  Globe,
  Shield,
  Zap,
  Mic,
  Volume2,
  Sparkles,
  PlusCircle,
  IndianRupee,
  CalendarDays,
  BadgeCheck,
  X,
  Loader,
  User,
  Mail,
} from "lucide-react";
import { db, auth } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const LoanMarketplace = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user] = useAuthState(auth);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState("");
  const [bankName, setBankName] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    duration: "",
    purpose: "",
    interestRate: "",
    description: "",
  });
  const [loanRequests, setLoanRequests] = useState([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchLoanRequests();
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserType(userDoc.data().userType);
        setUserName(userDoc.data().name);
        if (userDoc.data().userType === "bank") {
          setBankName(userDoc.data().institutionName || userDoc.data().name);
        }
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const fetchLoanRequests = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "loanRequests"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
        });
      });

      setLoanRequests(requests);
    } catch (error) {
      console.error("Error fetching loan requests: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit a loan request");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "loanRequests"), {
        amount: parseFloat(formData.amount),
        duration: parseInt(formData.duration),
        purpose: formData.purpose,
        interestRate: parseFloat(formData.interestRate),
        description: formData.description,
        requester: "user", //If send by Sage then is "sage"
        userName: userName || "Anonymous",
        userId: user.uid,
        createdAt: Timestamp.now(),
        approvals: [],
      });

      setFormData({
        amount: "",
        duration: "",
        purpose: "",
        interestRate: "",
        description: "",
      });

      setShowForm(false);
      fetchLoanRequests();
    } catch (error) {
      console.error("Error adding loan request: ", error);
      alert("Failed to submit loan request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (loanId) => {
    try {
      // Ensure bankName is defined
      const bankNameToUse = bankName || "Unknown Bank";
  
      const approvalData = {
        bankId: user.uid,
        bankName: bankNameToUse,
        approvedAt: Timestamp.now(),
      };
  
      // Validate approvalData
      if (!approvalData.bankId || !approvalData.bankName || !approvalData.approvedAt) {
        console.error("Invalid approval data:", approvalData);
        alert("Failed to approve loan request. Missing required data.");
        return;
      }
  
      // Update Firestore
      await updateDoc(doc(db, "loanRequests", loanId), {
        approvals: arrayUnion(approvalData),
      });
  
      // Refresh the loan requests list
      fetchLoanRequests();
    } catch (error) {
      console.error("Error approving loan request: ", error);
      alert("Failed to approve loan request. Please try again.");
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setSelectedUserDetails(userDoc.data());
        setShowUserDetailsModal(true);
      }
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  return (
    <div className="relative pt-24 pb-16 md:pb-24 overflow-hidden bg-black min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -100, y: -100 }}
          animate={{ opacity: 0.3, x: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 0.2, x: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-3 px-3 py-1 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-full">
            <span className="text-xs font-medium text-purple-300 tracking-wider">LOAN MARKETPLACE</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="text-white">Find Your Perfect </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Loan Match
            </span>
          </h1>

          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            {userType === "bank"
              ? "Review and approve loan requests from users."
              : "Request a loan that fits your needs or browse existing requests."
            }
          </p>

          {userType === "user" && !showForm && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-6 rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                <PlusCircle className="h-5 w-5 mr-2" />
                <span>Create Loan Request</span>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Loan Request Form for Users */}
        {userType === "user" && showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl shadow-purple-500/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create Loan Request</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                      Loan Amount (₹)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                      Duration (months)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter duration"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-300 mb-1">
                      Purpose
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select purpose</option>
                      <option value="Personal">Personal</option>
                      <option value="Education">Education</option>
                      <option value="Business">Business</option>
                      <option value="Home">Home</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Medical">Medical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-300 mb-1">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      id="interestRate"
                      name="interestRate"
                      value={formData.interestRate}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter interest rate"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                      placeholder="Enter loan details and purpose"
                      required
                    ></textarea>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block w-full">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20"
                  >
                    {submitting ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span>Submit Loan Request</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Loan Requests Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {userType === "bank" ? "Loan Requests to Approve" : "Available Loan Requests"}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : loanRequests.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="bg-gray-800/50 rounded-lg p-8 max-w-lg mx-auto">
                <p className="text-lg">No loan requests available at the moment.</p>
                <p className="mt-2">Be the first to create a request!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loanRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`relative rounded-2xl overflow-visible shadow-xl ${
                    request.requester === "sage"
                      ? "border-2 border-purple-500/50 shadow-purple-500/30 bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900"
                      : "border border-gray-800 bg-gradient-to-b from-gray-900 to-black"
                  }`}
                >
                  {/* Blur banner for approved requests */}
                  {request.approvals && request.approvals.length > 0 && (
                    <div className="absolute top-0 left-0 right-0 bg-white/10 backdrop-blur-sm z-10">
                      <div className="text-center py-2 px-4">
                        <span className="text-sm font-medium text-white">
                          {request.approvals.length} bank{request.approvals.length > 1 ? "s have" : " has"} already accepted this request
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Glow effect for "sage" requests */}
                  {request.requester === "sage" && (
                    <div className="absolute inset-0 animate-pulse">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl opacity-50"></div>
                    </div>
                  )}
                  
                  {/* Verified badge for "sage" */}
                  {request.requester === "sage" && (
                    <div className="absolute -right-3 -top-3 z-10">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg shadow-purple-500/30">
                        <BadgeCheck className="h-4 w-4 text-white mr-1" />
                        <span>Sage Verified</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 relative z-2">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-sm text-gray-400">{request.purpose}</span>
                        <h3 className="text-xl font-bold text-white flex items-center">
                          ₹{request.amount.toLocaleString('en-IN')}
                          {request.requester === "sage" && (
                            <Sparkles className="h-4 w-4 ml-2 text-purple-400" />
                          )}
                        </h3>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.requester === "sage" 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                          : "bg-gray-800 text-gray-300"
                      }`}>
                        {request.interestRate}% Interest
                      </div>
                    </div>
                    
                    <div className="mt-2 mb-4">
                      <p className="text-gray-300">{request.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="bg-gray-800/60 text-gray-300 text-xs rounded-full px-3 py-1 flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {request.duration} months
                      </div>
                      <div className="bg-gray-800/60 text-gray-300 text-xs rounded-full px-3 py-1">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          request.requester === "sage" 
                            ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                            : "bg-gray-700"
                        }`}>
                          {request.userName.charAt(0)}
                        </div>
                        <span className="ml-2 text-gray-300 text-sm">{request.userName}</span>
                      </div>
                      
                      {userType === "bank" && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleApprove(request.id)}
                            className="bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm rounded-full px-4 py-1.5 flex items-center shadow-md shadow-green-500/20"
                          >
                            Approve
                            <Check className="h-4 w-4 ml-1" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => fetchUserDetails(request.userId)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-full px-4 py-1.5 flex items-center shadow-md shadow-purple-500/20"
                          >
                            Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl shadow-purple-500/10 p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <User className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-gray-300 text-sm">Name</p>
                  <p className="text-white font-medium">{selectedUserDetails?.name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <p className="text-white font-medium">{selectedUserDetails?.email || "N/A"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>

  );
};

export default LoanMarketplace;