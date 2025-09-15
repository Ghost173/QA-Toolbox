import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Trash2, ArrowUpDown } from 'lucide-react';
import BackButton from '../components/BackButton';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
    } catch (err) {
      setError('Failed to encode: ' + err.message);
      setOutput('');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('Failed to decode: ' + err.message);
      setOutput('');
    }
  };

  const handleProcess = () => {
    if (!input.trim()) {
      setError('Please enter some text to process');
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput('');
    setError('');
  };

  const sampleText = 'Hello, World! This is a test string for Base64 encoding.';

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
            <Code size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Base64 Encoder/Decoder</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Encode and decode strings using Base64 encoding. Perfect for testing API payloads and data transmission.
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
              <h2 className="text-xl font-semibold text-white">
                {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setInput(sampleText)}
                  className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1.5 text-xs font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors"
                >
                  <Trash2 size={12} className="inline mr-1" />
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
              className="w-full h-64 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="mode"
                    value="encode"
                    checked={mode === 'encode'}
                    onChange={(e) => setMode(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-white text-sm">Encode</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="mode"
                    value="decode"
                    checked={mode === 'decode'}
                    onChange={(e) => setMode(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-white text-sm">Decode</span>
                </label>
              </div>
              <button
                onClick={handleProcess}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                {mode === 'encode' ? 'Encode' : 'Decode'}
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
              <h2 className="text-xl font-semibold text-white">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </h2>
              {output && (
                <div className="flex space-x-2">
                  <button
                    onClick={swapMode}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                  >
                    <ArrowUpDown size={12} />
                    <span>Swap</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(output)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                </div>
              )}
            </div>

            <div className="h-64 overflow-auto bg-dark-800 rounded-lg border border-dark-600 p-4">
              {output ? (
                <pre className="text-white font-mono text-sm whitespace-pre-wrap break-all">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-dark-500">
                  <div className="text-center">
                    <Code size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No output</p>
                    <p className="text-sm">
                      {mode === 'encode' 
                        ? 'Enter text and click "Encode" to see Base64 output'
                        : 'Enter Base64 string and click "Decode" to see decoded text'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {output && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400">
                  <Code size={16} />
                  <span className="text-sm font-medium">
                    {mode === 'encode' ? 'Text encoded successfully' : 'Base64 decoded successfully'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Base64Tool;
