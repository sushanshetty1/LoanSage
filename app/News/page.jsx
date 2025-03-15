"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Globe, Clock } from "lucide-react";
import Link from "next/link";

const NewsPage = () => {
  const newsArticles = [
    {
      id: 1,
      title: "LoanSage Launches Multilingual Voice Assistant",
      description:
        "LoanSage introduces a voice-enabled assistant supporting 10 Indian languages, revolutionizing the loan application process.",
      date: "2023-10-15",
      readTime: "3 min",
      link: "#",
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
                <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime} read</span>
                  </div>
                </div>

                {/* Read More Link */}
                <Link
                  href={article.link}
                  className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
