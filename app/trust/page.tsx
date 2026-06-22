import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Families and Surrogates Still Choose CSO',
  description:
    'Doing your homework before choosing a surrogacy agency is smart. Here is what Canadian Surrogacy Options wants you to know about our history, our values, and how we support families and surrogates today.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/trust' },
  openGraph: {
    title: 'Why Families and Surrogates Still Choose CSO | Canadian Surrogacy Options',
    description:
      'A direct, transparent look at what CSO stands for, what support looks like today, and where to go next if you are exploring surrogacy.',
    url: 'https://canadiansurrogacyoptions.com/trust',
    siteName: 'Canadian Surrogacy Options',
    type: 'website',
  },
};

const proofPills = [
  'Founded in 1992',
  '2,500+ families built',
  'Direct contact with Robyn',
  'Published refund policy for intended parents',
];

const supportItems = [
  'Clear communication about process and timing',
  'Careful family matching, not pressure',
  'Guidance through screening, legal, and medical steps',
  'Direct answers when something is unclear',
  'Resources to help you decide before you commit',
];

const changedItems = [
  'More direct public-facing communication from Robyn and the team',
  'Clear next-step tools like /qualify, /cost-calculator, and the gallery',
  'A trust-first approach that invites questions instead of dodging them',
];

const trustSteps = [
  {
    title: 'Start with clarity',
    body: 'Use our qualification page or cost calculator first if you want information before conversation.',
  },
  {
    title: 'Ask direct questions',
    body: 'If something you found online worries you, bring it to us. We would rather answer it than dance around it.',
  },
  {
    title: 'Move at your pace',
    body: 'Some people are ready to apply today. Some need one honest call first. Both are welcome here.',
  },
];

