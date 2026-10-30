import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useInterview } from "../hook/useinterview";

// Maps the database report (your Mongoose schema keys) to what this page displays.
// Missing fields fall back to safe defaults so the page never crashes.
const normalize = (r) => ({
  role: r.title || "Interview analysis",
  company: "",
  score: Math.max(0, Math.min(100, Math.round(Number(r.matchscore) || 0))),
  summary: r.summary || "",
  matched: r.matchedSkills ?? [],
  gaps: (r.skillGaps ?? []).map((g) => ({
    name: g.skills,
    level: g.severity === "high" ? "high" : "med",
    note: g.note || "",
  })),
  technical: (r.technicalQuestion ?? []).map((t) => ({
    topic: "Technical",
    q: t.question,
    intention: t.intention,
    a: t.answer,
  })),
  behavioral: (r.behaviorQuestion ?? []).map((b) => ({
    topic: "Behavioural",
    q: b.question,
    intention: b.intention,
    a: b.answer,
  })),
  plan: buildPlan(r.preparationPlan ?? []),
});

// "days" from the AI is how long each block lasts (e.g. 7), not a day number.
// Turn the blocks into consecutive ranges: Days 1-7, Days 8-14, Days 15-21.
function buildPlan(blocks) {
  let start = 1;
  return blocks
    .map((p) => {
      const length = Number(p.days) > 0 ? Number(p.days) : 7;
      const range = length === 1 ? `Day ${start}` : `Days ${start}-${start + length - 1}`;
      start += length;
      return { title: p.focus, range, tasks: p.tasks ?? [] };
    })
    .filter((w) => w.tasks.length);
}

function ScoreRing({ score }) {
  const R = 88;
  const C = 2 * Math.PI * R;
  const [shown, setShown] = useState(0);
  const label = score >= 75 ? "Strong match" : score >= 50 ? "Good match" : "Weak match";

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(score);
      return;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1400, 1);
      setShown(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div
      role="img"
      aria-label={`Match score ${score} out of 100, ${label}`}
      className="relative mx-auto h-48 w-48 sm:h-52 sm:w-52"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" strokeWidth="14" className="stroke-slate-200 dark:stroke-slate-700" />
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - shown / 100)}
          className="stroke-blue-600 dark:stroke-blue-400"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tabular-nums text-slate-900 dark:text-slate-50">{shown}</span>
        <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</span>
      </div>
    </div>
  );
}

const levelStyles = {
  high: { border: "border-l-red-600 dark:border-l-red-400", text: "text-red-700 dark:text-red-300", tag: "Major gap" },
  med: { border: "border-l-amber-600 dark:border-l-amber-400", text: "text-amber-700 dark:text-amber-300", tag: "Minor gap" },
  have: { border: "border-l-emerald-600 dark:border-l-emerald-400", text: "text-emerald-700 dark:text-emerald-300", tag: "Matched" },
};

function SkillCard({ name, note, level }) {
  const s = levelStyles[level];
  return (
    <div className={`rounded-xl border border-l-4 border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 ${s.border}`}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">{name}</h3>
        <span className={`text-xs font-semibold ${s.text}`}>{s.tag}</span>
      </div>
      {note && <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{note}</p>}
    </div>
  );
}

