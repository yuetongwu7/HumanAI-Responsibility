import { useState } from "react";

const YES_NO_UNSURE = ["Yes", "No", "Unsure"];

const questions = [
  { key: "primary_quantitative", text: "Primary quantitative study?", fullText: "Is this a primary quantitative study?", options: YES_NO_UNSURE },
  { key: "experimental", text: "Experimental study?", fullText: "Is this an experimental study?", options: YES_NO_UNSURE },
  { key: "design_type", text: "Experimental design", fullText: "If experimental, what design?", options: ["Within", "Between", "Not Applicable"], showIf: (d: any) => d.experimental === "Yes" },
  { key: "failure_present", text: "Failure depicted?", fullText: "Is there a failure or negative consequence depicted?", options: YES_NO_UNSURE },
  { key: "ai_human_comparison_possible", text: "AI vs Human comparison?", fullText: "Does the scenario involve potential AI vs Human comparison?", options: YES_NO_UNSURE },
  { key: "error_type", text: "Error type", fullText: "Error type:", options: ["Only_Humans", "Only_AI", "Both", "Different_Consequences", "Not_Applicable"], showIf: (d: any) => d.ai_human_comparison_possible === "Yes" },
  { key: "attribution_measure", text: "Attribution measure?", fullText: "Is there an attribution outcome measure?", options: YES_NO_UNSURE },
  { key: "DV_name", text: "DV name", fullText: "Enter DV name exactly as written:", type: "text", showIf: (d: any) => d.attribution_measure === "Yes" },
  { key: "ai_human_measures", text: "AI vs Human measures?", fullText: "Are there measures directly comparing AI vs Human?", options: YES_NO_UNSURE, showIf: (d: any) => d.ai_human_comparison_possible === "Yes" },
];

function getNextEligible(idx: number, data: any): number {
  let i = idx;
  while (i < questions.length) {
    if (!questions[i].showIf || questions[i].showIf(data)) return i;
    i++;
  }
  return i;
}

const answerColor: Record<string, string> = {
  "Yes": "bg-emerald-100 text-emerald-800",
  "No": "bg-red-100 text-red-800",
  "Unsure": "bg-amber-100 text-amber-800",
  "Within": "bg-blue-100 text-blue-800",
  "Between": "bg-blue-100 text-blue-800",
  "Not Applicable": "bg-slate-100 text-slate-600",
  "Only_Humans": "bg-purple-100 text-purple-800",
  "Only_AI": "bg-cyan-100 text-cyan-800",
  "Both": "bg-indigo-100 text-indigo-800",
  "Different_Consequences": "bg-orange-100 text-orange-800",
};

