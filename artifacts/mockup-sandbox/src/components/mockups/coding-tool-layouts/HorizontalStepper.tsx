import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HorizontalStepper() {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const totalQuestions = 9;
  const currentStep = 3;
  const answeredSteps = [1, 2];
  
  const options = ["Within", "Between", "Not Applicable"];

  return (
    <div className="flex flex-col h-screen w-full bg-white font-sans overflow-hidden">
      {/* Top Strip */}
      <div className="flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col w-full shadow-md z-10">
        
        {/* Row 1: Header & Metadata */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 h-[64px]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">AI Attribution</span>
            </div>
            
            <div className="h-6 w-px bg-slate-700 mx-2" />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paper ID</label>
                <input 
                  type="text" 
                  defaultValue="1234"
                  className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-sm w-20 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Study ID</label>
                <input 
                  type="text" 
                  defaultValue="Smith_2024"
                  className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-sm w-32 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Coder</label>
                <input 
                  type="text" 
                  defaultValue="Jane Doe"
                  className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-sm w-32 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
              <Save className="w-4 h-4 mr-2" />
              Save & Start New
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        {/* Row 2: Stepper */}
        <div className="flex items-center justify-between px-6 h-[56px] bg-slate-900/95">
          <div className="flex items-center w-full max-w-3xl">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const step = i + 1;
              const isAnswered = answeredSteps.includes(step);
              const isCurrent = step === currentStep;
              
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center justify-center relative">
                    {isAnswered ? (
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_0_2px_#0f172a]">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shadow-[0_0_0_2px_#0f172a,0_0_0_4px_#cbd5e1] z-10">
                        <span className="text-slate-900 font-bold text-sm">{step}</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-[0_0_0_2px_#0f172a]">
                        <span className="text-slate-400 font-medium text-sm">{step}</span>
                      </div>
                    )}
                  </div>
                  {step < totalQuestions && (
                    <div className={cn(
                      "flex-1 h-[2px] mx-2",
                      isAnswered ? "bg-blue-600/50" : "bg-slate-800"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="text-sm font-medium text-slate-400 flex-shrink-0 ml-8">
            Question <span className="text-white font-bold">{currentStep}</span> of {totalQuestions}
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
        <div className="flex-1 w-full max-w-4xl mx-auto px-8 py-12 flex flex-col justify-center">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border border-blue-200 uppercase tracking-widest text-xs py-1 px-3 mb-8 w-max font-bold">
            Question {currentStep}
          </Badge>
          
          <h1 className="text-[40px] font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-12 max-w-[800px]">
            If experimental, what design?
          </h1>
          
          <div className="flex flex-col gap-4 w-full max-w-[600px] ml-4">
            {options.map((option) => {
              const isSelected = selectedAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={cn(
                    "flex items-center p-6 border-2 rounded-xl text-left transition-all duration-200 w-full group",
                    isSelected 
                      ? "border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600/10 scale-[1.01]" 
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-6 transition-colors flex-shrink-0",
                    isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white group-hover:border-slate-400"
                  )}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                  <span className={cn(
                    "text-xl font-semibold transition-colors",
                    isSelected ? "text-blue-900" : "text-slate-700 group-hover:text-slate-900"
                  )}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-8 py-5 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
        <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-6 h-12 rounded-lg text-base font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button 
          className={cn(
            "h-12 px-8 rounded-lg text-base font-semibold shadow-sm transition-all",
            selectedAnswer 
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5" 
              : "bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed"
          )}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
