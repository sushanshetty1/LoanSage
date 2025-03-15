"use client";

import { motion } from "framer-motion";
import { HelpCircle, Mail, Phone } from "lucide-react";
import Link from "next/link";

const HelpCenterPage = () => {
  const faqs = [
    {
      question: "How do I apply for a loan?",
      answer:
        "You can apply for a loan by visiting the 'Loan Options' page and following the step-by-step instructions.",
    },
    {
      question: "What documents are required for a loan application?",
      answer:
        "Typically, you'll need proof of identity, income, and address. Specific requirements may vary by lender.",
    },
    {
      question: "How do I check my loan eligibility?",
      answer:
        "Use our instant eligibility check tool on the homepage to see if you qualify for a loan.",
    },
    {
      question: "Can I apply for a loan in my preferred language?",
      answer:
        "Yes, LoanSage supports 10 Indian languages for loan applications and assistance.",
    },
    {
      question: "What is the difference between a secured and unsecured loan?",
      answer:
        "A secured loan requires collateral (e.g., a house or car), while an unsecured loan does not. Unsecured loans typically have higher interest rates.",
    },
    {
      question: "How is my credit score calculated?",
      answer:
        "Your credit score is based on factors like payment history, credit utilization, length of credit history, and types of credit accounts.",
    },
    {
      question: "What is a debt-to-income ratio (DTI)?",
      answer:
        "DTI is a measure of your monthly debt payments compared to your monthly income. Lenders use it to assess your ability to manage repayments.",
    },
    {
      question: "Can I prepay my loan?",
      answer:
        "Yes, but some lenders may charge a prepayment penalty. Check your loan agreement for details.",
    },
    {
      question: "What happens if I miss a loan payment?",
      answer:
        "Missing a payment can result in late fees, a negative impact on your credit score, and potential default if not resolved.",
    },
    {
      question: "How do I refinance my loan?",
      answer:
        "Refinancing involves replacing your current loan with a new one, usually to get a lower interest rate or better terms. You can apply through LoanSage.",
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
            Help Center
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find answers to common questions and get support for LoanSage.
          </p>
        </motion.div>

        {/* FAQs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <HelpCircle className="h-6 w-6 mr-2 text-purple-400" />
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 + index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5"
              >
                <h4 className="text-lg font-semibold text-white mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-300 text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
            <Mail className="h-6 w-6 mr-2 text-purple-400" />
            Contact Support
          </h3>
          <p className="text-gray-300 text-lg mb-6">
            Need further assistance? Reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="mailto:support@loansage.com"
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              <span>Email Us</span>
            </Link>
            <Link
              href="tel:+911234567890"
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Phone className="h-5 w-5 mr-2" />
              <span>Call Us</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenterPage;