import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, RefreshCw, Check } from 'lucide-react';
import BackButton from '../components/BackButton';

const EmailGenerator = () => {
  const [emails, setEmails] = useState([]);
  const [count, setCount] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const domains = [
    'example.com',
    'test.com',
    'qa.com',
    'demo.org',
    'sample.net',
    'mock.io',
    'fake.co',
    'dummy.dev'
  ];

  const prefixes = [
    'user', 'test', 'qa', 'demo', 'sample', 'mock', 'fake', 'dummy',
    'admin', 'guest', 'temp', 'dev', 'staging', 'prod', 'api', 'web'
  ];

  const generateEmail = () => {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${prefix}${randomNum}@${domain}`;
  };

  const generateEmails = () => {
    const newEmails = [];
    for (let i = 0; i < count; i++) {
      newEmails.push(generateEmail());
    }
    setEmails(newEmails);
  };

  const copyToClipboard = async (email, index) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyAllEmails = async () => {
    const emailList = emails.join('\n');
    try {
      await navigator.clipboard.writeText(emailList);
      setCopiedIndex('all');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center">
            <Mail size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Email Generator</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Generate random email addresses for testing purposes. Perfect for creating test accounts and data validation.
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
                  Number of emails
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

              <button
                onClick={generateEmails}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <RefreshCw size={16} />
                <span>Generate Emails</span>
              </button>

              {emails.length > 0 && (
                <button
                  onClick={copyAllEmails}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 glass hover:bg-dark-700/50 text-white font-medium rounded-lg transition-all duration-200"
                >
                  {copiedIndex === 'all' ? (
                    <>
                      <Check size={16} className="text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy All</span>
                    </>
                  )}
                </button>
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
              <h2 className="text-xl font-semibold text-white">Generated Emails</h2>
              {emails.length > 0 && (
                <span className="text-sm text-dark-400">
                  {emails.length} email{emails.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {emails.length === 0 ? (
              <div className="text-center py-12">
                <Mail size={48} className="text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400 text-lg">No emails generated yet</p>
                <p className="text-dark-500 text-sm">Click "Generate Emails" to create test email addresses</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg border border-dark-600 hover:border-dark-500 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                        <Mail size={14} className="text-primary-400" />
                      </div>
                      <span className="text-white font-mono text-sm">{email}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(email, index)}
                      className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 hover:bg-dark-600"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check size={12} className="text-green-400" />
                          <span className="text-green-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} className="text-dark-400" />
                          <span className="text-dark-400">Copy</span>
                        </>
                      )}
                    </button>
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

export default EmailGenerator;