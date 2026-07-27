import Scorecard from './components/Scorecard'

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4">
          <img src="/assets/logo-light.png" alt="ZippyScale" width="150" height="28" className="h-7 w-auto" />
          <a href="#apply" className="rounded-xl bg-lime px-5 py-3 text-sm font-bold text-head">Get my score</a>
        </div>
      </header>

      <div className="bg-lime">
        <div className="mx-auto max-w-[1120px] px-6 py-2.5 text-center text-[0.95rem] text-head">
          Fit-outs, tenant improvements, clinics, restaurants, childcare, industrial and office{' '}
          <b>across North America</b>
        </div>
      </div>

      <section className="mx-auto max-w-[1120px] px-6 pt-14 pb-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-body">
          <i className="size-2 rounded-full bg-lime" /> For commercial GCs and design-build firms in North America
        </span>
        <h1 className="mt-6 max-w-[24ch] text-[clamp(2.05rem,4.1vw,3.35rem)] leading-[1.06]">
          Your job pipeline, live in 7 days.{' '}
          <em className="block not-italic text-lime-text">A qualified inquiry inside 14, or your money back.</em>
        </h1>
        <p className="mt-6 max-w-[24ch] font-display text-[clamp(1.15rem,1.9vw,1.42rem)] font-bold leading-tight text-head">
          A schedule full of the jobs you want, without dropping your price to win them.
        </p>
      </section>

      <section id="apply" className="scroll-mt-24 bg-white py-20">
        <div className="mx-auto max-w-[1120px] px-6">
          <span className="font-mono text-[0.66rem] font-bold uppercase tracking-widest text-lime-text">The scorecard</span>
          <h2 className="mt-3 mb-8 text-[clamp(1.8rem,3.4vw,2.6rem)]">Where are you losing jobs?</h2>
          <Scorecard />
        </div>
      </section>
    </>
  )
}