export function DenseTriage() {
  const [paperID, setPaperID] = useState("Smith_2024");
  const [studyID, setStudyID] = useState("Smith_2024_Study1");
  const [coderName, setCoderName] = useState("J. Carter");
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<any>({});
  const [done, setDone] = useState(false);
  const [dvInput, setDvInput] = useState("");

  const visibleQs = questions.filter(q => !q.showIf || q.showIf(data));
  const answeredCount = visibleQs.filter(q => data[q.key] !== undefined && data[q.key] !== "").length;
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

  function handleReset() { setData({}); setCurrent(0); setDone(false); setDvInput(""); }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif] text-sm">

      {/* COMPACT METADATA ROW */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-800 mr-1">Attribution Coder</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Paper:</span>
            <input className="text-xs border border-slate-200 rounded px-1.5 py-0.5 w-28 focus:outline-none focus:border-blue-400 font-mono"
              value={paperID} onChange={e => setPaperID(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Study:</span>
            <input className="text-xs border border-slate-200 rounded px-1.5 py-0.5 w-36 focus:outline-none focus:border-blue-400 font-mono"
              value={studyID} onChange={e => setStudyID(e.target.value)} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400">Coder:</span>
            <input className="text-xs border border-slate-200 rounded px-1.5 py-0.5 w-24 focus:outline-none focus:border-blue-400"
              value={coderName} onChange={e => setCoderName(e.target.value)} />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${visibleQs.length ? (answeredCount / visibleQs.length) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-slate-500">{answeredCount}/{visibleQs.length}</span>
            </div>
            <button onClick={handleReset} className="text-xs px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded transition-colors">Save &amp; New</button>
            <button className="text-xs px-2.5 py-1 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded transition-colors">Export CSV</button>
          </div>
        </div>
      </div>

      {/* MAIN BODY: checklist left + answer panel right */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 48px)" }}>

        {/* LEFT: Question checklist */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Questions</p>
          </div>
          {visibleQs.map((vq, i) => {
            const isActive = !done && vq.key === q?.key;
            const isAnswered = data[vq.key] !== undefined && data[vq.key] !== "";
            return (
              <div key={vq.key} className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-slate-50 cursor-default transition-colors
                ${isActive ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}
                ${isAnswered && !isActive ? 'bg-white' : ''}
              `}>
                <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 border
                  ${isAnswered ? 'bg-emerald-500 border-emerald-500' : isActive ? 'border-blue-500 bg-white' : 'border-slate-300 bg-white'}
                `}>
                  {isAnswered && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isActive && !isAnswered && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-tight ${isActive ? 'font-semibold text-blue-800' : isAnswered ? 'text-slate-500' : 'text-slate-600'}`}>
                    {i + 1}. {vq.text}
                  </p>
                  {isAnswered && (
                    <span className={`inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${answerColor[data[vq.key]] || 'bg-slate-100 text-slate-600'}`}>
                      {data[vq.key]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {done && (
            <div className="px-3 py-2.5 bg-emerald-50 border-l-2 border-l-emerald-500">
              <p className="text-xs font-semibold text-emerald-700">✓ All done</p>
            </div>
          )}
        </div>

        {/* RIGHT: Active question + answers */}
        <div className="flex-1 flex flex-col">
          {done ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-800">Study entry complete</p>
                <p className="text-xs text-slate-500">All applicable criteria have been coded. Save to proceed.</p>
              </div>
              <div className="w-full max-w-xs bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-600">Entry Summary</p>
                </div>
                <div className="p-3 space-y-1.5 max-h-48 overflow-y-auto">
                  {Object.entries(data).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2 text-xs">
                      <span className="text-slate-500 truncate">{k}</span>
                      <span className={`font-medium px-1.5 py-0.5 rounded text-[10px] ${answerColor[v as string] || 'bg-slate-100 text-slate-700'}`}>{v as string}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleReset} className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors">
                Save &amp; Code Next Study
              </button>
            </div>
          ) : q ? (
            <div className="flex-1 flex flex-col p-8">
              <div className="mb-1">
                <span className="text-xs text-blue-500 font-semibold uppercase tracking-wide">
                  Q{visibleQs.findIndex(vq => vq.key === q.key) + 1} of {visibleQs.length}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-6 leading-snug">{q.fullText}</h2>

              {q.type === "text" ? (
                <div className="max-w-sm space-y-3">
                  <p className="text-xs text-slate-500">Enter the response exactly as written.</p>
                  <input autoFocus
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={dvInput} onChange={e => setDvInput(e.target.value)} placeholder="Type here"
                    onKeyDown={e => e.key === "Enter" && dvInput && handleAnswer(dvInput)}
                  />
                  <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} disabled={!dvInput}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors">
                    Continue →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-w-sm">
                  {q.options!.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all group shadow-sm">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{opt}</span>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}

              {/* Context panel */}
              <div className="mt-auto pt-6 border-t border-slate-100">
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(data).slice(-3).map(([k, v]) => (
                    <div key={k} className="bg-slate-50 rounded-lg p-2.5">
                      <p className="text-[10px] text-slate-400 truncate">{k.replace(/_/g, " ")}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${answerColor[v as string]?.split(" ")[1] || 'text-slate-700'}`}>{v as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
