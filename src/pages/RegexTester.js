import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Regex, Copy, Trash2, Play, AlertCircle } from 'lucide-react';
import BackButton from '../components/BackButton';

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const samplePattern = '\\b\\w+@\\w+\\.\\w+\\b';
  const sampleText = 'Contact us at john@example.com or support@company.org for assistance.';

  const testRegex = () => {
    if (!pattern.trim()) {
      setError('Please enter a regex pattern');
      setMatches([]);
      return;
    }

    if (!testText.trim()) {
      setError('Please enter test text');
      setMatches([]);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches = [];
      let match;

      while ((match = regex.exec(testText)) !== null) {
        foundMatches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          fullMatch: match
        });

        // Prevent infinite loop on zero-length matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }

      setMatches(foundMatches);
      setError('');
    } catch (err) {
      setError('Invalid regex pattern: ' + err.message);
      setMatches([]);
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
    setPattern('');
    setTestText('');
    setMatches([]);
    setError('');
  };

  const highlightMatches = (text, matches) => {
    if (matches.length === 0) return text;

    let highlightedText = text;
    let offset = 0;

    matches.forEach((match, index) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const before = highlightedText.substring(0, start);
      const matchText = highlightedText.substring(start, end);
      const after = highlightedText.substring(end);

      highlightedText = before + 
        `<mark class="bg-yellow-400 text-black px-1 rounded" data-match="${index}">${matchText}</mark>` + 
        after;
      
      offset += 25; // Approximate offset for added HTML
    });

    return highlightedText;
  };

  const commonPatterns = [
    { name: 'Email', pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b' },
    { name: 'Phone', pattern: '\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b' },
    { name: 'URL', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?' },
    { name: 'IPv4', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\b(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}\\b' },
    { name: 'Credit Card', pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b' }
  ];

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
            <Regex size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Regex Tester</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Test regular expressions against sample text with real-time highlighting and match details.
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
              <h2 className="text-xl font-semibold text-white">Regex Pattern</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPattern(samplePattern)}
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

            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-300 mb-2">Flags</label>
              <div className="flex space-x-4">
                {['g', 'i', 'm', 's'].map(flag => (
                  <label key={flag} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={flags.includes(flag)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFlags(flags + flag);
                        } else {
                          setFlags(flags.replace(flag, ''));
                        }
                      }}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-white text-sm font-mono">{flag}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-dark-300 mb-2">Common Patterns:</h3>
              <div className="grid grid-cols-2 gap-2">
                {commonPatterns.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setPattern(item.pattern)}
                    className="text-left px-3 py-2 text-xs font-mono bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white rounded transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={testRegex}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Play size={16} />
              <span>Test Regex</span>
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} className="text-red-400" />
                  <p className="text-red-400 text-sm font-mono">{error}</p>
                </div>
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
              <h2 className="text-xl font-semibold text-white">Test Text</h2>
              <button
                onClick={() => setTestText(sampleText)}
                className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
              >
                Load Sample
              </button>
            </div>

            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test against the regex pattern..."
              className="w-full h-48 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none mb-4"
            />

            <div className="mb-4">
              <h3 className="text-lg font-medium text-white mb-2">Highlighted Text</h3>
              <div className="h-32 overflow-auto bg-dark-800 rounded-lg border border-dark-600 p-3">
                {matches.length > 0 ? (
                  <div 
                    className="text-white font-mono text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightMatches(testText, matches) 
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-500">
                    <p className="text-sm">No matches found</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">Matches ({matches.length})</h3>
                {matches.length > 0 && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(matches, null, 2))}
                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                )}
              </div>
              <div className="h-32 overflow-auto bg-dark-800 rounded-lg border border-dark-600 p-3">
                {matches.length > 0 ? (
                  <div className="space-y-2">
                    {matches.map((match, index) => (
                      <div key={index} className="text-white font-mono text-sm">
                        <span className="text-primary-400">Match {index + 1}:</span> "{match.match}" 
                        <span className="text-dark-400 ml-2">(at position {match.index})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-500">
                    <p className="text-sm">No matches found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegexTester;
