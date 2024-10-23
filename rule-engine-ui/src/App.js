import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RuleInput from './components/RuleInput';
import RuleList from './components/RuleList';
import RuleEvaluator from './components/RuleEvaluator';
import RuleCombiner from './components/RuleCombiner';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-32">
          <Routes>
            <Route path="/create-rule" element={<RuleInput />} />
            <Route path="/evaluate-rule" element={<RuleEvaluator />} />
            <Route path="/combine-rules" element={<RuleCombiner />} />
            <Route path="/" element={<RuleList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}