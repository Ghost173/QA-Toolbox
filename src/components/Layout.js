import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
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
  Menu,
  X
} from 'lucide-react';

const navigationItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/email-generator', icon: Mail, label: 'Email Generator' },
  { path: '/json-validator', icon: FileText, label: 'JSON Validator' },
  { path: '/jsonpath-finder', icon: Search, label: 'JSONPath Finder' },
  { path: '/uuid-generator', icon: Hash, label: 'UUID Generator' },
  { path: '/swagger-editor', icon: FileCode, label: 'Swagger Editor' },
  { path: '/base64-tool', icon: Code, label: 'Base64 Tool' },
  { path: '/jwt-decoder', icon: Key, label: 'JWT Decoder' },
  { path: '/regex-tester', icon: Regex, label: 'Regex Tester' },
  { path: '/datetime-formatter', icon: Calendar, label: 'Date/Time Formatter' },
  { path: '/fake-data-generator', icon: User, label: 'Fake Data Generator' },
  { path: '/curl-converter', icon: Terminal, label: 'cURL Converter' },
  { path: '/text-diff-tool', icon: GitCompare, label: 'Text Diff Tool' },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%',
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-dark-800/90 backdrop-blur-xl border-r border-dark-700 lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QA</span>
              </div>
              <span className="text-xl font-bold text-white">Toolbox</span>
            </motion.div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-dark-300 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                        : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`transition-colors ${
                        isActive ? 'text-primary-400' : 'text-dark-400 group-hover:text-white'
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-dark-800/50 backdrop-blur-sm border-b border-dark-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-dark-300 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold text-white">QA Toolbox</h1>
          <div className="w-6" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;