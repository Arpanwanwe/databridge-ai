import React, { useState } from 'react';
import { Database, Server, Lock, Globe, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const ConnectPage = () => {
  const navigate = useNavigate();
  const [dbType, setDbType] = useState('postgres');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [config, setConfig] = useState({
    host: '',
    database: '',
    user: '',
    password: '',
    port: 5432,
    account: '',
    warehouse: '',
    schema: 'public'
  });

  const handleTest = async () => {
    setLoading(true);
    try {
      const resp = await axios.post(`${BASE_URL}/api/test-connection`, { ...config, type: dbType });
      if (resp.data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
    setLoading(false);
  };

  const handleFetchSchema = async () => {
    setLoading(true);
    try {
      const resp = await axios.post(`${BASE_URL}/api/fetch-schema`, { ...config, type: dbType });
      localStorage.setItem('db_schema', JSON.stringify(resp.data.schema));
      navigate('/analysis');
    } catch (err) {
      alert('Failed to fetch schema');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <Database className="text-primary w-10 h-10" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Connect Your Database</h1>
            <p className="text-slate-500 text-sm">Select your source and provide credentials</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setDbType('postgres')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${dbType === 'postgres' ? 'border-primary bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
          >
            <Server className={dbType === 'postgres' ? 'text-primary' : 'text-slate-400'} />
            <span className={`font-semibold ${dbType === 'postgres' ? 'text-primary' : 'text-slate-600'}`}>PostgreSQL</span>
          </button>
          <button 
            onClick={() => setDbType('snowflake')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${dbType === 'snowflake' ? 'border-primary bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
          >
            <Globe className={dbType === 'snowflake' ? 'text-primary' : 'text-slate-400'} />
            <span className={`font-semibold ${dbType === 'snowflake' ? 'text-primary' : 'text-slate-600'}`}>Snowflake</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dbType === 'postgres' && (
            <>
              <Input label="Host" value={config.host} onChange={v => setConfig({...config, host: v})} />
              <Input label="Port" type="number" value={config.port} onChange={v => setConfig({...config, port: v})} />
            </>
          )}
          {dbType === 'snowflake' && (
            <>
              <Input label="Account" value={config.account} onChange={v => setConfig({...config, account: v})} />
              <Input label="Warehouse" value={config.warehouse} onChange={v => setConfig({...config, warehouse: v})} />
            </>
          )}
          <Input label="Database" value={config.database} onChange={v => setConfig({...config, database: v})} />
          <Input label="Schema" value={config.schema} onChange={v => setConfig({...config, schema: v})} />
          <Input label="User" value={config.user} onChange={v => setConfig({...config, user: v})} />
          <Input label="Password" type="password" value={config.password} onChange={v => setConfig({...config, password: v})} />
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={handleTest}
            disabled={loading}
            className="flex-1 py-3 px-6 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Test Connection'}
          </button>
          {status === 'success' && (
            <button 
              onClick={handleFetchSchema}
              className="flex-1 py-3 px-6 bg-primary text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Analyze Schema <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {status === 'error' && (
          <p className="mt-4 text-red-500 text-sm text-center font-medium">Connection failed. Please check your credentials.</p>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <div className="relative">
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

export default ConnectPage;
