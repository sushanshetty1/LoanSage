"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRightCircle,
  BadgeCheck,
  BarChart,
  CalendarDays,
  Check,
  CreditCard,
  DollarSign,
  FileText,
  Globe,
  IndianRupee,
  LineChart,
  Loader,
  Mail,
  PieChart,
  PlusCircle,
  Shield,
  Sparkles,
  User,
  Wallet,
  X,
  TrendingUp,
  Clock,
  Award,
  Zap,
} from "lucide-react";
import { db, auth } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    loanType: "",
    minAmount: "",
    maxAmount: "",
    interestRate: "",
    tenure: "",
    description: "",
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    setIsVisible(true);
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (user && userType) {
      fetchLoans();
    }
  }, [user, userType]);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserType(docSnap.data().userType);
        setUserData(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchLoans = async () => {
    setLoading(true);
    try {
      let q;
      if (userType === "bank") {
        q = query(collection(db, "loanRequests"));
      } else {
        q = query(collection(db, "loanRequests"), where("userId", "==", user.uid));
      }
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setLoanData(data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (loanId, status) => {
    try {
      const approvalData = {
        bankId: user.uid,
        bankName: userData?.bankName || "Our Bank",
        status: status,
        approvedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, "loanRequests", loanId), {
        approvals: arrayUnion(approvalData),
      });

      fetchLoans();
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (user && userType) {
      fetchLoans();
    }
  }, [user, userType]);
  
  const handleSubmitLoan = async (e) => {
    e.preventDefault();
    try {
      // Convert numeric fields to numbers
      const numericFormData = {
        ...formData,
        minAmount: Number(formData.minAmount),
        maxAmount: Number(formData.maxAmount),
        interestRate: Number(formData.interestRate),
        tenure: Number(formData.tenure)
      };
      
      await addDoc(collection(db, "loans"), {
        ...numericFormData,
        bankId: user.uid,
        bankName: userData?.bankName || "Our Bank",
        createdAt: new Date()
      });
      setShowLoanForm(false);
      fetchLoans();
    } catch (error) {
      console.error("Error adding loan:", error);
    }
  };

  // Calculate stats correctly using numeric values
  const calculateTotalAmount = () => {
    if (loanData.length === 0) return 0;
    
    if (userType === "bank") {
      // For banks, calculate the sum of average loan amounts
      return loanData.reduce((acc, loan) => {
        // Only use loans with valid min and max amounts
        if (typeof loan.minAmount === 'number' && typeof loan.maxAmount === 'number') {
          const avgAmount = (loan.minAmount + loan.maxAmount) / 2;
          return acc + avgAmount;
        }
        // If this is a loan request with a fixed amount
        if (typeof loan.amount === 'number') {
          return acc + loan.amount;
        }
        return acc;
      }, 0);
    } else {
      // For users, sum all loan request amounts
      return loanData.reduce((acc, loan) => {
        return acc + (typeof loan.amount === 'number' ? loan.amount : 0);
      }, 0);
    }
  };

  const calculateAvgInterestRate = () => {
    if (loanData.length === 0) return 0;
    
    let validLoans = 0;
    const totalRate = loanData.reduce((acc, loan) => {
      // Only consider loans with valid interest rates
      const rate = Number(loan.interestRate);
      if (!isNaN(rate) && rate > 0) {
        validLoans++;
        return acc + rate;
      }
      return acc;
    }, 0);
    
    return validLoans > 0 ? (totalRate / validLoans).toFixed(2) : "0.00";
  };

  const stats = [
    { 
      title: userType === "bank" ? "Total Loans Offered" : "Active Requests",
      value: loanData.length,
      icon: <Wallet className="h-6 w-6" />,
      color: "bg-purple-500"
    },
    {
      title: userType === "bank" ? "Total Amount Potential" : "Total Requested",
      value: `₹${calculateTotalAmount().toLocaleString()}`,
      icon: <IndianRupee className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      title: userType === "bank" ? "Avg. Interest Rate" : "Avg. Interest Offered",
      value: `${calculateAvgInterestRate()}%`,
      icon: <LineChart className="h-6 w-6" />,
      color: "bg-green-500"
    }
  ];
  

  // Market insights for the enhanced UI
  const marketInsights = [
    {
      icon: <TrendingUp className="h-6 w-6 text-blue-400" />,
      title: "Market Trend",
      content: "Personal loan interest rates have decreased by 0.5% this month, making it an ideal time for refinancing."
    },
    {
      icon: <Award className="h-6 w-6 text-amber-400" />,
      title: "Best Rate Available",
      content: "Current best home loan rate is 8.1% offered by HDFC Bank for 20-year tenure."
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-400" />,
      title: "Processing Time",
      content: "Average loan approval time has improved to 3 business days compared to 7 days last quarter."
    }
  ];

  // Quick tips based on user type
  const quickTips = userType === "bank" ? [
    "Offer competitive interest rates to attract more loan applicants",
    "Clearly outline your eligibility criteria to reduce application rejections",
    "Consider flexible repayment options to differentiate your loan products"
  ] : [
    "Compare multiple loan offers before making a decision",
    "Check for hidden fees and prepayment penalties",
    "Maintain a good credit score to qualify for better interest rates"
  ];

  return (
    <div className="relative pt-24 pb-16 overflow-hidden bg-black min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.3, x: 0 }}
          className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.2, x: 0 }}
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 0.25, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/4 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Greeting Header with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          className="flex flex-col md:flex-row justify-between items-start mb-8"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-4 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-3"
            >
              {userType === "bank" ? "Bank Dashboard" : "Borrower Dashboard"}
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center">
              Welcome Back, <span className="bg-gradient-to-r from-blue-400 to-purple-500 ml-2 bg-clip-text text-transparent">{userData?.name || "User"}</span>
              <motion.span 
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                transition={{ delay: 0.5, duration: 1.5, repeat: 0 }}
                className="ml-2"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-gray-400 md:text-lg max-w-2xl">
              {userType === "bank" 
                ? "Manage your loan portfolio, track performance metrics, and create attractive loan offers for potential borrowers." 
                : "Discover personalized loan options, track your applications, and manage your financial journey with our intelligent loan matching system."}
            </p>
          </div>
          
          {userType === "bank" && (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="mt-6 md:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                onClick={() => setShowLoanForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-6 rounded-full shadow-lg shadow-blue-700/20"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Loan Offer
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Financial Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900/80 to-gray-900/30 border border-gray-800 rounded-2xl p-6 mb-8 backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl text-white font-bold flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-400" />
              Financial Overview
            </h2>
            <span className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl p-5"
              >
                <div className="flex justify-between items-center">
                  <div className={`${stat.color} bg-opacity-20 p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-1 bg-gray-800/70 rounded-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (index + 1) * 33)}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className={`h-1 rounded-full ${stat.color}`} 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {marketInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-gray-900/40 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-start mb-3">
                <div className="p-2 rounded-lg bg-gray-800/50 mr-3">
                  {insight.icon}
                </div>
                <div>
                  <h3 className="text-white font-medium">{insight.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{insight.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loan Form Modal */}
        {showLoanForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-xl shadow-purple-900/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-400" />
                  Create Loan Offer
                </h2>
                <button 
                  onClick={() => setShowLoanForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitLoan} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Loan Type</label>
                  <select
                    required
                    className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3 focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition"
                    value={formData.loanType}
                    onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                  >
                    <option value="">Select Loan Type</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Education Loan">Education Loan</option>
                    <option value="Vehicle Loan">Vehicle Loan</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Min Amount (₹)</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3 focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Max Amount (₹)</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3 focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition"
                      value={formData.maxAmount}
                      onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3 focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Tenure (months)</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3 focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition"
                      value={formData.tenure}
                      onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Description</label>
                  <textarea
                    className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3 h-24 focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your loan offering, eligibility requirements, and any special features..."
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-full shadow-lg shadow-blue-700/20 transition-all"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create Loan Offer
                </Button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Quick Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <Zap className="h-5 w-5 text-yellow-400 mr-2" />
            <h2 className="text-xl text-white font-bold">Quick Tips</h2>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border border-yellow-800/30 rounded-xl p-6">
            <ul className="space-y-3">
              {quickTips.map((tip, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start"
                >
                  <Check className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

       {/* Loan Listings */}
       <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-400" />
            {userType === "bank" ? "Loan Requests" : "Your Loan Applications"}
          </h3>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        ) : loanData.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400">No loan records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {loanData.map((loan) => (
              <div key={loan.id} className="p-6 hover:bg-gray-900/20 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h4 className="text-white font-medium text-lg">{loan.purpose}</h4>
                    <p className="text-gray-400 text-sm">
                      <IndianRupee className="h-4 w-4 mr-1 inline" />
                      {loan.amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Approval status */}
                  <div className="flex items-center space-x-6">
                    {loan.approvals && loan.approvals.length > 0 && (
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">Approvals</p>
                        <p className="text-lg font-bold text-emerald-400">
                          {loan.approvals.filter((a) => a.status === "approved").length} / {loan.approvals.length}
                        </p>
                      </div>
                    )}

                    {userType === "bank" && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveReject(loan.id, "approved")}
                          className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-full"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleApproveReject(loan.id, "rejected")}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-full"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Approval details */}
                {loan.approvals && loan.approvals.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm mb-2">Approval Details:</p>
                    <div className="space-y-2">
                      {loan.approvals.map((approval, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            approval.status === "approved" ? "bg-green-500" : "bg-red-500"
                          }`} />
                          <p className="text-gray-300 text-sm">
                            {approval.bankName} - {approval.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Dashboard;