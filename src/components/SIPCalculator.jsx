import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SIPCalculator = ({ setCurrentPage }) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [period, setPeriod] = useState(5);
  const [returns, setReturns] = useState(12);
  const [chartData, setChartData] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  const calculateSIP = () => {
    const monthlyRate = returns / 12 / 100;
    const months = period * 12;
    const futureValue = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const investedAmount = monthlyInvestment * months;
    return {
      total: futureValue,
      invested: investedAmount,
      returns: futureValue - investedAmount
    };
  };

  useEffect(() => {
    const data = [];
    const monthlyRate = returns / 12 / 100;
    for (let year = 1; year <= period; year++) {
      const months = year * 12;
      const accumulated = monthlyInvestment * 
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      data.push({
        year: `${year}Y`,
        investment: monthlyInvestment * months,
        returns: accumulated - (monthlyInvestment * months)
      });
    }
    setChartData(data);
  }, [monthlyInvestment, period, returns]);

  const result = calculateSIP();

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-2">SIP Calculator</h1>
            <p className="text-gray-600 mb-4">Calculate returns on your systematic investment plan</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Investment</label>
                <input type="range" min="500" max="100000" step="500" value={monthlyInvestment} 
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))} className="w-full" />
                <span>₹{monthlyInvestment.toLocaleString()}</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Investment Period</label>
                <input type="range" min="1" max="30" value={period} 
                  onChange={(e) => setPeriod(Number(e.target.value))} className="w-full" />
                <span>{period} Years</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expected Returns</label>
                <input type="range" min="1" max="30" step="0.5" value={returns} 
                  onChange={(e) => setReturns(Number(e.target.value))} className="w-full" />
                <span>{returns}%</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded">
              <h3 className="text-lg font-semibold">Total Value</h3>
              <p className="text-2xl font-bold">₹{(result.total / 100000).toFixed(2)} Lacs</p>
              <div className="mt-2 text-sm">
                <p>Invested Amount: ₹{(result.invested / 100000).toFixed(2)} Lacs</p>
                <p>Est. Returns: ₹{(result.returns / 100000).toFixed(2)} Lacs</p>
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
              {[{ q: "What is SIP?", a: "SIP, or Systematic Investment Plan, is a way to invest a fixed amount of money in mutual funds at regular intervals, like monthly, to build wealth over time. " }].map((item, index) => (
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

export default SIPCalculator;