import { useState } from "react";

const YES_NO_UNSURE = ["Yes", "No", "Unsure"];

const questions = [
  { key: "primary_quantitative", text: "Is this a primary quantitative study?", options: YES_NO_UNSURE },
  { key: "experimental", text: "Is this an experimental study?", options: YES_NO_UNSURE },
  { key: "design_type", text: "If experimental, what design?", options: ["Within", "Between", "Not Applicable"], showIf: (d: any) => d.experimental === "Yes" },
  { key: "failure_present", text: "Is there a failure or negative consequence depicted?", options: YES_NO_UNSURE },
  { key: "ai_human_comparison_possible", text: "Does the scenario involve potential AI vs Human comparison?", options: YES_NO_UNSURE },
  { key: "error_type", text: "Error type:", options: ["Only_Humans", "Only_AI", "Both", "Different_Consequences", "Not_Applicable"], showIf: (d: any) => d.ai_human_comparison_possible === "Yes" },
  { key: "attribution_measure", text: "Is there an attribution outcome measure?", options: YES_NO_UNSURE },
  { key: "DV_name", text: "Enter DV name exactly as written:", type: "text", showIf: (d: any) => d.attribution_measure === "Yes" },
  { key: "ai_human_measures", text: "Are there measures directly comparing AI vs Human?", options: YES_NO_UNSURE, showIf: (d: any) => d.ai_human_comparison_possible === "Yes" },
];

const answerColor: Record<string, string> = {
  Yes: "bg-emerald-100 text-emerald-800 border-emerald-200",
  No: "bg-red-50 text-red-700 border-red-200",
  Unsure: "bg-amber-50 text-amber-700 border-amber-200",
  Within: "bg-blue-50 text-blue-700 border-blue-200",
  Between: "bg-blue-50 text-blue-700 border-blue-200",
  "Not Applicable": "bg-slate-100 text-slate-600 border-slate-200",
  Only_Humans: "bg-purple-50 text-purple-700 border-purple-200",
  Only_AI: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Both: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Different_Consequences: "bg-orange-50 text-orange-700 border-orange-200",
};

function getNextEligible(idx: number, data: any): number {
  let i = idx;
  while (i < questions.length) {
    if (!questions[i].showIf || questions[i].showIf(data)) return i;
    i++;
  }
  return i;
}

