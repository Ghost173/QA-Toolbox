import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Copy, Trash2, ArrowUpDown } from 'lucide-react';
import { diffWords, diffChars, diffLines } from 'diff';
import BackButton from '../components/BackButton';

const TextDiffTool = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffType, setDiffType] = useState('words');
  const [diffResult, setDiffResult] = useState([]);
  const [error, setError] = useState('');

  const sampleText1 = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}`;

  const sampleText2 = `{
  "name": "Jane Smith",
  "age": 28,
  "email": "jane@example.com",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "zipCode": "90210"
  },
  "phone": "+1-555-123-4567"
}`;

  const diffTypes = [
    { value: 'words', label: 'Word Level' },
    { value: 'chars', label: 'Character Level' },
    { value: 'lines', label: 'Line Level' }
  ];

  const performDiff = () => {
    if (!text1.trim() && !text2.trim()) {
      setError('Please enter text in at least one field');
      setDiffResult([]);
      return;
    }

    try {
      let diff;
      switch (diffType) {
        case 'words':
          diff = diffWords(text1, text2);
          break;
        case 'chars':
          diff = diffChars(text1, text2);
          break;
        case 'lines':
          diff = diffLines(text1, text2);
          break;
        default:
          diff = diffWords(text1, text2);
      }

      setDiffResult(diff);
      setError('');
    } catch (err) {
      setError('Failed to perform diff: ' + err.message);
      setDiffResult([]);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
    setDiffResult([]);
    setError('');
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDiffResult([]);
    setError('');
  };

  const renderDiff = () => {
    if (diffResult.length === 0) return null;

    return (
      <div className="space-y-1">
        {diffResult.map((part, index) => {
          const className = part.added 
            ? 'bg-green-900/30 text-green-300 border-l-2 border-green-500' 
            : part.removed 
            ? 'bg-red-900/30 text-red-300 border-l-2 border-red-500'
            : 'text-white';
          
          return (
            <div key={index} className={`px-3 py-1 font-mono text-sm ${className}`}>
              {part.value}
            </div>
          );
        })}
      </div>
    );
  };

  const getStats = () => {
    if (diffResult.length === 0) return null;

    const added = diffResult.filter(part => part.added).length;
    const removed = diffResult.filter(part => part.removed).length;
    const unchanged = diffResult.filter(part => !part.added && !part.removed).length;

    return { added, removed, unchanged };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center">
            <GitCompare size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Text Diff Tool</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Compare two text blocks and highlight differences at word, character, or line level.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Text 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Text 1</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setText1(sampleText1)}
                  className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={() => copyToClipboard(text1)}
                  className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  <Copy size={12} className="inline mr-1" />
                  Copy
                </button>
              </div>
            </div>

            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter first text block..."
              className="w-full h-64 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </motion.div>

        {/* Text 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Text 2</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setText2(sampleText2)}
                  className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={() => copyToClipboard(text2)}
                  className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  <Copy size={12} className="inline mr-1" />
                  Copy
                </button>
              </div>
            </div>

            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter second text block..."
              className="w-full h-64 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-6"
      >
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Diff Type
                </label>
                <div className="flex space-x-4">
                  {diffTypes.map(type => (
                    <label key={type.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="diffType"
                        value={type.value}
                        checked={diffType === type.value}
                        onChange={(e) => setDiffType(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-white text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={swapTexts}
                className="flex items-center space-x-2 px-4 py-2 glass hover:bg-dark-700/50 text-white font-medium rounded-lg transition-all duration-200"
              >
                <ArrowUpDown size={16} />
                <span>Swap</span>
              </button>
              <button
                onClick={performDiff}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <GitCompare size={16} />
                <span>Compare</span>
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg transition-colors duration-200"
              >
                <Trash2 size={16} className="inline mr-2" />
                Clear
              </button>
            </div>
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

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Diff Results</h2>
            {stats && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-green-400">{stats.added} added</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-red-400">{stats.removed} removed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-500 rounded"></div>
                  <span className="text-gray-400">{stats.unchanged} unchanged</span>
                </div>
              </div>
            )}
          </div>

          <div className="h-96 overflow-auto bg-dark-800 rounded-lg border border-dark-600 p-4">
            {diffResult.length > 0 ? (
              renderDiff()
            ) : (
              <div className="flex items-center justify-center h-full text-dark-500">
                <div className="text-center">
                  <GitCompare size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No diff results</p>
                  <p className="text-sm">Enter text in both fields and click "Compare" to see differences</p>
                </div>
              </div>
            )}
          </div>

          {diffResult.length > 0 && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-400">
                <GitCompare size={16} />
                <span className="text-sm font-medium">
                  Diff completed successfully - {diffType} level comparison
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TextDiffTool;
