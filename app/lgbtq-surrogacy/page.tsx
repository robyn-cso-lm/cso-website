import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LGBTQ+ Surrogacy in Canada | Canadian Surrogacy Options',
  description: 'Canada is one of the best countries in the world for LGBTQ+ families to build through surrogacy. Clear legal protections, altruistic surrogacy, and a welcoming community.',
};

export default function LGBTQSurrogacyPage() {
  return (
    <>
      <style>{`
        .lgbtq-body { font-family: 'Jost', sans-serif; color: #2d2d2d; background: #fff; line-height: 1.7; font-weight: 300; }
        .lgbtq-body a { color: #6B3FA0; text-decoration: none; }
        .lgbtq-body a:hover { text-decoration: underline; }
        .lgbtq-hero { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; padding: 80px 24px 64px; }
        .lgbtq-hero-inner { max-width: 820px; margin: 0 auto; }
        .lgbtq-hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 5vw, 3.6rem); font-weight: 500; line-height: 1.2; margin-bottom: 20px; }
        .lgbtq-hero p { font-size: 1.15rem; max-width: 680px; opacity: 0.92; margin-bottom: 32px; }
        .trust-bar { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 28px; font-size: 0.85rem; opacity: 0.85; letter-spacing: 0.05em; }
        .trust-bar span::before { content: "· "; }
        .btn { display: inline-block; background: #3D1A6E; color: #fff !important; padding: 16px 36px; border-radius: 50px; font-size: 1.05rem; font-weight: 600; letter-spacing: 0.03em; transition: background 0.2s; text-decoration: none !important; }
        .btn:hover { background: #6B3FA0; }
        .btn-white { background: #fff; color: #3D1A6E !important; }
        .btn-white:hover { background: #E8E0F5; }
        .btn-outline { display: inline-block; background: transparent; color: #3D1A6E !important; border: 2px solid #3D1A6E; padding: 14px 32px; border-radius: 50px; font-size: 1rem; font-weight: 600; transition: all 0.2s; text-decoration: none !important; }
        .btn-outline:hover { background: #3D1A6E; color: #fff !important; }
        .cta-center { text-align: center; margin: 36px 0; }
        .section { max-width: 860px; margin: 0 auto; padding: 60px 24px; }
        .section-dark { background: #3D1A6E; color: #fff; }
        .section-dark .section { color: #fff; }
        .section-lavender { background: #E8E0F5; }
        .section-label { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 10px; display: block; }
        .section-dark .section-label { color: #C4ADEA; }
        h2.lgbtq-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.9rem, 3.8vw, 2.7rem); font-weight: 500; color: #3D1A6E; margin-bottom: 8px; line-height: 1.2; }
        .section-dark h2.lgbtq-h2 { color: #E8E0F5; }
        .divider { width: 60px; height: 4px; background: #9B7FC7; margin: 16px auto 32px; border-radius: 2px; }
        .divider-left { margin-left: 0; }
        .reasons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 32px; }
        .reason-card { background: #fff; border-radius: 12px; padding: 28px 24px; box-shadow: 0 2px 12px rgba(61,26,110,0.07); border-left: 4px solid #9B7FC7; }
        .reason-card h3 { font-size: 1rem; color: #3D1A6E; font-weight: 600; margin-bottom: 8px; }
        .reason-card p { font-size: 0.9rem; color: #555; }
        .community-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 32px; }
        .community-card { background: rgba(255,255,255,0.08); border-radius: 12px; padding: 28px 24px; border: 1px solid rgba(255,255,255,0.15); text-align: center; }
        .community-card .icon { font-size: 2rem; margin-bottom: 12px; }
        .community-card h3 { font-size: 1rem; color: #E8E0F5; font-weight: 600; margin-bottom: 8px; }
        .community-card p { font-size: 0.88rem; color: rgba(255,255,255,0.75); }
        .process-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 32px; }
        .process-step { text-align: center; padding: 24px 16px; }
        .process-num { font-size: 2.5rem; font-weight: 700; color: #9B7FC7; line-height: 1; margin-bottom: 12px; }
        .process-step h3 { font-size: 1rem; color: #3D1A6E; font-weight: 600; margin-bottom: 8px; }
        .process-step p { font-size: 0.88rem; color: #555; }
        .legal-list { list-style: none; margin-top: 28px; padding: 0; }
        .legal-list li { padding: 14px 0; border-bottom: 1px solid #E8E0F5; display: flex; gap: 14px; align-items: flex-start; }
        .legal-list li .check { color: #6B3FA0; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
        .legal-list li .text strong { display: block; color: #3D1A6E; margin-bottom: 3px; font-size: 0.95rem; }
        .legal-list li .text span { font-size: 0.9rem; color: #555; }
        .testimonial-block { background: linear-gradient(145deg, #f3eeff 0%, #e8e0f5 100%); border-radius: 16px; padding: 48px 40px; border-left: 5px solid #6B3FA0; max-width: 700px; margin: 40px auto 0; }
        .testimonial-block p { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-style: italic; color: #3D1A6E; line-height: 1.8; margin-bottom: 20px; }
        .testimonial-block cite { font-size: 0.8rem; color: #9B7FC7; font-style: normal; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .final-cta { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 72px 24px; }
        .final-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 500; margin-bottom: 16px; }
        .final-cta p { font-size: 1.1rem; opacity: 0.9; max-width: 560px; margin: 0 auto 32px; }
        @media (max-width: 600px) { .lgbtq-hero { padding: 56px 20px 48px; } }
      `}</style>

      <div className="lgbtq-body">

        {/* HERO */}
        <section className="lgbtq-hero">
          <div className="lgbtq-hero-inner">
            <h1>Canada Is One of the Best Places in the World for LGBTQ+ Families to Build Through Surrogacy.</h1>
            <p>Altruistic surrogacy. Inclusive family law. Clear legal protections for all parents. Canada doesn&apos;t just tolerate LGBTQ+ families. It protects them.</p>
            <a href="/contact" className="btn btn-white">Book a Free Consultation</a>
            <div className="trust-bar">
              <span>More Than Half Our Families Are LGBTQ+</span>
              <span>Pre-Birth Orders Available</span>
              <span>Both Parents on Birth Certificate</span>
            </div>
          </div>
        </section>

        {/* WHY CANADA */}
        <div className="section">
          <span className="section-label">Why Canada</span>
          <h2 className="lgbtq-h2">A Country Built for This</h2>
          <div className="divider divider-left" />
          <p style={{ maxWidth: 660, marginBottom: 8 }}>Canada isn&apos;t just a safe choice for LGBTQ+ surrogacy. It&apos;s genuinely one of the best in the world. Here&apos;s why.</p>
          <div className="reasons-grid">
            {[
              { title: 'Altruistic Surrogacy', text: 'Canada\'s model is altruistic: surrogates are not paid a fee, only reimbursed for expenses. This means surrogates are motivated by genuine desire to help, not financial vulnerability. No exploitation concerns.' },
              { title: 'Inclusive Family Law', text: 'Canadian law recognises all family structures. Same-sex couples, single parents, non-binary parents: all are protected under provincial family law when it comes to parentage.' },
              { title: 'Pre-Birth Parentage Orders', text: 'In most provinces, intended parents can obtain a court order before birth, ensuring both parents are on the birth certificate from day one, regardless of genetic connection.' },
              { title: 'The Assisted Human Reproduction Act', text: 'Federal legislation governs surrogacy in Canada, creating a clear and consistent framework that doesn\'t shift with elections or politics the way it does in other countries.' },
            ].map(r => (
              <div key={r.title} className="reason-card">
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CSO LGBTQ+ COMMUNITY */}
        <div className="section-dark">
          <div className="section">
            <span className="section-label">Our Community</span>
            <h2 className="lgbtq-h2">More Than Half Our Families Are LGBTQ+</h2>
            <div className="divider" />
            <p style={{ maxWidth: 660, marginBottom: 8, opacity: 0.9 }}>This isn&apos;t a niche we added on. LGBTQ+ families are at the heart of what CSO does. We see every configuration of family, and every one is treated with the same care, the same expertise, and the same commitment.</p>
            <div className="community-grid">
              {[
                { icon: '👨‍👨‍👦', title: 'Gay Male Couples', text: 'Egg donor + surrogate coordination. We manage both sides of the process.' },
                { icon: '👩‍👩‍👧', title: 'Lesbian Couples', text: 'Whether using one partner\'s eggs or a donor, we navigate the medical and legal steps with you.' },
                { icon: '⚧', title: 'Non-Binary & Trans Parents', text: 'We meet you where you are. No assumptions, no extra hoops.' },
                { icon: '👤', title: 'Single Gay Men', text: 'Among the most common journeys we facilitate. You don\'t need a partner to become a parent.' },
              ].map(c => (
                <div key={c.title} className="community-card">
                  <div className="icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROCESS FOR SAME-SEX MALE COUPLES */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">For Same-Sex Male Couples</span>
            <h2 className="lgbtq-h2">Two Steps, One Journey</h2>
            <div className="divider divider-left" />
            <p style={{ maxWidth: 660, marginBottom: 8 }}>Same-sex male couples need both an egg donor and a surrogate. CSO coordinates both, so instead of navigating two separate processes with two agencies, you have one team managing everything.</p>
            <div className="process-steps">
              {[
                { num: '01', title: 'Egg Donor Selection', text: 'We connect you with reputable egg donor agencies or CSO\'s own donor network. You choose a donor whose profile resonates with you.' },
                { num: '02', title: 'Embryo Creation', text: 'Working with your fertility clinic, embryos are created using donor eggs and one or both partners\' sperm.' },
                { num: '03', title: 'Surrogate Matching', text: 'While embryos are being created or frozen, we begin matching you with a surrogate. Timing is coordinated so nothing is rushed.' },
                { num: '04', title: 'Transfer & Pregnancy', text: 'Embryo transfer, confirmed pregnancy, and full case management through to birth.' },
              ].map(s => (
                <div key={s.num} className="process-step">
                  <div className="process-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="/programs" className="btn">See Our Programs</a>
            </div>
          </div>
        </div>

        {/* LEGAL PROTECTIONS */}
        <div className="section">
          <span className="section-label">Legal Clarity</span>
          <h2 className="lgbtq-h2">Your Rights, Simply Explained</h2>
          <div className="divider divider-left" />
          <p style={{ maxWidth: 640, marginBottom: 8 }}>Legal complexity shouldn&apos;t be a barrier to building your family. Here&apos;s what the law in Canada actually means for LGBTQ+ intended parents.</p>
          <ul className="legal-list">
            {[
              { title: 'Pre-Birth Order', desc: 'A court order obtained before your baby is born that legally names both intended parents. Available in most provinces. Means you are the legal parents from day one.' },
              { title: 'Both Parents on the Birth Certificate', desc: 'In all provinces, same-sex couples can both appear as parents on the birth certificate. No adoption required.' },
              { title: 'No Parental Rights for the Surrogate', desc: 'The surrogate has no parental claim. This is established in the surrogacy agreement and reinforced by the parentage order.' },
              { title: 'International Recognition', desc: 'A Canadian parentage order is a legally recognised document. Most countries with functioning family law systems will recognise Canadian birth certificates. For international families, we work with your country\'s consulate.' },
            ].map(l => (
              <li key={l.title}>
                <span className="check">✓</span>
                <div className="text">
                  <strong>{l.title}</strong>
                  <span>{l.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* TESTIMONIAL */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">From One of Our Families</span>
            <div className="testimonial-block">
              <p>&ldquo;When we started this process we were terrified about discrimination. We had stories from friends in other countries: long delays, judgmental clinics, agencies that quietly deprioritised gay couples. We never felt it at CSO. Not once. Every person we worked with treated our family like any other family. We have a son now. And we&apos;re already thinking about going back.&rdquo;</p>
              <cite>Anonymous Same-Sex Couple, Toronto, Ontario</cite>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <section className="final-cta">
          <h2>Your Family Deserves the Same Start as Everyone Else&apos;s</h2>
          <p>Book a free consultation. No pressure, no judgment, no assumptions. Just a real conversation about what&apos;s possible for your family.</p>
          <a href="/contact" className="btn btn-white">Book a Free Consultation</a>
        </section>

      </div>
    </>
  );
}
