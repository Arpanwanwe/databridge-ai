import React, { useState, useEffect } from 'react';
import { Sparkles, BarChart, Code, PieChart, Table, Send, Power, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [schema, setSchema] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userQuery, setUserQuery] = useState('');
  const [customSql, setCustomSql] = useState('');

  useEffect(() => {
    const storedSchema = localStorage.getItem('db_schema');
    if (storedSchema) {
      const parsed = JSON.parse(storedSchema);
      setSchema(parsed);
      fetchAnalysis(parsed);
    } else {
      navigate('/connect');
    }
  }, []);

  const fetchAnalysis = async (schemaData) => {
    try {
      const resp = await axios.post(`${BASE_URL}/api/analyze-schema`, schemaData);
      setAnalysis(resp.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleGenerateSql = async () => {
    try {
      const resp = await axios.post(`${BASE_URL}/api/generate-sql`, { schema, prompt: userQuery });
      setCustomSql(resp.data.sql);
    } catch (err) {
      alert('Failed to generate SQL');
    }
  };

  const connectToPowerBI = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/pbi-auth-url?redirect_uri=${window.location.origin}/auth/callback`);
      window.location.href = resp.data.url;
    } catch (err) {
      alert('Failed to get PBI auth URL');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <h2 className="text-xl font-bold text-slate-800">AI is analyzing your schema...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-yellow-500" /> AI Insights
            </h1>
            <p className="text-slate-500">Intelligent schema analysis and recommendations</p>
          </div>
          <button 
            onClick={connectToPowerBI}
            className="flex items-center gap-2 px-6 py-3 bg-[#f2c811] text-black font-bold rounded-xl hover:bg-[#e6be00] transition-all shadow-md"
          >
            <Power className="w-5 h-5" /> Connect to Power BI
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* KPIs & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                  <BarChart className="w-5 h-5" /> Suggested KPIs
                </h3>
                <ul className="space-y-2">
                  {analysis?.kpis?.map((kpi, i) => (
                    <li key={i} className="text-slate-600 flex items-center gap-2 bg-blue-50/50 p-2 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {kpi}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600">
                  <PieChart className="w-5 h-5" /> Metrics
                </h3>
                <ul className="space-y-2">
                  {analysis?.metrics?.map((metric, i) => (
                    <li key={i} className="text-slate-600 flex items-center gap-2 bg-green-50/50 p-2 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Recommended Queries</h3>
              {analysis?.suggestions?.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">{s.title}</h4>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold uppercase text-slate-500 flex items-center gap-1">
                      {s.visualization === 'bar' ? <BarChart className="w-3 h-3" /> : <PieChart className="w-3 h-3" />} {s.visualization}
                    </span>
                  </div>
                  <pre className="bg-slate-900 text-blue-300 p-4 rounded-xl overflow-x-auto text-sm font-mono">
                    {s.sql}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* AI SQL Assistant */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Code className="text-primary" /> AI SQL Assistant
              </h3>
              <textarea 
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                placeholder="Ask AI to write a query..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
              />
              <button 
                onClick={handleGenerateSql}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              >
                Generate SQL <Send className="w-4 h-4" />
              </button>

              {customSql && (
                <div className="mt-6">
                  <label className="text-sm font-bold text-slate-500 block mb-2 uppercase tracking-wider">Resulting SQL</label>
                  <pre className="bg-slate-50 p-4 rounded-xl text-xs font-mono border border-slate-200 overflow-x-auto">
                    {customSql}
                  </pre>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold mb-4">Schema Preview</h3>
               <div className="max-h-96 overflow-y-auto space-y-2">
                 {schema.map((col, i) => (
                   <div key={i} className="flex justify-between p-2 hover:bg-slate-50 rounded transition-colors border-b border-slate-50 last:border-0">
                     <span className="text-slate-700 text-sm font-medium">{col.table}.{col.column}</span>
                     <span className="text-slate-400 text-xs italic">{col.type}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
