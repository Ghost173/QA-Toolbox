import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Copy, RefreshCw, Download } from 'lucide-react';
import BackButton from '../components/BackButton';

const FakeDataGenerator = () => {
  const [count, setCount] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState({
    name: true,
    email: true,
    phone: true,
    address: true,
    company: false,
    job: false,
    website: false,
    date: false
  });
  const [generatedData, setGeneratedData] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
    'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel',
    'Lisa', 'Matthew', 'Nancy', 'Anthony', 'Karen', 'Mark', 'Betty', 'Donald',
    'Helen', 'Steven', 'Sandra', 'Paul', 'Donna', 'Andrew', 'Carol', 'Joshua',
    'Ruth', 'Kenneth', 'Sharon', 'Kevin', 'Michelle', 'Brian', 'Laura', 'George',
    'Sarah', 'Edward', 'Kimberly', 'Ronald', 'Deborah', 'Timothy', 'Dorothy'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
  ];

  const companies = [
    'Acme Corp', 'Tech Solutions', 'Global Industries', 'Innovation Labs', 'Digital Systems',
    'Future Technologies', 'Smart Solutions', 'Advanced Systems', 'Creative Works',
    'Dynamic Solutions', 'Elite Services', 'Prime Technologies', 'Superior Systems',
    'Ultimate Solutions', 'Visionary Labs', 'Zenith Corp', 'Alpha Industries'
  ];

  const jobTitles = [
    'Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'DevOps Engineer',
    'Marketing Manager', 'Sales Representative', 'HR Specialist', 'Financial Analyst',
    'Project Manager', 'Business Analyst', 'Quality Assurance', 'System Administrator',
    'Content Writer', 'Graphic Designer', 'Customer Success Manager'
  ];

  const domains = [
    'example.com', 'test.com', 'demo.org', 'sample.net', 'mock.io', 'fake.co'
  ];

  const streets = [
    'Main St', 'Oak Ave', 'Pine Rd', 'Cedar Ln', 'Elm St', 'Maple Dr', 'First St',
    'Second Ave', 'Park Rd', 'Garden St', 'Sunset Blvd', 'Sunrise Ave', 'Highland Dr'
  ];

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
    'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle'
  ];

  const states = [
    'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'NC', 'WA', 'IN', 'OR', 'TN', 'MI'
  ];

  const generateRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const generatePhoneNumber = () => {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${exchange}-${number}`;
  };

  const generateAddress = () => {
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const street = generateRandomItem(streets);
    const city = generateRandomItem(cities);
    const state = generateRandomItem(states);
    const zipCode = Math.floor(Math.random() * 90000) + 10000;
    return `${streetNumber} ${street}, ${city}, ${state} ${zipCode}`;
  };

  const generateEmail = (firstName, lastName) => {
    const domain = generateRandomItem(domains);
    const variations = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}${Math.floor(Math.random() * 99) + 1}@${domain}`,
      `${lastName.toLowerCase()}.${firstName.toLowerCase()}@${domain}`
    ];
    return generateRandomItem(variations);
  };

  const generateWebsite = (company) => {
    const domain = company.toLowerCase().replace(/\s+/g, '');
    return `https://www.${domain}.com`;
  };

  const generateDate = () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  };

  const generateFakeData = () => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const firstName = generateRandomItem(firstNames);
      const lastName = generateRandomItem(lastNames);
      const item = { id: i + 1 };

      if (selectedTypes.name) {
        item.name = `${firstName} ${lastName}`;
      }
      if (selectedTypes.email) {
        item.email = generateEmail(firstName, lastName);
      }
      if (selectedTypes.phone) {
        item.phone = generatePhoneNumber();
      }
      if (selectedTypes.address) {
        item.address = generateAddress();
      }
      if (selectedTypes.company) {
        item.company = generateRandomItem(companies);
      }
      if (selectedTypes.job) {
        item.job = generateRandomItem(jobTitles);
      }
      if (selectedTypes.website) {
        item.website = generateWebsite(item.company || generateRandomItem(companies));
      }
      if (selectedTypes.date) {
        item.date = generateDate();
      }

      data.push(item);
    }
    setGeneratedData(data);
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyAllData = async () => {
    const jsonData = JSON.stringify(generatedData, null, 2);
    try {
      await navigator.clipboard.writeText(jsonData);
      setCopiedIndex('all');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadData = () => {
    const jsonData = JSON.stringify(generatedData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center">
            <User size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Fake Data Generator</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Generate realistic test data including names, addresses, phone numbers, and more for your testing needs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="lg:col-span-1"
        >
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Number of records
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Data types to include
                </label>
                <div className="space-y-2">
                  {Object.entries(selectedTypes).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setSelectedTypes({
                          ...selectedTypes,
                          [key]: e.target.checked
                        })}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-white text-sm capitalize">
                        {key === 'job' ? 'Job Title' : key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={generateFakeData}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <RefreshCw size={16} />
                <span>Generate Data</span>
              </button>

              {generatedData.length > 0 && (
                <div className="space-y-2">
                  <button
                    onClick={copyAllData}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 glass hover:bg-dark-700/50 text-white font-medium rounded-lg transition-all duration-200"
                  >
                    {copiedIndex === 'all' ? (
                      <>
                        <Copy size={16} className="text-green-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy All (JSON)</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadData}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 glass hover:bg-dark-700/50 text-white font-medium rounded-lg transition-all duration-200"
                  >
                    <Download size={16} />
                    <span>Download JSON</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Generated Data</h2>
              {generatedData.length > 0 && (
                <span className="text-sm text-dark-400">
                  {generatedData.length} record{generatedData.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {generatedData.length === 0 ? (
              <div className="text-center py-12">
                <User size={48} className="text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400 text-lg">No data generated yet</p>
                <p className="text-dark-500 text-sm">Click "Generate Data" to create test records</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="p-4 bg-dark-700/50 rounded-lg border border-dark-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        {Object.entries(item).map(([key, value]) => (
                          key !== 'id' && (
                            <div key={key} className="flex items-center space-x-2">
                              <span className="text-primary-400 text-sm font-medium w-20 capitalize">
                                {key}:
                              </span>
                              <span className="text-white text-sm">{value}</span>
                            </div>
                          )
                        ))}
                      </div>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(item, null, 2), index)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-dark-600 hover:bg-dark-500 text-white rounded transition-colors"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Copy size={12} className="text-green-400" />
                            <span className="text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FakeDataGenerator;
