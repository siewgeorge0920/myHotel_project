import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState('');

  const fetchLogs = () => {
    fetch('http://localhost:5000/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLastRefreshed(new Date().toLocaleTimeString());
      })
      .catch(err => console.error(err));
  };

  // Lifetime Auto-Refresh (每 5 秒自动跑一次)
  useEffect(() => {
    fetchLogs(); // 第一次跑
    const interval = setInterval(() => {
      fetchLogs();
    }, 5000); 
    return () => clearInterval(interval); // 退出页面时关掉
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-end border-b pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">System Audit Logs 🕵️‍♂️</h1>
            <p className="text-sm text-gray-500">Auto-refreshing every 5 seconds. Last check: {lastRefreshed}</p>
          </div>
          <div className="flex space-x-4">
            {/* Refresh Button */}
            <button onClick={fetchLogs} className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm font-semibold hover:bg-blue-200">
              ↻ Refresh Now
            </button>
            <Link to="/admin-iam" className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-semibold hover:bg-gray-300">
              Back to IAM
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase">
                <th className="p-4">Time</th>
                <th className="p-4">Action</th>
                <th className="p-4">By</th>
                <th className="p-4">Target</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-medium">{log.action}</td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">{log.performedBy}</span></td>
                  <td className="p-4 font-mono">{log.targetId || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}