import React, { useState } from "react";
import { 
  Save, 
  Download, 
  ChevronLeft, 
  CheckCircle2, 
  FileText,
  Activity,
  Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function VerticalStack() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Simulation data
  const totalQuestions = 9;
  const currentQuestionIndex = 3; // 4th question (0-indexed)
  
  const history = [
    { id: 1, key: "Primary Quant", answer: "Yes" },
    { id: 2, key: "Experimental", answer: "Yes" },
    { id: 3, key: "Design Type", answer: "Within" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-y-auto pb-12">
      {/* Centered Single Column container */}
      <div className="max-w-2xl mx-auto pt-8 px-4 flex flex-col gap-4">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                <Layers className="text-white w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">AI Attribution</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9 gap-2 text-slate-600 border-slate-200 hover:bg-slate-50">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2 text-slate-600 border-slate-200 hover:bg-slate-50">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="paperId" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paper ID</Label>
              <Input id="paperId" defaultValue="1234" className="h-9 text-sm border-slate-200 bg-slate-50 focus-visible:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="studyId" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study ID</Label>
              <Input id="studyId" defaultValue="Smith_2024_Study1" className="h-9 text-sm border-slate-200 bg-slate-50 focus-visible:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="coderName" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coder Name</Label>
              <Input id="coderName" defaultValue="Alex Researcher" className="h-9 text-sm border-slate-200 bg-slate-50 focus-visible:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Progress
            </h2>
            <span className="text-sm font-medium text-slate-500">
              {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          {/* Segmented Progress Bar */}
          <div className="flex items-center gap-1.5 mb-5">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              if (i < currentQuestionIndex) {
                // Answered
                return <div key={i} className="h-1.5 flex-1 bg-blue-500 rounded-full" />;
              } else if (i === currentQuestionIndex) {
                // Current
                return (
                  <div key={i} className="h-1.5 flex-1 bg-blue-100 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500 w-1/2 animate-pulse rounded-full" />
                  </div>
                );
              } else {
                // Upcoming
                return <div key={i} className="h-1.5 flex-1 bg-slate-100 rounded-full" />;
              }
            })}
          </div>
          
          {/* Answered Chips */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-1 px-1">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-slate-500 truncate max-w-[80px]">{item.key}:</span>
                <span className="font-bold">{item.answer}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 relative overflow-hidden">
          {/* Decorative subtle gradient at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <div className="inline-flex items-center bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-bold tracking-wider uppercase px-2.5 py-1 mb-6">
            Question 4
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-8">
            Is there a failure or negative consequence depicted?
          </h2>
          
          <div className="space-y-3">
            {["Yes", "No", "Unsure"].map((option) => (
              <button
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedOption === option
                    ? "border-blue-600 bg-blue-50 shadow-[0_2px_10px_-3px_rgba(37,99,235,0.2)]"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className={`text-lg font-semibold ${selectedOption === option ? "text-blue-900" : "text-slate-700"}`}>
                  {option}
                </span>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedOption === option
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 bg-white"
                }`}>
                  {selectedOption === option && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar / Navigation Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mt-2 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          
          <div className="order-2 sm:order-1">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 w-full sm:w-auto">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>
          
          <div className="flex-1 px-0 sm:px-6 order-1 sm:order-2">
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Textarea 
                placeholder="Optional notes for this study..." 
                className="min-h-[44px] h-11 py-2.5 pl-9 resize-none text-sm border-slate-200 focus-visible:ring-blue-500 bg-slate-50"
              />
            </div>
          </div>
          
          <div className="order-3">
            <Button 
              className={`w-full sm:w-auto h-11 px-8 rounded-lg font-semibold transition-all ${
                selectedOption 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20" 
                  : "bg-slate-100 text-slate-400"
              }`}
              disabled={!selectedOption}
            >
              Continue
            </Button>
          </div>
          
        </div>

      </div>
    </div>
  );
}
