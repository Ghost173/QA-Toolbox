import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Copy, RefreshCw, Clock } from 'lucide-react';
import BackButton from '../components/BackButton';

const DateTimeFormatter = () => {
  const [inputDate, setInputDate] = useState('');
  const [inputFormat, setInputFormat] = useState('auto');
  const [outputFormats, setOutputFormats] = useState({
    iso: true,
    unix: true,
    readable: true,
    custom: false
  });
  const [customFormat, setCustomFormat] = useState('YYYY-MM-DD HH:mm:ss');
  const [results, setResults] = useState({});
  const [error, setError] = useState('');

  const formatOptions = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'iso', label: 'ISO 8601' },
    { value: 'unix', label: 'Unix Timestamp' },
    { value: 'readable', label: 'Readable Format' },
    { value: 'custom', label: 'Custom Format' }
  ];

  const commonFormats = [
    'YYYY-MM-DD',
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY-MM-DD HH:mm:ss',
    'MMM DD, YYYY',
    'DD MMM YYYY',
    'YYYY-MM-DDTHH:mm:ss.sssZ'
  ];

  const parseDate = (dateString, format) => {
    let date;

    if (format === 'auto') {
      // Try to auto-detect format
      if (/^\d{10}$/.test(dateString)) {
        // Unix timestamp (seconds)
        date = new Date(parseInt(dateString) * 1000);
      } else if (/^\d{13}$/.test(dateString)) {
        // Unix timestamp (milliseconds)
        date = new Date(parseInt(dateString));
      } else {
        // Try parsing as ISO or other standard formats
        date = new Date(dateString);
      }
    } else if (format === 'unix') {
      if (dateString.length === 10) {
        date = new Date(parseInt(dateString) * 1000);
      } else if (dateString.length === 13) {
        date = new Date(parseInt(dateString));
      } else {
        throw new Error('Invalid Unix timestamp format');
      }
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    return date;
  };

  const formatDate = (date, format) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'unix':
        return Math.floor(date.getTime() / 1000).toString();
      case 'readable':
        return date.toLocaleString();
      case 'custom':
        return customFormat
          .replace('YYYY', year)
          .replace('MM', month)
          .replace('DD', day)
          .replace('HH', hours)
          .replace('mm', minutes)
          .replace('ss', seconds)
          .replace('sss', milliseconds)
          .replace('MMM', monthNames[date.getMonth()]);
      default:
        return date.toString();
    }
  };

  const convertDate = () => {
    if (!inputDate.trim()) {
      setError('Please enter a date');
      setResults({});
      return;
    }

    try {
      const date = parseDate(inputDate, inputFormat);
      const newResults = {};

      if (outputFormats.iso) {
        newResults.iso = formatDate(date, 'iso');
      }
      if (outputFormats.unix) {
        newResults.unix = formatDate(date, 'unix');
      }
      if (outputFormats.readable) {
        newResults.readable = formatDate(date, 'readable');
      }
      if (outputFormats.custom) {
        newResults.custom = formatDate(date, 'custom');
      }

      setResults(newResults);
      setError('');
    } catch (err) {
      setError('Failed to parse date: ' + err.message);
      setResults({});
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const setCurrentTime = () => {
    const now = new Date();
    setInputDate(now.toISOString());
    setInputFormat('iso');
  };

  const clearAll = () => {
    setInputDate('');
    setResults({});
    setError('');
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
            <Calendar size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Date/Time Formatter</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Convert dates between different formats including ISO 8601, Unix timestamps, and custom formats.
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
              <h2 className="text-xl font-semibold text-white">Input Date</h2>
              <div className="flex space-x-2">
                <button
                  onClick={setCurrentTime}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  <Clock size={12} />
                  <span>Now</span>
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1.5 text-xs font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Date String
                </label>
                <input
                  type="text"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  placeholder="Enter date (e.g., 2023-12-25, 1703462400, Dec 25, 2023)"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Input Format
                </label>
                <select
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {formatOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Output Formats
                </label>
                <div className="space-y-2">
                  {Object.entries(outputFormats).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setOutputFormats({
                          ...outputFormats,
                          [key]: e.target.checked
                        })}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-white text-sm capitalize">
                        {key === 'iso' ? 'ISO 8601' : 
                         key === 'unix' ? 'Unix Timestamp' :
                         key === 'readable' ? 'Readable Format' :
                         key === 'custom' ? 'Custom Format' : key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {outputFormats.custom && (
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Custom Format
                  </label>
                  <input
                    type="text"
                    value={customFormat}
                    onChange={(e) => setCustomFormat(e.target.value)}
                    placeholder="YYYY-MM-DD HH:mm:ss"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-dark-400 mt-1">
                    Available tokens: YYYY, MM, DD, HH, mm, ss, sss, MMM
                  </p>
                </div>
              )}

              <button
                onClick={convertDate}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <RefreshCw size={16} />
                <span>Convert Date</span>
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
                >
                  <p className="text-red-400 text-sm font-mono">{error}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Converted Formats</h2>

            {Object.keys(results).length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={48} className="text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400 text-lg">No conversions yet</p>
                <p className="text-dark-500 text-sm">Enter a date and click "Convert Date" to see results</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(results).map(([format, value]) => (
                  <div key={format} className="p-4 bg-dark-700/50 rounded-lg border border-dark-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-primary-400 uppercase">
                        {format === 'iso' ? 'ISO 8601' : 
                         format === 'unix' ? 'Unix Timestamp' :
                         format === 'readable' ? 'Readable Format' :
                         format === 'custom' ? 'Custom Format' : format}
                      </h3>
                      <button
                        onClick={() => copyToClipboard(value)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-dark-600 hover:bg-dark-500 text-white rounded transition-colors"
                      >
                        <Copy size={12} />
                        <span>Copy</span>
                      </button>
                    </div>
                    <p className="text-white font-mono text-sm break-all">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DateTimeFormatter;
