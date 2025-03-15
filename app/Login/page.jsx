"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowRightCircle,
  ChevronLeft,
  ChevronRight,
  Building,
  User,
  Lock,
  Mail,
  Calendar,
  Building2,
  LogIn,
  Fingerprint,
  UserCheck,
  Shield,
  CheckCircle,
  Star,
  HeartHandshake,
  TrendingUp,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { app } from "@/firebase";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const googleProvider = new GoogleAuthProvider();

  const [isVisible, setIsVisible] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [userType, setUserType] = useState(null);
  const [showUserTypeSelect, setShowUserTypeSelect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: 25,
  });

  const [bankData, setBankData] = useState({
    institutionName: "",
    registrationNumber: "",
    contactEmail: "",
    contactPhone: "",
    bankDescription: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBack = () => {
    if (formStep > 0) {
      setFormStep((prevStep) => prevStep - 1);
    } else if (showUserTypeSelect) {
      setShowUserTypeSelect(false);
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setShowUserTypeSelect(false);
    setFormStep(0);
  };

  const updateUserData = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const updateBankData = (field, value) => {
    setBankData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user is new
      if (result._tokenResponse.isNewUser) {
        setShowUserTypeSelect(true); // Show account type selection for new users
      } else {
        toast({
          title: "Google Login Successful",
          description: "Welcome to LoanSage!",
        });
        router.push("/"); // Redirect to home page
      }
    } catch (error) {
      console.error("Google login error:", error.message);
      setError(error.message);
      toast({
        title: "Google Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration
  const handleUserRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: userData.name,
        email: user.email,
        age: userData.age,
        userType: "user",
        createdAt: new Date().toISOString(),
      });

      console.log("User registered successfully");
      toast({
        title: "Registration Successful",
        description: "Your user account has been created!",
      });
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Registration error:", error.message);
      setError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bank registration
  const handleBankRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;

      // Store bank data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        institutionName: bankData.institutionName,
        registrationNumber: bankData.registrationNumber,
        contactEmail: bankData.contactEmail,
        contactPhone: bankData.contactPhone,
        bankDescription: bankData.bankDescription,
        userType: "bank",
        createdAt: new Date().toISOString(),
      });

      console.log("Bank registered successfully");
      toast({
        title: "Registration Successful",
        description: "Your banking institution has been registered!",
      });
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Bank registration error:", error.message);
      setError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userProgressPercentage = formStep === 0 ? 50 : 100;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black mt-10">
      {/* Enhanced Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
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
        <motion.div
          initial={{ opacity: 0, x: -50, y: 200 }}
          animate={{ opacity: 0.15, x: 0, y: 0 }}
          transition={{ duration: 2, delay: 0.9 }}
          className="absolute bottom-40 left-20 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl"
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      {/* Content container */}
      <div className="container relative z-10 mx-auto flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Main Content Area - Two Column Layout */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:items-start">
          {/* Information Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full md:w-1/2 md:sticky md:top-20"
          >
            <div className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-3">Simplify Your Loan Journey</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mb-5"></div>
                <p className="text-gray-300 mb-6">
                  LoanSage uses advanced algorithms to match you with the perfect loan options tailored to your needs and financial profile.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Search className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Smart Matching</h3>
                    <p className="text-gray-400 text-sm mt-1">Our AI analyzes thousands of loan products to find your perfect match.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.7 }}
                  className="flex items-start space-x-4"
                >
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Pre-Approval Insights</h3>
                    <p className="text-gray-400 text-sm mt-1">Get instant pre-approval probability before applying.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.9 }}
                  className="flex items-start space-x-4"
                >
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Financial Insights</h3>
                    <p className="text-gray-400 text-sm mt-1">Track your loan progress and get personalized financial advice.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center">
                    <HeartHandshake className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Direct Lender Connections</h3>
                    <p className="text-gray-400 text-sm mt-1">Connect directly with reputable lenders for transparent terms.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Auth Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <div className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden">
              <AnimatePresence mode="wait">
                {showUserTypeSelect ? (
                  <motion.div
                    key="user-type-select"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="mb-6">
                      <button
                        onClick={handleBack}
                        className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span>Back</span>
                      </button>
                      <h2 className="text-2xl font-bold text-white mb-3">Select Account Type</h2>
                      <p className="text-gray-400 mb-6">Choose an account type to continue registration</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="border border-blue-600/30 rounded-xl p-6 cursor-pointer bg-gradient-to-br from-blue-900/20 to-blue-800/10 hover:from-blue-800/30 hover:to-blue-700/20 transition-all"
                        onClick={() => handleUserTypeSelect("user")}
                      >
                        <div className="w-14 h-14 mb-4 rounded-full bg-blue-600/20 flex items-center justify-center">
                          <User className="h-8 w-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Individual User</h3>
                        <p className="text-gray-400 mb-4">Access personalized loan recommendations, check eligibility, and track applications.</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-400">10+ features</span>
                          <ChevronRight className="h-4 w-4 text-blue-400" />
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="border border-purple-600/30 rounded-xl p-6 cursor-pointer bg-gradient-to-br from-purple-900/20 to-purple-800/10 hover:from-purple-800/30 hover:to-purple-700/20 transition-all"
                        onClick={() => handleUserTypeSelect("bank")}
                      >
                        <div className="w-14 h-14 mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                          <Building className="h-8 w-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Banking Partner</h3>
                        <p className="text-gray-400 mb-4">Manage loan offerings, view applicant profiles, and process loan applications efficiently.</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-purple-400">8+ features</span>
                          <ChevronRight className="h-4 w-4 text-purple-400" />
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : userType === null ? (
                  <motion.div
                    key="auth-tabs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 md:p-8"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4 py-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                LoanSage
                            </span>
                        </h2>
                        <p className="text-gray-400">Sign in to access personalized loan recommendations</p>
                      </div>

                      <div className="w-full max-w-sm">
                        <Button
                          type="button"
                          onClick={handleGoogleLogin}
                          variant="outline"
                          className="w-full border-gray-800 bg-transparent hover:bg-white hover:text-black text-white py-6"
                        >
                          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                            ></path>
                          </svg>
                          Continue with Google
                        </Button>
                      </div>

                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">By signing in, you agree to our</p>
                        <p className="text-sm text-gray-400">
                          <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : userType === "user" ? (
                  <motion.div
                    key={`user-form-${formStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 md:p-8"
                  >
                    <div className="mb-6">
                      <button
                        onClick={handleBack}
                        className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span>Back</span>
                      </button>

                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
                          <span className="text-sm text-blue-400">Step {formStep + 1} of 2</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-700 h-1.5 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${userProgressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {formStep === 0 ? (
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm text-gray-300">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              type="text"
                              placeholder="Enter your full name"
                              className="pl-10 bg-gray-950 border-gray-800 text-white"
                              value={userData.name}
                              onChange={(e) => updateUserData("name", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-sm text-gray-300">Age</Label>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">{userData.age} years</span>
                          </div>
                          <Slider
                            id="age"
                            min={18}
                            max={100}
                            step={1}
                            value={[userData.age]}
                            onValueChange={(values) => updateUserData("age", values[0])}
                            className="my-2"
                          />
                        </div>

                        <Button
                          type="button"
                          onClick={() => setFormStep(1)}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          <span>Continue</span>
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleUserRegistration} className="space-y-4">
                        <div className="p-4 border border-gray-800 rounded-lg mb-4 bg-gray-900/50">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                              <UserCheck className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">Account Details</h3>
                              <p className="text-gray-400 text-sm">Review your information before creating account</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Name</span>
                              <span className="text-white">{userData.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Age</span>
                              <span className="text-white">{userData.age} years</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="terms"
                              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                              required
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                              I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and{" "}
                              <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                            </label>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              <span>Creating account...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Fingerprint className="h-4 w-4 mr-2" />
                              <span>Create Account</span>
                            </div>
                          )}
                        </Button>
                      </form>
                    )}
                  </motion.div>
                ) : userType === "bank" && (
                  <motion.div
                    key="bank-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 md:p-8"
                  >
                    <div className="mb-6">
                      <button
                        onClick={handleBack}
                        className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        <span>Back</span>
                      </button>

                      <h2 className="text-2xl font-bold text-white mb-2">Register Banking Institution</h2>
                      <p className="text-gray-400">Provide your banking institution's details to join our platform</p>
                    </div>

                    <form onSubmit={handleBankRegistration} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="institutionName" className="text-sm text-gray-300">Institution Name</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="institutionName"
                              type="text"
                              placeholder="Enter institution name"
                              className="pl-10 bg-gray-950 border-gray-800 text-white"
                              value={bankData.institutionName}
                              onChange={(e) => updateBankData("institutionName", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber" className="text-sm text-gray-300">Registration Number</Label>
                          <div className="relative">
                            <Fingerprint className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="registrationNumber"
                              type="text"
                              placeholder="Enter registration number"
                              className="pl-10 bg-gray-950 border-gray-800 text-white"
                              value={bankData.registrationNumber}
                              onChange={(e) => updateBankData("registrationNumber", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail" className="text-sm text-gray-300">Contact Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="contactEmail"
                              type="email"
                              placeholder="Enter contact email"
                              className="pl-10 bg-gray-950 border-gray-800 text-white"
                              value={bankData.contactEmail}
                              onChange={(e) => updateBankData("contactEmail", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contactPhone" className="text-sm text-gray-300">Contact Phone</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="contactPhone"
                              type="tel"
                              placeholder="Enter contact phone"
                              className="pl-10 bg-gray-950 border-gray-800 text-white"
                              value={bankData.contactPhone}
                              onChange={(e) => updateBankData("contactPhone", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankDescription" className="text-sm text-gray-300">Bank Description</Label>
                        <textarea
                          id="bankDescription"
                          rows={3}
                          placeholder="Brief description of your banking institution"
                          className="w-full px-3 py-2 text-white bg-gray-950 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          value={bankData.bankDescription}
                          onChange={(e) => updateBankData("bankDescription", e.target.value)}
                          required
                        />
                      </div>

                      <div className="p-4 border border-gray-800 rounded-lg bg-gray-900/50">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-purple-400 mr-3" />
                          <div>
                            <h4 className="text-white font-medium">Security Verification Required</h4>
                            <p className="text-sm text-gray-400">Your institution will undergo verification before activation</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-purple-500"
                            required
                          />
                          <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                            I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and{" "}
                            <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                          </label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span>Registering institution...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Building className="h-4 w-4 mr-2" />
                            <span>Register Institution</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;