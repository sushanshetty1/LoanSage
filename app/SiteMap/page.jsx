"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Map,
  Compass,
  Layout,
  Layers,
  Link as LinkIcon,
  Globe,
  Home,
} from "lucide-react";
import Link from "next/link";

const SiteMap = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sections = [
    { id: "overview", title: "Overview", icon: Map },
    { id: "navigation", title: "Navigation", icon: Compass },
    { id: "structure", title: "Site Structure", icon: Layout },
    { id: "links", title: "Important Links", icon: LinkIcon },
    { id: "global", title: "Global Pages", icon: Globe },
    { id: "home", title: "Home", icon: Home },
  ];

  const siteMapContent = {
    overview: {
      title: "Site Map Overview",
      content:
        "Welcome to our site map. This page provides a comprehensive overview of the structure and navigation of our website. Use the sections below to explore different parts of the site.",
    },
    navigation: {
      title: "Navigation",
      content:
        "Our website is designed for easy navigation. Below are the main sections and how you can access them.",
    },
    structure: {
      title: "Site Structure",
      content:
        "The site is structured to provide a seamless user experience. Here's a breakdown of the main sections and their sub-pages.",
    },
    links: {
      title: "Important Links",
      content:
        "Below are some important links that you might find useful. These include key pages and resources.",
    },
    global: {
      title: "Global Pages",
      content:
        "These are the pages that are accessible from anywhere on the site, such as the contact page, privacy policy, and terms of service.",
    },
    home: {
      title: "Home",
      content:
        "The home page is the starting point of our website. It provides an overview of our services and directs you to other important sections.",
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
                <Map className="h-3 w-3 mr-2" />
                EXPLORE OUR SITE
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            >
              <span className="text-white">Site </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Map
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto"
            >
              Navigate through our website with ease using our detailed site
              map.
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
                  <Map className="h-4 w-4 mr-2 text-purple-400" />
                  Site Sections
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
                      {siteMapContent[activeSection].title}
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
                        {siteMapContent.overview.content}
                      </p>
                      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 my-4">
                        <p className="text-blue-300 text-sm">
                          Use the navigation on the left to explore different
                          sections of our site.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "navigation" && (
                    <motion.div
                      key="navigation"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {siteMapContent.navigation.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Main Sections
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Home</li>
                          <li>About Us</li>
                          <li>Services</li>
                          <li>Contact</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "structure" && (
                    <motion.div
                      key="structure"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {siteMapContent.structure.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Site Structure
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Home</li>
                          <li>About Us</li>
                          <li>Services</li>
                          <li>Contact</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "links" && (
                    <motion.div
                      key="links"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {siteMapContent.links.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Important Links
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>
                            <Link href="/privacy">Privacy Policy</Link>
                          </li>
                          <li>
                            <Link href="/terms">Terms of Service</Link>
                          </li>
                          <li>
                            <Link href="/contact">Contact Us</Link>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "global" && (
                    <motion.div
                      key="global"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {siteMapContent.global.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Global Pages
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>
                            <Link href="/privacy">Privacy Policy</Link>
                          </li>
                          <li>
                            <Link href="/terms">Terms of Service</Link>
                          </li>
                          <li>
                            <Link href="/contact">Contact Us</Link>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === "home" && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-300 mb-4">
                        {siteMapContent.home.content}
                      </p>
                      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-purple-500/20 rounded-lg p-5 mt-5">
                        <h3 className="text-lg font-medium text-white mb-3">
                          Home Page
                        </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Overview of Services</li>
                          <li>Quick Links to Key Sections</li>
                          <li>Latest News and Updates</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Footer with contact info */}
                  <div className="mt-8 pt-6 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">
                      If you have questions about our site map, please contact
                      our Support Team at{" "}
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
                        href="/terms"
                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                      >
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

export default SiteMap;
