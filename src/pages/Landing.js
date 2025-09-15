import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  FileText,
  Search,
  Hash,
  FileCode,
  Code,
  Key,
  Regex,
  Calendar,
  User,
  Terminal,
  GitCompare,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

const tools = [
  {
    path: '/email-generator',
    icon: Mail,
    title: 'Email Generator',
    description: 'Generate random emails for testing with copy functionality'
  },
  {
    path: '/json-validator',
    icon: FileText,
    title: 'JSON Validator',
    description: 'Validate JSON syntax with real-time error detection'
  },
  {
    path: '/jsonpath-finder',
    icon: Search,
    title: 'JSONPath Finder',
    description: 'Query JSON data using JSONPath expressions'
  },
  {
    path: '/uuid-generator',
    icon: Hash,
    title: 'UUID Generator',
    description: 'Generate UUIDs (v4) with copy functionality'
  },
  {
    path: '/swagger-editor',
    icon: FileCode,
    title: 'Swagger Editor',
    description: 'Multi-instance OpenAPI spec editor and preview'
  },
  {
    path: '/base64-tool',
    icon: Code,
    title: 'Base64 Tool',
    description: 'Encode and decode strings for testing'
  },
  {
    path: '/jwt-decoder',
    icon: Key,
    title: 'JWT Decoder',
    description: 'Decode JWT tokens and view header/payload'
  },
  {
    path: '/regex-tester',
    icon: Regex,
    title: 'Regex Tester',
    description: 'Test regular expressions with highlighting'
  },
  {
    path: '/datetime-formatter',
    icon: Calendar,
    title: 'Date/Time Formatter',
    description: 'Convert between different date/time formats'
  },
  {
    path: '/fake-data-generator',
    icon: User,
    title: 'Fake Data Generator',
    description: 'Generate test data for names, addresses, etc.'
  },
  {
    path: '/curl-converter',
    icon: Terminal,
    title: 'cURL Converter',
    description: 'Convert cURL commands to fetch/axios requests'
  },
  {
    path: '/text-diff-tool',
    icon: GitCompare,
    title: 'Text Diff Tool',
    description: 'Compare and highlight differences in text/JSON'
  }
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'All tools run client-side for instant results'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'No data leaves your browser - complete privacy'
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Works offline, no server dependencies'
  }
];

const Landing = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-8">
          <span className="text-3xl font-bold text-white">QA</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          QA <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Toolbox</span>
        </h1>
        
        <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Professional tools for QA Engineers. Streamline your testing workflow with our comprehensive suite of utilities designed for modern quality assurance.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-2 px-4 py-2 bg-dark-800/50 rounded-full border border-dark-700"
              >
                <Icon size={16} className="text-primary-400" />
                <span className="text-dark-300 text-sm">{feature.title}</span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link
                to={tool.path}
                className="block p-6 glass rounded-xl glass-hover h-full"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-600/30 transition-all duration-300">
                    <Icon size={24} className="text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-dark-400 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-dark-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center"
      >
        <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to streamline your QA workflow?
          </h2>
          <p className="text-dark-300 mb-6">
            Choose any tool from the sidebar or explore the tools above to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/email-generator"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Start with Email Generator
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link
              to="/json-validator"
              className="inline-flex items-center px-6 py-3 glass hover:bg-dark-700/50 text-white font-medium rounded-lg transition-all duration-200"
            >
              Try JSON Validator
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;