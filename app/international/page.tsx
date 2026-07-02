import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'International Surrogacy in Canada',
  description: 'Canada is one of the safest and most welcoming countries in the world for international intended parents. Learn how CSO supports families from the USA, UK, Australia, Israel, and beyond.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/international' },
};

const countries = [
  {
    country: 'United States',
    flag: '🇺🇸',
    notes: "American intended parents can often drive to Canada or take a short flight. Embryo shipping is straightforward across the US-Canada border. US citizens do not need a visa. Confirm your baby's US citizenship through the US consulate.",
  },
  {
    country: 'United Kingdom',
    flag: '🇬🇧',
    notes: 'UK intended parents are among our most frequent international clients. Surrogacy law in the UK is more restrictive, which is why many UK families look to Canada. Plan for 2-3 trips: transfer, possibly prenatal visit, and birth.',
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    notes: 'Commercial surrogacy restrictions in Australia drive many families to look internationally. Canadian altruistic surrogacy is often a strong fit. Plan for significant travel; video consultations handle most of the process.',
  },
  {
    country: 'Israel',
    flag: '🇮🇱',
    notes: 'Israeli intended parents often have specific requirements around genetic connection and legal process. We have experience coordinating with Israeli families and can advise on documentation needed by Israeli family courts.',
  },
  {
    country: 'Western Europe',
    flag: '🇪🇺',
    notes: 'France, Germany, Spain, and other EU countries where domestic surrogacy is illegal or heavily restricted. Canadian surrogacy offers a legally cleaner and more stable path for many families.',
  },
];

