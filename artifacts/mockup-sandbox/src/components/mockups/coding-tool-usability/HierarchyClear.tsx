import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Save, Download, CheckCircle2, Circle } from "lucide-react";

export default function HierarchyClear() {
  // Simulate state
  const [paperId, setPaperId] = useState("1234");
  const [studyId, setStudyId] = useState("Smith_2024_Study1");
  const [coderName, setCoderName] = useState("Jane Doe");
  
  // Accumulated answers simulation
  const answeredQuestions = [
    { id: 1, text: "Is this a primary quantitative study?", answer: "Yes" },
  ];
  
  const currentQuestion = {
    number: 2,
    text: "Is this an experimental study?",
    options: ["Yes", "No", "Unsure"]
  };
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[280px] md:w-[320px] bg-slate-900 text-slate-100 flex flex-col flex-shrink-0 h-full overflow-y-auto border-r border-slate-800">
        <div className="p-6 flex flex-col flex-grow">
          <h1 className="text-xl font-bold tracking-tight mb-8 text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            </div>
            AI Attribution
          </h1>
          
          <div className="space-y-5 mb-10 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <div className="space-y-2">
              <Label htmlFor="paperId" className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Paper ID</Label>
              <Input 
                id="paperId" 
                value={paperId} 
                onChange={e => setPaperId(e.target.value)} 
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 h-9 focus-visible:ring-blue-500" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studyId" className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Study ID</Label>
              <Input 
                id="studyId" 
                value={studyId} 
                onChange={e => setStudyId(e.target.value)} 
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 h-9 focus-visible:ring-blue-500" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coderName" className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Coder Name</Label>
              <Input 
                id="coderName" 
                value={coderName} 
                onChange={e => setCoderName(e.target.value)} 
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 h-9 focus-visible:ring-blue-500" 
              />
            </div>
          </div>
          
          <div className="mt-2 flex-grow">
            <div className="flex justify-between items-end mb-5">
              <h2 className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Progress</h2>
              <span className="text-xs font-medium text-slate-500">2 of 9</span>
            </div>
            
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-slate-800 pl-1">
              {/* Answered */}
              <div className="relative flex items-start gap-4">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white shrink-0 z-10 shadow-[0_0_0_4px_rgba(15,23,42,1)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[13px] font-medium text-slate-300 leading-snug mb-1">{answeredQuestions[0].text}</span>
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded w-max border border-blue-800/50">{answeredQuestions[0].answer}</span>
                </div>
              </div>
              
              {/* Current */}
              <div className="relative flex items-start gap-4">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-slate-900 border-2 border-slate-900 shrink-0 z-10 shadow-[0_0_0_4px_rgba(15,23,42,1)]">
                  <Circle className="w-2.5 h-2.5 fill-slate-900" />
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[13px] font-semibold text-white leading-snug">Current Question</span>
                </div>
              </div>

              {/* Upcoming */}
              <div className="relative flex items-start gap-4 opacity-40">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 shrink-0 z-10 shadow-[0_0_0_4px_rgba(15,23,42,1)]">
                  <span className="text-[10px] font-bold">3</span>
                </div>
                <div className="flex flex-col pt-0.5">
                  <span className="text-[13px] font-medium text-slate-400 leading-snug">Next Question</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-5 border-t border-slate-800 bg-slate-950/50">
          <div className="text-xs font-medium text-slate-500 flex items-center justify-center gap-2">
            <DatabaseIcon className="w-3.5 h-3.5" />
            Saved dataset: 42 entries
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10">
        <header className="flex justify-end p-4 md:p-6 border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex gap-3">
            <Button variant="outline" className="text-slate-600 border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-9 font-medium shadow-sm">
              <Save className="w-4 h-4 mr-2 text-slate-400" />
              Save & Start New
            </Button>
            <Button variant="outline" className="text-slate-600 border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 h-9 font-medium shadow-sm">
              <Download className="w-4 h-4 mr-2 text-slate-400" />
              Export CSV
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12 md:py-20 justify-center">
          <div className="mb-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-100 font-semibold px-3 py-1 rounded-md text-xs uppercase tracking-wider shadow-sm">
              Question {currentQuestion.number}
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-12 animate-in slide-in-from-bottom-4 fade-in duration-700">
            {currentQuestion.text}
          </h2>
          
          <div className="space-y-4 animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-150">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full text-left px-6 py-5 rounded-xl border-2 transition-all duration-200 ease-out flex items-center justify-between group focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
                  selectedAnswer === option 
                    ? "border-blue-600 bg-blue-50/50 shadow-sm transform scale-[1.01]" 
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-sm"
                }`}
              >
                <span className={`text-lg md:text-xl font-semibold transition-colors ${selectedAnswer === option ? "text-blue-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                  {option}
                </span>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm ${
                  selectedAnswer === option 
                    ? "border-blue-600 bg-blue-600" 
                    : "border-slate-300 bg-white group-hover:border-slate-400"
                }`}>
                  {selectedAnswer === option && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center animate-in fade-in duration-1000 delay-300">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            
            <Button 
              className={`h-12 px-8 rounded-lg text-base font-semibold shadow-sm transition-all duration-300 ${
                selectedAnswer 
                  ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md hover:-translate-y-0.5" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-70"
              }`}
              disabled={!selectedAnswer}
            >
              Continue
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
