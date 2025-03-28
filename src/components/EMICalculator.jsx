import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EMICalculator = ({ setCurrentPage }) => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [chartData, setChartData] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  const calculateEMI = () => {
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfMonths = loanTenure * 12;
    const emi = loanAmount * monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfMonths) /
      (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);
    const totalPayment = emi * numberOfMonths;
    return {
      emi: emi,
      totalInterest: totalPayment - loanAmount,
      totalPayment: totalPayment
    };
  };

  useEffect(() => {
    const data = [];
    const monthlyInterestRate = interestRate / 12 / 100;
    const months = loanTenure * 12;
    const emi = calculateEMI().emi;
    let remainingPrincipal = loanAmount;
    for (let year = 1; year <= loanTenure; year++) {
      const yearlyPayments = emi * 12;
      const yearlyInterest = remainingPrincipal * interestRate / 100;
      const yearlyPrincipal = yearlyPayments - yearlyInterest;
      remainingPrincipal -= yearlyPrincipal;
      data.push({
        year: `${year}Y`,
        principal: yearlyPrincipal,
        interest: yearlyInterest
      });
    }
    setChartData(data);
  }, [loanAmount, interestRate, loanTenure]);

  const result = calculateEMI();

  const formatCurrency = (amount) => {
    const roundedAmount = Math.round(amount); // Round to nearest whole number

    if (!roundedAmount || isNaN(roundedAmount)) return "0";

    if (roundedAmount >= 10000000) {
      return `${(roundedAmount / 10000000).toFixed(2)} Cr`; // Crores (e.g., "1.50 Cr")
    } else if (roundedAmount >= 100000) {
      return `${(roundedAmount / 100000).toFixed(2)} L`; // Lakhs (e.g., "1.50 L")
    } else if (roundedAmount >= 1000) {
      return `${(roundedAmount / 1000).toFixed(2)} K`; // Thousands (e.g., "5.00 K")
    }
    return roundedAmount.toLocaleString(); // Show raw number if < ₹1,000 (e.g., "500")
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-2">EMI Calculator</h1>
            <p className="text-gray-600 mb-4">Calculate your loan EMI</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Loan Amount</label>
                {/* <input type="range" min="1000" max="10000000" step="1000" value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full" /> */}
                <input
                  type="text"
                  placeholder="Enter the Loan Amount"
                  value={loanAmount}
                  onChange={(e) => {
                    const numValue = parseInt(e.target.value.replace(/,/g, '')); // Remove commas for parsing
                    if (!isNaN(numValue)) {
                      setLoanAmount(numValue);
                    } else {
                      setLoanAmount('');
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="ml-2 whitespace-nowrap">
                  ₹{formatCurrency(loanAmount)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Interset Rate (%)</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter percentage (0-100)"
                    value={interestRate}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Allow empty input or valid numbers (including decimals)
                      if (input === '') {
                        setInterestRate('');
                        return;
                      }

                      // Check if input is a valid number (including decimals)
                      if (/^(\d+)?([.]\d*)?$/.test(input)) {
                        const numValue = parseFloat(input);

                        // Validate range (0-100)
                        if (numValue >= 0 && numValue <= 100) {
                          setInterestRate(input); // Store as string to allow decimal input
                        }
                      }
                    }}
                    onBlur={() => {
                      // When field loses focus, convert to number with 2 decimal places
                      if (employeeContribution !== '') {
                        const numValue = parseFloat(interestRate);
                        setInterestRate(numValue.toFixed(2));
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Loan Tenure</label>
                <input type="range" min="1" max="30" value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full" />
                <span>{loanTenure} Years</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded">
              <h3 className="text-lg font-semibold">Monthly EMI</h3>
              <p className="text-2xl font-bold">₹{formatCurrency(result.emi)}</p>
              <div className="mt-2 text-sm">
                <p>Total Interest: ₹{formatCurrency(result.totalInterest)}</p>
                <p>Total Payment: ₹{formatCurrency(result.totalPayment)}</p>
              </div>
            </div>

            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="principal" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="interest" stackId="a" fill="#93c5fd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
              {[{ q: "What is EMI?", a: "EMI stands for Equated Monthly Installment..." }].map((item, index) => (
                <div key={index} className="mb-2">
                  <button className="w-full text-left py-2 flex justify-between items-center"
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}>
                    {item.q}
                    <span>{faqOpen === index ? '−' : '+'}</span>
                  </button>
                  {faqOpen === index && <p className="text-sm text-gray-600 mt-2">{item.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;