export function AccordionForm() {
  const [paperID, setPaperID] = useState("");
  const [studyID, setStudyID] = useState("");
  const [coderName, setCoderName] = useState("");
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<any>({});
  const [done, setDone] = useState(false);
  const [dvInput, setDvInput] = useState("");

  const visibleQs = questions.filter(q => !q.showIf || q.showIf(data));
  const answeredCount = visibleQs.filter(q => data[q.key] !== undefined && data[q.key] !== "").length;
  const progress = visibleQs.length ? Math.round((answeredCount / visibleQs.length) * 100) : 0;

  const effectiveCurrent = getNextEligible(current, data);
  const q = questions[effectiveCurrent];

  function handleAnswer(val: string) {
    const newData = { ...data, [q.key]: val };
    if (q.key === "experimental" && val !== "Yes") delete newData.design_type;
    if (q.key === "attribution_measure" && val !== "Yes") delete newData.DV_name;
    if (q.key === "ai_human_comparison_possible" && val !== "Yes") { delete newData.error_type; delete newData.ai_human_measures; }
    setData(newData);
    const hasYesNo = q.options?.includes("Yes") && q.options?.includes("No");
    if (hasYesNo && val === "No") { setDone(true); return; }
    const next = getNextEligible(effectiveCurrent + 1, newData);
    if (next >= questions.length) setDone(true); else setCurrent(next);
  }

  function handleReset() { setData({}); setCurrent(0); setDone(false); setDvInput(""); }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">

      {/* COMPACT METADATA GRID HEADER */}
      <div className="bg-white border-b border-slate-200 px-5 py-4">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-sm font-bold text-slate-800">AI vs Human Attribution Coding Tool</h1>
            <p className="text-xs text-slate-400 mt-0.5">Research coding instrument — HumanAI Responsibility</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[["Paper ID", paperID, setPaperID, "Smith_2024", "w-28"], ["Study ID", studyID, setStudyID, "Study_1", "w-32"], ["Coder", coderName, setCoderName, "Your name", "w-24"]].map(([label, val, setter, ph, w]) => (
              <div key={label as string}>
                <label className="block text-[10px] text-slate-400 mb-1">{label as string}</label>
                <input className={`${w} border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400`}
                  value={val as string} onChange={e => (setter as any)(e.target.value)} placeholder={ph as string} />
              </div>
            ))}
          </div>
        </div>
        {/* Progress */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0">{answeredCount} of {visibleQs.length} answered</span>
        </div>
      </div>

      {/* ACCORDION QUESTION LIST */}
      <div className="flex-1 overflow-y-auto py-3 px-4 space-y-2">
        {done ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 py-12 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800">Form Complete</p>
              <p className="text-sm text-slate-400 mt-1">All applicable questions answered.</p>
            </div>

            {/* Summary of answers */}
            <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {visibleQs.filter(vq => data[vq.key]).map(vq => (
                <div key={vq.key} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-slate-500 truncate pr-2">{vq.text}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border flex-shrink-0 ${answerColor[data[vq.key]] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {data[vq.key]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleReset} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors shadow">Save &amp; Start New</button>
              <button className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition-colors">Export CSV</button>
            </div>
          </div>
        ) : (
          visibleQs.map((vq, i) => {
            const isActive = vq.key === q?.key;
            const isAnswered = data[vq.key] !== undefined && data[vq.key] !== "";
            const isPending = !isAnswered && !isActive;

            return (
              <div key={vq.key} className={`rounded-2xl border transition-all duration-200 overflow-hidden
                ${isActive ? 'border-blue-200 bg-white shadow-md shadow-blue-50' :
                  isAnswered ? 'border-slate-200 bg-white' :
                  'border-slate-100 bg-slate-50/50 opacity-50'}`}>

                {/* Row header */}
                <div className={`flex items-center gap-3 px-4 py-3 ${isActive ? 'pb-0' : ''}`}>
                  {/* Number / check icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                    ${isAnswered ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {isAnswered ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i + 1}
                  </div>

                  {/* Question text */}
                  <p className={`flex-1 text-sm font-medium leading-snug
                    ${isActive ? 'text-slate-800' : isAnswered ? 'text-slate-500' : 'text-slate-400'}`}>
                    {vq.text}
                  </p>

                  {/* Answer tag (when answered) */}
                  {isAnswered && (
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${answerColor[data[vq.key]] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {data[vq.key]}
                    </span>
                  )}
                </div>

                {/* Expanded options (active only) */}
                {isActive && (
                  <div className="px-4 pb-4 pt-3">
                    {vq.type === "text" ? (
                      <div className="flex gap-2 ml-9">
                        <input autoFocus
                          className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-slate-300"
                          value={dvInput} onChange={e => setDvInput(e.target.value)} placeholder="Type DV name here"
                          onKeyDown={e => e.key === "Enter" && dvInput && handleAnswer(dvInput)} />
                        <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} disabled={!dvInput}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors flex-shrink-0">
                          →
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 ml-9">
                        {vq.options!.map(opt => (
                          <button key={opt} onClick={() => handleAnswer(opt)}
                            className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-semibold rounded-xl transition-all shadow-sm">
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <span className="text-xs text-slate-400">
          {done ? "Study entry complete" : `${visibleQs.length - answeredCount} question${visibleQs.length - answeredCount !== 1 ? 's' : ''} remaining`}
        </span>
        <div className="flex gap-2">
          <button onClick={handleReset} className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors">Save &amp; Start New</button>
          <button className="text-xs px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors">Export CSV</button>
        </div>
      </div>
    </div>
  );
}
