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

export function HorizontalAnswers() {
  const [paperID, setPaperID] = useState("");
  const [studyID, setStudyID] = useState("");
  const [coderName, setCoderName] = useState("");
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<any>({});
  const [done, setDone] = useState(false);
  const [dvInput, setDvInput] = useState("");

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
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif] overflow-hidden">

      {/* TOP BAND — dark, contains the question (tall, takes visual weight) */}
      <div className="bg-slate-900 flex flex-col flex-[3] relative">

        {/* Inner top row: meta inputs + actions */}
        <div className="flex items-center gap-4 px-6 pt-5 pb-0">
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase flex-shrink-0">Attribution Coder</span>
          <div className="flex gap-3 flex-1">
            {[["Paper", paperID, setPaperID, "Smith_2024", "w-28"], ["Study", studyID, setStudyID, "Study_1", "w-32"], ["Coder", coderName, setCoderName, "Your name", "w-24"]].map(([label, val, setter, ph, w]) => (
              <div key={label as string} className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500">{label as string}</span>
                <input className={`${w} bg-slate-800 text-white text-xs rounded px-2 py-1.5 border border-slate-700 focus:outline-none focus:border-blue-400 placeholder-slate-600`}
                  value={val as string} onChange={e => (setter as any)(e.target.value)} placeholder={ph as string} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleReset} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Save &amp; New</button>
            <button className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Export CSV</button>
          </div>
        </div>

        {/* Question number + text — centered in the dark band */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-6">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Study Complete</h2>
              <p className="text-slate-400 text-sm">All applicable criteria coded. Save or export below.</p>
            </div>
          ) : q ? (
            <>
              <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase mb-4">
                Question {qIdx + 1} of {visibleQs.length}
              </span>
              <h2 className="text-2xl font-bold text-white text-center leading-snug max-w-2xl">
                {q.text}
              </h2>
              {q.type === "text" && (
                <p className="text-slate-500 text-sm mt-3">Enter your answer in the field below, then click Continue.</p>
              )}
            </>
          ) : null}
        </div>

        {/* Step dots at bottom of dark band */}
        <div className="flex justify-center gap-1.5 pb-4">
          {visibleQs.map((_, i) => (
            <div key={i} className={`rounded-full transition-all duration-200 ${
              i === qIdx && !done ? 'w-5 h-1.5 bg-blue-400' :
              i < answeredCount ? 'w-1.5 h-1.5 bg-emerald-400' :
              'w-1.5 h-1.5 bg-white/15'
            }`} />
          ))}
        </div>
      </div>

      {/* PROGRESS DIVIDER */}
      <div className="h-1 bg-slate-800 flex-shrink-0">
        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* BOTTOM BAND — white, contains answers arranged HORIZONTALLY */}
      <div className="bg-white flex-[2] flex flex-col items-center justify-center px-8 py-6">
        {done ? (
          <div className="flex gap-3">
            <button onClick={handleReset} className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-colors shadow-lg text-sm">
              Save &amp; Start Next Study
            </button>
            <button className="px-7 py-3.5 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-2xl transition-colors text-sm">
              Export to CSV
            </button>
          </div>
        ) : q ? (
          q.type === "text" ? (
            <div className="flex gap-3 w-full max-w-lg">
              <input autoFocus
                className="flex-1 border-2 border-slate-200 focus:border-blue-400 rounded-2xl px-5 py-3.5 text-base focus:outline-none transition placeholder-slate-300"
                value={dvInput} onChange={e => setDvInput(e.target.value)} placeholder="Enter DV name exactly as written…"
                onKeyDown={e => e.key === "Enter" && dvInput && handleAnswer(dvInput)} />
              <button onClick={() => { handleAnswer(dvInput); setDvInput(""); }} disabled={!dvInput}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-2xl transition-colors flex-shrink-0">
                Continue →
              </button>
            </div>
          ) : (
            /* HORIZONTAL ANSWER PILLS — the key layout differentiator */
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl">
              {q.options!.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)}
                  className="flex-1 min-w-[120px] max-w-[220px] py-4 px-6 border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-600 hover:text-white bg-white text-slate-700 font-semibold rounded-2xl transition-all duration-150 shadow-sm text-sm group">
                  {opt}
                </button>
              ))}
            </div>
          )
        ) : null}

        {/* Answered breadcrumb */}
        {answeredCount > 0 && !done && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-5 max-w-2xl">
            {visibleQs.filter(vq => data[vq.key]).slice(-4).map(vq => (
              <span key={vq.key} className="text-[11px] bg-slate-100 text-slate-500 rounded-full px-2.5 py-1 border border-slate-200">
                <span className="font-medium text-slate-600">{data[vq.key]}</span>
              </span>
            ))}
            {answeredCount > 4 && <span className="text-[11px] text-slate-400 py-1">+{answeredCount - 4} more</span>}
          </div>
        )}
      </div>
    </div>
  );
}
