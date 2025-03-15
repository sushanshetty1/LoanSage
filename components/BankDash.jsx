// components/DashboardPopup.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DashboardPopup({ isOpen, onClose }) {
  const router = useRouter();
  
  // Sample loan offers data - replace with your API call
  const [loanOffers, setLoanOffers] = useState([
    {
      id: 1,
      bankName: "HDFC Bank",
      interestRate: 7.5,
      maxAmount: 5000000,
      tenure: "Up to 20 years",
      processingFee: "0.5% of loan amount",
      eligibility: "CIBIL score above 750",
      featured: true,
    },
    {
      id: 2,
      bankName: "SBI",
      interestRate: 7.75,
      maxAmount: 7500000,
      tenure: "Up to 30 years",
      processingFee: "0.35% of loan amount",
      eligibility: "CIBIL score above 700",
      featured: false,
    },
    {
      id: 3,
      bankName: "ICICI Bank",
      interestRate: 7.6,
      maxAmount: 6000000,
      tenure: "Up to 25 years",
      processingFee: "0.5% of loan amount",
      eligibility: "CIBIL score above 730",
      featured: true,
    },
    {
      id: 4,
      bankName: "Axis Bank",
      interestRate: 7.65,
      maxAmount: 5500000,
      tenure: "Up to 25 years",
      processingFee: "0.45% of loan amount",
      eligibility: "CIBIL score above 720",
      featured: false,
    },
    {
      id: 5,
      bankName: "Kotak Mahindra",
      interestRate: 7.7,
      maxAmount: 4500000,
      tenure: "Up to 20 years",
      processingFee: "0.5% of loan amount",
      eligibility: "CIBIL score above 740",
      featured: false,
    }
  ]);

  const [filters, setFilters] = useState({
    loanType: "all",
    sortBy: "interestRate",
    minAmount: 1000000,
    maxAmount: 10000000,
  });

  // Filter offers based on user selection
  const filteredOffers = loanOffers
    .sort((a, b) => {
      if (filters.sortBy === "interestRate") {
        return a.interestRate - b.interestRate;
      } else if (filters.sortBy === "maxAmount") {
        return b.maxAmount - a.maxAmount;
      }
      return 0;
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Dashboard Header with Back Button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Loan Offers Dashboard</h2>
          <button 
            onClick={onClose}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Filter Loan Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="loanType" className="block text-sm font-medium text-gray-400 mb-2">Loan Type</label>
                <select 
                  id="loanType"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filters.loanType}
                  onChange={(e) => setFilters({...filters, loanType: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="home">Home Loan</option>
                  <option value="personal">Personal Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="education">Education Loan</option>
                </select>
              </div>
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                <select 
                  id="sortBy"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                >
                  <option value="interestRate">Interest Rate (Low to High)</option>
                  <option value="maxAmount">Loan Amount (High to Low)</option>
                </select>
              </div>
              <div>
                <label htmlFor="minAmount" className="block text-sm font-medium text-gray-400 mb-2">Min Amount (₹)</label>
                <input 
                  type="range" 
                  id="minAmount"
                  min="100000" 
                  max="5000000" 
                  step="100000"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({...filters, minAmount: parseInt(e.target.value)})}
                  className="w-full accent-purple-500 bg-gray-700"
                />
                <div className="text-sm text-gray-400 mt-1">₹{(filters.minAmount/100000).toFixed(1)} Lakhs</div>
              </div>
              <div>
                <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-400 mb-2">Max Amount (₹)</label>
                <input 
                  type="range" 
                  id="maxAmount"
                  min="1000000" 
                  max="10000000" 
                  step="500000"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({...filters, maxAmount: parseInt(e.target.value)})}
                  className="w-full accent-purple-500 bg-gray-700"
                />
                <div className="text-sm text-gray-400 mt-1">₹{(filters.maxAmount/100000).toFixed(1)} Lakhs</div>
              </div>
            </div>
          </div>

          {/* Featured Offers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Featured Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOffers.filter(offer => offer.featured).map(offer => (
                <div key={offer.id} className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-purple-500 px-3 py-1 text-xs font-medium rounded-bl-lg">
                    FEATURED
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white">{offer.bankName}</h3>
                      <div className="text-3xl font-bold mt-2 mb-1 text-white">
                        {offer.interestRate}% <span className="text-sm text-gray-300">p.a.</span>
                      </div>
                      <div className="text-sm text-gray-300">Up to ₹{(offer.maxAmount/100000).toFixed(1)} Lakhs</div>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-white bg-opacity-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-gray-400">Tenure</div>
                      <div className="text-sm font-medium text-white">{offer.tenure}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Processing Fee</div>
                      <div className="text-sm font-medium text-white">{offer.processingFee}</div>
                    </div>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* All Offers */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">All Loan Offers</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-left">
                    <th className="py-3 px-4 font-medium text-gray-300">Bank</th>
                    <th className="py-3 px-4 font-medium text-gray-300">Interest Rate</th>
                    <th className="py-3 px-4 font-medium text-gray-300">Max Loan Amount</th>
                    <th className="py-3 px-4 font-medium text-gray-300">Tenure</th>
                    <th className="py-3 px-4 font-medium text-gray-300">Processing Fee</th>
                    <th className="py-3 px-4 font-medium text-gray-300">Eligibility</th>
                    <th className="py-3 px-4 font-medium text-gray-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map(offer => (
                    <tr key={offer.id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-4 px-4 font-medium text-white">{offer.bankName}</td>
                      <td className="py-4 px-4 text-purple-400 font-medium">{offer.interestRate}%</td>
                      <td className="py-4 px-4 text-white">₹{(offer.maxAmount/100000).toFixed(1)} Lakhs</td>
                      <td className="py-4 px-4 text-white">{offer.tenure}</td>
                      <td className="py-4 px-4 text-white">{offer.processingFee}</td>
                      <td className="py-4 px-4 text-white">{offer.eligibility}</td>
                      <td className="py-4 px-4">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150">
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}