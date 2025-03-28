import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EMICalculator = ({ setCurrentPage }) => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(10);
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
                <input type="range" min="1000" max="10000000" step="1000" value={loanAmount} 
                  onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full" />
                <span>₹{(loanAmount / 100000).toFixed(2)} lakhs</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Interest Rate</label>
                <input type="range" min="5" max="20" step="0.1" value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full" />
                <span>{interestRate}%</span>
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
              <p className="text-2xl font-bold">₹{Math.round(result.emi).toLocaleString()}</p>
              <div className="mt-2 text-sm">
                <p>Total Interest: ₹{Math.round(result.totalInterest).toLocaleString()}</p>
                <p>Total Payment: ₹{Math.round(result.totalPayment).toLocaleString()}</p>
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