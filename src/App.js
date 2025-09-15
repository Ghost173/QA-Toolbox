import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import EmailGenerator from './pages/EmailGenerator';
import JsonValidator from './pages/JsonValidator';
import JsonPathFinder from './pages/JsonPathFinder';
import UuidGenerator from './pages/UuidGenerator';
import SwaggerEditor from './pages/SwaggerEditor';
import Base64Tool from './pages/Base64Tool';
import JwtDecoder from './pages/JwtDecoder';
import RegexTester from './pages/RegexTester';
import DateTimeFormatter from './pages/DateTimeFormatter';
import FakeDataGenerator from './pages/FakeDataGenerator';
import CurlConverter from './pages/CurlConverter';
import TextDiffTool from './pages/TextDiffTool';

function App() {
  return (
    <Router basename="/QA-Toolbox">
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/email-generator" element={<EmailGenerator />} />
            <Route path="/json-validator" element={<JsonValidator />} />
            <Route path="/jsonpath-finder" element={<JsonPathFinder />} />
            <Route path="/uuid-generator" element={<UuidGenerator />} />
            <Route path="/swagger-editor" element={<SwaggerEditor />} />
            <Route path="/base64-tool" element={<Base64Tool />} />
            <Route path="/jwt-decoder" element={<JwtDecoder />} />
            <Route path="/regex-tester" element={<RegexTester />} />
            <Route path="/datetime-formatter" element={<DateTimeFormatter />} />
            <Route path="/fake-data-generator" element={<FakeDataGenerator />} />
            <Route path="/curl-converter" element={<CurlConverter />} />
            <Route path="/text-diff-tool" element={<TextDiffTool />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;