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
  X
} from "lucide-react";
import { db, auth } from "@/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loanData, setLoanData] = useState([]);
  const [formData, setFormData] = useState({
    loanType: "",
    minAmount: "",
    maxAmount: "",
    interestRate: "",
    tenure: "",
    description: ""
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    setIsVisible(true);
    if (user) {
      fetchUserData();
      fetchLoans();
    }
  }, [user]);

  const fetchUserData = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserType(docSnap.data().userType);
      setUserData(docSnap.data());
    }
  };

  const fetchLoans = async () => {
    let q;
    if (userType === "bank") {
      q = query(collection(db, "loans"), where("bankId", "==", user.uid));
    } else {
      q = query(collection(db, "loanRequests"), where("userId", "==", user.uid));
    }
    
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setLoanData(data);
  };

  const handleSubmitLoan = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "loans"), {
        ...formData,
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

  const stats = [
    { 
      title: userType === "bank" ? "Total Loans Offered" : "Active Requests",
      value: loanData.length,
      icon: <Wallet className="h-6 w-6" />,
      color: "bg-purple-500"
    },
    {
      title: userType === "bank" ? "Total Amount Lent" : "Total Requested",
      value: `₹${loanData.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}`,
      icon: <IndianRupee className="h-6 w-6" />,
      color: "bg-blue-500"
    },
    {
      title: userType === "bank" ? "Avg. Interest Rate" : "Avg. Interest Offered",
      value: `${(loanData.reduce((acc, curr) => acc + curr.interestRate, 0) / loanData.length || 0).toFixed(1)}%`,
      icon: <LineChart className="h-6 w-6" />,
      color: "bg-green-500"
    }
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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          className="flex flex-col md:flex-row justify-between items-start mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome Back, {userData?.name || "User"}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ml-2">
                👋
              </span>
            </h1>
            <p className="text-gray-400">
              {userType === "bank" 
                ? "Manage your loan offers and track performance" 
                : "Track your loan requests and discover new offers"}
            </p>
          </div>
          
          {userType === "bank" && (
            <motion.div whileHover={{ scale: 1.05 }} className="mt-4 md:mt-0">
              <Button 
                onClick={() => setShowLoanForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-6 rounded-full"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Loan Offer
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-6"
            >
              <div className="flex justify-between items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1 bg-gray-800 rounded-full">
                  <div 
                    className={`h-1 rounded-full ${stat.color}`} 
                    style={{ width: `${Math.min(100, (index + 1) * 33)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loan Form Modal */}
        {showLoanForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create Loan Offer</h2>
                <button 
                  onClick={() => setShowLoanForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitLoan} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Loan Type</label>
                  <select
                    required
                    className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3"
                    value={formData.loanType}
                    onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                  >
                    <option value="">Select Loan Type</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Business Loan">Business Loan</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Min Amount</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Max Amount</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3"
                      value={formData.maxAmount}
                      onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Tenure (months)</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3"
                      value={formData.tenure}
                      onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    className="w-full bg-gray-800/70 text-white rounded-lg border border-gray-700 p-3 h-24"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-full"
                >
                  Create Loan Offer
                </Button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Loan Listings */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-gray-800 rounded-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white">
              {userType === "bank" ? "Your Loan Offers" : "Your Loan Requests"}
            </h3>
          </div>
          
          <div className="divide-y divide-gray-800">
            {loanData.map((loan, index) => (
              <motion.div 
                key={loan.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-900/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${userType === "bank" ? "bg-blue-500/20" : "bg-purple-500/20"}`}>
                        <CreditCard className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{loan.loanType || loan.purpose}</h4>
                        <p className="text-gray-400 text-sm">
                          {userType === "bank" 
                            ? `₹${loan.minAmount} - ₹${loan.maxAmount}`
                            : `₹${loan.amount.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">
                      {loan.interestRate}%
                    </p>
                    <p className="text-sm text-gray-400">
                      {loan.tenure || loan.duration} months
                    </p>
                  </div>
                </div>
                
                {loan.description && (
                  <p className="mt-4 text-gray-300 text-sm">{loan.description}</p>
                )}
                
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">
                      {new Date(loan.createdAt?.toDate()).toLocaleDateString()}
                    </span>
                  </div>
                  {loan.status && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      loan.status === "approved" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {loan.status}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;