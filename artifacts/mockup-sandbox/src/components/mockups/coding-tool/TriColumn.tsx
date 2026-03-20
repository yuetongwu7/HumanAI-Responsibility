import { useState } from "react";

const YES_NO_UNSURE = ["Yes", "No", "Unsure"];

const questions = [
  { key: "primary_quantitative", text: "Is this a primary quantitative study?", short: "Primary quantitative?", options: YES_NO_UNSURE },
  { key: "experimental", text: "Is this an experimental study?", short: "Experimental study?", options: YES_NO_UNSURE },
  { key: "design_type", text: "If experimental, what design?", short: "Experimental design", options: ["Within", "Between", "Not Applicable"], showIf: (d: any) => d.experimental === "Yes" },
  { key: "failure_present", text: "Is there a failure or negative consequence depicted?", short: "Failure depicted?", options: YES_NO_UNSURE },
  { key: "ai_human_comparison_possible", text: "Does the scenario involve potential AI vs Human comparison?", short: "AI vs Human comparison?", options: YES_NO_UNSURE },
  { key: "error_type", text: "Error type:", short: "Error type", options: ["Only_Humans", "Only_AI", "Both", "Different_Consequences", "Not_Applicable"], showIf: (d: any) => d.ai_human_comparison_possible === "Yes" },
  { key: "attribution_measure", text: "Is there an attribution outcome measure?", short: "Attribution measure?", options: YES_NO_UNSURE },
  { key: "DV_name", text: "Enter DV name exactly as written:", short: "DV name", type: "text", showIf: (d: any) => d.attribution_measure === "Yes" },
  { key: "ai_human_measures", text: "Are there measures directly comparing AI vs Human?", short: "AI vs Human measures?", options: YES_NO_UNSURE, showIf: (d: any) => d.ai_human_comparison_possible === "Yes" },
];

const answerChipColor: Record<string, string> = {
  Yes: "bg-emerald-100 text-emerald-800",
  No: "bg-red-100 text-red-800",
  Unsure: "bg-amber-100 text-amber-800",
  Within: "bg-blue-100 text-blue-800",
  Between: "bg-blue-100 text-blue-800",
  "Not Applicable": "bg-slate-100 text-slate-600",
  Only_Humans: "bg-purple-100 text-purple-800",
  Only_AI: "bg-cyan-100 text-cyan-800",
  Both: "bg-indigo-100 text-indigo-800",
  Different_Consequences: "bg-orange-100 text-orange-800",
};

function getNextEligible(idx: number, data: any): number {
  let i = idx;
  while (i < questions.length) {
    if (!questions[i].showIf || questions[i].showIf(data)) return i;
    i++;
  }
  return i;
}

export function TriColumn() {
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">

      {/* COMPACT HEADER */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center gap-4">
        <span className="text-sm font-bold text-slate-800 flex-shrink-0">AI Attribution Coder</span>
        <div className="flex items-center gap-3 flex-1">
          {[["Paper", paperID, setPaperID, "Smith_2024", "w-28"], ["Study", studyID, setStudyID, "Study1", "w-36"], ["Coder", coderName, setCoderName, "Name", "w-24"]].map(([label, val, setter, ph, w]) => (
            <div key={label as string} className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">{label as string}</span>
              <input className={`${w} border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-400 text-slate-700`}
                value={val as string} onChange={e => (setter as any)(e.target.value)} placeholder={ph as string} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-1.5 w-20 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-slate-400">{answeredCount}/{visibleQs.length}</span>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={handleReset} className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors">Save &amp; New</button>
          <button className="text-xs px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors">CSV</button>
        </div>
      </div>

      {/* TRI-COLUMN BODY */}
      <div className="flex-1 flex overflow-hidden">

        {/* COL 1: Step Navigator */}
        <div className="w-56 flex-shrink-0 bg-white border-r border-slate-200 py-4 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Questions</p>
          {visibleQs.map((vq, i) => {
            const isActive = !done && vq.key === q?.key;
            const isAnswered = data[vq.key] !== undefined && data[vq.key] !== "";
            return (
              <div key={vq.key} className={`relative flex items-start gap-3 px-4 py-3 transition-colors
                ${isActive ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''}`}>
                {/* Connector line */}
                {i < visibleQs.length - 1 && (
                  <div className={`absolute left-[23px] top-8 w-px h-full ${isAnswered ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                )}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 mt-0.5
                  ${isAnswered ? 'bg-emerald-500 border-emerald-500' : isActive ? 'bg-white border-blue-500' : 'bg-white border-slate-300'}`}>
                  {isAnswered ? (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${isActive ? 'font-semibold text-blue-800' : isAnswered ? 'text-slate-500' : 'text-slate-600'}`}>
                    {vq.short}
                  </p>
                  {isAnswered && (
                    <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded ${answerChipColor[data[vq.key]] || 'bg-slate-100 text-slate-600'}`}>
                      {data[vq.key]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {done && (
            <div className="mx-4 mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <p className="text-xs font-semibold text-emerald-700">✓ Complete</p>
            </div>
          )}
        </div>

        {/* COL 2: Active Question (center, widest) */}
        <div className="flex-1 flex flex-col justify-center p-8">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xl font-bold text-slate-800">Study Coded</p>
              <p className="text-sm text-slate-500">All applicable criteria are answered.</p>
              <button onClick={handleReset} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors shadow">
                Save &amp; Start Next
              </button>
            </div>
          ) : q ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  Q{qIdx + 1} / {visibleQs.length}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 leading-snug">{q.text}</h2>

              {q.type === "text" ? (
                <div className="space-y-3 max-w-sm">
                  <p className="text-sm text-slate-500">Enter the response exactly as written.</p>
                  <input autoFocus
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={dvInput} onChange={e => setDvInput(e.target.value)} placeholder="Type here"
                    onKeyDown={e => e.key === "Enter" && dvInput && handleAnswer(dvInput)} />
                  <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} disabled={!dvInput}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
                    Continue →
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-w-sm">
                  {q.options!.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl shadow-sm transition-all group">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{opt}</span>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* COL 3: Live Answer Log */}
        <div className="w-56 flex-shrink-0 border-l border-slate-200 bg-slate-50 py-4 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Answer Log</p>
          {visibleQs.filter(vq => data[vq.key]).length === 0 ? (
            <p className="px-4 text-xs text-slate-400 italic">Answers appear here as you code…</p>
          ) : (
            <div className="px-3 space-y-2">
              {visibleQs.filter(vq => data[vq.key]).map(vq => (
                <div key={vq.key} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                  <p className="text-[10px] text-slate-400 mb-1 leading-tight">{vq.short}</p>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-lg ${answerChipColor[data[vq.key]] || 'bg-slate-100 text-slate-700'}`}>
                    {data[vq.key]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
