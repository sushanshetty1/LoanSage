"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  CreditCard,
  BarChart,
  Percent,
  ArrowRightCircle,
  Globe,
  Shield,
  Zap,
  MessageCircle
} from "lucide-react";
import Link from "next/link";

const Calculators = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const calculatorOptions = [
    {
      icon: Calculator,
      title: "EMI Calculator",
      description:
        "Calculate your monthly EMI for loans based on principal, interest rate, and tenure.",
      link: "/Calculators/EMI",
    },
    {
      icon: BarChart,
      title: "Repayment Planner",
      description:
        "Plan your loan repayments and see how extra payments can reduce your tenure.",
      link: "/Calculators/RepaymentPlanner",
    },
    {
      icon: Shield,
      title: "Debt-to-Income Ratio Calculator",
      description:
        "Calculate your debt-to-income ratio to assess your financial health.",
      link: "/Calculators/DebtToIncome",
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
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-white">Financial </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Calculators
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Use our powerful calculators to plan your loans, compare rates, and
            make informed financial decisions.
          </p>
        </motion.div>

        {/* Calculator Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {calculatorOptions.map((calculator, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <calculator.icon className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-white font-medium text-lg mb-2">
                {calculator.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {calculator.description}
              </p>
              <Link href={calculator.link}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20 relative overflow-hidden group">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  <span>Open Calculator</span>
                  <ArrowRightCircle className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="text-center mt-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need Help Choosing a Calculator?
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            Our AI-powered assistant, Sage, can guide you to the right tool for
            your needs.
          </p>
          <Link href="/chat">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-6 rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20 relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>Chat with Sage</span>
              <ArrowRightCircle className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Calculators;
