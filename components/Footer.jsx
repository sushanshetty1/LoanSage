"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  CreditCard,
  ArrowUp,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  Shield,
  HelpCircle,
  FileText,
  Lock,
  Globe,
  Award,
  ThumbsUp,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Show/hide scroll to top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const FooterLink = ({ href, children }) => (
    <Link
      href={href}
      className="text-gray-400 hover:text-white transition-colors relative group"
    >
      <span className="group-hover:text-blue-400">{children}</span>
      <span className="absolute left-0 bottom-0 w-0 h-px bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );

  const FooterHeading = ({ children }) => (
    <h4 className="text-white font-semibold mb-4 text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
      {children}
    </h4>
  );

  return (
    <footer className="bg-gray-950 relative overflow-hidden mt-auto">
      {/* Top wavy border */}
      <div className="h-6 w-full bg-gray-950 relative">
        <svg
          className="absolute bottom-0 left-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C240,48 480,48 720,24 C960,0 1200,0 1440,24 L1440,48 L0,48 Z"
            fill="#030712"
          />
        </svg>
      </div>

      {/* Animated orbs for background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="relative w-full h-full">
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-blue-600/5 blur-3xl"
            animate={{
              x: ["-20%", "30%", "-10%"],
              y: ["10%", "40%", "20%"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 25,
            }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-purple-600/5 blur-3xl"
            animate={{
              x: ["60%", "20%", "40%"],
              y: ["0%", "30%", "50%"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 30,
            }}
          />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                LoanSage
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Empowering financial decisions through AI-driven loan advice in
              10 languages. We're revolutionizing how the world accesses and
              manages loans.
            </p>

            <div className="flex items-center space-x-4">
              {[
                { icon: Twitter, color: "text-blue-400" },
                { icon: Linkedin, color: "text-blue-500" },
                { icon: Facebook, color: "text-blue-600" },
                { icon: Instagram, color: "text-pink-500" },
                { icon: Youtube, color: "text-red-500" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <social.icon size={18} className={social.color} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FooterHeading>Company</FooterHeading>
            <ul className="space-y-3">
              <li>
                <FooterLink href="/AboutUs">About Us</FooterLink>
              </li>
              <li>
                <FooterLink href="/News">News</FooterLink>
              </li>
              <li>
                <FooterLink href="/Contact">Contact</FooterLink>
              </li>
            </ul>
          </div>

          {/* Products Links */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FooterHeading>Products</FooterHeading>
            <ul className="space-y-3">
              <li>
                <FooterLink href="/PersonalLoans">Personal Loans</FooterLink>
              </li>
              <li>
                <FooterLink href="/BusinessLoans">Business Loans</FooterLink>
              </li>
              <li>
                <FooterLink href="/Mortgage">Mortgage</FooterLink>
              </li>
              <li>
                <FooterLink href="/CreditScore">Credit Score</FooterLink>
              </li>
              <li>
                <FooterLink href="/FinancialTools">Financial Tools</FooterLink>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
            <FooterHeading>Resources</FooterHeading>
            <ul className="space-y-3">
              <li>
                <FooterLink href="/Guides">Guides</FooterLink>
              </li>
              <li>
                <FooterLink href="/Calculators">Calculators</FooterLink>
              </li>
              <li>
                <FooterLink href="/LoanGlossary">Loan Glossary</FooterLink>
              </li>
              <li>
                <FooterLink href="/HelpCenter">Help Center</FooterLink>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <FooterHeading>Stay Updated</FooterHeading>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-500 bg-green-500/10 p-3 rounded-md"
              >
                Thanks for subscribing! 🎉
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <p className="text-gray-400 text-sm">
                  Get financial tips and loan news in your inbox.
                </p>
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="bg-gray-900 border-gray-800 focus:border-blue-500 text-gray-300 rounded-l-md w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-r-md"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <p className="text-gray-500 text-xs">
                  We'll never share your email. You can unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Section with Links */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-4 sm:gap-x-4">
              <FooterLink href="/Privacy">
                <Lock size={14} className="inline mr-1" /> Privacy
              </FooterLink>
              <FooterLink href="/Terms">
                <FileText size={14} className="inline mr-1" /> Terms
              </FooterLink>
              <FooterLink href="/Security">
                <Shield size={14} className="inline mr-1" /> Security
              </FooterLink>
              <FooterLink href="/SiteMap">
                <Globe size={14} className="inline mr-1" /> Sitemap
              </FooterLink>
            </div>

            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} LoanSage. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed z-50 right-6 bottom-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg shadow-purple-500/20"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;