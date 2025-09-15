import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Plus, X, Copy, Trash2, Upload, Download, Eye, Code2 } from 'lucide-react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import BackButton from '../components/BackButton';

const SwaggerEditor = () => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      name: 'API Spec 1',
      content: '',
      isValid: null,
      error: '',
      spec: null
    }
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [viewMode, setViewMode] = useState('editor'); // 'editor' or 'preview'
  const fileInputRef = useRef(null);

  const sampleSwagger = `{
  "openapi": "3.0.0",
  "info": {
    "title": "Sample API",
    "version": "1.0.0",
    "description": "A sample API for testing"
  },
  "servers": [
    {
      "url": "https://api.example.com/v1"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Get all users",
        "responses": {
          "200": {
            "description": "List of users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Create a new user",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/User"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User created successfully"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "required": ["name", "email"],
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          },
          "email": {
            "type": "string",
            "format": "email"
          }
        }
      }
    }
  }
}`;

  const validateSwagger = (content) => {
    if (!content.trim()) {
      return { isValid: null, error: '', spec: null };
    }

    try {
      const parsed = JSON.parse(content);
      
      // Basic validation
      if (!parsed.openapi && !parsed.swagger) {
        return { isValid: false, error: 'Missing OpenAPI/Swagger version', spec: null };
      }
      
      if (!parsed.info) {
        return { isValid: false, error: 'Missing info section', spec: null };
      }
      
      if (!parsed.paths) {
        return { isValid: false, error: 'Missing paths section', spec: null };
      }

      return { isValid: true, error: '', spec: parsed };
    } catch (err) {
      return { isValid: false, error: 'Invalid JSON: ' + err.message, spec: null };
    }
  };

  const addTab = () => {
    const newTab = {
      id: nextId,
      name: `API Spec ${nextId}`,
      content: '',
      isValid: null,
      error: '',
      spec: null
    };
    setTabs([...tabs, newTab]);
    setActiveTab(nextId);
    setNextId(nextId + 1);
  };

  const removeTab = (tabId) => {
    if (tabs.length === 1) return; // Don't remove the last tab
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const updateTabContent = (tabId, content) => {
    const validation = validateSwagger(content);
    setTabs(tabs.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, ...validation }
        : tab
    ));
  };

  const updateTabName = (tabId, name) => {
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, name } : tab
    ));
  };

  const loadSample = (tabId) => {
    updateTabContent(tabId, sampleSwagger);
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearTab = (tabId) => {
    updateTabContent(tabId, '');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      updateTabContent(activeTab, content);
    };
    reader.readAsText(file);
  };

  const downloadSpec = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (!activeTabData?.content) return;

    const blob = new Blob([activeTabData.content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTabData.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateSamplePayload = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab || !tab.content || !tab.isValid) return;

    try {
      const spec = JSON.parse(tab.content);
      const samples = [];

      // Find all POST/PUT endpoints with request bodies
      Object.entries(spec.paths || {}).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, operation]) => {
          if (['post', 'put', 'patch'].includes(method.toLowerCase()) && operation.requestBody) {
            const schema = operation.requestBody.content?.['application/json']?.schema;
            if (schema) {
              const sample = generateSampleFromSchema(schema, spec.components?.schemas || {});
              samples.push({
                path,
                method: method.toUpperCase(),
                operationId: operation.operationId,
                sample
              });
            }
          }
        });
      });

      if (samples.length > 0) {
        const sampleText = samples.map(s => 
          `// ${s.method} ${s.path}\n${JSON.stringify(s.sample, null, 2)}`
        ).join('\n\n');
        
        // Create a new tab for samples
        const newTab = {
          id: nextId,
          name: `${tab.name} - Samples`,
          content: sampleText,
          isValid: true,
          error: '',
          spec: null
        };
        setTabs([...tabs, newTab]);
        setActiveTab(nextId);
        setNextId(nextId + 1);
      }
    } catch (err) {
      console.error('Failed to generate samples:', err);
    }
  };

  const generateSampleFromSchema = (schema, components) => {
    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop();
      return generateSampleFromSchema(components[refName] || {}, components);
    }

    if (schema.type === 'object') {
      const obj = {};
      Object.entries(schema.properties || {}).forEach(([key, prop]) => {
        obj[key] = generateSampleFromSchema(prop, components);
      });
      return obj;
    }

    if (schema.type === 'array') {
      return [generateSampleFromSchema(schema.items || {}, components)];
    }

    if (schema.enum) {
      return schema.enum[0];
    }

    if (schema.example !== undefined) {
      return schema.example;
    }

    // Generate based on type
    switch (schema.type) {
      case 'string':
        if (schema.format === 'email') return 'user@example.com';
        if (schema.format === 'date-time') return new Date().toISOString();
        if (schema.format === 'uuid') return '123e4567-e89b-12d3-a456-426614174000';
        return 'string';
      case 'integer':
        return 123;
      case 'number':
        return 123.45;
      case 'boolean':
        return true;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return null;
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

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
            <FileCode size={20} className="text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Swagger Editor</h1>
        </div>
        <p className="text-dark-300 text-lg">
          Multi-instance OpenAPI/Swagger spec editor with real-time validation and interactive preview.
        </p>
      </motion.div>

      {/* Tab Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-6"
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <input
                  type="text"
                  value={tab.name}
                  onChange={(e) => updateTabName(tab.id, e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium min-w-0 flex-1"
                  onClick={(e) => e.stopPropagation()}
                />
                {tab.isValid === true && (
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                )}
                {tab.isValid === false && (
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                )}
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTab(tab.id);
                    }}
                    className="text-dark-400 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addTab}
              className="flex items-center space-x-2 px-4 py-2 text-dark-300 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-200"
            >
              <Plus size={16} />
              <span>New Tab</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* View Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-6"
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="viewMode"
                  value="editor"
                  checked={viewMode === 'editor'}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <Code2 size={16} />
                <span className="text-white text-sm">Editor</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="viewMode"
                  value="preview"
                  checked={viewMode === 'preview'}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <Eye size={16} />
                <span className="text-white text-sm">Preview</span>
              </label>
            </div>

            <div className="flex space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.yaml,.yml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
              >
                <Upload size={12} />
                <span>Upload</span>
              </button>
              <button
                onClick={downloadSpec}
                className="flex items-center space-x-2 px-3 py-2 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
              >
                <Download size={12} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {viewMode === 'editor' ? (
          /* Editor View */
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">OpenAPI/Swagger Editor</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => loadSample(activeTab)}
                    className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                  >
                    Load Sample
                  </button>
                  {activeTabData?.isValid === true && (
                    <button
                      onClick={() => generateSamplePayload(activeTab)}
                      className="px-3 py-1.5 text-xs font-medium bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-md transition-colors"
                    >
                      Generate Samples
                    </button>
                  )}
                  <button
                    onClick={() => clearTab(activeTab)}
                    className="px-3 py-1.5 text-xs font-medium bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors"
                  >
                    <Trash2 size={12} className="inline mr-1" />
                    Clear
                  </button>
                  <button
                    onClick={() => copyToClipboard(activeTabData?.content || '')}
                    className="px-3 py-1.5 text-xs font-medium bg-dark-700 hover:bg-dark-600 text-white rounded-md transition-colors"
                  >
                    <Copy size={12} className="inline mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              <textarea
                value={activeTabData?.content || ''}
                onChange={(e) => updateTabContent(activeTab, e.target.value)}
                placeholder="Paste your OpenAPI/Swagger spec here..."
                className="w-full h-96 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />

              {activeTabData?.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
                >
                  <p className="text-red-400 text-sm font-mono">{activeTabData.error}</p>
                </motion.div>
              )}

              {activeTabData?.isValid === true && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-green-400">
                    <FileCode size={16} />
                    <span className="text-sm font-medium">Valid OpenAPI/Swagger specification</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Preview View */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Interactive Preview</h2>
                {activeTabData?.isValid === true && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Eye size={16} />
                    <span className="text-sm font-medium">Valid Spec</span>
                  </div>
                )}
              </div>

              <div className="h-96 overflow-auto bg-white rounded-lg border border-dark-600">
                {activeTabData?.content && activeTabData?.isValid === true ? (
                  <div className="swagger-ui-container">
                    <SwaggerUI
                      spec={activeTabData.spec}
                      docExpansion="list"
                      defaultModelsExpandDepth={1}
                      defaultModelExpandDepth={1}
                      displayRequestDuration={true}
                      tryItOutEnabled={true}
                      requestInterceptor={(request) => {
                        // Add CORS headers for testing
                        request.headers['Access-Control-Allow-Origin'] = '*';
                        return request;
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-500">
                    <div className="text-center">
                      <FileCode size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No valid spec to preview</p>
                      <p className="text-sm">Enter a valid OpenAPI/Swagger specification to see the interactive preview</p>
                    </div>
                  </div>
                )}
              </div>

              {activeTabData?.content && activeTabData?.isValid === true && (
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Eye size={16} />
                    <span className="text-sm font-medium">
                      Interactive preview ready - you can test API endpoints directly
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SwaggerEditor;