import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Copy, Trash2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import BackButton from '../components/BackButton';

const JsonValidator = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState('');
  const [formattedJson, setFormattedJson] = useState('');

  const validateJson = () => {
    if (!jsonInput.trim()) {
      setIsValid(null);
      setError('');
      setFormattedJson('');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      setError(err.message);
      setFormattedJson('');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearInput = () => {
    setJsonInput('');
    setIsValid(null);
    setError('');
    setFormattedJson('');
  };

  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"]
}`;

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
            <FileText size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">JSON Validator</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Validate and format JSON data with real-time syntax checking and error detection.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">JSON Input</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setJsonInput(sampleJson)}
                  className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={clearInput}
                  className="px-3 py-1.5 text-xs font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors"
                >
                  <Trash2 size={12} className="inline mr-1" />
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              onBlur={validateJson}
              placeholder="Paste your JSON here..."
              className="w-full h-96 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isValid === true && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Valid JSON</span>
                  </div>
                )}
                {isValid === false && (
                  <div className="flex items-center space-x-2 text-red-400">
                    <XCircle size={16} />
                    <span className="text-sm font-medium">Invalid JSON</span>
                  </div>
                )}
              </div>
              <button
                onClick={validateJson}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Validate
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Formatted Output</h2>
              {formattedJson && (
                <button
                  onClick={() => copyToClipboard(formattedJson)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  <Copy size={12} />
                  <span>Copy</span>
                </button>
              )}
            </div>

            <div className="h-96 overflow-auto bg-dark-800 rounded-lg border border-dark-600">
              {formattedJson ? (
                <SyntaxHighlighter
                  language="json"
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                  showLineNumbers
                  wrapLines
                >
                  {formattedJson}
                </SyntaxHighlighter>
              ) : (
                <div className="flex items-center justify-center h-full text-dark-500">
                  <div className="text-center">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No formatted JSON</p>
                    <p className="text-sm">Enter valid JSON to see formatted output</p>
                  </div>
                </div>
              )}
            </div>

            {formattedJson && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">JSON is valid and formatted</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JsonValidator;