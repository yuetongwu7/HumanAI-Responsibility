import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data structure
const YES_NO_UNSURE = ["Yes", "No", "Unsure"];

const questions = [
  { id: 1, key: "primary_quantitative", text: "Is this a primary quantitative study?", options: YES_NO_UNSURE },
  { id: 2, key: "experimental", text: "Is this an experimental study?", options: YES_NO_UNSURE },
  { id: 3, key: "design_type", text: "If experimental, what design?", options: ["Within", "Between", "Not Applicable"] },
  { id: 4, key: "failure_present", text: "Is there a failure or negative consequence depicted?", options: YES_NO_UNSURE },
  { id: 5, key: "ai_human_comparison_possible", text: "Does the scenario involve potential AI vs Human comparison as contributing to failure or negative consequence?", options: YES_NO_UNSURE },
  { id: 6, key: "error_type", text: "Error type:", options: ["Only_Humans", "Only_AI", "Both", "Different_Consequences", "Not_Applicable"] },
  { id: 7, key: "attribution_measure", text: "Is there an attribution outcome measure?", options: YES_NO_UNSURE },
  { id: 8, key: "DV_name", text: "Enter DV name exactly as written:", type: "text" },
  { id: 9, key: "ai_human_measures", text: "Are there measures directly comparing AI vs Human?", options: YES_NO_UNSURE }
];

export default function AffordanceFirst() {
  // Simulate at "Is there a failure or negative consequence depicted?" question (Q4)
  const [currentStep, setCurrentStep] = useState(4);
  const [answers, setAnswers] = useState<Record<string, string>>({
    primary_quantitative: "Yes",
    experimental: "Yes",
    design_type: "Between"
  });

  const [paperId, setPaperId] = useState("1234");
  const [studyId, setStudyId] = useState("Smith_2024_Study1");
  const [coderName, setCoderName] = useState("Jane Doe");

  const activeQuestion = questions.find((q) => q.id === currentStep);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'y' && activeQuestion?.options?.includes("Yes")) {
        handleAnswer("Yes");
      } else if (e.key.toLowerCase() === 'n' && activeQuestion?.options?.includes("No")) {
        handleAnswer("No");
      } else if (e.key.toLowerCase() === 'u' && activeQuestion?.options?.includes("Unsure")) {
        handleAnswer("Unsure");
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, activeQuestion]);

  const handleAnswer = (answer: string) => {
    if (activeQuestion) {
      setAnswers((prev) => ({ ...prev, [activeQuestion.key]: answer }));
      if (currentStep < questions.length) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getOptionStyle = (option: string) => {
    if (option === "Yes") {
      return "hover:bg-green-50 hover:border-green-300 active:bg-green-100 group-hover:text-green-700";
    }
    if (option === "No") {
      return "hover:bg-red-50 hover:border-red-300 active:bg-red-100 group-hover:text-red-700";
    }
    if (option === "Unsure") {
      return "hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 group-hover:text-slate-700";
    }
    return "hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 group-hover:text-blue-700";
  };

  const getShortcut = (option: string) => {
    if (option === "Yes") return "Y";
    if (option === "No") return "N";
    if (option === "Unsure") return "U";
    return null;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        
        {/* Top Metadata row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex-1 space-y-1">
            <Label htmlFor="paperId" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paper ID</Label>
            <Input id="paperId" value={paperId} onChange={(e) => setPaperId(e.target.value)} className="bg-white border-slate-200" />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="studyId" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study ID</Label>
            <Input id="studyId" value={studyId} onChange={(e) => setStudyId(e.target.value)} className="bg-white border-slate-200" />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="coderName" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coder Name</Label>
            <Input id="coderName" value={coderName} onChange={(e) => setCoderName(e.target.value)} className="bg-white border-slate-200" />
          </div>
        </div>

        {/* Numbered Step Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
            
            {questions.map((q) => {
              const isCompleted = q.id < currentStep;
              const isActive = q.id === currentStep;
              const isUpcoming = q.id > currentStep;
              
              return (
                <div key={q.id} className="relative flex flex-col items-center group">
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200
                      ${isCompleted ? 'bg-blue-600 text-white shadow-sm ring-4 ring-white' : ''}
                      ${isActive ? 'bg-white text-blue-600 border-2 border-blue-600 ring-4 ring-blue-50' : ''}
                      ${isUpcoming ? 'bg-white text-slate-400 border border-slate-200' : ''}
                    `}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : q.id}
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none z-10">
                    Step {q.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Area */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
              {currentStep}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              {activeQuestion?.text}
            </h2>
          </div>
          
          <div className="space-y-3 mt-8">
            {activeQuestion?.options?.map((option, idx) => {
              const shortcut = getShortcut(option);
              const customStyle = getOptionStyle(option);
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`
                    w-full min-h-16 px-6 py-4 flex items-center justify-between text-left
                    bg-white border-2 border-slate-200 rounded-xl
                    transition-all duration-200 group outline-none
                    focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500
                    hover:shadow-md hover:-translate-y-0.5
                    ${customStyle}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {shortcut && (
                      <kbd className={`
                        inline-flex items-center justify-center min-w-[28px] h-7 px-2 
                        text-xs font-mono font-bold rounded-md border-b-2
                        bg-white border-slate-200 text-slate-500
                        group-hover:border-current group-hover:text-current transition-colors
                      `}>
                        {shortcut}
                      </kbd>
                    )}
                    <span className="text-lg font-medium text-slate-700 group-hover:text-current transition-colors">
                      {option}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-current transition-colors transform group-hover:translate-x-1" />
                </button>
              );
            })}

            {activeQuestion?.type === "text" && (
              <div className="space-y-4">
                <Input 
                  autoFocus
                  placeholder="Type your answer here..." 
                  className="h-16 text-lg px-4 border-2 border-slate-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100 rounded-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAnswer((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <Button 
                  className="w-full h-14 text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Type your answer here..."]') as HTMLInputElement;
                    if (input && input.value) handleAnswer(input.value);
                  }}
                >
                  Continue <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex justify-between items-center pt-6 border-t border-slate-100">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={currentStep === 1}
            className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium px-4 h-12 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6 rounded-lg text-slate-600 border-slate-200 hover:bg-slate-50 font-medium">
              Export All to CSV
            </Button>
            <Button className="h-12 px-6 rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow">
              Save Study & Start New
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
