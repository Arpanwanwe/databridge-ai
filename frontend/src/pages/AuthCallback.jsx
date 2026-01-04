import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const code = searchParams.get('code');

  useEffect(() => {
    if (code) {
      handleCallback();
    } else {
      setStatus('error');
    }
  }, [code]);

  const handleCallback = async () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    try {
      const resp = await axios.get(`${BASE_URL}/api/pbi-callback?code=${code}&redirect_uri=${redirectUri}`);
      localStorage.setItem('pbi_token', resp.data.access_token);
      setStatus('success');
      setTimeout(() => navigate('/analysis'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Authenticating...</h1>
            <p className="text-slate-500">Securely connecting to your Power BI account</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Success!</h1>
            <p className="text-slate-500">Power BI connected. Redirecting you back...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Auth Failed</h1>
            <p className="text-slate-500">We couldn't connect to Power BI. Please try again.</p>
            <button 
              onClick={() => navigate('/analysis')}
              className="mt-8 px-6 py-2 bg-primary text-white rounded-lg font-bold"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
