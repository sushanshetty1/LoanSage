"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Key, 
  Server, 
  EyeOff, 
  Fingerprint,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

const Security = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    { id: "overview", title: "Overview", icon: Shield },
    { id: "encryption", title: "Encryption", icon: Lock },
    { id: "access", title: "Access Control", icon: Key },
    { id: "infrastructure", title: "Infrastructure", icon: Server },
    { id: "privacy", title: "Privacy Measures", icon: EyeOff },
    { id: "updates", title: "Security Updates", icon: RefreshCw }
  ];

  const securityContent = {
    overview: {
      title: "Security Overview",
      content: "At Sage, we prioritize the security of your data. Our comprehensive security measures ensure that your personal and financial information is protected at all times. This page outlines the steps we take to safeguard your data."
    },
    encryption: {
      title: "Data Encryption",
      content: "We use industry-standard encryption protocols to protect your data both in transit and at rest. This ensures that your information is secure from unauthorized access."
    },
    access: {
      title: "Access Control",
      content: "Strict access controls are in place to ensure that only authorized personnel can access your data. Multi-factor authentication (MFA) and role-based access are enforced across our systems."
    },
    infrastructure: {
      title: "Secure Infrastructure",
      content: "Our platform is built on a secure, scalable infrastructure with regular security audits and vulnerability assessments. We partner with trusted cloud providers to ensure the highest level of security."
    },
    privacy: {
      title: "Privacy Measures",
      content: "We adhere to strict privacy policies to ensure that your data is never misused. All data collection and processing activities are transparent and comply with applicable regulations."
    },
    updates: {
      title: "Security Updates",
      content: "We continuously monitor and update our security practices to address emerging threats. Regular patches and updates are applied to keep our systems secure."
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
                YOUR SECURITY IS OUR PRIORITY
              </span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            >
              <span className="text-white">Security </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Measures
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto"
            >
              We employ state-of-the-art security practices to protect your data and ensure a safe experience on our platform.
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
                  <Shield className="h-4 w-4 mr-2 text-purple-400" />
                  Security Sections
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
                        {React.createElement(sections.find(s => s.id === activeSection).icon, { 
                          className: "h-5 w-5 text-purple-400" 
                        })}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-white">
                      {securityContent[activeSection].title}
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
                        {securityContent.overview.content}
                      </p>
                      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 my-4">
                        <p className="text-blue-300 text-sm">
                          Your trust is important to us. We are committed to maintaining the highest standards of security to protect your data.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "encryption" && (
                    <motion.div
                      key="encryption"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {securityContent.encryption.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">Encryption Protocols</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>AES-256 encryption for data at rest</li>
                          <li>TLS 1.3 for secure data transmission</li>
                          <li>End-to-end encryption for sensitive communications</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "access" && (
                    <motion.div
                      key="access"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {securityContent.access.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">Access Control Measures</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Multi-factor authentication (MFA)</li>
                          <li>Role-based access controls (RBAC)</li>
                          <li>Regular access reviews and audits</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "infrastructure" && (
                    <motion.div
                      key="infrastructure"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {securityContent.infrastructure.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">Infrastructure Security</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Secure cloud hosting with AWS/GCP</li>
                          <li>Regular penetration testing</li>
                          <li>24/7 monitoring and incident response</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "privacy" && (
                    <motion.div
                      key="privacy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {securityContent.privacy.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">Privacy Practices</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Data minimization and anonymization</li>
                          <li>Transparent data collection practices</li>
                          <li>Compliance with GDPR and other regulations</li>
                        </ul>
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
                        {securityContent.updates.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">Update Practices</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Regular security patches</li>
                          <li>Continuous monitoring for vulnerabilities</li>
                          <li>Proactive response to emerging threats</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Footer with contact info */}
                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">
                      If you have questions about our security practices, please contact our Security Team at{" "}
                      <a href="mailto:security@sageloans.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                        security@sageloans.com
                      </a>
                    </p>
                    <div className="flex items-center mt-4">
                      <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-300 transition-colors mr-4">
                        Privacy Policy
                      </Link>
                      <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                        Terms of Service
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

export default Security;