"use client";

import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

const NewsPage = () => {
  const newsArticles = [
    {
      id: 1,
      title: "LoanSage Launches Multilingual Voice Assistant",
      description:
        "LoanSage introduces a voice-enabled assistant supporting 10 Indian languages, revolutionizing the loan application process.",
      date: "2023-10-15",
      readTime: "3 min",
    },
    {
      id: 2,
      title: "OpenBanking Integration Goes Live",
      description:
        "LoanSage now integrates with OpenBanking APIs, providing real-time loan rate comparisons across major banks.",
      date: "2023-10-10",
      readTime: "4 min",
    },
    {
      id: 3,
      title: "AI-Powered Loan Recommendations",
      description:
        "Our new AI model offers personalized loan recommendations based on user profiles and financial history.",
      date: "2023-10-05",
      readTime: "5 min",
    },
    {
      id: 4,
      title: "LoanSage Wins Fintech Innovation Award",
      description:
        "LoanSage has been recognized as the most innovative fintech platform of the year at the Global Fintech Summit.",
      date: "2023-09-28",
      readTime: "2 min",
    },
    {
      id: 5,
      title: "New Feature: Instant Eligibility Check",
      description:
        "LoanSage now offers an instant eligibility check feature, allowing users to see if they qualify for a loan in seconds.",
      date: "2023-09-25",
      readTime: "3 min",
    },
    {
      id: 6,
      title: "Expanding to 10 New Cities",
      description:
        "LoanSage is expanding its services to 10 new cities across India, making loans more accessible to everyone.",
      date: "2023-09-20",
      readTime: "4 min",
    },
    {
      id: 7,
      title: "Introducing Regional Language Support",
      description:
        "LoanSage now supports loan applications and assistance in 10 regional languages, breaking language barriers.",
      date: "2023-09-15",
      readTime: "3 min",
    },
    {
      id: 8,
      title: "LoanSage Partners with Major Banks",
      description:
        "LoanSage has partnered with leading banks to offer exclusive loan rates and benefits to its users.",
      date: "2023-09-10",
      readTime: "4 min",
    },
    {
      id: 9,
      title: "New Mobile App Launch",
      description:
        "LoanSage has launched a new mobile app with enhanced features, making loan applications even easier.",
      date: "2023-09-05",
      readTime: "3 min",
    },
    {
      id: 10,
      title: "Customer Support Now Available 24/7",
      description:
        "LoanSage's customer support team is now available 24/7 to assist users with their loan-related queries.",
      date: "2023-08-30",
      readTime: "2 min",
    },
  ];

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
            Latest News
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Stay updated with the latest developments, features, and
            announcements from LoanSage.
          </p>
        </motion.div>

        {/* News Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="flex flex-col h-full">
                {/* Article Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {article.title}
                </h3>

                {/* Article Description */}
                <p className="text-gray-300 text-sm mb-4 flex-grow">
                  {article.description}
                </p>

                {/* Metadata (Date and Read Time) */}
                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime} read</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;