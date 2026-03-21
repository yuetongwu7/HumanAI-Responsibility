import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronLeft, Save, Download, Database } from "lucide-react";

export default function FlippedPanel() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const questions = [
    { id: 1, text: "Is this a primary quantitative study?", status: 'answered', answer: 'Yes' },
    { id: 2, text: "Is this an experimental study?", status: 'current' },
    { id: 3, text: "If experimental, what design?", status: 'upcoming' },
    { id: 4, text: "Is there a failure or negative consequence depicted?", status: 'upcoming' },
    { id: 5, text: "Does the scenario involve potential AI vs Human comparison?", status: 'upcoming' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-900 bg-white">
      {/* Left Panel (Dominant, Dark) */}
      <div className="flex-1 flex flex-col bg-[#0a0f1e] text-white overflow-hidden relative shadow-2xl z-10">
        
        {/* Sticky Top Bar inside left panel */}
        <header className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b border-white/10 bg-[#0a0f1e]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" x2="8" y1="13" y2="13"/>
                <line x1="16" x2="8" y1="17" y2="17"/>
                <line x1="10" x2="8" y1="9" y2="9"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AI Attribution</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9 px-4 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
              <Save className="w-4 h-4 mr-2" />
              Save & Start New
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </header>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto px-8 py-16 lg:px-20 xl:px-32 flex flex-col">
          <div className="max-w-2xl mx-auto w-full">
            <div className="inline-flex items-center bg-blue-900/30 text-blue-400 border border-blue-800/50 rounded-md text-xs font-bold tracking-widest uppercase px-3 py-1.5 mb-8 shadow-sm">
              Question 2
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-12 tracking-tight">
              Is this an experimental study?
            </h1>

            <div className="flex flex-col gap-4">
              {['Yes', 'No', 'Unsure'].map((option) => (
                <div 
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={`flex items-center justify-between p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 w-full text-left
                    ${selectedAnswer === option 
                      ? 'border-blue-500 bg-blue-900/20 shadow-[0_0_20px_rgba(59,130,246,0.15)] transform scale-[1.01]' 
                      : 'border-slate-800 bg-transparent hover:border-slate-700 hover:bg-slate-800/30'
                    }`}
                >
                  <span className={`text-xl font-semibold transition-colors ${selectedAnswer === option ? 'text-blue-400' : 'text-slate-200'}`}>
                    {option}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors shadow-sm
                    ${selectedAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-slate-600 bg-transparent'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-white transition-opacity ${selectedAnswer === option ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex-shrink-0 flex justify-between items-center px-8 py-5 border-t border-white/10 bg-[#0a0f1e]/90 backdrop-blur-md">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 font-medium px-4 h-11">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button 
            className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            disabled={!selectedAnswer}
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Right Sidebar (Light) */}
      <div className="w-[320px] lg:w-[380px] bg-white border-l border-slate-200 flex flex-col h-screen flex-shrink-0 relative z-0">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8">
          
          {/* Metadata */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Paper ID</label>
              <Input 
                defaultValue="1234" 
                className="bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Study ID</label>
              <Input 
                defaultValue="Smith_2024_Study1" 
                className="bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Coder Name</label>
              <Input 
                placeholder="Your name" 
                className="bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Study Notes</label>
            <Textarea 
              placeholder="Any notes about this study..." 
              className="resize-y min-h-[100px] bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm"
            />
          </div>

          <hr className="border-slate-100" />

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progress</h3>
              <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">1 of 9</span>
            </div>
            
            <div className="relative pl-[11px] space-y-6">
              {/* Vertical line */}
              <div className="absolute left-[22px] top-3 bottom-4 w-px bg-slate-200" />

              {questions.map((q) => (
                <div key={q.id} className={`flex items-start gap-4 relative z-10 ${q.status === 'upcoming' ? 'opacity-50' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${q.status === 'answered' ? 'bg-blue-600 text-white ring-4 ring-white' : 
                      q.status === 'current' ? 'bg-white border-2 border-slate-900 ring-4 ring-white' : 
                      'bg-slate-100 border border-slate-300 ring-4 ring-white'}`}
                  >
                    {q.status === 'answered' && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col pt-1">
                    <p className={`text-sm leading-snug mb-1.5 ${q.status === 'current' ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                      {q.text}
                    </p>
                    {q.status === 'answered' && (
                      <div className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 w-max">
                        {q.answer}
                      </div>
                    )}
                    {q.status === 'current' && (
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Current</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50/80 backdrop-blur flex justify-center mt-auto">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Database className="w-4 h-4" />
            Saved dataset: 0 entries
          </div>
        </div>
      </div>
    </div>
  );
}
