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

const qLabels: Record<string, string> = {
  primary_quantitative: "Primary quantitative?",
  experimental: "Experimental study?",
  design_type: "Design type",
  failure_present: "Failure depicted?",
  ai_human_comparison_possible: "AI vs Human comparison?",
  error_type: "Error type",
  attribution_measure: "Attribution measure?",
  DV_name: "DV name",
  ai_human_measures: "AI vs Human measures?",
};

function getNextEligible(idx: number, data: any): number {
  let i = idx;
  while (i < questions.length) {
    if (!questions[i].showIf || questions[i].showIf(data)) return i;
    i++;
  }
  return i;
}

export function RightSidebar() {
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
  const qIdx = visibleQs.findIndex(vq => vq.key === q?.key);

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
    <div className="min-h-screen bg-stone-50 flex items-start justify-center pt-6 pb-10 px-4 font-['Inter',sans-serif]">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl border border-stone-200" style={{ minHeight: 560 }}>

        {/* LEFT — QUESTION AREA (primary visual weight) */}
        <div className="flex-1 bg-white flex flex-col p-8">
          <div className="mb-5">
            <h1 className="text-base font-bold text-slate-800">AI vs Human Attribution Coding Tool</h1>
            <p className="text-xs text-slate-400 mt-0.5">Research coding instrument — HumanAI Responsibility</p>
          </div>

          {done ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 bg-teal-50 border-2 border-teal-200 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-800">Study Complete</p>
                <p className="text-sm text-slate-400 mt-1">Review your answers in the panel, then save or export.</p>
              </div>
              <button onClick={handleReset} className="mt-1 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl shadow transition-colors">
                Start Next Study
              </button>
            </div>
          ) : q ? (
            <div className="flex-1 flex flex-col justify-center">
              <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-4 self-start">
                Q{qIdx + 1} / {visibleQs.length}
              </span>
              <h2 className="text-2xl font-bold text-slate-800 leading-snug mb-7">{q.text}</h2>

              {q.type === "text" ? (
                <div className="space-y-3 max-w-sm">
                  <p className="text-sm text-slate-500">Enter the response exactly as written.</p>
                  <input autoFocus
                    className="w-full border-2 border-stone-200 focus:border-teal-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition"
                    value={dvInput} onChange={e => setDvInput(e.target.value)} placeholder="Type here"
                    onKeyDown={e => e.key === "Enter" && dvInput && handleAnswer(dvInput)} />
                  <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} disabled={!dvInput}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
                    Continue →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-w-sm">
                  {q.options!.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      className="w-full text-left px-5 py-3.5 border-2 border-stone-200 hover:border-teal-400 hover:bg-teal-50 bg-white text-slate-700 hover:text-teal-800 text-sm font-medium rounded-xl transition-all shadow-sm">
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Subtle next-question hint */}
              {qIdx + 1 < visibleQs.length && (
                <p className="mt-8 text-xs text-slate-300">
                  Next: {visibleQs[qIdx + 1]?.text}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* RIGHT SIDEBAR (context panel — lighter treatment) */}
        <div className="w-64 flex-shrink-0 bg-stone-100 border-l border-stone-200 flex flex-col p-5 gap-5">

          {/* Meta inputs */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Study Context</p>
            <div className="space-y-2.5">
              {[["Paper ID", paperID, setPaperID, "Smith_2024"], ["Study ID", studyID, setStudyID, "Study1"], ["Coder Name", coderName, setCoderName, "Your name"]].map(([label, val, setter, ph]) => (
                <div key={label as string}>
                  <label className="block text-[10px] text-stone-400 mb-1">{label as string}</label>
                  <input
                    className="w-full bg-white text-slate-700 text-xs rounded-lg px-2.5 py-1.5 border border-stone-300 focus:outline-none focus:border-teal-400 placeholder-stone-300 shadow-sm"
                    value={val as string} onChange={e => (setter as any)(e.target.value)} placeholder={ph as string} />
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Progress</p>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex-1 h-1.5 bg-stone-300 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-[11px] text-stone-500 w-7 text-right">{progress}%</span>
            </div>
            <p className="text-[10px] text-stone-400">{answeredCount} of {visibleQs.length} answered</p>
          </div>

          {/* Answers so far */}
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Answers So Far</p>
            <div className="space-y-2">
              {visibleQs.map(vq => {
                const isAnswered = data[vq.key] !== undefined && data[vq.key] !== "";
                const isActive = !done && vq.key === q?.key;
                return (
                  <div key={vq.key} className={`flex items-start gap-1.5 ${isActive ? 'opacity-100' : isAnswered ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 transition-colors ${isAnswered ? 'bg-teal-500' : isActive ? 'bg-blue-400' : 'bg-stone-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-stone-500 truncate leading-tight">{qLabels[vq.key]}</p>
                      {isAnswered && (
                        <p className="text-[11px] font-semibold text-slate-700 truncate">{data[vq.key]}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button onClick={handleReset} className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2 rounded-xl transition-colors shadow">
              Save &amp; Start New
            </button>
            <button className="w-full bg-white border border-stone-300 hover:bg-stone-50 text-slate-600 text-xs font-medium py-2 rounded-xl transition-colors">
              Export to CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
