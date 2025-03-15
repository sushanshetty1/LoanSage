"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const LoanGlossaryPage = () => {
  const glossaryTerms = [
    {
      term: "Annual Percentage Rate (APR)",
      definition:
        "The annual rate charged for borrowing, expressed as a single percentage that represents the actual yearly cost over the term of a loan.",
    },
    {
      term: "Amortization",
      definition:
        "The process of spreading out a loan into a series of fixed payments over time, covering both principal and interest.",
    },
    {
      term: "Collateral",
      definition:
        "An asset pledged as security for a loan, which can be seized by the lender if the borrower fails to repay the loan.",
    },
    {
      term: "Credit Score",
      definition:
        "A numerical representation of a borrower's creditworthiness, based on their credit history and financial behavior.",
    },
    {
      term: "Debt-to-Income Ratio (DTI)",
      definition:
        "A measure of a borrower's monthly debt payments compared to their monthly income, used to assess their ability to manage repayments.",
    },
    {
      term: "Equity",
      definition:
        "The difference between the current market value of an asset and the amount owed on it (e.g., a home).",
    },
    {
      term: "Fixed-Rate Loan",
      definition:
        "A loan with an interest rate that remains the same throughout the entire term of the loan.",
    },
    {
      term: "Interest Rate",
      definition:
        "The percentage of the loan amount charged by the lender for borrowing money.",
    },
    {
      term: "Principal",
      definition:
        "The original amount of money borrowed in a loan, excluding interest and other charges.",
    },
    {
      term: "Refinancing",
      definition:
        "The process of replacing an existing loan with a new one, typically to secure better terms or lower interest rates.",
    },
    {
      term: "Secured Loan",
      definition:
        "A loan that is backed by collateral, such as a house or car, which the lender can seize if the borrower defaults.",
    },
    {
      term: "Unsecured Loan",
      definition:
        "A loan that is not backed by collateral, typically relying on the borrower's creditworthiness.",
    },
    {
      term: "Loan Term",
      definition:
        "The length of time over which a loan is scheduled to be repaid.",
    },
    {
      term: "Prepayment Penalty",
      definition:
        "A fee charged by some lenders if the borrower pays off the loan before the end of the loan term.",
    },
    {
      term: "Default",
      definition:
        "Failure to repay a loan according to the terms agreed upon in the loan agreement.",
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
            Loan Glossary
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Understand key loan-related terms and concepts to make informed financial decisions.
          </p>
        </motion.div>

        {/* Glossary Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {glossaryTerms.map((term, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="flex flex-col h-full">
                {/* Term Icon */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                </div>

                {/* Term Title */}
                <h3 className="text-xl font-bold text-white mb-2">{term.term}</h3>

                {/* Term Definition */}
                <p className="text-gray-300 text-sm">{term.definition}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanGlossaryPage;