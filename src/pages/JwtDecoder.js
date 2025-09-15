import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Trash2, Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import BackButton from '../components/BackButton';

const JwtDecoder = () => {
  const [jwtToken, setJwtToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const decodeJWT = () => {
    if (!jwtToken.trim()) {
      setError('Please enter a JWT token');
      setHeader('');
      setPayload('');
      setSignature('');
      return;
    }

    try {
      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT should have 3 parts separated by dots.');
      }

      // Decode header
      const headerDecoded = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      setHeader(JSON.stringify(JSON.parse(headerDecoded), null, 2));

      // Decode payload
      const payloadDecoded = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      setPayload(JSON.stringify(JSON.parse(payloadDecoded), null, 2));

      // Signature (not decoded, just displayed)
      setSignature(parts[2]);

      setError('');
    } catch (err) {
      setError('Failed to decode JWT: ' + err.message);
      setHeader('');
      setPayload('');
      setSignature('');
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
    setJwtToken('');
    setHeader('');
    setPayload('');
    setSignature('');
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
            <Key size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">JWT Decoder</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Decode JWT tokens to view header and payload information. No signature verification is performed.
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
              <h2 className="text-xl font-semibold text-white">JWT Token</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setJwtToken(sampleJWT)}
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
              value={jwtToken}
              onChange={(e) => setJwtToken(e.target.value)}
              placeholder="Paste your JWT token here..."
              className="w-full h-32 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />

            <button
              onClick={decodeJWT}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Eye size={16} />
              <span>Decode JWT</span>
            </button>

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
            <h2 className="text-xl font-semibold text-white mb-4">Decoded Information</h2>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">Header</h3>
                {header && (
                  <button
                    onClick={() => copyToClipboard(header)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                )}
              </div>
              <div className="h-32 overflow-auto bg-dark-800 rounded-lg border border-dark-600">
                {header ? (
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
                    {header}
                  </SyntaxHighlighter>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-500">
                    <p className="text-sm">No header data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payload */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">Payload</h3>
                {payload && (
                  <button
                    onClick={() => copyToClipboard(payload)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                )}
              </div>
              <div className="h-32 overflow-auto bg-dark-800 rounded-lg border border-dark-600">
                {payload ? (
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
                    {payload}
                  </SyntaxHighlighter>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-500">
                    <p className="text-sm">No payload data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">Signature</h3>
                {signature && (
                  <button
                    onClick={() => copyToClipboard(signature)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                )}
              </div>
              <div className="h-16 overflow-auto bg-dark-800 rounded-lg border border-dark-600 p-3">
                {signature ? (
                  <p className="text-white font-mono text-sm break-all">{signature}</p>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-500">
                    <p className="text-sm">No signature data</p>
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

export default JwtDecoder;
