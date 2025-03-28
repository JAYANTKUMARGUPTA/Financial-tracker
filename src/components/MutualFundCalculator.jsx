import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MutualFundCalculator = ({ setCurrentPage }) => {
  const [investmentType, setInvestmentType] = useState('sip'); // Toggle between SIP and Lump Sum
  const [amount, setAmount] = useState(investmentType === 'sip' ? 5000 : 10000); // Default: 5000 for SIP, 100000 for Lump Sum
  const [period, setPeriod] = useState(5); // Investment period in years
  const [returns, setReturns] = useState(12); // Expected annual return rate (%)
  const [chartData, setChartData] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  const calculateReturns = () => {
    const annualRate = returns / 100;
    let futureValue, investedAmount;

    if (investmentType === 'sip') {
      const monthlyRate = annualRate / 12;
      const months = period * 12;
      futureValue = amount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      investedAmount = amount * months;
    } else {
      futureValue = amount * Math.pow(1 + annualRate, period);
      investedAmount = amount;
    }

    return {
      total: futureValue,
      invested: investedAmount,
      returns: futureValue - investedAmount,
    };
  };

  useEffect(() => {
    const data = [];
    const annualRate = returns / 100;

    if (investmentType === 'sip') {
      const monthlyRate = annualRate / 12;
      for (let year = 1; year <= period; year++) {
        const months = year * 12;
        const accumulated = amount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
        data.push({
          year: `${year}Y`,
          investment: amount * months,
          returns: accumulated - (amount * months),
        });
      }
    } else {
      for (let year = 1; year <= period; year++) {
        const accumulated = amount * Math.pow(1 + annualRate, year);
        data.push({
          year: `${year}Y`,
          investment: amount,
          returns: accumulated - amount,
        });
      }
    }
    setChartData(data);
  }, [investmentType, amount, period, returns]);

  const result = calculateReturns();
  // For the current value display

  const formatFinancialValue = (value) => {
    const num = Number(value) || 0;

    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
    return num.toLocaleString();
  };

  // For min/max labels (simpler format)
  const formatSliderValue = (value) => {
    const num = Number(value);
    if (num >= 100000) return `${num / 100000}L`;
    if (num >= 1000) return `${num / 1000}K`;
    return num;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold">Mutual Fund Calculator</h1>
            </div>
            <p className="text-gray-600 mb-4">Estimate returns on your mutual fund investment</p>

            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded ${investmentType === 'sip' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setInvestmentType('sip');
                  setAmount(5000); // Reset to SIP default
                }}
              >
                SIP
              </button>
              <button
                className={`px-4 py-2 rounded ${investmentType === 'lumpsum' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => {
                  setInvestmentType('lumpsum');
                  setAmount(100000); // Reset to Lump Sum default
                }}
              >
                Lump Sum
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {investmentType === 'sip' ? 'Monthly Investment' : 'Investment Amount'}
                </label>
                <div >
                  <input
                    type="text"
                    placeholder={`Enter ${investmentType === 'sip' ? 'Monthly Investment' : 'Investment Amount'}`}
                    min={investmentType === 'sip' ? 500 : 10000}
                    max={investmentType === 'sip' ? 100000 : 1000000}
                    step={investmentType === 'sip' ? 500 : 10000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>₹{formatSliderValue(investmentType === 'sip' ? 500 : 10000)}</span>
                    <span>₹{formatSliderValue(investmentType === 'sip' ? 100000 : 1000000)}</span>
                  </div>
                </div>
                <span className="text-lg font-medium mt-2 block">₹{formatFinancialValue(amount)}</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Investment Period</label>
                {/* <input
                  type="range"
                  min="1"
                  max="30"
                  value={period}
                  onChange={(e) => setPeriod(Number(e.target.value))}
                  className="w-full"
                />
                <span>{period} Years</span> */}
                <input
                  type="text"
                  placeholder="Enter the Monthly Investment"
                  value={period}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value.replace(/,/g, '')); // Remove existing commas
                    if (!isNaN(numValue)) {
                      setPeriod(numValue);
                    } else {
                      setPeriod('');
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="ml-2 whitespace-nowrap">
                  {period} Years
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expected Returns</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={returns}
                  onChange={(e) => setReturns(Number(e.target.value))}
                  className="w-full"
                />
                <span>{returns}%</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded">
              <h3 className="text-lg font-semibold">Total Value</h3>
              <p className="text-2xl font-bold">₹{formatFinancialValue(result.total)} Lacs</p>
              <div className="mt-2 text-sm">
                <p>Invested Amount: ₹{formatFinancialValue(result.invested)} </p>
                <p>Est. Returns: ₹{formatFinancialValue(result.returns)}</p>
              </div>
            </div>

            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="investment" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="returns" stackId="a" fill="#93c5fd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
              {[
                {
                  q: "What is a Mutual Fund?",
                  a: "A mutual fund pools money from multiple investors to invest in securities like stocks, bonds, or other assets.",
                },
                {
                  q: "What’s the difference between SIP and Lump Sum?",
                  a: "SIP involves regular investments over time, while Lump Sum is a one-time investment.",
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

export default MutualFundCalculator;