"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRightCircle, Home } from "lucide-react";
import Link from "next/link";

const DebtToIncomeRatioCalculator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState(""); // Monthly income (no default value)
  const [monthlyDebt, setMonthlyDebt] = useState(""); // Monthly debt payments (no default value)
  const [dtiRatio, setDtiRatio] = useState(0); // Debt-to-Income Ratio
  const [step, setStep] = useState(1); // Step-by-step wizard

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate Debt-to-Income Ratio
  const calculateDtiRatio = () => {
    const income = parseFloat(monthlyIncome);
    const debt = parseFloat(monthlyDebt);

    if (isNaN(income) || isNaN(debt) || income <= 0) {
      setDtiRatio(0); // Reset if inputs are invalid
      return;
    }

    const ratio = (debt / income) * 100;
    setDtiRatio(ratio);
  };

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      calculateDtiRatio();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="relative pt-32 pb-16 md:pb-24 overflow-hidden bg-black min-h-screen">
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
            <span className="text-white">Debt-to-Income Ratio </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Calculator
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Calculate your debt-to-income ratio to assess your financial health.
          </p>
        </motion.div>

        {/* Step-by-Step Wizard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 max-w-2xl mx-auto"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
            <Calculator className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">
            Step {step}:{" "}
            {step === 1
              ? "Monthly Income"
              : "Monthly Debt Payments"}
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {step === 1
              ? "Enter your monthly income."
              : "Enter your total monthly debt payments."}
          </p>

          {/* Input Fields */}
          <div className="space-y-6">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Monthly Income Input */}
              {step === 1 && (
                <div>
                  <label className="text-gray-300 text-sm">Monthly Income</label>
                  <input
                    type="number"
                    placeholder="Enter monthly income"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-purple-500"
                    value={monthlyIncome}
                    onChange={(e) => {
                      setMonthlyIncome(e.target.value);
                    }}
                  />
                </div>
              )}

              {/* Monthly Debt Payments Input */}
              {step === 2 && (
                <div>
                  <label className="text-gray-300 text-sm">Monthly Debt Payments</label>
                  <input
                    type="number"
                    placeholder="Enter monthly debt payments"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-purple-500"
                    value={monthlyDebt}
                    onChange={(e) => {
                      setMonthlyDebt(e.target.value);
                    }}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevStep}
              disabled={step === 1}
              className="bg-gray-800/50 hover:bg-gray-700/50 text-white px-4 py-2 rounded-full flex items-center space-x-2"
            >
              <ArrowRightCircle className="h-5 w-5 rotate-180" />
              <span>Back</span>
            </Button>
            <Button
              onClick={handleNextStep}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full flex items-center space-x-2"
            >
              <span>{step === 2 ? "Calculate DTI Ratio" : "Next"}</span>
              <ArrowRightCircle className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Result */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-center"
          >
            <h4 className="text-white font-medium text-lg">
              Your Debt-to-Income Ratio:
            </h4>
            <p className="text-purple-400 text-2xl font-bold">
              {dtiRatio.toFixed(2)}%
            </p>
            <p className="text-gray-300 text-sm mt-2">
              A DTI ratio below 36% is generally considered healthy.
            </p>
          </motion.div>
        )}

        {/* Back to Calculators Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/Calculators">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-6 rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20 relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <Home className="h-5 w-5 mr-2" />
              <span>Back to Calculators</span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

// Ensure the component is exported as default
export default DebtToIncomeRatioCalculator;