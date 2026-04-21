import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intended Parents | Canadian Surrogacy Options',
  description: 'CSO has helped build families since 1992. If you\'re ready to become a parent through surrogacy, we\'re here to guide you every step of the way.',
};

export default function IntendedParentsPage() {
  return (
    <>
      <style>{`
        .ip-body { font-family: 'Jost', sans-serif; color: #2d2d2d; background: #fff; line-height: 1.7; font-weight: 300; }
        .ip-body a { color: #6B3FA0; text-decoration: none; }
        .ip-body a:hover { text-decoration: underline; }
        .ip-hero { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 80px 24px 64px; }
        .ip-hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.6rem, 6vw, 4.2rem); font-weight: 500; line-height: 1.15; margin-bottom: 20px; }
        .ip-hero p { font-size: 1.2rem; max-width: 640px; margin: 0 auto 36px; opacity: 0.92; }
        .trust-bar { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 28px; margin-top: 32px; font-size: 0.85rem; opacity: 0.85; letter-spacing: 0.05em; }
        .trust-bar span::before { content: "· "; }
        .btn { display: inline-block; background: #3D1A6E; color: #fff !important; padding: 16px 36px; border-radius: 50px; font-size: 1.05rem; font-weight: 600; letter-spacing: 0.03em; transition: background 0.2s; text-decoration: none !important; }
        .btn:hover { background: #6B3FA0; }
        .btn-outline { display: inline-block; background: transparent; color: #3D1A6E !important; border: 2px solid #3D1A6E; padding: 14px 32px; border-radius: 50px; font-size: 1.05rem; font-weight: 600; letter-spacing: 0.03em; transition: all 0.2s; text-decoration: none !important; }
        .btn-outline:hover { background: #3D1A6E; color: #fff !important; }
        .btn-white { background: #fff; color: #3D1A6E !important; }
        .btn-white:hover { background: #E8E0F5; }
        .cta-center { text-align: center; margin: 36px 0; }
        .section { max-width: 860px; margin: 0 auto; padding: 60px 24px; }
        .section-dark { background: #3D1A6E; color: #fff; }
        .section-dark .section { color: #fff; }
        .section-lavender { background: #E8E0F5; }
        h2.ip-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 500; color: #3D1A6E; margin-bottom: 8px; line-height: 1.2; }
        .section-dark h2.ip-h2 { color: #E8E0F5; }
        .section-label { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 10px; display: block; }
        .section-dark .section-label { color: #C4ADEA; }
        .divider { width: 60px; height: 4px; background: #9B7FC7; margin: 16px auto 32px; border-radius: 2px; }
        .divider-left { margin-left: 0; }
        .urgency { background: #3D1A6E; color: #fff; padding: 32px; max-width: 820px; margin: 48px auto; border-radius: 12px; text-align: center; }
        .urgency p { font-size: 1.3rem; font-weight: 600; line-height: 1.5; margin-bottom: 20px; }
        .urgency small { font-size: 0.9rem; opacity: 0.8; display: block; }
        .who-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 32px; }
        .who-card { background: #fff; border-radius: 12px; padding: 28px 24px; box-shadow: 0 2px 12px rgba(61,26,110,0.08); border-top: 4px solid #9B7FC7; text-align: center; }
        .who-card .who-icon { font-size: 2.2rem; margin-bottom: 12px; }
        .who-card h3 { font-size: 1rem; color: #3D1A6E; font-weight: 600; margin-bottom: 8px; }
        .who-card p { font-size: 0.9rem; color: #555; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-top: 36px; }
        .step { text-align: center; padding: 28px 16px; position: relative; }
        .step-num { font-size: 2.8rem; font-weight: 700; color: #E8E0F5; line-height: 1; margin-bottom: 10px; }
        .step h3 { font-size: 1rem; color: #3D1A6E; margin-bottom: 8px; font-weight: 600; }
        .step p { font-size: 0.9rem; color: #555; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 28px; }
        .two-col-item h3 { font-size: 1.05rem; color: #3D1A6E; font-weight: 600; margin-bottom: 12px; }
        .two-col-item ul { list-style: none; padding: 0; margin: 0; }
        .two-col-item ul li { padding: 8px 0; border-bottom: 1px solid #E8E0F5; font-size: 0.95rem; display: flex; gap: 10px; align-items: flex-start; }
        .two-col-item ul li::before { content: "✓"; color: #6B3FA0; font-weight: 700; flex-shrink: 0; }
        .packages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-top: 36px; }
        .package-card { background: #fff; border-radius: 16px; padding: 36px 28px; box-shadow: 0 4px 20px rgba(61,26,110,0.1); border: 2px solid #E8E0F5; transition: border-color 0.2s; }
        .package-card:hover { border-color: #9B7FC7; }
        .package-card.featured { border-color: #3D1A6E; position: relative; }
        .package-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #3D1A6E; color: #fff; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 16px; border-radius: 20px; white-space: nowrap; }
        .package-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: #3D1A6E; margin-bottom: 12px; }
        .package-card .tagline { font-size: 0.9rem; color: #777; margin-bottom: 20px; }
        .package-card ul { list-style: none; padding: 0; margin: 0 0 24px; }
        .package-card ul li { font-size: 0.9rem; padding: 7px 0; border-bottom: 1px solid #f0ebfa; display: flex; gap: 8px; align-items: flex-start; }
        .package-card ul li::before { content: "✓"; color: #6B3FA0; font-weight: 700; flex-shrink: 0; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px; margin-top: 32px; }
        .testimonial-card { background: linear-gradient(145deg, #f3eeff 0%, #e8e0f5 100%); border-radius: 16px; padding: 36px 32px; border-left: 4px solid #9B7FC7; box-shadow: 0 4px 20px rgba(61,26,110,0.07); }
        .testimonial-card p { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 400; color: #3D1A6E; line-height: 1.8; margin-bottom: 18px; font-style: italic; }
        .testimonial-card cite { font-size: 0.78rem; color: #9B7FC7; font-style: normal; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .faq-list { margin-top: 32px; }
        .faq-item { border-bottom: 1px solid #E8E0F5; padding: 20px 0; }
        .faq-item h3 { font-size: 1.05rem; color: #3D1A6E; font-weight: 600; margin-bottom: 10px; }
        .faq-item p { font-size: 0.95rem; color: #444; line-height: 1.7; }
        .final-cta { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 72px 24px; }
        .final-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 500; margin-bottom: 16px; }
        .final-cta p { font-size: 1.1rem; opacity: 0.9; max-width: 560px; margin: 0 auto 32px; }
        @media (max-width: 640px) { .two-col { grid-template-columns: 1fr; } .ip-hero { padding: 56px 20px 44px; } }
      `}</style>

      <div className="ip-body">

        {/* HERO */}
        <section className="ip-hero">
          <h1>Your Family Is Worth Fighting For</h1>
          <p>Whatever brought you here, I want you to know: you are not out of options. CSO has been helping families grow through surrogacy since 1992, and we&apos;re still here — for you.</p>
          <a href="/contact" className="btn btn-white">Start Your Journey</a>
          <div className="trust-bar">
            <span>In Practice Since 1992</span>
            <span>2,500+ Families Built</span>
            <span>Active Surrogates Now</span>
            <span>Full Legal & Medical Support</span>
          </div>
        </section>

        {/* URGENCY */}
        <div style={{ padding: '0 24px' }}>
          <div className="urgency">
            <p>Families are building right now. Yours can too.</p>
            <small>A free consultation takes 30 minutes. It could change everything.</small>
            <div style={{ marginTop: 24 }}>
              <a href="/contact" className="btn btn-white">Book a Free Consultation</a>
            </div>
          </div>
        </div>

        {/* WHO COMES TO CSO */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">You Belong Here</span>
            <h2 className="ip-h2">We&apos;ve Walked This Road With All Kinds of Families</h2>
            <div className="divider divider-left" />
            <p style={{ maxWidth: 640, marginBottom: 8 }}>There&apos;s no single story that leads to surrogacy. Here are some of the people we serve every day.</p>
            <div className="who-grid">
              {[
                { icon: '👨‍👩‍👧', title: 'Couples with Infertility', text: 'Years of IVF. Failed cycles. Loss. You deserve a path that actually works.' },
                { icon: '🏳️‍🌈', title: 'Same-Sex Couples', text: 'Gay men, lesbian couples, and queer families — you are a huge part of our CSO community.' },
                { icon: '👤', title: 'Single Parents', text: 'Single men and women choosing parenthood on their own terms. We see you and we support you.' },
                { icon: '🌍', title: 'International Families', text: 'Canada is one of the safest and most welcoming countries in the world for international surrogacy.' },
              ].map(w => (
                <div key={w.title} className="who-card">
                  <div className="who-icon">{w.icon}</div>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JOURNEY OVERVIEW */}
        <div className="section">
          <span className="section-label">The Road Ahead</span>
          <h2 className="ip-h2">Your Journey, Step by Step</h2>
          <div className="divider" />
          <p style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 8px' }}>Every journey is unique, but here&apos;s how most of our families move through the process.</p>
          <div className="steps">
            {[
              { num: '01', title: 'Free Consultation', text: 'We sit down together — by phone, video, or in person — and I learn about you, your history, and what you need.' },
              { num: '02', title: 'Matching', text: 'We introduce you to surrogate candidates who are a genuine fit. You\'ll have a say in every match. This isn\'t a database — it\'s a relationship.' },
              { num: '03', title: 'Legal & Medical', text: 'Your surrogate\'s legal counsel is arranged. Medical screening, contract signing, and coordination with your fertility clinic all happen here.' },
              { num: '04', title: 'Pregnancy', text: 'Transfer, confirmation, prenatal care — your case manager keeps you informed and supported at every milestone.' },
              { num: '05', title: 'Birth & Home', text: 'Your baby is born. We help with the birth certificate, parentage order, and anything you need to bring your family home.' },
            ].map(s => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT CSO HANDLES */}
        <div className="section-dark">
          <div className="section">
            <span className="section-label">The Division of Labour</span>
            <h2 className="ip-h2">What We Handle. What You Do.</h2>
            <div className="divider" />
            <div className="two-col">
              <div className="two-col-item">
                <h3 style={{ color: '#E8E0F5' }}>CSO Handles</h3>
                <ul style={{ color: '#ddd' }}>
                  {[
                    'Surrogate recruitment & screening',
                    'Background checks & references',
                    'Matching & introductions',
                    'Legal coordination (your surrogate\'s counsel)',
                    'Monthly expense reimbursements',
                    'Ongoing case management',
                    'Conflict resolution if needed',
                    'Birth certificate & parentage support',
                  ].map(i => (
                    <li key={i} style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#C4ADEA', fontWeight: 700 }}>✓</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="two-col-item">
                <h3 style={{ color: '#E8E0F5' }}>You Do</h3>
                <ul style={{ color: '#ddd' }}>
                  {[
                    'Work with your fertility clinic on embryos',
                    'Hire your own family lawyer',
                    'Attend key medical appointments',
                    'Build a relationship with your surrogate',
                    'Be present for the birth',
                    'Take your baby home',
                  ].map(i => (
                    <li key={i} style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                      <span style={{ color: '#C4ADEA', fontWeight: 700 }}>✓</span> {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* PACKAGES */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">Our Programs</span>
            <h2 className="ip-h2">Find the Right Level of Support</h2>
            <div className="divider divider-left" />
            <p style={{ maxWidth: 620, marginBottom: 8 }}>Every family is different. Some want full white-glove coordination. Others want a more independent path with expert guidance. We have options for both.</p>
            <div className="packages-grid">
              {[
                {
                  name: 'Foundation',
                  price: 'From $9,500 + HST',
                  tagline: 'For families who are informed and ready.',
                  items: ['Surrogate matching coordination', 'Legal & clinic referrals', 'Journey milestone support', 'Access to CSO\'s screened surrogate pool'],
                  featured: false,
                },
                {
                  name: 'Guided Journey',
                  price: 'From $19,500 + HST',
                  tagline: 'For families who want a trusted partner.',
                  items: ['Everything in Foundation', 'Dedicated case management', 'Regular journey check-ins', 'IP profile creation & presentation', 'Matching advocacy & introductions'],
                  featured: false,
                },
                {
                  name: 'Priority Match',
                  price: 'From $29,500 + HST',
                  tagline: 'For families who are ready now.',
                  items: ['Everything in Guided Journey', 'Priority matching', 'Doubled surrogate recruitment', 'Faster average match timeline', 'Split payment structure available'],
                  featured: true,
                },
                {
                  name: 'Independent Journey',
                  price: 'From $1,500 + HST',
                  tagline: 'For families navigating their own path.',
                  items: ['Comprehensive journey checklist', 'Legal & clinic referrals', 'CSO document templates', 'Consultation calls as needed', 'Optional receipt management add-on'],
                  featured: false,
                },
              ].map(p => (
                <div key={p.name} className={`package-card${p.featured ? ' featured' : ''}`} style={{ position: 'relative' }}>
                  {p.featured && <span className="package-badge">Most Popular</span>}
                  <h3>{p.name}</h3>
                  <p className="tagline">{p.tagline}</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#3D1A6E', marginBottom: 16 }}>{p.price}</p>
                  <ul>
                    {p.items.map(i => <li key={i}>{i}</li>)}
                  </ul>
                  <a href="/programs" className="btn" style={{ width: '100%', textAlign: 'center', boxSizing: 'border-box', display: 'block' }}>See Full Details</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="section">
          <span className="section-label">From Our Families</span>
          <h2 className="ip-h2">They Were Right Where You Are</h2>
          <div className="divider" />
          <div className="testimonials-grid">
            {[
              { quote: 'After three failed IVF cycles, we didn\'t think we\'d ever be parents. CSO matched us within four months and our daughter was born last spring. I can\'t put into words what that means.', cite: '— Sarah & James, Ontario' },
              { quote: 'As a single gay man, I was nervous about whether there would be judgment. There wasn\'t. Not once. Robyn and her team treated me like any other parent from day one.', cite: '— David, British Columbia' },
              { quote: 'We\'d been burned by another agency before coming to CSO. The difference was night and day. Transparent, responsive, genuinely caring. We now have twins.', cite: '— Marcus & Elena, Alberta' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <p>&ldquo;{t.quote}&rdquo;</p>
                <cite>{t.cite}</cite>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">Questions We Hear Every Day</span>
            <h2 className="ip-h2">Quick Answers</h2>
            <div className="divider divider-left" />
            <div className="faq-list">
              {[
                { q: 'How long does matching take?', a: 'On average, 3–6 months from the time your profile is active. Some matches happen faster. We don\'t rush it — a good match is worth waiting for.' },
                { q: 'Do I get to choose my surrogate?', a: 'Yes. We introduce you to candidates who are a good fit, but you always have the final say. This is one of the most important relationships of your life.' },
                { q: 'What if the match doesn\'t work out?', a: 'It happens, and that\'s okay. We re-match you. Our team works through any challenges with care, and we don\'t leave you without support.' },
                { q: 'Can same-sex couples use CSO?', a: 'Absolutely. More than half of our intended parent families are LGBTQ+. Canada\'s legal framework protects all family types, and so do we.' },
                { q: 'What does surrogacy cost in Canada?', a: 'Total journey costs typically range from $80,000–$120,000 CAD including legal, medical, and surrogate compensation. See our programs page for a detailed breakdown.' },
              ].map(f => (
                <div key={f.q} className="faq-item">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <a href="/faq" className="btn-outline">See All FAQs</a>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <section className="final-cta">
          <h2>Let&apos;s Talk About Your Family</h2>
          <p>A free, no-pressure consultation call with me or one of our senior coordinators. Just a real conversation about where you are and what&apos;s possible.</p>
          <a href="/contact" className="btn btn-white">Book Your Free Call</a>
        </section>

      </div>
    </>
  );
}
