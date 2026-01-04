import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b">
        <div className="flex items-center gap-2">
          <Database className="text-primary w-8 h-8" />
          <span className="text-xl font-bold text-slate-900">DataBridge AI</span>
        </div>
        <button 
          onClick={() => navigate('/connect')}
          className="px-6 py-2 text-white bg-primary rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-8 py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-extrabold text-slate-900 tracking-tight"
          >
            The Intelligent Bridge to <span className="text-primary">Power BI</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Connect Snowflake and PostgreSQL seamlessly. Use AI to understand your schema and generate insights directly in Power BI.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex justify-center gap-4"
          >
            <button 
              onClick={() => navigate('/connect')}
              className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
            >
              Connect Database <ArrowRight w={20} h={20} />
            </button>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-yellow-500" />}
            title="AI Powered"
            description="Auto-generate SQL and insights using advanced AI schema introspection."
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-green-500" />}
            title="Enterprise Secure"
            description="Safe credential handling and Microsoft Entra ID authentication."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8 text-purple-500" />}
            title="Direct Visualization"
            description="One-click dataset creation and reporting in Power BI Service."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <p className="mt-2 text-slate-600 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
