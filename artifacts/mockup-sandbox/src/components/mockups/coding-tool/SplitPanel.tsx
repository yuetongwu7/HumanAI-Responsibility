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

export function SplitPanel() {
  const [paperID, setPaperID] = useState("Smith_2024");
  const [studyID, setStudyID] = useState("Smith_2024_Study1");
  const [coderName, setCoderName] = useState("J. Carter");
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
    if (next >= questions.length) { setDone(true); } else { setCurrent(next); }
  }

  function handleReset() {
    setData({}); setCurrent(0); setDone(false); setDvInput("");
  }

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

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center pt-6 font-['Inter',sans-serif]">
      <div className="w-full max-w-4xl flex rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white" style={{ minHeight: 580 }}>

        {/* LEFT SIDEBAR */}
        <div className="w-72 flex-shrink-0 bg-slate-800 text-white flex flex-col p-5 gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Study Context</p>
            <div className="space-y-3">
              {[["Paper ID", paperID, setPaperID], ["Study ID", studyID, setStudyID], ["Coder Name", coderName, setCoderName]].map(([label, val, setter]) => (
                <div key={label as string}>
                  <label className="block text-xs text-slate-400 mb-1">{label as string}</label>
                  <input
                    className="w-full bg-slate-700 text-white text-sm rounded px-2 py-1.5 border border-slate-600 focus:outline-none focus:border-blue-400 placeholder-slate-500"
                    value={val as string}
                    onChange={e => (setter as any)(e.target.value)}
                    placeholder={`Enter ${label}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Progress</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-2 bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-slate-300 w-8 text-right">{progress}%</span>
            </div>
            <p className="text-xs text-slate-400">{answeredCount} of {visibleQs.length} questions answered</p>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Answers So Far</p>
            <div className="space-y-1.5">
              {visibleQs.map(vq => (
                <div key={vq.key} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${data[vq.key] ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className={`text-xs truncate ${data[vq.key] ? 'text-slate-200' : 'text-slate-500'}`}>
                    {qLabels[vq.key]}
                  </span>
                  {data[vq.key] && <span className="text-xs text-slate-400 ml-auto truncate max-w-[60px]">{data[vq.key]}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <button onClick={handleReset} className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg transition-colors">
              Save &amp; Start New
            </button>
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg transition-colors">
              Export to CSV
            </button>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="flex-1 flex flex-col p-8">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-slate-800">AI vs Human Attribution Coding Tool</h1>
            <p className="text-sm text-slate-400 mt-0.5">Research coding instrument — HumanAI Responsibility</p>
          </div>

          {done ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-800">Study Complete</p>
                <p className="text-sm text-slate-500 mt-1">Review your answers in the sidebar, then save or export.</p>
              </div>
              <button onClick={handleReset} className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                Start Next Study
              </button>
            </div>
          ) : q ? (
            <div className="flex-1 flex flex-col justify-center max-w-lg">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Q{visibleQs.findIndex(vq => vq.key === q.key) + 1} / {visibleQs.length}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-6 leading-snug">{q.text}</h2>

              {q.type === "text" ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">Enter the response, then click Continue.</p>
                  <input
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={dvInput}
                    onChange={e => setDvInput(e.target.value)}
                    placeholder="Type here"
                  />
                  <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Continue →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {q.options!.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="w-full text-left px-4 py-3 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 text-sm font-medium rounded-lg transition-all shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
