import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EPFCalculator = ({ setCurrentPage }) => {
  const [basicSalary, setBasicSalary] = useState(25000); // Monthly basic salary
  const [employeeContribution, setEmployeeContribution] = useState(12); // Employee contribution (%)
  const [employerContribution, setEmployerContribution] = useState(12); // Employer contribution (%)
  const [interestRate, setInterestRate] = useState(8.15); // Default EPF interest rate (as of 2023)
  const [tenure, setTenure] = useState(20); // Years until retirement
  const [chartData, setChartData] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  const calculateEPF = () => {
    const monthlyEmployeeContrib = (basicSalary * employeeContribution) / 100;
    const monthlyEmployerContrib = (basicSalary * employerContribution) / 100;
    const totalMonthlyContrib = monthlyEmployeeContrib + monthlyEmployerContrib;
    const annualContrib = totalMonthlyContrib * 12;
    const annualRate = interestRate / 100;

    let totalBalance = 0;
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;

    for (let year = 1; year <= tenure; year++) {
      totalEmployeeContrib += monthlyEmployeeContrib * 12;
      totalEmployerContrib += monthlyEmployerContrib * 12;
      totalBalance = (totalBalance + annualContrib) * (1 + annualRate);
    }

    const totalInterest = totalBalance - (totalEmployeeContrib + totalEmployerContrib);

    return {
      total: totalBalance,
      employeeContrib: totalEmployeeContrib,
      employerContrib: totalEmployerContrib,
      interest: totalInterest,
    };
  };

  useEffect(() => {
    const data = [];
    const monthlyEmployeeContrib = (basicSalary * employeeContribution) / 100;
    const monthlyEmployerContrib = (basicSalary * employerContribution) / 100;
    const totalMonthlyContrib = monthlyEmployeeContrib + monthlyEmployerContrib;
    const annualContrib = totalMonthlyContrib * 12;
    const annualRate = interestRate / 100;

    let balance = 0;
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;

    for (let year = 1; year <= tenure; year++) {
      totalEmployeeContrib += monthlyEmployeeContrib * 12;
      totalEmployerContrib += monthlyEmployerContrib * 12;
      balance = (balance + annualContrib) * (1 + annualRate);
      data.push({
        year: `${year}Y`,
        employeeContrib: totalEmployeeContrib,
        employerContrib: totalEmployerContrib,
        interest: balance - (totalEmployeeContrib + totalEmployerContrib),
      });
    }
    setChartData(data);
  }, [basicSalary, employeeContribution, employerContribution, interestRate, tenure]);

  const result = calculateEPF();

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
              <h1 className="text-2xl font-bold">EPF Calculator</h1>
            </div>
            <p className="text-gray-600 mb-4">Estimate your Employee Provident Fund savings</p>

            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder='Enter the Interest rate'
                  value={basicSalary}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value);
                    if (!isNaN(numValue)) {
                      setBasicSalary(numValue);
                    } else {
                      setBasicSalary('');
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="ml-2">₹{formatFinancialValue(basicSalary)}</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Employee Contribution (%)</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter percentage (0-100)"
                    value={employeeContribution}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Allow empty input or valid numbers (including decimals)
                      if (input === '') {
                        setEmployeeContribution('');
                        return;
                      }

                      // Check if input is a valid number (including decimals)
                      if (/^(\d+)?([.]\d*)?$/.test(input)) {
                        const numValue = parseFloat(input);

                        // Validate range (0-100)
                        if (numValue >= 0 && numValue <= 100) {
                          setEmployeeContribution(input); // Store as string to allow decimal input
                        }
                      }
                    }}
                    onBlur={() => {
                      // When field loses focus, convert to number with 2 decimal places
                      if (employeeContribution !== '') {
                        const numValue = parseFloat(employeeContribution);
                        setEmployeeContribution(numValue.toFixed(2));
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div>
        
                <label className="block text-sm font-medium mb-2">Employee Contribution (%)</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter percentage (0-100)"
                    value={employerContribution}
                    onChange={(e) => {
                      const input = e.target.value;

                      // Allow empty input or valid numbers (including decimals)
                      if (input === '') {
                        setEmployerContribution('');
                        return;
                      }

                      // Check if input is a valid number (including decimals)
                      if (/^(\d+)?([.]\d*)?$/.test(input)) {
                        const numValue = parseFloat(input);

                        // Validate range (0-100)
                        if (numValue >= 0 && numValue <= 100) {
                          setEmployerContribution(input); // Store as string to allow decimal input
                        }
                      }
                    }}
                    onBlur={() => {
                      // When field loses focus, convert to number with 2 decimal places
                      if (employeeContribution !== '') {
                        const numValue = parseFloat(employerContribution);
                        setEmployerContribution(numValue.toFixed(2));
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div>

              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tenure (Years)</label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full"
                />
                <span>{tenure} Years</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded">
              <h3 className="text-lg font-semibold">Total EPF Balance</h3>
              <p className="text-2xl font-bold">₹{formatFinancialValue(result.total)}</p>
              <div className="mt-2 text-sm">
                <p>Employee Contribution: ₹{formatFinancialValue(result.employeeContrib)} </p>
                <p>Employer Contribution: ₹{formatFinancialValue(result.employerContrib)} </p>
                <p>Interest Earned: ₹{formatFinancialValue(result.interest)}</p>
              </div>
            </div>

            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employeeContrib" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="employerContrib" stackId="a" fill="#60a5fa" />
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
                  q: "What is EPF?",
                  a: "EPF (Employee Provident Fund) is a retirement savings scheme where both employee and employer contribute a percentage of the salary.",
                },
                {
                  q: "How is EPF interest calculated?",
                  a: "Interest is calculated annually on the accumulated balance and credited at the end of the financial year.",
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

export default EPFCalculator;