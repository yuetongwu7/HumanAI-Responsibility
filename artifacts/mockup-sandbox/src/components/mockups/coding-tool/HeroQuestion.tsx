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

export function HeroQuestion() {
  const [paperID, setPaperID] = useState("");
  const [studyID, setStudyID] = useState("");
  const [coderName, setCoderName] = useState("");
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<any>({});
  const [done, setDone] = useState(false);
  const [dvInput, setDvInput] = useState("");
  const [showMeta, setShowMeta] = useState(false);

  const visibleQs = questions.filter(q => !q.showIf || q.showIf(data));
  const answeredCount = visibleQs.filter(q => data[q.key] !== undefined && data[q.key] !== "").length;
  const progress = visibleQs.length ? (answeredCount / visibleQs.length) * 100 : 0;

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
    <div className="min-h-screen bg-slate-900 flex flex-col font-['Inter',sans-serif] overflow-hidden">

      {/* FLOATING METADATA BADGE — top right */}
      <div className="absolute top-4 right-4 z-20">
        <button onClick={() => setShowMeta(!showMeta)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/20 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {paperID || "Set study info"}
          <svg className={`w-3 h-3 opacity-60 transition-transform ${showMeta ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMeta && (
          <div className="absolute right-0 top-9 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 w-64 space-y-3 z-30">
            {[["Paper ID", paperID, setPaperID, "Smith_2024"], ["Study ID", studyID, setStudyID, "Study_1"], ["Coder Name", coderName, setCoderName, "Your name"]].map(([label, val, setter, ph]) => (
              <div key={label as string}>
                <label className="block text-[10px] text-slate-400 mb-1">{label as string}</label>
                <input className="w-full bg-slate-700 text-white text-xs rounded px-2.5 py-1.5 border border-slate-600 focus:outline-none focus:border-blue-400 placeholder-slate-500"
                  value={val as string} onChange={e => (setter as any)(e.target.value)} placeholder={ph as string} />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => { handleReset(); setShowMeta(false); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-1.5 rounded-lg transition-colors">Save &amp; New</button>
              <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-1.5 rounded-lg transition-colors">Export CSV</button>
            </div>
          </div>
        )}
      </div>

      {/* HERO QUESTION AREA */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-8 pt-16 pb-6">

        {done ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Study Complete</h2>
              <p className="text-slate-400 mt-2 text-base">All applicable criteria have been coded.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-blue-900/40">
                Save &amp; Start Next
              </button>
              <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl transition-colors backdrop-blur-sm border border-white/20">
                Export CSV
              </button>
            </div>
          </div>
        ) : q ? (
          <>
            {/* Step indicator */}
            <div className="flex gap-1.5 mb-8">
              {visibleQs.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${
                  i === qIdx ? 'w-6 h-1.5 bg-blue-400' :
                  i < answeredCount ? 'w-1.5 h-1.5 bg-emerald-400' : 'w-1.5 h-1.5 bg-white/20'
                }`} />
              ))}
            </div>

            {/* Question number */}
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
              Question {qIdx + 1} of {visibleQs.length}
            </p>

            {/* HERO TEXT — the question IS the visual surface */}
            <h2 className="text-3xl font-bold text-white text-center leading-tight max-w-2xl mb-10">
              {q.text}
            </h2>

            {/* Text input variant */}
            {q.type === "text" ? (
              <div className="w-full max-w-md space-y-4 text-center">
                <p className="text-slate-400 text-sm">Enter the response exactly as written in the paper.</p>
                <input autoFocus
                  className="w-full bg-white/10 text-white text-base text-center rounded-2xl px-5 py-4 border border-white/20 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition placeholder-white/30 backdrop-blur-sm"
                  value={dvInput} onChange={e => setDvInput(e.target.value)} placeholder="Type DV name here…"
                  onKeyDown={e => e.key === "Enter" && dvInput && handleAnswer(dvInput)} />
                <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} disabled={!dvInput}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-blue-900/40">
                  Continue →
                </button>
              </div>
            ) : (
              /* Answer chips — wide row for 3-option, wrap for more */
              <div className={`flex flex-wrap justify-center gap-3 max-w-xl`}>
                {q.options!.map(opt => (
                  <button key={opt} onClick={() => handleAnswer(opt)}
                    className="px-7 py-4 bg-white/10 hover:bg-blue-600 border border-white/20 hover:border-blue-500 text-white font-semibold rounded-2xl transition-all duration-150 backdrop-blur-sm text-sm hover:shadow-lg hover:shadow-blue-900/40">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* BOTTOM PROGRESS BAR STRIP */}
      <div className="h-1 bg-white/10 flex-shrink-0">
        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* BOTTOM META STRIP */}
      <div className="bg-slate-800/60 backdrop-blur-sm px-6 py-2.5 flex items-center justify-between flex-shrink-0 border-t border-white/10">
        <div className="flex gap-4 text-xs text-slate-500">
          {paperID && <span>Paper: <span className="text-slate-300">{paperID}</span></span>}
          {studyID && <span>Study: <span className="text-slate-300">{studyID}</span></span>}
          {coderName && <span>Coder: <span className="text-slate-300">{coderName}</span></span>}
          {!paperID && !studyID && !coderName && <span className="text-slate-600 italic">Click the badge above to set study info</span>}
        </div>
        <span className="text-xs text-slate-500">{answeredCount}/{visibleQs.length} answered</span>
      </div>
    </div>
  );
}
