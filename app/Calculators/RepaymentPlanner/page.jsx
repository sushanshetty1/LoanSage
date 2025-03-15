"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRightCircle, Home } from "lucide-react";
import Link from "next/link";

const RepaymentPlanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loanAmount, setLoanAmount] = useState(50000); // Loan amount
  const [interestRate, setInterestRate] = useState(5); // Annual interest rate
  const [tenure, setTenure] = useState(12); // Loan tenure in months
  const [extraPayment, setExtraPayment] = useState(0); // Extra monthly payment
  const [repaymentSchedule, setRepaymentSchedule] = useState([]); // Repayment schedule
  const [step, setStep] = useState(1); // Step-by-step wizard

  const sliderRef = useRef(null); // Ref for the slider container
  const thumbRef = useRef(null); // Ref for the custom thumb
  const inputRef = useRef(null); // Ref for the hidden input

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate repayment schedule
  const calculateRepaymentSchedule = () => {
    const monthlyInterestRate = interestRate / 12 / 100;
    const monthlyPayment =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure)) /
      (Math.pow(1 + monthlyInterestRate, tenure) - 1);

    let remainingBalance = loanAmount;
    const schedule = [];

    for (let month = 1; month <= tenure; month++) {
      const interest = remainingBalance * monthlyInterestRate;
      const principal = monthlyPayment - interest + extraPayment;
      remainingBalance -= principal;

      if (remainingBalance <= 0) {
        schedule.push({
          month,
          principal: principal + remainingBalance,
          interest,
          remainingBalance: 0,
        });
        break;
      }

      schedule.push({
        month,
        principal,
        interest,
        remainingBalance,
      });
    }

    setRepaymentSchedule(schedule);
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      calculateRepaymentSchedule();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Update slider fill and thumb position dynamically
  const updateSlider = (value, min, max) => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (sliderRef.current) {
      sliderRef.current.style.background = `linear-gradient(to right, #7c3aed ${percentage}%, #1e1b4b ${percentage}%)`;
    }
    if (thumbRef.current) {
      thumbRef.current.style.left = `${percentage}%`;
    }
  };

  // Handle slider input
  const handleSliderInput = (e, setValue, min, max) => {
    const value = parseFloat(e.target.value);
    setValue(value);
    updateSlider(value, min, max);
  };

  // Handle thumb drag
  const handleThumbDrag = (e, setValue, min, max) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    let offsetX = e.clientX - sliderRect.left;
    offsetX = Math.min(Math.max(offsetX, 0), sliderRect.width); // Constrain within slider bounds
    const percentage = (offsetX / sliderRect.width) * 100;
    const value = min + ((max - min) * percentage) / 100;
    setValue(Math.round(value)); // Round the value to the nearest whole number
    updateSlider(value, min, max);
    if (inputRef.current) {
      inputRef.current.value = value;
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
            <span className="text-white">Repayment </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Planner
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Plan your loan repayments and see how extra payments can reduce your tenure.
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
              ? "Loan Amount"
              : step === 2
              ? "Interest Rate"
              : step === 3
              ? "Loan Tenure"
              : "Extra Payment"}
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {step === 1
              ? "Enter the loan amount."
              : step === 2
              ? "Enter the annual interest rate."
              : step === 3
              ? "Enter the loan tenure in months."
              : "Enter the extra monthly payment."}
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
              {/* Loan Amount Input */}
              {step === 1 && (
                <div>
                  <label className="text-gray-300 text-sm">Loan Amount</label>
                  <input
                    type="number"
                    placeholder="Enter loan amount"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-purple-500"
                    value={loanAmount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setLoanAmount(value || 0);
                    }}
                  />
                </div>
              )}

              {/* Interest Rate Slider */}
              {step === 2 && (
                <div>
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                  <div
                    ref={sliderRef}
                    className="w-full h-2 bg-gray-800 rounded-full relative"
                  >
                    <input
                      ref={inputRef}
                      type="range"
                      min={1}
                      max={20}
                      value={interestRate}
                      onChange={(e) => {
                        handleSliderInput(e, setInterestRate, 1, 20);
                      }}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      style={{
                        width: `${((interestRate - 1) / (20 - 1)) * 100}%`,
                      }}
                    />
                    {/* Custom Thumb */}
                    <div
                      ref={thumbRef}
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-purple-600 rounded-full shadow-lg cursor-pointer"
                      style={{
                        left: `${((interestRate - 1) / (20 - 1)) * 100}%`,
                      }}
                      onMouseDown={(e) => {
                        const handleMouseMove = (e) => {
                          handleThumbDrag(e, setInterestRate, 1, 20);
                        };
                        const handleMouseUp = () => {
                          window.removeEventListener("mousemove", handleMouseMove);
                          window.removeEventListener("mouseup", handleMouseUp);
                        };
                        window.addEventListener("mousemove", handleMouseMove);
                        window.addEventListener("mouseup", handleMouseUp);
                      }}
                    />
                  </div>
                  <div className="text-center text-gray-300 text-lg">
                    {Math.round(interestRate)}%
                  </div>
                </div>
              )}

              {/* Loan Tenure Slider */}
              {step === 3 && (
                <div>
                  <div className="flex justify-between text-gray-300 text-sm">
                    <span>12 months</span>
                    <span>60 months</span>
                  </div>
                  <div
                    ref={sliderRef}
                    className="w-full h-2 bg-gray-800 rounded-full relative"
                  >
                    <input
                      ref={inputRef}
                      type="range"
                      min={12}
                      max={60}
                      value={tenure}
                      onChange={(e) => {
                        handleSliderInput(e, setTenure, 12, 60);
                      }}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      style={{
                        width: `${((tenure - 12) / (60 - 12)) * 100}%`,
                      }}
                    />
                    {/* Custom Thumb */}
                    <div
                      ref={thumbRef}
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-purple-600 rounded-full shadow-lg cursor-pointer"
                      style={{
                        left: `${((tenure - 12) / (60 - 12)) * 100}%`,
                      }}
                      onMouseDown={(e) => {
                        const handleMouseMove = (e) => {
                          handleThumbDrag(e, setTenure, 12, 60);
                        };
                        const handleMouseUp = () => {
                          window.removeEventListener("mousemove", handleMouseMove);
                          window.removeEventListener("mouseup", handleMouseUp);
                        };
                        window.addEventListener("mousemove", handleMouseMove);
                        window.addEventListener("mouseup", handleMouseUp);
                      }}
                    />
                  </div>
                  <div className="text-center text-gray-300 text-lg">
                    {Math.round(tenure)} months
                  </div>
                </div>
              )}

              {/* Extra Payment Input */}
              {step === 4 && (
                <div>
                  <label className="text-gray-300 text-sm">Extra Monthly Payment</label>
                  <input
                    type="number"
                    placeholder="Enter extra payment"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 mt-1 text-white focus:outline-none focus:border-purple-500"
                    value={extraPayment}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setExtraPayment(value || 0);
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
              <span>{step === 4 ? "Calculate Repayment Plan" : "Next"}</span>
              <ArrowRightCircle className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Repayment Schedule */}
        {step === 4 && repaymentSchedule.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <h4 className="text-white font-medium text-lg mb-2">
              Repayment Schedule
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              <strong>Principal</strong>: The portion of your payment that reduces the loan amount.
              <br />
              <strong>Interest</strong>: The cost of borrowing, calculated on the remaining balance.
              <br />
              <strong>Remaining Balance</strong>: The amount left to repay after each payment.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg">
                <thead>
                  <tr className="text-gray-300 text-sm">
                    <th className="px-4 py-2">Month</th>
                    <th className="px-4 py-2">Principal</th>
                    <th className="px-4 py-2">Interest</th>
                    <th className="px-4 py-2">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {repaymentSchedule.map((row, index) => (
                    <tr key={index} className="text-gray-300 text-sm">
                      <td className="px-4 py-2 text-center">{row.month}</td>
                      <td className="px-4 py-2 text-center">₹{row.principal.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">₹{row.interest.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">₹{row.remainingBalance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default RepaymentPlanner;