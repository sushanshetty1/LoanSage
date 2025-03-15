"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  BookOpen,
  AlertCircle,
  Clipboard,
  UserCheck,
  Info,
} from "lucide-react";
import Link from "next/link";

const TermsOfService = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    { id: "introduction", title: "Introduction", icon: Info },
    { id: "eligibility", title: "Eligibility", icon: UserCheck },
    { id: "usage", title: "Acceptable Use", icon: Clipboard },
    { id: "liability", title: "Liability", icon: AlertCircle },
    { id: "termination", title: "Termination", icon: Shield },
  ];

  const termsContent = {
    introduction: {
      title: "Introduction",
      content:
        "Welcome to Sage! These Terms of Service govern your use of our loan recommendation platform. By accessing or using our services, you agree to comply with these terms. Please read them carefully before proceeding.",
    },
    eligibility: {
      title: "Eligibility",
      content:
        "To use our services, you must be at least 18 years old and reside in a region where our services are available. By using Sage, you confirm that you meet these eligibility requirements and agree to provide accurate information.",
    },
    usage: {
      title: "Acceptable Use",
      content:
        "You agree to use our platform only for lawful purposes and in accordance with these terms. Prohibited activities include fraud, misuse of personal data, and any actions that could harm the platform or other users.",
    },
    liability: {
      title: "Liability",
      content:
        "Sage provides loan recommendations based on the information you provide. We are not responsible for the accuracy of third-party loan offers or any financial decisions you make. Use our services at your own risk.",
    },
    termination: {
      title: "Termination",
      content:
        "We reserve the right to terminate or suspend your access to our services at any time, without notice, for any reason, including violation of these terms. You may also terminate your account at any time.",
    },
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
                <FileText className="h-3 w-3 mr-2" />
                TERMS AND CONDITIONS
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            >
              <span className="text-white">Terms of </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Service
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto"
            >
              By using Sage, you agree to these terms and conditions. Please
              review them carefully to understand your rights and
              responsibilities.
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
                  <BookOpen className="h-4 w-4 mr-2 text-purple-400" />
                  Terms Sections
                </h3>
                <nav className="space-y-2">
                  {sections.map((section, index) => (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
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
                    {sections.find((s) => s.id === activeSection)?.icon && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mr-4">
                        {React.createElement(
                          sections.find((s) => s.id === activeSection).icon,
                          {
                            className: "h-5 w-5 text-purple-400",
                          }
                        )}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-white">
                      {termsContent[activeSection].title}
                    </h2>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6">
                  {activeSection === "introduction" && (
                    <motion.div
                      key="introduction"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {termsContent.introduction.content}
                      </p>
                      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 my-4">
                        <p className="text-blue-300 text-sm">
                          These terms apply to all users of the Sage platform,
                          including those accessing our services in multiple
                          Indian languages.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "eligibility" && (
                    <motion.div
                      key="eligibility"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {termsContent.eligibility.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Eligibility Requirements
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Minimum age of 18 years</li>
                          <li>Residency in a supported region</li>
                          <li>Accurate and truthful information</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "usage" && (
                    <motion.div
                      key="usage"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {termsContent.usage.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Prohibited Activities
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Fraudulent or illegal activities</li>
                          <li>Misuse of personal or financial data</li>
                          <li>Attempting to disrupt the platform</li>
                          <li>Violating intellectual property rights</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "liability" && (
                    <motion.div
                      key="liability"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {termsContent.liability.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Limitations of Liability
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>
                            We are not responsible for third-party loan offers
                          </li>
                          <li>
                            You are solely responsible for financial decisions
                          </li>
                          <li>We do not guarantee loan approval or terms</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "termination" && (
                    <motion.div
                      key="termination"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {termsContent.termination.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Termination Conditions
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>We may terminate access for violations</li>
                          <li>You may terminate your account at any time</li>
                          <li>Termination does not affect prior obligations</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Footer with contact info */}
                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">
                      If you have questions about these terms, please contact us
                      at{" "}
                      <a
                        href="mailto:support@sageloans.com"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        support@sageloans.com
                      </a>
                    </p>
                    <div className="flex items-center mt-4">
                      <Link
                        href="/privacy"
                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors mr-4"
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        href="/cookies"
                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                      >
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

export default TermsOfService;
