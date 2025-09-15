import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Trash2 } from 'lucide-react';
import BackButton from '../components/BackButton';

const JsonPathFinder = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [selectedPath, setSelectedPath] = useState('');
  const [parsedJson, setParsedJson] = useState(null);

  const sampleJson = `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "zipCode": "10001"
      }
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "address": {
        "street": "456 Oak Ave",
        "city": "Los Angeles",
        "zipCode": "90210"
      }
    }
  ],
  "total": 2
}`;


  const parseJsonInput = () => {
    if (!jsonInput.trim()) {
      setParsedJson(null);
      return;
    }

    try {
      const jsonData = JSON.parse(jsonInput);
      setParsedJson(jsonData);
      setError('');
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setParsedJson(null);
    }
  };

  const getPathForElement = (element, path = '$') => {
    if (Array.isArray(element)) {
      return element.map((item, index) => getPathForElement(item, `${path}[${index}]`));
    } else if (element && typeof element === 'object') {
      return Object.entries(element).map(([key, value]) => ({
        key,
        value,
        path: `${path}.${key}`,
        children: getPathForElement(value, `${path}.${key}`)
      }));
    } else {
      return { value: element, path };
    }
  };

  const handleElementClick = (path) => {
    setSelectedPath(path);
  };

  const renderJsonWithPaths = (data, path = '$', level = 0) => {
    if (data === null || data === undefined) {
      return <span className="text-gray-400">null</span>;
    }

    if (typeof data === 'string') {
      return (
        <span 
          className="text-green-400 cursor-pointer hover:bg-yellow-200 hover:text-black px-2 py-1 rounded transition-all duration-200 hover:scale-105"
          onClick={() => handleElementClick(path)}
          title={`Click to select path: ${path}`}
        >
          "{data}"
        </span>
      );
    }

    if (typeof data === 'number') {
      return (
        <span 
          className="text-blue-400 cursor-pointer hover:bg-yellow-200 hover:text-black px-2 py-1 rounded transition-all duration-200 hover:scale-105"
          onClick={() => handleElementClick(path)}
          title={`Click to select path: ${path}`}
        >
          {data}
        </span>
      );
    }

    if (typeof data === 'boolean') {
      return (
        <span 
          className="text-purple-400 cursor-pointer hover:bg-yellow-200 hover:text-black px-2 py-1 rounded transition-all duration-200 hover:scale-105"
          onClick={() => handleElementClick(path)}
          title={`Click to select path: ${path}`}
        >
          {data.toString()}
        </span>
      );
    }

    if (Array.isArray(data)) {
      return (
        <div className="inline-block">
          <span className="text-gray-300">[</span>
          <div className="ml-6 space-y-1">
            {data.map((item, index) => (
              <div key={index} className="flex items-start group">
                <span 
                  className="text-gray-400 cursor-pointer hover:bg-yellow-200 hover:text-black px-2 py-1 rounded mr-3 transition-all duration-200 hover:scale-105 min-w-0 flex-shrink-0"
                  onClick={() => handleElementClick(`${path}[${index}]`)}
                  title={`Click to select path: ${path}[${index}]`}
                >
                  {index}:
                </span>
                <div className="flex-1 min-w-0">
                  {renderJsonWithPaths(item, `${path}[${index}]`, level + 1)}
                </div>
                {index < data.length - 1 && <span className="text-gray-400 ml-2">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-300">]</span>
        </div>
      );
    }

    if (typeof data === 'object') {
      return (
        <div className="inline-block">
          <span className="text-gray-300">{'{'}</span>
          <div className="ml-6 space-y-1">
            {Object.entries(data).map(([key, value], index, array) => (
              <div key={key} className="flex items-start group">
                <span 
                  className="text-yellow-400 cursor-pointer hover:bg-yellow-200 hover:text-black px-2 py-1 rounded mr-3 transition-all duration-200 hover:scale-105 min-w-0 flex-shrink-0"
                  onClick={() => handleElementClick(`${path}.${key}`)}
                  title={`Click to select path: ${path}.${key}`}
                >
                  "{key}":
                </span>
                <div className="flex-1 min-w-0">
                  {renderJsonWithPaths(value, `${path}.${key}`, level + 1)}
                </div>
                {index < array.length - 1 && <span className="text-gray-400 ml-2">,</span>}
              </div>
            ))}
          </div>
          <span className="text-gray-300">{'}'}</span>
        </div>
      );
    }

    return <span className="text-gray-400">{String(data)}</span>;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearAll = () => {
    setJsonInput('');
    setSelectedPath('');
    setError('');
    setParsedJson(null);
  };

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
            <Search size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">JSONPath Finder</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Interactive JSON viewer with clickable elements. Click on any JSON element to get its path automatically.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">JSON Data</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setJsonInput(sampleJson)}
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
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                // Auto-parse when JSON changes
                setTimeout(() => {
                  if (e.target.value.trim()) {
                    try {
                      const jsonData = JSON.parse(e.target.value);
                      setParsedJson(jsonData);
                      setError('');
                    } catch (err) {
                      setError('Invalid JSON: ' + err.message);
                      setParsedJson(null);
                    }
                  } else {
                    setParsedJson(null);
                    setError('');
                  }
                }, 100);
              }}
              placeholder="Paste your JSON data here..."
              className="w-full h-96 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />

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

        {/* Interactive JSON Viewer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Interactive JSON Viewer</h2>
              {parsedJson && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-400">Valid JSON</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(parsedJson, null, 2))}
                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                </div>
              )}
            </div>

            <div className="h-96 overflow-auto bg-dark-800 rounded-lg border border-dark-600 p-4">
              {parsedJson ? (
                <div className="font-mono text-sm leading-relaxed">
                  {renderJsonWithPaths(parsedJson)}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-dark-500">
                  <div className="text-center">
                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No JSON to display</p>
                    <p className="text-sm">Enter valid JSON to see interactive viewer</p>
                  </div>
                </div>
              )}
            </div>

            {selectedPath && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Search size={16} />
                    <span className="text-sm font-medium">Selected Path:</span>
                    <span className="font-mono text-sm bg-blue-600/20 px-2 py-1 rounded">{selectedPath}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedPath)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy Path</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JsonPathFinder;