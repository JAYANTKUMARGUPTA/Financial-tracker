import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FDCalculator = ({ setCurrentPage }) => {
  const [principal, setPrincipal] = useState(10000); // Default principal amount
  const [interestRate, setInterestRate] = useState(2); // Default annual interest rate (%)
  const [tenure, setTenure] = useState(5); // Default tenure in years
  const [interestType, setInterestType] = useState('compound'); // Toggle between Simple and Compound
  const [chartData, setChartData] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  const calculateFD = () => {
    let maturityAmount, interestEarned;

    if (interestType === 'simple') {
      // Simple Interest: A = P + (P * r * t)
      interestEarned = principal * (interestRate / 100) * tenure;
      maturityAmount = principal + interestEarned;
    } else {
      // Compound Interest: A = P * (1 + r/n)^(n*t)
      // Assuming annual compounding (n = 1)
      maturityAmount = principal * Math.pow(1 + interestRate / 100, tenure);
      interestEarned = maturityAmount - principal;
    }

    return {
      total: maturityAmount,
      principal: principal,
      interest: interestEarned,
    };
  };

  useEffect(() => {
    const data = [];
    if (interestType === 'simple') {
      for (let year = 1; year <= tenure; year++) {
        const interest = principal * (interestRate / 100) * year;
        data.push({
          year: `${year}Y`,
          principal: principal,
          interest: interest,
        });
      }
    } else {
      for (let year = 1; year <= tenure; year++) {
        const accumulated = principal * Math.pow(1 + interestRate / 100, year);
        data.push({
          year: `${year}Y`,
          principal: principal,
          interest: accumulated - principal,
        });
      }
    }
    setChartData(data);
  }, [principal, interestRate, tenure, interestType]);

  const result = calculateFD();

  const formatFinancialValue = (amount) => {
    const value = Math.round(amount || 0);

    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`; // Crores (1.25 Cr)
    }
    if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} L`; // Lakhs (1.50 L)
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} K`; // Thousands (25.5 K)
    }
    return value.toLocaleString(); // Below ₹1,000 (500)
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold">FD Calculator</h1>
            </div>
            <p className="text-gray-600 mb-4">Calculate returns on your Fixed Deposit</p>

            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded ${interestType === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setInterestType('simple')}
              >
                Simple Interest
              </button>
              <button
                className={`px-4 py-2 rounded ${interestType === 'compound' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setInterestType('compound')}
              >
                Compound Interest
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Principal Amount</label>
                <input
                  type="text"
                  placeholder="Enter the Loan Amount"
                  value={principal}
                  onChange={(e) => {
                    const numValue = parseInt(e.target.value.replace(/,/g, '')); // Remove commas for parsing
                    if (!isNaN(numValue)) {
                      setPrincipal(numValue);
                    } else {
                      setPrincipal('');
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="ml-2 whitespace-nowrap">
                  ₹{formatFinancialValue(principal)}
                </span>

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
                <label className="block text-sm font-medium mb-2">Tenure</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full"
                />
                <span>{tenure} Years</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded">
              <h3 className="text-lg font-semibold">Maturity Amount</h3>
              <p className="text-2xl font-bold">₹{formatFinancialValue(result.total)}</p>
              <div className="mt-2 text-sm">
                <p>Principal Amount: ₹{formatFinancialValue(result.principal)}</p>
                <p>Interest Earned: ₹{formatFinancialValue(result.interest)} </p>
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
              {[
                {
                  q: "What is a Fixed Deposit?",
                  a: "A Fixed Deposit (FD) is a financial instrument where money is invested for a fixed period at a fixed interest rate.",
                },
                {
                  q: "What’s the difference between Simple and Compound Interest?",
                  a: "Simple interest is calculated only on the principal, while compound interest is calculated on the principal plus accumulated interest.",
                },
              ].map((item, index) => (
                <div key={index} className="mb-2">
                  <button
                    className="w-full text-left py-2 flex justify-between items-center"
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  >
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

export default FDCalculator;