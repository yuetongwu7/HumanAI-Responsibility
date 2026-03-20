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
    if (!questions[i].showIf || questions[i].showIf(data)) return i;
    i++;
  }
  return i;
}

export function TopNavBar() {
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Inter',sans-serif]">

      {/* TOP NAVIGATION BAR */}
      <header className="bg-slate-800 text-white px-6 py-3 flex items-center gap-6 flex-shrink-0">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-sm font-semibold whitespace-nowrap">Attribution Coder</span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs text-slate-400">Paper</span>
          <input className="bg-slate-700 text-white text-xs rounded px-2 py-1.5 border border-slate-600 focus:outline-none focus:border-blue-400 w-28 placeholder-slate-500"
            value={paperID} onChange={e => setPaperID(e.target.value)} placeholder="Smith_2024" />
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs text-slate-400">Study</span>
          <input className="bg-slate-700 text-white text-xs rounded px-2 py-1.5 border border-slate-600 focus:outline-none focus:border-blue-400 w-36 placeholder-slate-500"
            value={studyID} onChange={e => setStudyID(e.target.value)} placeholder="Smith_2024_Study1" />
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs text-slate-400">Coder</span>
          <input className="bg-slate-700 text-white text-xs rounded px-2 py-1.5 border border-slate-600 focus:outline-none focus:border-blue-400 w-24 placeholder-slate-500"
            value={coderName} onChange={e => setCoderName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="flex-1" />

        {/* Progress pill */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-20 h-1.5 bg-slate-600 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-slate-300">{progress}%</span>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button onClick={handleReset} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md transition-colors whitespace-nowrap">Save &amp; New</button>
          <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md transition-colors">Export CSV</button>
        </div>
      </header>

      {/* PROGRESS STEP STRIP */}
      {!done && (
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          {visibleQs.map((vq, i) => {
            const isActive = vq.key === q?.key;
            const isAnswered = data[vq.key] !== undefined && data[vq.key] !== "";
            return (
              <div key={vq.key} className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex items-center gap-1.5`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
                    ${isActive ? 'bg-blue-600 text-white' : isAnswered ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {isAnswered && !isActive ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i + 1}
                  </div>
                  {isActive && <span className="text-[11px] font-medium text-blue-700 max-w-[80px] leading-tight truncate">{vq.text.split(" ").slice(0,3).join(" ")}…</span>}
                </div>
                {i < visibleQs.length - 1 && <div className={`w-4 h-px flex-shrink-0 ${isAnswered ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              </div>
            );
          })}
        </div>
      )}

      {/* MAIN QUESTION AREA */}
      <div className="flex-1 flex items-center justify-center p-8">
        {done ? (
          <div className="text-center space-y-5 max-w-sm">
            <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Study Complete</h2>
              <p className="text-sm text-slate-500 mt-1.5">All applicable criteria coded. Save or export your dataset.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg shadow transition-colors">
                Save &amp; Start New
              </button>
              <button className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                Export CSV
              </button>
            </div>
          </div>
        ) : q ? (
          <div className="w-full max-w-lg">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="mb-5">
                <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-4">
                  Q{qIdx + 1} of {visibleQs.length}
                </span>
                <h2 className="text-xl font-bold text-slate-800 leading-snug">{q.text}</h2>
              </div>

              {q.type === "text" ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">Enter the response exactly as written, then continue.</p>
                  <input autoFocus
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    value={dvInput} onChange={e => setDvInput(e.target.value)} placeholder="Type here"
                    onKeyDown={e => e.key === "Enter" && dvInput && handleAnswer(dvInput)} />
                  <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} disabled={!dvInput}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors">
                    Continue →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {q.options!.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      className="w-full text-left px-4 py-3.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-sm font-medium rounded-xl transition-all shadow-sm group">
                      <span className="flex items-center justify-between">
                        {opt}
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Answered summary below card */}
            {answeredCount > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {visibleQs.filter(vq => data[vq.key]).map(vq => (
                  <span key={vq.key} className="text-xs bg-white border border-slate-200 rounded-full px-2.5 py-1 text-slate-500 shadow-sm">
                    <span className="text-slate-400">{vq.key.replace(/_/g, " ")}: </span>
                    <span className="font-medium text-slate-700">{data[vq.key]}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