export default function TrustPage() {
  return (
    <>
      <style>{`
        .trust-page {
          color: var(--text);
          background:
            radial-gradient(circle at top right, rgba(45, 140, 138, 0.14), transparent 28%),
            linear-gradient(180deg, #fffcfa 0%, var(--cream) 100%);
        }
        .trust-wrap {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .trust-hero {
          padding: 72px 0 42px;
        }
        .trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(45, 140, 138, 0.12);
          color: #1f6e6c;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .trust-badge::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #2d8c8a;
        }
        .trust-hero h1 {
          margin-top: 18px;
          max-width: 11ch;
          font-size: clamp(3rem, 7vw, 5.2rem);
          line-height: 1.03;
          color: var(--deep-purple);
          letter-spacing: -0.03em;
        }
        .trust-lead {
          margin-top: 22px;
          max-width: 760px;
          font-size: 1.15rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }
        .trust-proofRow {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }
        .trust-pill {
          display: inline-flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(45, 140, 138, 0.16);
          color: var(--deep-purple);
          font-size: 0.86rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          box-shadow: 0 10px 26px rgba(61, 26, 110, 0.05);
        }
        .trust-ctaRow {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 30px;
        }
        .trust-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 15px 24px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.98rem;
          font-weight: 600;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
          text-decoration: none !important;
        }
        .trust-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 26px rgba(31, 36, 48, 0.12);
        }
        .trust-btnPrimary {
          background: #2d8c8a;
          color: white !important;
        }
        .trust-btnPrimary:hover {
          background: #1f6e6c;
        }
        .trust-btnSecondary {
          background: white;
          color: var(--deep-purple) !important;
          border: 1px solid rgba(61, 26, 110, 0.14);
        }
        .trust-section {
          padding: 24px 0 64px;
        }
        .trust-grid3,
        .trust-grid2 {
          display: grid;
          gap: 22px;
        }
        .trust-grid3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .trust-grid2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .trust-card {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(232, 224, 245, 0.92);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 16px 40px rgba(61, 26, 110, 0.06);
        }
        .trust-card h2,
        .trust-card h3 {
          color: var(--deep-purple);
          margin-bottom: 12px;
        }
        .trust-card h3 {
          font-size: 1.95rem;
          line-height: 1.08;
        }
        .trust-card p,
        .trust-card li {
          color: var(--text-secondary);
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1rem;
          line-height: 1.8;
        }
        .trust-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .trust-card li {
          position: relative;
          padding-left: 22px;
          margin-top: 12px;
        }
        .trust-card li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 11px;
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: #2d8c8a;
        }
        .trust-quote {
          background: linear-gradient(135deg, #3d1a6e 0%, #6b3fa0 100%);
          color: white;
          border: none;
        }
        .trust-quoteLabel {
          display: inline-block;
          margin-bottom: 14px;
          color: #bfe8e6;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .trust-quote p {
          color: rgba(255,255,255,0.92);
          font-size: 1.08rem;
        }
        .trust-linkCard {
          display: block;
          text-decoration: none;
          border-radius: 24px;
          padding: 28px;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .trust-linkCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 38px rgba(61, 26, 110, 0.08);
        }
        .trust-linkCardTeal {
          background: linear-gradient(135deg, rgba(45, 140, 138, 0.12), rgba(45, 140, 138, 0.22));
        }
        .trust-linkCardRose {
          background: linear-gradient(135deg, rgba(232, 224, 245, 0.75), rgba(255, 255, 255, 0.95));
        }
        .trust-linkCard h3 {
          margin-bottom: 10px;
          font-size: 2rem;
        }
        .trust-linkCard p {
          font-family: var(--font-dm-sans), sans-serif;
          color: var(--text-secondary);
          line-height: 1.8;
        }
        .trust-sectionHeading {
          margin-bottom: 18px;
        }
        .trust-sectionLabel {
          display: block;
          margin-bottom: 10px;
          color: #2d8c8a;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .trust-sectionHeading h2 {
          font-size: clamp(2.15rem, 4vw, 3.2rem);
          color: var(--deep-purple);
        }
        .trust-stepGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          margin-top: 18px;
        }
        .trust-miniGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }
        .trust-miniCard {
          padding: 22px 20px;
          border-radius: 20px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(232, 224, 245, 0.92);
        }
        .trust-miniCard h3 {
          margin-bottom: 8px;
          font-size: 1.3rem;
          color: var(--deep-purple);
        }
        .trust-miniCard p {
          font-family: var(--font-dm-sans), sans-serif;
          color: var(--text-secondary);
          line-height: 1.75;
        }
        .trust-stepCard {
          padding: 26px 24px;
          border-radius: 22px;
          background: white;
          border: 1px solid rgba(232, 224, 245, 0.92);
          box-shadow: 0 12px 30px rgba(61, 26, 110, 0.05);
        }
        .trust-stepNum {
          font-family: var(--font-dm-sans), sans-serif;
          color: #2d8c8a;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .trust-stepCard h3 {
          margin-top: 12px;
          margin-bottom: 10px;
          font-size: 1.55rem;
          color: var(--deep-purple);
        }
        .trust-stepCard p {
          font-family: var(--font-dm-sans), sans-serif;
          color: var(--text-secondary);
          line-height: 1.8;
        }
        .trust-final {
          text-align: center;
          padding-bottom: 80px;
        }
        .trust-finalBox {
          background: white;
          border-radius: 28px;
          border: 1px solid rgba(232, 224, 245, 0.92);
          box-shadow: 0 16px 42px rgba(61, 26, 110, 0.06);
          padding: 36px 28px;
        }
        .trust-finalBox h2 {
          font-size: clamp(2.3rem, 4vw, 3.35rem);
          color: var(--deep-purple);
        }
        .trust-finalBox p {
          max-width: 720px;
          margin: 14px auto 0;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--text-secondary);
        }
        @media (max-width: 900px) {
          .trust-grid3,
          .trust-grid2,
          .trust-stepGrid,
          .trust-miniGrid {
            grid-template-columns: 1fr;
          }
          .trust-hero {
            padding-top: 50px;
          }
        }
      `}</style>

      <div className="trust-page">
        <section className="trust-hero">
          <div className="trust-wrap">
            <div className="trust-badge">A Real Conversation. No Scripts.</div>
            <h1>Why families and surrogates still choose CSO.</h1>
            <p className="trust-lead">
              If you are here because you are doing your homework, we respect that. You should ask hard
              questions before choosing a surrogacy agency. Here is what we want you to know about who
              we are, what we have learned, and how we support people now.
            </p>

            <div className="trust-proofRow">
              {proofPills.map((pill) => (
                <div key={pill} className="trust-pill">
                  {pill}
                </div>
              ))}
            </div>

            <div className="trust-ctaRow">
              <a className="trust-btn trust-btnPrimary" href="https://portal.canadiansurrogacyoptions.com/register">
                Start Your Application
              </a>
              <a className="trust-btn trust-btnSecondary" href="https://calendly.com/cso-robyn">
                Ask Robyn First
              </a>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="trust-wrap trust-grid3">
            <article className="trust-card">
              <h3>We have history.</h3>
              <p>
                Canadian Surrogacy Options has been in this field since 1992. That does not make us
                perfect. It does mean we have lived through the changes in law, medicine, matching, and
                family-building that shaped surrogacy in Canada.
              </p>
            </article>

            <article className="trust-card">
              <h3>We answer directly.</h3>
              <p>
                There is no call centre voice here. If you reach out, you can speak with Robyn or a team
                member who knows the work, knows the process, and will not talk to you like a script.
              </p>
            </article>

            <article className="trust-card">
              <h3>We believe trust must be earned.</h3>
              <p>
                People Google. People ask questions. They should. We would rather answer openly than
                pretend those questions do not exist.
              </p>
            </article>
          </div>
        </section>

        <section className="trust-section">
          <div className="trust-wrap trust-grid2">
            <article className="trust-card trust-quote">
              <span className="trust-quoteLabel">From Robyn</span>
              <p>
                The last two years were hard, and I have spoken publicly about that. What matters to me
                now is how we show up today: with honesty, with care, and with the kind of support I
                would want for my own family.
              </p>
              <p>
                If you are unsure, ask me directly. I would rather give you the truthful answer than the
                polished one.
              </p>
            </article>

            <article className="trust-card">
              <h3>What support looks like now</h3>
              <ul>
                {supportItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="trust-section">
          <div className="trust-wrap">
            <div className="trust-sectionHeading">
              <span className="trust-sectionLabel">What We Want You To Know</span>
              <h2>We know trust has to feel current, not historical.</h2>
            </div>

            <div className="trust-miniGrid">
              {changedItems.map((item, index) => (
                <article key={item} className="trust-miniCard">
                  <h3>{`0${index + 1}`}</h3>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="trust-wrap">
            <div className="trust-sectionHeading">
              <span className="trust-sectionLabel">Start Here</span>
              <h2>Clarity builds trust fast.</h2>
            </div>

            <div className="trust-grid2">
              <a className="trust-linkCard trust-linkCardTeal" href="/cost-calculator">
                <h3>Expense Calculator</h3>
                <p>
                  See how eligible surrogacy-related expenses are handled so you can understand the
                  process clearly before you apply.
                </p>
              </a>

              <a className="trust-linkCard trust-linkCardRose" href="/qualify">
                <h3>Do I Qualify?</h3>
                <p>
                  Start with the basics. This quick guide helps you understand whether becoming a
                  surrogate may be a fit for you right now.
                </p>
              </a>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="trust-wrap">
            <div className="trust-sectionHeading">
              <span className="trust-sectionLabel">How To Use This Page</span>
              <h2>Trust is built one step at a time.</h2>
            </div>

            <div className="trust-stepGrid">
              {trustSteps.map((step, index) => (
                <article key={step.title} className="trust-stepCard">
                  <div className="trust-stepNum">Step {String(index + 1).padStart(2, '0')}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="trust-final">
          <div className="trust-wrap">
            <div className="trust-finalBox">
              <h2>We will meet you where you are.</h2>
              <p>
                If becoming a surrogate has been on your heart, you do not need to make every decision
                today. You can start with a question, a call, a look through our gallery, or a simple
                application. We will meet you there.
              </p>

              <div className="trust-ctaRow" style={{ justifyContent: 'center' }}>
                <a className="trust-btn trust-btnPrimary" href="https://portal.canadiansurrogacyoptions.com/register">
                  Begin Your Application
                </a>
                <a className="trust-btn trust-btnSecondary" href="/gallery">
                  Visit the Gallery
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