export default function InternationalPage() {
  return (
    <>
      <style>{`
        .intl-body { font-family: 'Jost', sans-serif; color: #2d2d2d; background: #fff; line-height: 1.7; font-weight: 300; }
        .intl-body a { color: #6B3FA0; text-decoration: none; }
        .intl-body a:hover { text-decoration: underline; }
        .intl-hero { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 80px 24px 64px; }
        .intl-hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 5.5vw, 4rem); font-weight: 500; line-height: 1.15; margin-bottom: 20px; }
        .intl-hero p { font-size: 1.2rem; max-width: 700px; margin: 0 auto 32px; opacity: 0.92; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; margin-bottom: 18px; }
        .hero-note { font-size: 0.95rem; color: rgba(255,255,255,0.74); margin: 0 auto; max-width: 620px; }
        .trust-bar { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 28px; margin-top: 28px; font-size: 0.85rem; opacity: 0.85; letter-spacing: 0.05em; }
        .trust-bar span::before { content: "· "; }
        .btn { display: inline-block; background: #3D1A6E; color: #fff !important; padding: 16px 36px; border-radius: 50px; font-size: 1.05rem; font-weight: 600; letter-spacing: 0.03em; transition: background 0.2s; text-decoration: none !important; }
        .btn:hover { background: #6B3FA0; }
        .btn-white { background: #fff; color: #3D1A6E !important; }
        .btn-white:hover { background: #E8E0F5; }
        .btn-soft { background: rgba(255,255,255,0.12); color: #fff !important; border: 1px solid rgba(255,255,255,0.28); }
        .btn-soft:hover { background: rgba(255,255,255,0.18); }
        .section { max-width: 880px; margin: 0 auto; padding: 60px 24px; }
        .section-dark { background: #3D1A6E; color: #fff; }
        .section-dark .section { color: #fff; }
        .section-lavender { background: #E8E0F5; }
        .section-label { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 10px; display: block; }
        .section-dark .section-label { color: #C4ADEA; }
        h2.intl-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.9rem, 3.8vw, 2.7rem); font-weight: 500; color: #3D1A6E; margin-bottom: 8px; line-height: 1.2; }
        .section-dark h2.intl-h2 { color: #E8E0F5; }
        .divider { width: 60px; height: 4px; background: #9B7FC7; margin: 16px auto 32px; border-radius: 2px; }
        .divider-left { margin-left: 0; }
        .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 32px; }
        .why-card { background: rgba(255,255,255,0.1); border-radius: 12px; padding: 28px 24px; border: 1px solid rgba(255,255,255,0.15); }
        .why-card h3 { font-size: 1rem; color: #E8E0F5; font-weight: 600; margin-bottom: 8px; }
        .why-card p { font-size: 0.9rem; color: rgba(255,255,255,0.78); }
        .countries-list { display: flex; flex-direction: column; gap: 16px; margin-top: 32px; }
        .country-item { background: #fff; border-radius: 12px; padding: 24px 28px; box-shadow: 0 2px 12px rgba(61,26,110,0.07); display: flex; gap: 20px; align-items: flex-start; }
        .country-flag { font-size: 2.2rem; flex-shrink: 0; margin-top: 2px; }
        .country-item h3 { font-size: 1.05rem; color: #3D1A6E; font-weight: 600; margin-bottom: 6px; }
        .country-item p { font-size: 0.9rem; color: #444; }
        .process-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 36px; }
        .process-step { text-align: center; padding: 24px 16px; }
        .process-num { font-size: 2.5rem; font-weight: 700; color: #9B7FC7; line-height: 1; margin-bottom: 10px; }
        .process-step h3 { font-size: 1rem; color: #3D1A6E; font-weight: 600; margin-bottom: 8px; }
        .process-step p { font-size: 0.88rem; color: #555; }
        .legal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 28px; }
        .legal-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(61,26,110,0.07); border-top: 4px solid #9B7FC7; }
        .legal-card h3 { font-size: 1rem; color: #3D1A6E; font-weight: 600; margin-bottom: 8px; }
        .legal-card p { font-size: 0.9rem; color: #555; }
        .practical-list { list-style: none; margin-top: 28px; padding: 0; }
        .practical-list li { padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; gap: 14px; align-items: flex-start; }
        .practical-list li .bullet { color: #C4ADEA; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
        .practical-list li .text strong { display: block; color: #E8E0F5; margin-bottom: 3px; font-size: 0.95rem; }
        .practical-list li .text span { font-size: 0.9rem; color: rgba(255,255,255,0.72); }
        .concierge-block { background: linear-gradient(145deg, #f3eeff, #e8e0f5); border-radius: 16px; padding: 48px 40px; border-left: 5px solid #3D1A6E; }
        .concierge-block h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; color: #3D1A6E; margin-bottom: 12px; }
        .concierge-block p { font-size: 0.95rem; color: #444; margin-bottom: 20px; }
        .final-cta { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 72px 24px; }
        .final-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 500; margin-bottom: 16px; }
        .final-cta p { font-size: 1.1rem; opacity: 0.9; max-width: 560px; margin: 0 auto 32px; }
        @media (max-width: 600px) { .intl-hero { padding: 56px 20px 48px; } .country-item { flex-direction: column; gap: 10px; } }
      `}</style>

      <div className="intl-body">
        <section className="intl-hero">
          <h1>Canada Welcomes Families From Around the World</h1>
          <p>Whether you're in the UK, Australia, the US, or somewhere else surrogacy is complicated at home, Canada can offer a clear, ethical, legally sound path to parenthood. Start by understanding the real costs, travel, and legal steps before you book a call.</p>
          <div className="hero-actions">
            <a href="/guides/is-surrogacy-right" className="btn btn-white">Start with the $27 Guide</a>
            <a href="/contact" className="btn btn-soft">Book a Free Video Consultation</a>
          </div>
          <p className="hero-note">Best first step for international intended parents who want honest numbers, realistic timelines, and a clearer sense of whether Canada is the right fit.</p>
          <div className="trust-bar">
            <span>Video Consultations Available</span>
            <span>Embryo Shipping Coordination</span>
            <span>Parentage Orders Internationally Recognised</span>
            <span>Canadian Citizenship for Baby</span>
          </div>
        </section>

        <div className="section-dark">
          <div className="section">
            <span className="section-label">Why Canada</span>
            <h2 className="intl-h2">What Makes Canada Different</h2>
            <div className="divider" />
            <div className="why-grid">
              {[
                { title: 'Altruistic Surrogacy', text: 'No exploitation concerns. Canadian surrogates are not paid a fee, only reimbursed. This satisfies the ethical requirements many international intended parents have.' },
                { title: 'Clear Legal Framework', text: 'The Assisted Human Reproduction Act provides a stable federal legal foundation. Parentage law is well-established and consistently applied.' },
                { title: 'English-Speaking', text: 'Communication is easy. Legal documents are in English or French. There are few translation barriers for most international families.' },
                { title: 'World-Class Fertility Clinics', text: "Canada's fertility clinics operate to internationally recognised standards. Many already work with international patients." },
                { title: 'Proximity to the US', text: 'For US families, Canada is often just a short drive or flight away, making required travel appointments far less disruptive.' },
                { title: 'Diverse Surrogate Pool', text: "CSO has surrogates across all provinces. We're not limited to one city or region, which improves match flexibility." },
              ].map(r => (
                <div key={r.title} className="why-card">
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section">
          <span className="section-label">Where We Work</span>
          <h2 className="intl-h2">Countries We Work With</h2>
          <div className="divider divider-left" />
          <p style={{ maxWidth: 660, marginBottom: 8 }}>We work with international families regularly. Here is what intended parents from common countries usually need to know.</p>
          <div className="countries-list">
            {countries.map(c => (
              <div key={c.country} className="country-item">
                <span className="country-flag">{c.flag}</span>
                <div>
                  <h3>{c.country}</h3>
                  <p>{c.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-lavender">
          <div className="section">
            <span className="section-label">How It Works</span>
            <h2 className="intl-h2">The Process for International Families</h2>
            <div className="divider divider-left" />
            <div className="process-steps">
              {[
                { num: '01', title: 'Initial Video Consultation', text: "We meet by video. You tell us your situation. We explain what's realistic for your country, timeline, and budget. No travel required at this stage." },
                { num: '02', title: 'Contract & Onboarding', text: 'Legal agreements are signed. Your case manager is assigned. We begin the matching process.' },
                { num: '03', title: 'Embryo Shipping or IVF', text: 'If you have frozen embryos, we coordinate shipping to the Canadian clinic. If embryos need to be created, we coordinate with the clinic.' },
                { num: '04', title: 'Transfer Appointment', text: 'You travel to Canada for the embryo transfer. This is typically a 3-5 day trip. Your case manager coordinates everything with the clinic.' },
                { num: '05', title: 'Pregnancy & Check-Ins', text: "You're home. We manage everything in Canada. Video updates, milestones, regular communication with your surrogate." },
                { num: '06', title: 'Birth & Documents', text: "You travel for the birth. We help with the Canadian birth certificate, parentage order, and citizenship documentation for your home country." },
              ].map(s => (
                <div key={s.num} className="process-step">
                  <div className="process-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section">
          <span className="section-label">Legal Clarity</span>
          <h2 className="intl-h2">What the Paperwork Looks Like</h2>
          <div className="divider divider-left" />
          <div className="legal-grid">
            {[
              { title: 'Parentage Order', text: 'A Canadian court order naming you as the legal parents. Obtained before or after birth depending on province. This is the foundational document.' },
              { title: 'Canadian Birth Certificate', text: 'Your baby is a Canadian citizen by birth. The birth certificate is issued provincially and usually lists the intended parents.' },
              { title: 'Citizenship for Your Baby', text: "Your baby's citizenship in your home country is established through your consulate or embassy in Canada. The process varies by country and we will guide you." },
              { title: 'Passport & Travel', text: "You'll need travel documents to bring your baby home. We have experience supporting families through this step and can connect you with specialists." },
            ].map(l => (
              <div key={l.title} className="legal-card">
                <h3>{l.title}</h3>
                <p>{l.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-dark">
          <div className="section">
            <span className="section-label">Practical Details</span>
            <h2 className="intl-h2">Planning Your Trips</h2>
            <div className="divider" />
            <ul className="practical-list">
              {[
                { title: 'Which Appointments Require Travel?', desc: 'Typically 2-3 trips: embryo transfer, optionally a prenatal visit, and the birth. Plan for 2-3 weeks after birth to handle post-birth documentation.' },
                { title: 'Where to Stay', desc: "We usually recommend short-term rentals over hotels for the birth trip so you have a kitchen and laundry. We can suggest options near major clinics." },
                { title: 'Approximate Travel Budget', desc: 'Most international families budget roughly $8,000-$15,000 CAD for travel across the full journey, depending on distance and number of trips.' },
                { title: 'Clinic Coordination', desc: "We work with fertility clinics across Canada and can help match you with one that has international patient experience and makes logistical sense for your surrogate." },
              ].map(p => (
                <li key={p.title}>
                  <span className="bullet">→</span>
                  <div className="text">
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="section-lavender">
          <div className="section">
            <span className="section-label">For Complex Journeys</span>
            <h2 className="intl-h2">Camica Concierge</h2>
            <div className="divider divider-left" />
            <div className="concierge-block">
              <h3>White-Glove Coordination for International Families</h3>
              <p>International surrogacy has more moving parts than a domestic journey. Camica Concierge is our premium coordination program designed specifically for families navigating distance, time zones, embryo logistics, and cross-border documentation.</p>
              <p>From your first video call to the moment your baby clears customs, Camica handles it. Travel coordination, clinic liaison, consulate documentation support, and direct access to your coordinator.</p>
              <a href="/programs" className="btn">Learn About Camica</a>
            </div>
          </div>
        </div>

        <section className="final-cta">
          <h2>Start with Clarity, Then Book the Call</h2>
          <p>The fastest way to know whether Canada makes sense for your family is to read the guide first, then come to your consultation with the right questions already in hand.</p>
          <div className="hero-actions" style={{ marginBottom: 0 }}>
            <a href="/guides/is-surrogacy-right" className="btn btn-white">Get the $27 Guide</a>
            <a href="/contact" className="btn btn-soft">Book a Free Video Consultation</a>
          </div>
        </section>
      </div>
    </>
  );
}
