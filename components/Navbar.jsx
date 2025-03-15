"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Home, 
  ShoppingBag, 
  Menu, 
  X, 
  LogIn, 
  UserCircle, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  Globe,
  CreditCard,
  ArrowRightCircle, 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import SageButton from "@/components/Sage";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const languageOptions = [
  { code: "en-IN", name: "English", flag: "🇮🇳" },
  { code: "hi-IN", name: "हिन्दी", flag: "🇮🇳" },
  { code: "bn-IN", name: "বাংলা", flag: "🇮🇳" },
  { code: "gu-IN", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn-IN", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml-IN", name: "മലയാളം", flag: "🇮🇳" },
  { code: "mr-IN", name: "मराठी", flag: "🇮🇳" },
  { code: "od-IN", name: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "pa-IN", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ta-IN", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te-IN", name: "తెలుగు", flag: "🇮🇳" },
];

const Logo = ({ showLogo }) => (
  <Link href="/">
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex items-center space-x-3"
    >
      <motion.div 
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.5 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg relative overflow-hidden shadow-xl"
      >
        <CreditCard className="h-6 w-6 text-white relative z-10" />
        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
        <motion.div 
          animate={{ 
            background: ['linear-gradient(45deg, #4f46e5, #7e22ce)', 'linear-gradient(225deg, #7e22ce, #4f46e5)'],
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0"
        />
      </motion.div>
      <motion.span 
        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLogo ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        LoanSage
      </motion.span>
    </motion.div>
  </Link>
);

const NavItem = ({ icon: Icon, text, href, onClick }) => (
  <Link 
    href={href || "#"} 
    className="group relative flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
    onClick={onClick}
  >
    <Icon className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
    <span>{text}</span>
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
  </Link>
);

const MobileNavItem = ({ icon: Icon, text, href, onClick, delay = 0 }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: delay }}
  >
    <Link 
      href={href} 
      className="block py-2.5 px-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/70 transition-colors flex items-center space-x-3"
      onClick={onClick}
    >
      <div className="bg-gray-800/50 p-2 rounded-md">
        <Icon className="h-4 w-4 text-blue-400" />
      </div>
      <span className="font-medium">{text}</span>
    </Link>
  </motion.div>
);

const DesktopSkeleton = () => (
  <>
    <div className="hidden md:flex items-center space-x-8">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
    <div className="hidden md:flex items-center space-x-4">
      <Skeleton className="h-10 w-32 rounded-md" />
      <Skeleton className="h-10 w-28 rounded-full" />
    </div>
  </>
);

const MobileSkeleton = () => (
  <div className="px-6 py-4 space-y-4">
    {[1, 2, 3, 4].map((item) => (
      <div key={item} className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-6 w-28" />
      </div>
    ))}
    <div className="border-t border-gray-800 my-3"></div>
    <Skeleton className="h-20 w-full rounded-lg" />
    <div className="grid grid-cols-2 gap-2 mb-3">
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="h-16 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-48 rounded-md mb-2" />
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Skeleton key={item} className="h-14 rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-12 w-full rounded-lg mt-4" />
  </div>
);

const LanguageSelector = ({ selectedLanguage, changeLanguage, className }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className={`flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-1 rounded-md transition-colors border border-transparent hover:border-gray-700 focus:outline-none ${className}`}>
      <span className="text-lg mr-1">{selectedLanguage.flag}</span>
      <span>{selectedLanguage.name}</span>
      <ChevronDown className="h-4 w-4 opacity-70" />
    </DropdownMenuTrigger>
    <DropdownMenuContent className="bg-gray-900 border border-gray-800 text-white rounded-md shadow-xl shadow-purple-900/20 p-1 min-w-[180px]">
      <DropdownMenuLabel className="text-gray-400 text-xs px-2 py-1">Select Language For ChatBot</DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-gray-700 my-1" />
      <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
        {languageOptions.map((language) => (
          <DropdownMenuItem 
            key={language.code} 
            className={`flex items-center space-x-2 hover:bg-gray-800 rounded-md cursor-pointer px-3 py-2 ${selectedLanguage.code === language.code ? 'bg-gray-800 text-blue-400' : ''}`}
            onClick={() => changeLanguage(language)}
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {selectedLanguage.code === language.code && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-auto"
              />
            )}
          </DropdownMenuItem>
        ))}
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);

