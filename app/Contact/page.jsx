"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import Link from "next/link";

const ContactPage = () => {
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
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Contact Us
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to us! We're here to help.
          </p>
        </motion.div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Email Us</h3>
                  <p className="text-gray-300 text-sm">support@loansage.com</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Call Us</h3>
                  <p className="text-gray-300 text-sm">+91 90082 13107</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Visit Us</h3>
                  <p className="text-gray-300 text-sm">
                    NMAMIT Nitte, Karkala, Udupi India
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4 mt-6">
              <Link
                href="https://github.com/loansage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href="https://linkedin.com/company/loansage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5"
          >
            <h3 className="text-xl font-bold text-white mb-6">Send Us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;