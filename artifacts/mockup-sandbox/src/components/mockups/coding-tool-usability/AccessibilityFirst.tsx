import React, { useState } from "react";
import { Check, ArrowLeft, Save, Download } from "lucide-react";

export default function AccessibilityFirst() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = ["Yes", "No", "Unsure"];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 sm:p-12 text-[18px] leading-relaxed max-w-4xl mx-auto">
      <header className="mb-12 border-b-2 border-gray-200 pb-8">
        <h1 className="text-3xl font-bold mb-8 text-black">AI vs Human Attribution Coding Tool</h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="paperId" className="block text-lg font-semibold text-black">
              Paper ID
            </label>
            <input
              id="paperId"
              type="text"
              defaultValue="1234"
              className="w-full border-2 border-gray-400 rounded-md p-3 text-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
              aria-label="Paper ID"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="studyId" className="block text-lg font-semibold text-black">
              Study ID
            </label>
            <input
              id="studyId"
              type="text"
              defaultValue="Smith_2024_Study1"
              className="w-full border-2 border-gray-400 rounded-md p-3 text-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
              aria-label="Study ID"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="coderName" className="block text-lg font-semibold text-black">
              Coder Name
            </label>
            <input
              id="coderName"
              type="text"
              defaultValue="Jane Doe"
              className="w-full border-2 border-gray-400 rounded-md p-3 text-lg focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
              aria-label="Coder Name"
            />
          </div>
        </div>
      </header>

      <main>
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Question 8 of 9</h2>
            <span className="text-lg font-medium text-gray-600" aria-hidden="true">88% Complete</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={88} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-blue-700 w-[88%]" />
          </div>
        </div>

        <section className="mb-12">
          <h3 className="text-[28px] font-bold text-black mb-8 leading-tight">
            Are there measures directly comparing AI vs Human?
          </h3>

          <div className="space-y-4" role="radiogroup" aria-labelledby="question-text">
            {options.map((option) => {
              const isSelected = selectedOption === option;
              return (
                <label
                  key={option}
                  className={`
                    flex items-center min-h-[56px] p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${isSelected ? "bg-blue-50 border-blue-700" : "bg-white border-gray-400 hover:bg-gray-50"}
                    focus-within:ring-4 focus-within:ring-blue-600 focus-within:ring-offset-2
                  `}
                >
                  <div className="relative flex items-center justify-center w-6 h-6 mr-4">
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={isSelected}
                      onChange={() => setSelectedOption(option)}
                      className="peer sr-only"
                    />
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? "border-blue-700 bg-blue-700" : "border-gray-500 bg-white"}
                    `}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <span className={`text-xl font-medium flex-grow ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                    {option}
                  </span>
                  {isSelected && (
                    <Check className="w-6 h-6 text-blue-700 flex-shrink-0" aria-hidden="true" />
                  )}
                </label>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t-2 border-gray-200">
          <button className="flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 border-2 border-gray-400 text-gray-800 font-bold rounded-md hover:bg-gray-100 hover:border-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors w-full sm:w-auto text-lg">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 border-2 border-gray-400 text-gray-800 font-bold rounded-md hover:bg-gray-100 hover:border-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 transition-colors w-full sm:w-auto text-lg">
              <Download className="w-5 h-5" />
              Export All to CSV
            </button>
            <button className="flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-offset-2 transition-colors w-full sm:w-auto text-lg">
              <Save className="w-5 h-5" />
              Save Study & Start New
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
