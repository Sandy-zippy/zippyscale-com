import { useMemo, useRef, useState } from 'react'
import {
  QUESTIONS, GAPS, FORM_POST, CONTACT_FIELDS, RESULT_FIELDS, gradeFor,
  type Scored,
} from '../data/quiz'

type Phase = 'intro' | 'run' | 'gate' | 'result'

const isScored = (q: (typeof QUESTIONS)[number]) => q.score !== false

/** Max points per area, derived from the data so it cannot drift. */
const AREA_MAX = QUESTIONS.filter(isScored).reduce<Record<string, number>>((acc, q) => {
  const best = Math.max(...(q.o as Scored[]).map(([, p]) => p))
  acc[q.area] = (acc[q.area] ?? 0) + best
  return acc
}, {})

const CONTACT = [
  { key: 'company', label: 'Company', type: 'text', autoComplete: 'organization' },
  { key: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
  { key: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { key: 'region', label: 'Where do you build', type: 'text', autoComplete: 'address-level2' },
] as const

export default function Scorecard() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [areaScore, setAreaScore] = useState<Record<string, number>>({})
  const [contact, setContact] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const result = useMemo(() => {
    const areas = Object.keys(AREA_MAX)
    const got = areas.reduce((n, a) => n + (areaScore[a] ?? 0), 0)
    const max = areas.reduce((n, a) => n + AREA_MAX[a], 0)
    const pct = max ? Math.round((got / max) * 100) : 0
    const bars = areas.map((a) => ({ area: a, pct: Math.round(((areaScore[a] ?? 0) / AREA_MAX[a]) * 100) }))
    const worst = bars.reduce((w, b) => (b.pct < w.pct ? b : w), bars[0])
    return { pct, bars, worst: worst?.area ?? 'Is work coming in', ...gradeFor(pct) }
  }, [areaScore])

  function choose(optionIndex: number) {
    const q = QUESTIONS[step]
    const opt = q.o[optionIndex]
    const label = Array.isArray(opt) ? opt[0] : opt
    setAnswers((a) => ({ ...a, [q.field]: label }))
    if (isScored(q)) {
      const pts = (opt as Scored)[1]
      setAreaScore((s) => ({ ...s, [q.area]: (s[q.area] ?? 0) + pts }))
    }
    if (step + 1 < QUESTIONS.length) setStep(step + 1)
    else { setPhase('gate'); focusHeading() }
  }

  function back() {
    if (step === 0) { setPhase('intro'); return }
    // Re-answering recomputes from scratch, so drop this question's contribution.
    const q = QUESTIONS[step - 1]
    const prev = answers[q.field]
    if (prev && isScored(q)) {
      const opt = (q.o as Scored[]).find(([l]) => l === prev)
      if (opt) setAreaScore((s) => ({ ...s, [q.area]: (s[q.area] ?? 0) - opt[1] }))
    }
    setAnswers(({ [q.field]: _drop, ...rest }) => rest)
    setStep(step - 1)
  }

  function focusHeading() {
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  function submit() {
    const missing = CONTACT.filter((f) => {
      const v = (contact[f.key] ?? '').trim()
      if (!v) return true
      if (f.type === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      return false
    })
    if (missing.length) {
      setError('Fill these in and we will show the score.')
      document.getElementById(`g-${missing[0].key}`)?.focus()
      return
    }
    setError('')

    const payload: Record<string, string> = { ...answers }
    for (const f of CONTACT) payload[CONTACT_FIELDS[f.key]] = contact[f.key].trim()
    payload[RESULT_FIELDS.score] = String(result.pct)
    payload[RESULT_FIELDS.grade] = `${result.grade} (weakest: ${result.worst})`

    // Native POST into a hidden iframe: Google Forms has no CORS, so fetch fails.
    const form = formRef.current!
    form.innerHTML = ''
    for (const [name, value] of Object.entries(payload)) {
      const input = document.createElement('input')
      input.type = 'hidden'; input.name = name; input.value = value
      form.appendChild(input)
    }
    form.submit()

    window.fbq?.('track', 'Lead', { content_name: 'scorecard', value: result.pct })
    window.gtag?.('event', 'generate_lead', { method: 'scorecard', score: result.pct })
    setPhase('result')
    focusHeading()
  }

  return (
    <>
      <iframe name="zs-sink" title="form sink" className="hidden" aria-hidden="true" />
      <form ref={formRef} action={FORM_POST} method="POST" target="zs-sink" className="hidden" />

      {phase === 'intro' && (
        <div>
          <h3 className="text-xl mb-3">Where your jobs are going instead</h3>
          <p className="text-body max-w-[52ch] mb-7">
            Six things: can they find you, is work coming in, how fast you reply, who checks a job
            before your estimator does, who chases quotes, and what a job costs you to win.
          </p>
          <button type="button" onClick={() => { setPhase('run'); focusHeading() }}
            className="rounded-xl bg-lime px-7 py-4 font-bold text-head transition-colors hover:bg-[#c8e034]">
            Start the scorecard
          </button>
          <p className="mt-4 text-sm text-muted">No email until the last step. Ten questions, ninety seconds.</p>
        </div>
      )}

      {phase === 'run' && (
        <div>
          <div className="h-1 w-full overflow-hidden rounded bg-line" role="progressbar"
               aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length}>
            <i className="block h-full origin-left bg-lime-text transition-transform duration-500 ease-[var(--ease-out-expo)]"
               style={{ transform: `scaleX(${(step + 1) / QUESTIONS.length})` }} />
          </div>
          <p className="mt-4 font-mono text-xs tracking-widest text-muted">
            {step + 1} of {QUESTIONS.length}
          </p>
          <h3 ref={headingRef} tabIndex={-1} className="mt-3 mb-6 text-2xl outline-none">
            {QUESTIONS[step].t}
          </h3>
          <div className="grid gap-2.5">
            {QUESTIONS[step].o.map((opt, i) => (
              <button key={i} type="button" onClick={() => choose(i)}
                className="rounded-xl border border-line bg-white px-5 py-4 text-left text-body transition-colors hover:border-lime-text hover:bg-cream">
                {Array.isArray(opt) ? opt[0] : opt}
              </button>
            ))}
          </div>
          <button type="button" onClick={back}
            className="mt-6 font-mono text-xs tracking-widest text-muted underline underline-offset-4">
            Back
          </button>
        </div>
      )}

      {phase === 'gate' && (
        <div>
          <h3 ref={headingRef} tabIndex={-1} className="text-2xl outline-none">Your score is ready.</h3>
          <p className="mt-2 mb-6 text-body">Tell us where to send it and we will show it now.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTACT.map((f) => (
              <label key={f.key} className="grid gap-1.5">
                <span className="font-mono text-[0.66rem] tracking-widest uppercase text-muted">{f.label}</span>
                <input id={`g-${f.key}`} type={f.type} autoComplete={f.autoComplete} required
                  value={contact[f.key] ?? ''}
                  onChange={(e) => setContact((c) => ({ ...c, [f.key]: e.target.value }))}
                  className="rounded-lg border border-[#9AA0AE] bg-white px-4 py-3 text-body outline-none focus:border-lime-text" />
              </label>
            ))}
          </div>
          {error && <p role="alert" className="mt-4 text-sm font-medium text-[#B3261E]">{error}</p>}
          <button type="button" onClick={submit}
            className="mt-6 rounded-xl bg-lime px-7 py-4 font-bold text-head transition-colors hover:bg-[#c8e034]">
            Show my score
          </button>
        </div>
      )}

      {phase === 'result' && (
        <div aria-live="polite">
          <div className="flex flex-wrap items-baseline gap-4">
            <span className="font-mono text-5xl font-bold text-head">{result.pct}</span>
            <span className="font-mono text-muted">/100</span>
            <span className="font-display text-xl text-head">{result.grade}</span>
          </div>
          <h3 ref={headingRef} tabIndex={-1} className="sr-only outline-none">Your score</h3>
          <p className="mt-3 max-w-[56ch] text-body">{result.line}</p>

          <div className="mt-7 grid gap-2">
            {result.bars.map((b) => (
              <div key={b.area} className="grid items-center gap-x-4 gap-y-1 border-b border-line py-3 sm:grid-cols-[210px_1fr_48px]">
                <b className="text-[0.95rem] font-medium text-head">{b.area}</b>
                <div className="h-1.5 overflow-hidden rounded bg-line">
                  <i className="block h-full origin-left transition-transform duration-700 ease-[var(--ease-out-expo)]"
                     style={{
                       transform: `scaleX(${b.pct / 100})`,
                       background: b.pct < 40 ? '#B3261E' : b.pct < 70 ? '#B8891E' : 'var(--color-lime-text)',
                     }} />
                </div>
                <span className="text-right font-mono text-sm font-bold text-head">{b.pct}%</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-charcoal p-7">
            <span className="font-mono text-[0.62rem] tracking-widest text-lime">YOUR BIGGEST GAP</span>
            <h3 className="mt-2 text-xl text-cream">{GAPS[result.worst]?.[0]}</h3>
            <p className="mt-2 max-w-[60ch] text-body-dark">{GAPS[result.worst]?.[1]}</p>
            <a href="#book" className="mt-6 inline-block rounded-xl bg-lime px-7 py-4 font-bold text-head">
              See how we would fix it
            </a>
          </div>
        </div>
      )}
    </>
  )
}
