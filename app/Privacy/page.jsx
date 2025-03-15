"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Server, 
  UserCheck,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    { id: "overview", title: "Overview", icon: Eye },
    { id: "collection", title: "Data Collection", icon: Server },
    { id: "use", title: "Data Usage", icon: UserCheck },
    { id: "protection", title: "Data Protection", icon: Lock },
    { id: "updates", title: "Policy Updates", icon: RefreshCw }
  ];

  const privacyContent = {
    overview: {
      title: "Privacy Overview",
      content: "At LoanSage, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our loan recommendation services."
    },
    collection: {
      title: "Information We Collect",
      content: "We collect personal information you provide directly to us, such as your name, contact details, financial information, and loan preferences. We also collect data about how you interact with our platform, including your language preferences, device information, and usage patterns."
    },
    use: {
      title: "How We Use Your Data",
      content: "We use your information to provide personalized loan recommendations, process your requests, improve our services, and communicate with you in your preferred language. We analyze usage patterns to enhance user experience and develop new features that meet your needs."
    },
    protection: {
      title: "How We Protect Your Data",
      content: "We implement robust security measures to protect your personal information, including encryption, access controls, and regular security assessments. We do not sell or rent your data to third parties and only share information with trusted partners necessary to provide our services."
    },
    updates: {
      title: "Policy Updates",
      content: "We may update this Privacy Policy periodically to reflect changes in our practices or regulatory requirements. We encourage you to review this policy regularly. Significant changes will be notified to you through our platform or via email."
    }
  };

  return (
    <div className="relative pt-32 pb-16 md:pb-24 overflow-hidden bg-black">
      {/* Animated background elements */}
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
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/30 rounded-full">
              <span className="text-xs font-medium text-purple-300 tracking-wider flex items-center">
                <Shield className="h-3 w-3 mr-2" />
                YOUR PRIVACY MATTERS
              </span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            >
              <span className="text-white">Privacy </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Policy
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto"
            >
              We're committed to transparency and protecting your personal information while providing personalized loan services across multiple Indian languages.
            </motion.p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Navigation Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="lg:w-1/4"
            >
              <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-4 sticky top-24">
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-purple-400" />
                  Policy Sections
                </h3>
                <nav className="space-y-2">
                  {sections.map((section, index) => (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1) }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center text-sm transition-colors ${
                        activeSection === section.id 
                          ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-white border border-purple-500/30" 
                          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                      }`}
                    >
                      <section.icon className="h-4 w-4 mr-2" />
                      {section.title}
                    </motion.button>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="lg:w-3/4"
            >
              <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden">
                {/* Content Header */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 border-b border-gray-800">
                  <div className="flex items-center">
                    {sections.find(s => s.id === activeSection)?.icon && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mr-4">
                        {React.createElement(sections.find(s => s.id === activeSection)?.icon, { 
                          className: "h-5 w-5 text-purple-400" 
                        })}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-white">
                      {privacyContent[activeSection].title}
                    </h2>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6">
                  {activeSection === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {privacyContent.overview.content}
                      </p>
                      <p className="text-gray-300 mb-4">
                        We understand the importance of safeguarding the information you share with us, especially when it comes to your financial data. Our commitment to privacy extends across all our services, whether you interact with us in English or any of the 10 Indian languages we support.
                      </p>
                      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 my-4">
                        <p className="text-blue-300 text-sm">
                          By using our services, you consent to the practices described in this Privacy Policy. Your trust is important to us, and we strive to be transparent about how we handle your information.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "collection" && (
                    <motion.div
                      key="collection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {privacyContent.collection.content}
                      </p>
                      <h3 className="text-lg font-medium text-white mb-2 mt-4">Personal Information</h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                        <li>Identity information (name, date of birth)</li>
                        <li>Contact information (email address, phone number)</li>
                        <li>Financial information (income, existing loans)</li>
                        <li>Language preferences and regional settings</li>
                      </ul>
                      
                      <h3 className="text-lg font-medium text-white mb-2 mt-4">Usage Information</h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Voice recordings (when using voice features)</li>
                        <li>Device information and IP address</li>
                        <li>Interaction data and feature usage</li>
                        <li>Loan preferences and search history</li>
                      </ul>
                    </motion.div>
                  )}

                  {activeSection === "use" && (
                    <motion.div
                      key="use"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {privacyContent.use.content}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <h4 className="text-blue-400 font-medium mb-2">Primary Uses</h4>
                          <ul className="text-gray-300 text-sm space-y-2">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5 mr-2">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              Personalized loan recommendations
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5 mr-2">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              Eligibility assessment for financial products
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5 mr-2">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              Providing service in your preferred language
                            </li>
                          </ul>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <h4 className="text-blue-400 font-medium mb-2">Secondary Uses</h4>
                          <ul className="text-gray-300 text-sm space-y-2">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5 mr-2">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              Improving our AI language capabilities
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5 mr-2">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              Analytics to enhance user experience
                            </li>
                            <li className="flex items-start">
                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5 mr-2">
                                <span className="text-white text-xs">✓</span>
                              </div>
                              Research and development of new features
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "protection" && (
                    <motion.div
                      key="protection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {privacyContent.protection.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">Our Security Measures</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                              <Lock className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-blue-300 font-medium text-sm">End-to-End Encryption</h4>
                              <p className="text-gray-400 text-sm">Your data is encrypted during transmission and storage</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                              <Shield className="h-4 w-4 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-purple-300 font-medium text-sm">Access Controls</h4>
                              <p className="text-gray-400 text-sm">Strict access policies and authentication requirements</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                              <Server className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="text-blue-300 font-medium text-sm">Secure Infrastructure</h4>
                              <p className="text-gray-400 text-sm">Protected servers and regular security audits</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                              <RefreshCw className="h-4 w-4 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="text-purple-300 font-medium text-sm">Regular Updates</h4>
                              <p className="text-gray-400 text-sm">Continuous improvement of security protocols</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "updates" && (
                    <motion.div
                      key="updates"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {privacyContent.updates.content}
                      </p>
                      <div className="border-l-4 border-purple-500 pl-4 my-5">
                        <p className="text-gray-300 italic">
                          "We believe in keeping you informed about how we use and protect your data. When we make changes to this policy, we'll notify you before they take effect."
                        </p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mt-5">
                        <h4 className="text-white font-medium mb-2">How to Stay Informed</h4>
                        <ul className="text-gray-300 space-y-2">
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            Check this page periodically for updates
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            Watch for notification emails about policy changes
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                            Review platform announcements regarding privacy
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Footer with contact info */}
                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">
                      If you have questions about our privacy practices, please contact our Privacy Officer at{" "}
                      <a href="mailto:privacy@sageloans.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                        sushanshetty1470@gmail.com
                      </a>
                    </p>
                    <div className="flex items-center mt-4">
                      <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-300 transition-colors mr-4">
                        Terms of Service
                      </Link>
                      <Link href="/cookies" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                        Cookie Policy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;