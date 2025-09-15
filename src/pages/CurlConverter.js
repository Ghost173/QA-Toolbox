import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Trash2, ArrowRightLeft } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import BackButton from '../components/BackButton';

const CurlConverter = () => {
  const [curlCommand, setCurlCommand] = useState('');
  const [outputFormat, setOutputFormat] = useState('fetch');
  const [convertedCode, setConvertedCode] = useState('');
  const [error, setError] = useState('');

  const sampleCurl = `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-token-here" \\
  -d '{"name": "John Doe", "email": "john@example.com"}'`;

  const parseCurlCommand = (curl) => {
    const result = {
      method: 'GET',
      url: '',
      headers: {},
      body: null
    };

    // Remove 'curl' and split by lines
    const lines = curl.replace(/^curl\s+/, '').split(/\\\s*\n/).map(line => line.trim());
    
    for (const line of lines) {
      if (line.startsWith('-X ')) {
        result.method = line.substring(3).toUpperCase();
      } else if (line.startsWith('-H ')) {
        const header = line.substring(3).replace(/^["']|["']$/g, '');
        const [key, ...valueParts] = header.split(': ');
        result.headers[key] = valueParts.join(': ');
      } else if (line.startsWith('-d ') || line.startsWith('--data ')) {
        result.body = line.substring(line.startsWith('-d ') ? 3 : 8).replace(/^["']|["']$/g, '');
      } else if (line.startsWith('http')) {
        result.url = line;
      }
    }

    return result;
  };

  const generateFetchCode = (parsed) => {
    let code = `fetch('${parsed.url}', {\n`;
    code += `  method: '${parsed.method}',\n`;
    
    if (Object.keys(parsed.headers).length > 0) {
      code += `  headers: {\n`;
      Object.entries(parsed.headers).forEach(([key, value]) => {
        code += `    '${key}': '${value}',\n`;
      });
      code += `  },\n`;
    }
    
    if (parsed.body) {
      code += `  body: ${parsed.body},\n`;
    }
    
    code += `})\n`;
    code += `  .then(response => response.json())\n`;
    code += `  .then(data => console.log(data))\n`;
    code += `  .catch(error => console.error('Error:', error));`;
    
    return code;
  };

  const generateAxiosCode = (parsed) => {
    let code = `import axios from 'axios';\n\n`;
    
    const config = {
      method: parsed.method.toLowerCase(),
      url: parsed.url
    };
    
    if (Object.keys(parsed.headers).length > 0) {
      config.headers = parsed.headers;
    }
    
    if (parsed.body) {
      if (parsed.method === 'GET') {
        // For GET requests, parse body as query params
        try {
          const params = JSON.parse(parsed.body);
          config.params = params;
        } catch {
          config.data = parsed.body;
        }
      } else {
        config.data = parsed.body;
      }
    }
    
    code += `axios(${JSON.stringify(config, null, 2)})\n`;
    code += `  .then(response => console.log(response.data))\n`;
    code += `  .catch(error => console.error('Error:', error));`;
    
    return code;
  };

  const generateJavascriptCode = (parsed) => {
    let code = `const xhr = new XMLHttpRequest();\n`;
    code += `xhr.open('${parsed.method}', '${parsed.url}');\n\n`;
    
    Object.entries(parsed.headers).forEach(([key, value]) => {
      code += `xhr.setRequestHeader('${key}', '${value}');\n`;
    });
    
    code += `\nxhr.onreadystatechange = function() {\n`;
    code += `  if (xhr.readyState === 4) {\n`;
    code += `    if (xhr.status === 200) {\n`;
    code += `      console.log(JSON.parse(xhr.responseText));\n`;
    code += `    } else {\n`;
    code += `      console.error('Error:', xhr.status);\n`;
    code += `    }\n`;
    code += `  }\n`;
    code += `};\n\n`;
    
    if (parsed.body) {
      code += `xhr.send('${parsed.body}');\n`;
    } else {
      code += `xhr.send();\n`;
    }
    
    return code;
  };

  const convertCurl = () => {
    if (!curlCommand.trim()) {
      setError('Please enter a cURL command');
      setConvertedCode('');
      return;
    }

    try {
      const parsed = parseCurlCommand(curlCommand);
      
      if (!parsed.url) {
        throw new Error('Could not find URL in cURL command');
      }

      let code = '';
      switch (outputFormat) {
        case 'fetch':
          code = generateFetchCode(parsed);
          break;
        case 'axios':
          code = generateAxiosCode(parsed);
          break;
        case 'javascript':
          code = generateJavascriptCode(parsed);
          break;
        default:
          code = generateFetchCode(parsed);
      }

      setConvertedCode(code);
      setError('');
    } catch (err) {
      setError('Failed to parse cURL command: ' + err.message);
      setConvertedCode('');
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
    setCurlCommand('');
    setConvertedCode('');
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
            <Terminal size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">cURL to HTTP Request Converter</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Convert cURL commands to JavaScript fetch, axios, or XMLHttpRequest code for easy integration into your applications.
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
              <h2 className="text-xl font-semibold text-white">cURL Command</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurlCommand(sampleCurl)}
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
              value={curlCommand}
              onChange={(e) => setCurlCommand(e.target.value)}
              placeholder="Paste your cURL command here..."
              className="w-full h-64 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="format"
                    value="fetch"
                    checked={outputFormat === 'fetch'}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-white text-sm">Fetch</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="format"
                    value="axios"
                    checked={outputFormat === 'axios'}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-white text-sm">Axios</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="format"
                    value="javascript"
                    checked={outputFormat === 'javascript'}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-white text-sm">XHR</span>
                </label>
              </div>
              <button
                onClick={convertCurl}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <ArrowRightLeft size={16} />
                <span>Convert</span>
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
                {outputFormat === 'fetch' ? 'Fetch Code' : 
                 outputFormat === 'axios' ? 'Axios Code' : 
                 'XMLHttpRequest Code'}
              </h2>
              {convertedCode && (
                <button
                  onClick={() => copyToClipboard(convertedCode)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                >
                  <Copy size={12} />
                  <span>Copy</span>
                </button>
              )}
            </div>

            <div className="h-64 overflow-auto bg-dark-800 rounded-lg border border-dark-600">
              {convertedCode ? (
                <SyntaxHighlighter
                  language="javascript"
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
                  {convertedCode}
                </SyntaxHighlighter>
              ) : (
                <div className="flex items-center justify-center h-full text-dark-500">
                  <div className="text-center">
                    <Terminal size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No converted code</p>
                    <p className="text-sm">Enter a cURL command and click "Convert" to see the result</p>
                  </div>
                </div>
              )}
            </div>

            {convertedCode && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400">
                  <ArrowRightLeft size={16} />
                  <span className="text-sm font-medium">
                    cURL command converted to {outputFormat} successfully
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

export default CurlConverter;
