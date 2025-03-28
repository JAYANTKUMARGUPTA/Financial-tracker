
import { useState } from 'react';
import SIPCalculator from './components/SIPCalculator';
import LumpSumCalculator from './components/LumpSumCalculator';
import EMICalculator from './components/EMICalculator';
import MutualFundCalculator from './components/MutualFundCalculator';
import FDCalculator from './components/FDCalculator';
import EPFCalculator from './components/EPFCalculator';

const Welcome = ({ calculators, setCurrentPage }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to Financial Calculators</h1>
      <p className="text-gray-600 mb-8 text-center">Choose a calculator to get started</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {calculators.map(calculator => (
          <div
            key={calculator.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer flex items-center gap-4"
            onClick={() => setCurrentPage(calculator.id)}
          >
            <img
              src={calculator.image}
              alt={`${calculator.name} Icon`}
              className="w-12 h-12 object-contain"
            />
            <h2 className="text-lg font-semibold">{calculator.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('welcome'); // Default to welcome page

  const calculators = [
    { id: 'sip', name: 'SIP Calculator', component: SIPCalculator, image: "https://play-lh.googleusercontent.com/BDoR6XZF6fWnPOfoZ3R0SndgDKezf6f7tZ0tv_BZMUeOzk77dTQ6C9W7CKa2_JCgtUo=w240-h480-rw" },
    { id: 'lumpsum', name: 'Lump Sum Calculator', component: LumpSumCalculator, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm575pSsr7VEMCxvFy2qzxsOA76cXjXpS9RA&s' },
    { id: 'emi', name: 'EMI Calculator', component: EMICalculator, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1ZMvxF23YWz7YCiE9jOoLruUmcQW3zb3zrw&s' },
    { id: 'mutualfund', name: 'Mutual Fund Calculator', component: MutualFundCalculator, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg1Gn14i4hfP6BXd2n8vGKdGg5crFXbPSghA&s' },
    { id: 'fd', name: 'FD Calculator', component: FDCalculator, image: 'https://cdn-scripbox-wordpress.scripbox.com/wp-content/uploads/2021/04/post-office-fd-calculator-vector-1.png' },
    { id: 'epf', name: 'EPF Calculator', component: EPFCalculator, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6JTKiuq7R12mURRGWMEh4nc6SkrpYAYuHOg&s' }
  ];

  const CurrentCalculator = currentPage === 'welcome'
    ? () => <Welcome calculators={calculators} setCurrentPage={setCurrentPage} />
    : calculators.find(calc => calc.id === currentPage)?.component;

  const currentCalculator = calculators.find(calc => calc.id === currentPage);

  const toggleMenu = () => {
    console.log('Button clicked, isMenuOpen will be:', !isMenuOpen);
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <div className="min-h-screen bg-amber-100 font-sans">
      {/* Header */}
      <header className="bg-gray-700 shadow-sm p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="text-l focus:outline-none bg-gray-200 p-1 rounded"
              onClick={toggleMenu}
            >
              ☰
            </button>
           
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-white">
              {currentPage === 'welcome' ? 'Home' : currentCalculator?.name}
            </span>
            {currentPage !== 'welcome' && (
              <img
                src={currentCalculator?.image}
                alt={`${currentCalculator?.name} Icon`}
                className="w-6 h-6 object-contain"
              />
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Calculators</h2>
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded ${
                  currentPage === 'welcome' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  setCurrentPage('welcome');
                  setIsMenuOpen(false);
                }}
              >
                Home
              </button>
            </li>
            {calculators.map(calculator => (
              <li key={calculator.id}>
                <button
                  className={`w-full text-left p-2 rounded ${
                    currentPage === calculator.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setCurrentPage(calculator.id);
                    setIsMenuOpen(false);
                  }}
                >
                  {calculator.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <CurrentCalculator setCurrentPage={setCurrentPage} />
      </main>

      {/* Debug Info */}
      {/* <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow">
        Menu Open: {isMenuOpen.toString()}
      </div> */}
    </div>
  );
};

export default App;