function SkillsPanel({ gaps, matched }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-50">What to work on</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {gaps.map((g) => (
            <SkillCard key={g.name} {...g} />
          ))}
        </div>
      </section>
      {matched.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-50">What already matches</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {matched.map((m) => (
              <SkillCard key={m.name} {...m} level="have" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function QuestionList({ items }) {
  return (
    <div className="space-y-2.5">
      {items.map((i) => (
        <details key={i.q} className="group rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-3 rounded-xl p-4 font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-slate-50 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="mb-1.5 inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {i.topic}
              </span>
              <br />
              {i.q}
            </span>
            <span aria-hidden="true" className="text-2xl leading-none text-slate-400 group-open:hidden">+</span>
            <span aria-hidden="true" className="hidden text-2xl leading-none text-slate-400 group-open:inline">&minus;</span>
          </summary>
          <div className="space-y-2 px-4 pb-4 text-slate-600 dark:text-slate-400">
            {i.intention && (
              <p>
                <b className="text-slate-900 dark:text-slate-50">Why they ask:</b> {i.intention}
              </p>
            )}
            <p>
              <b className="text-slate-900 dark:text-slate-50">What to cover:</b> {i.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}

function PlanPanel({ plan }) {
  const [done, setDone] = useState({});
  const total = plan.reduce((n, w) => n + w.tasks.length, 0);
  const count = Object.values(done).filter(Boolean).length;

  return (
    <div>
      <div
        role="progressbar"
        aria-label="Plan progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={count}
        className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
      >
        <div className="h-full bg-emerald-600 transition-all dark:bg-emerald-400" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
      </div>
      <div className="space-y-4">
        {plan.map((w, wi) => (
          <section key={`${w.range}-${w.title}`} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <header className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{w.title}</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">{w.range}</span>
            </header>
            {w.tasks.map((t, ti) => {
              const id = `task-${wi}-${ti}`;
              return (
                <div key={id} className="flex items-start gap-2.5 py-1.5">
                  <input
                    id={id}
                    type="checkbox"
                    checked={!!done[id]}
                    onChange={(e) => setDone((d) => ({ ...d, [id]: e.target.checked }))}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600"
                  />
                  <label htmlFor={id} className={done[id] ? "text-slate-400 line-through dark:text-slate-500" : "text-slate-800 dark:text-slate-200"}>
                    {t}
                  </label>
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}

function ResultPage() {
  const { report, getReportbyID } = useInterview();
  const { interviewid } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("gaps");
  const [checked, setChecked] = useState(false);

  // The report in context is the one for this URL (fresh analysis), so no fetch is needed.
  const ready = report && report._id === interviewid;

  // On refresh or when opening an old link, load the report from the database by its id.
  useEffect(() => {
    if (!ready) getReportbyID(interviewid).finally(() => setChecked(true));
  }, [interviewid]);

  if (!ready) {
    return checked ? (
      <Navigate to="/" replace />
    ) : (
      <main className="flex min-h-screen items-center justify-center">Loading...</main>
    );
  }

  const result = normalize(report);
  const onBack = () => navigate("/");
  const high = result.gaps.filter((g) => g.level === "high").length;

  const tabs = [
    { id: "gaps", name: "Skill gaps", count: result.gaps.length, body: <SkillsPanel gaps={result.gaps} matched={result.matched} /> },
    { id: "tech", name: "Technical questions", count: result.technical.length, body: <QuestionList items={result.technical} /> },
    { id: "beh", name: "Behavioural questions", count: result.behavioral.length, body: <QuestionList items={result.behavioral} /> },
    { id: "plan", name: "Preparation plan", body: <PlanPanel plan={result.plan} /> },
  ];

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === active);
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else return;
    setActive(tabs[n].id);
    document.getElementById(`tab-${tabs[n].id}`)?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-slate-50"
        >
          &larr; New analysis
        </button>

        <section className="grid items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-[240px_1fr] sm:gap-8 sm:p-8">
          <ScoreRing score={result.score} />
          <div>
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
              {result.role}
              {result.company ? ` at ${result.company}` : ""}
            </h1>
            {result.summary && <p className="mb-4 max-w-prose text-slate-600 dark:text-slate-400">{result.summary}</p>}
            <div className="flex flex-wrap gap-2.5 text-sm font-semibold">
              {result.matched.length > 0 && (
                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {result.matched.length} skills matched
                </span>
              )}
              <span className="rounded-full bg-red-100 px-3 py-1.5 text-red-800 dark:bg-red-950 dark:text-red-300">{high} major gaps</span>
              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {result.gaps.length - high} minor gaps
              </span>
            </div>
          </div>
        </section>

        <div role="tablist" aria-label="Analysis sections" onKeyDown={onKeyDown} className="mb-4 mt-7 flex gap-1 overflow-x-auto border-b border-slate-300 dark:border-slate-700">
          {tabs.map((t) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={`panel-${t.id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(t.id)}
                className={`-mb-px whitespace-nowrap border-b-[3px] px-3.5 py-3 text-[15px] font-semibold ${
                  on
                    ? "border-blue-600 text-slate-900 dark:border-blue-400 dark:text-slate-50"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {t.name}
                {t.count != null && <span className="ml-1.5 font-medium text-slate-500 dark:text-slate-400">{t.count}</span>}
              </button>
            );
          })}
        </div>

        {tabs.map((t) => (
          <div key={t.id} id={`panel-${t.id}`} role="tabpanel" aria-labelledby={`tab-${t.id}`} hidden={t.id !== active}>
            {t.body}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultPage;
