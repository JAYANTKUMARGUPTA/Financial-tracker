import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LumpSumCalculator = ({ setCurrentPage }) => {
  const [amount, setAmount] = useState(100000);
  const [period, setPeriod] = useState(5);
  const [returns, setReturns] = useState(12);
  const [chartData, setChartData] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  const calculateLumpSum = () => {
    const total = amount * Math.pow(1 + returns / 100, period);
    return {
      total: total,
      invested: amount,
      returns: total - amount
    };
  };

  useEffect(() => {
    const data = [];
    for (let year = 1; year <= period; year++) {
      const value = amount * Math.pow(1 + returns / 100, year);
      data.push({
        year: `${year}Y`,
        investment: amount,
        returns: value - amount
      });
    }
    setChartData(data);
  }, [amount, period, returns]);

  const result = calculateLumpSum();

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-2">Lump Sum Calculator</h1>
            <p className="text-gray-600 mb-4">Calculate returns on your one-time investment</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Investment Amount</label>
                <input type="range" min="10000" max="10000000" step="10000" value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value))} className="w-full" />
                <span>₹{(amount / 100000).toFixed(2)} Lacs</span>
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
              {[{ q: "What is Lump Sum?", a: "A lump sum refers to a single, large payment or investment made all at once, rather than in smaller, periodic installments. " }].map((item, index) => (
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

export default LumpSumCalculator;