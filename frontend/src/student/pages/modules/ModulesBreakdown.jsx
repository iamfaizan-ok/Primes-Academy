import React from 'react';
import { LucideHeadphones, LucideMic, LucideBookOpen, LucidePenTool, LucideArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ModulesBreakdown() {
  const navigate = useNavigate();
  const modules = [
    { name: 'Listening', icon: <LucideHeadphones className="w-6 h-6 text-blue-600" />, description: 'Audio comprehension, note‑taking, and question types.' },
    { name: 'Speaking', icon: <LucideMic className="w-6 h-6 text-green-600" />, description: 'Fluency, pronunciation, and interactive tasks.' },
    { name: 'Reading', icon: <LucideBookOpen className="w-6 h-6 text-purple-600" />, description: 'Skimming, scanning, and detailed comprehension.' },
    { name: 'Writing', icon: <LucidePenTool className="w-6 h-6 text-red-600" />, description: 'Task response, coherence, and grammar accuracy.' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition"
      >
        <LucideArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <h1 className="text-2xl font-bold text-slate-900">IELTS Modules Breakdown</h1>
      <p className="text-sm text-slate-600">
        Quick overview of the four core IELTS components with a short description for each.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.name}
            className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
          >
            <div className="flex-shrink-0 pt-1">{mod.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{mod.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{mod.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