const UserProfile = ({ user, userType, logout, isMobile = false, onMenuClose }) => {
  const handleLogout = async () => {
    try {
      await logout();
      if (onMenuClose) onMenuClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isMobile) {
    return (
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="border-t border-gray-800 my-3"></div>
        <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg mb-3 border border-gray-800">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2 shadow-lg shadow-purple-500/10">
            <UserCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-white font-medium">{user.displayName || "User"}</div>
            <div className="text-xs text-gray-400">{userType || "User"}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Link 
            href="/dashboard" 
            className="flex flex-col items-center justify-center py-3 px-2 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            onClick={onMenuClose}
          >
            <LayoutDashboard className="h-5 w-5 mb-1 text-blue-400" />
            <span className="text-sm">Dashboard</span>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-3 text-center bg-red-900/20 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300 transition-colors border border-red-900/30"
        >
          <div className="flex items-center justify-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </div>
        </button>
      </motion.div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-white px-3 py-1.5 rounded-full shadow-md shadow-purple-500/10 border border-blue-500/20 focus:outline-none"
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-1 mr-1">
            <UserCircle className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">{user.displayName || "User"}</span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900 border border-gray-800 text-white rounded-md shadow-xl shadow-purple-900/20">
        <DropdownMenuLabel className="flex items-center space-x-2 px-3 py-2">
          <UserCircle className="h-4 w-4 text-blue-400" />
          <div>
            <p className="font-medium text-sm">{user.displayName || "User"}</p>
            <p className="text-xs text-gray-400">{userType || "User"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem className="hover:bg-gray-800 rounded-md cursor-pointer" asChild>
          <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-2 w-full">
            <LayoutDashboard className="h-4 w-4 text-gray-400" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          className="hover:bg-gray-800 text-red-400 hover:text-red-300 rounded-md cursor-pointer px-3 py-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LoginButton = ({ isMobile = false, onMenuClose }) => {
  if (isMobile) {
    return (
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="pt-4"
      >
        <div className="border-t border-gray-800 mb-4"></div>
        <Link href="/Login" onClick={onMenuClose}>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/20">
            <LogIn className="h-5 w-5" />
            <span>Login to Your Account</span>
            <ArrowRightCircle className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <Link href="/Login">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 rounded-full flex items-center space-x-2 shadow-lg shadow-purple-500/20 relative overflow-hidden group">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
          <LogIn className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          <span>Login</span>
          <ArrowRightCircle className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </Link>
  );
};

const MobileLanguageSelector = ({ selectedLanguage, changeLanguage }) => (
  <motion.div
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="pt-3"
  >
    <div className="border-t border-gray-800 mb-3"></div>
    <div className="text-gray-400 text-sm mb-2 flex items-center px-1">
      <Globe className="h-4 w-4 mr-2" />
      Select Chatbot Language
    </div>
    <div className="grid grid-cols-3 gap-2">
      {languageOptions.slice(0, 6).map((language) => (
        <button
          key={language.code}
          onClick={() => changeLanguage(language)}
          className={`flex flex-col items-center space-y-1 p-2 rounded-lg text-sm ${
            selectedLanguage.code === language.code 
              ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 text-blue-400 border border-blue-500/20' 
              : 'text-gray-300 hover:bg-gray-800/50'
          }`}
        >
          <span className="text-xl">{language.flag}</span>
          <span className="text-xs">{language.name}</span>
        </button>
      ))}
    </div>
  </motion.div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, userType, logout, loading } = useAuth();

  useEffect(() => {
    const fetchUserLanguage = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().lang) {
          const userLang = languageOptions.find((lang) => lang.code === userDoc.data().lang);
          if (userLang) {
            setSelectedLanguage(userLang);
          }
        }
      }
    };

    fetchUserLanguage();
  }, [user]);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 400);
    
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(loadingTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const changeLanguage = async (language) => {
    setSelectedLanguage(language);
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, { lang: language.code });
      } else {
        await setDoc(userRef, { lang: language.code });
      }
    }
  };

  const navItems = [
    { icon: Home, text: "Home", href: "/" },
    { icon: ShoppingBag, text: "Marketplace", href: "/Marketplace" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg shadow-purple-900/10' : 'bg-black'}`}>
      <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400"></div>
      <div className="relative py-4 px-6 flex items-center justify-between">
        <Logo showLogo={showLogo} />
        {isLoading || loading ? (
          <DesktopSkeleton />
        ) : (
          <>
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavItem 
                  key={item.text} 
                  icon={item.icon} 
                  text={item.text} 
                  href={item.href}
                />
              ))}
              <SageButton />
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector 
                selectedLanguage={selectedLanguage} 
                changeLanguage={changeLanguage}
              />
              {user ? (
                <UserProfile user={user} userType={userType} logout={logout} />
              ) : (
                <LoginButton />
              )}
            </div>
          </>
        )}
        <motion.button 
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 fixed left-0 right-0 overflow-y-auto max-h-[calc(100vh-80px)] shadow-lg shadow-purple-900/20"
          >
            {isLoading || loading ? (
              <MobileSkeleton />
            ) : (
              <div className="px-6 py-4 space-y-3">
                {navItems.map((item, index) => (
                  <MobileNavItem
                    key={item.text}
                    icon={item.icon}
                    text={item.text}
                    href={item.href}
                    onClick={closeMenu}
                    delay={index * 0.05}
                  />
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="py-2"
                >
                  <SageButton />
                </motion.div>
                {user ? (
                  <UserProfile 
                    user={user} 
                    userType={userType} 
                    logout={logout} 
                    isMobile={true}
                    onMenuClose={closeMenu}
                  />
                ) : (
                  <LoginButton isMobile={true} onMenuClose={closeMenu} />
                )}
                <MobileLanguageSelector 
                  selectedLanguage={selectedLanguage}
                  changeLanguage={changeLanguage}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;