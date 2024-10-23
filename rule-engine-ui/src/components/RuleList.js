import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RuleTree from './RuleTree';

export default function RuleList() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await axios.get('http://localhost:5001/rules');
      setRules(response.data.rules);
    } catch (error) {
      console.error('Error fetching rules:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Rule List</h2>
      {rules.map((rule) => (
        <div key={rule.id} className="mb-8 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">ID: {rule.id}</h3>
          <p className="text-sm text-gray-600 mb-4">Rule String: {rule.rule_string}</p>
          <RuleTree ast={rule.ast} />
        </div>
      ))}
    </div>
  );
}