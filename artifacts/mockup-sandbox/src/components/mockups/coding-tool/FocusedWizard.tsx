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

function getNextEligible(idx: number, data: any): number {
  let i = idx;
  while (i < questions.length) {
    const q = questions[i];
    if (!q.showIf || q.showIf(data)) return i;
    i++;
  }
  return i;
}

export function FocusedWizard() {
  const [paperID, setPaperID] = useState("Smith_2024");
  const [studyID, setStudyID] = useState("Smith_2024_Study1");
  const [coderName, setCoderName] = useState("J. Carter");
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<any>({});
  const [done, setDone] = useState(false);
  const [dvInput, setDvInput] = useState("");
  const [metaExpanded, setMetaExpanded] = useState(false);

  const visibleQs = questions.filter(q => !q.showIf || q.showIf(data));
  const answeredCount = visibleQs.filter(q => data[q.key] !== undefined && data[q.key] !== "").length;
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
    if (next >= questions.length) { setDone(true); } else { setCurrent(next); }
  }

  function handleReset() { setData({}); setCurrent(0); setDone(false); setDvInput(""); }

  const metaFilled = paperID && studyID && coderName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col font-['Inter',sans-serif]">

      {/* TOP HEADER BAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-700">AI vs Human Attribution Coding</span>
          </div>

          <button onClick={() => setMetaExpanded(!metaExpanded)} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">
            {metaFilled ? (
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-slate-100 rounded-full font-mono">{paperID}</span>
                <span className="text-slate-300">·</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-full font-mono">{studyID}</span>
                <span className="text-slate-300">·</span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">{coderName}</span>
              </div>
            ) : (
              <span className="text-amber-600 font-medium">⚠ Set study info</span>
            )}
            <svg className={`w-3.5 h-3.5 transition-transform ${metaExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {metaExpanded && (
          <div className="max-w-2xl mx-auto mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-3">
            {[["Paper ID", paperID, setPaperID, "Smith_2024"], ["Study ID", studyID, setStudyID, "Smith_2024_Study1"], ["Coder Name", coderName, setCoderName, "Your name"]].map(([label, val, setter, ph]) => (
              <div key={label as string}>
                <label className="block text-xs text-slate-500 mb-1">{label as string}</label>
                <input
                  className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  value={val as string} onChange={e => (setter as any)(e.target.value)} placeholder={ph as string}
                />
              </div>
            ))}
          </div>
        )}
      </header>

      {/* STEP DOTS */}
      {!done && (
        <div className="flex justify-center gap-1.5 pt-6">
          {visibleQs.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-200 ${i === qIdx ? 'w-5 h-2 bg-indigo-600' : i < answeredCount ? 'w-2 h-2 bg-indigo-300' : 'w-2 h-2 bg-slate-200'}`} />
          ))}
        </div>
      )}

      {/* MAIN FOCUS AREA */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        {done ? (
          <div className="text-center space-y-5 max-w-sm">
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Study coded</h2>
              <p className="text-slate-500 mt-2 text-sm">All applicable questions answered. Save to your dataset or export.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-indigo-200">
                Save &amp; Code Next
              </button>
              <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors">
                Export CSV
              </button>
            </div>
          </div>
        ) : q ? (
          <div className="w-full max-w-xl text-center space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400">
                Question {qIdx + 1} of {visibleQs.length}
              </p>
              <h2 className="text-2xl font-bold text-slate-800 leading-tight">{q.text}</h2>
            </div>

            {q.type === "text" ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-500">Type exactly as written in the paper.</p>
                <input
                  autoFocus
                  className="w-full border-2 border-slate-200 focus:border-indigo-400 rounded-xl px-4 py-3 text-base text-center focus:outline-none transition-colors"
                  value={dvInput}
                  onChange={e => setDvInput(e.target.value)}
                  placeholder="Enter DV name..."
                  onKeyDown={e => e.key === "Enter" && dvInput && handleAnswer(dvInput)}
                />
                <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} disabled={!dvInput}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors shadow-md shadow-indigo-200">
                  Continue →
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {q.options!.map(opt => (
                  <button key={opt} onClick={() => handleAnswer(opt)}
                    className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold rounded-xl transition-all shadow-sm text-sm">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="border-t border-slate-100 bg-white px-6 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="h-1 flex-1 max-w-[200px] bg-slate-100 rounded-full overflow-hidden">
            <div className="h-1 bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${visibleQs.length ? (answeredCount / visibleQs.length) * 100 : 0}%` }} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleReset} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Save &amp; Start New</button>
            <span className="text-slate-200">|</span>
            <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Export CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
}
