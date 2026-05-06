import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Surrogacy Resources & Guides | Canadian Surrogacy Options',
  description: 'PDF guides for intended parents and surrogates. Written by Robyn Price after 34 years answering the same questions on calls.',
};

const guides = [
  {
    title: 'Is Surrogacy Right For Me?',
    price: '$27',
    desc: 'The honest, no-fluff guide for anyone at the very beginning, still weighing whether surrogacy is the right path for their family.',
    forWho: 'For anyone just starting to explore surrogacy, unsure if it\'s for them.',
    icon: '🌱',
  },
  {
    title: 'The Canadian Surrogacy Roadmap',
    price: '$97',
    desc: 'A complete walkthrough of the Canadian surrogacy journey from match to birth, plus a budget tracker that covers every category of cost.',
    forWho: 'For intended parents who are ready to understand what the full journey looks like.',
    icon: '🗺️',
    featured: true,
  },
  {
    title: 'Independent Journey Checklist',
    price: '$87',
    desc: 'Everything you need to know if you\'re considering doing surrogacy without an agency: the risks, the requirements, and the real checklist.',
    forWho: 'For intended parents who want to explore the independent route with open eyes.',
    icon: '📋',
  },
  {
    title: 'Surrogate Readiness Guide',
    price: '$47',
    desc: 'A practical, warm guide for women who are seriously thinking about becoming a surrogate: what to expect, what questions to ask, and how to know if the timing is right.',
    forWho: 'For women considering surrogacy who want a clear picture before they apply.',
    icon: '💜',
  },
  {
    title: 'IP Profile Template Pack',
    price: '$67',
    desc: 'A fill-in-the-blanks template for intended parents to create a profile that actually resonates with surrogates, with guidance on what surrogates are really looking for.',
    forWho: 'For intended parents who want to make the strongest possible first impression.',
    icon: '✍️',
  },
];

export default function ResourcesPage() {
  return (
    <>
      <style>{`
        .res-body { font-family: 'Jost', sans-serif; color: #2d2d2d; background: #fff; line-height: 1.7; font-weight: 300; }
        .res-body a { color: #6B3FA0; text-decoration: none; }
        .res-body a:hover { text-decoration: underline; }
        .res-hero { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 80px 24px 64px; }
        .res-hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.6rem, 6vw, 4rem); font-weight: 500; line-height: 1.15; margin-bottom: 20px; }
        .res-hero p { font-size: 1.2rem; max-width: 620px; margin: 0 auto; opacity: 0.92; }
        .btn { display: inline-block; background: #3D1A6E; color: #fff !important; padding: 16px 36px; border-radius: 50px; font-size: 1.05rem; font-weight: 600; letter-spacing: 0.03em; transition: background 0.2s; text-decoration: none !important; }
        .btn:hover { background: #6B3FA0; }
        .btn-white { background: #fff; color: #3D1A6E !important; }
        .btn-white:hover { background: #E8E0F5; }
        .btn-sm { padding: 12px 28px; font-size: 0.95rem; }
        .section { max-width: 900px; margin: 0 auto; padding: 60px 24px; }
        .section-lavender { background: #E8E0F5; }
        .section-dark { background: #3D1A6E; color: #fff; }
        .section-label { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 10px; display: block; }
        .section-dark .section-label { color: #C4ADEA; }
        h2.res-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 500; color: #3D1A6E; margin-bottom: 8px; line-height: 1.2; }
        .section-dark h2.res-h2 { color: #E8E0F5; }
        .divider { width: 60px; height: 4px; background: #9B7FC7; margin: 16px auto 32px; border-radius: 2px; }
        .divider-left { margin-left: 0; }
        .intro-block { background: linear-gradient(145deg, #f3eeff, #e8e0f5); border-radius: 16px; padding: 40px; max-width: 780px; margin: 0 auto; }
        .intro-block blockquote { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-style: italic; color: #3D1A6E; line-height: 1.8; margin: 0 0 12px; }
        .intro-block cite { font-size: 0.82rem; color: #9B7FC7; font-style: normal; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .guides-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; margin-top: 40px; }
        .guide-card { background: #fff; border-radius: 16px; padding: 36px 28px; box-shadow: 0 4px 20px rgba(61,26,110,0.09); border: 2px solid #E8E0F5; display: flex; flex-direction: column; transition: border-color 0.2s, box-shadow 0.2s; }
        .guide-card:hover { border-color: #9B7FC7; box-shadow: 0 6px 28px rgba(61,26,110,0.14); }
        .guide-card.featured { border-color: #3D1A6E; position: relative; }
        .guide-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: #3D1A6E; color: #fff; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 14px; border-radius: 20px; white-space: nowrap; }
        .guide-icon { font-size: 2.4rem; margin-bottom: 16px; }
        .guide-price { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 600; color: #3D1A6E; margin-bottom: 4px; }
        .guide-card h3 { font-size: 1.1rem; color: #3D1A6E; font-weight: 600; margin-bottom: 12px; line-height: 1.3; }
        .guide-card .desc { font-size: 0.92rem; color: #444; margin-bottom: 14px; flex: 1; }
        .guide-card .for-who { font-size: 0.82rem; color: #9B7FC7; font-style: italic; margin-bottom: 20px; padding: 10px 14px; background: #f3eeff; border-radius: 8px; }
        .bundle-block { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); border-radius: 20px; padding: 48px 40px; text-align: center; color: #fff; margin-top: 48px; }
        .bundle-block h3 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 500; margin-bottom: 10px; }
        .bundle-block .includes { font-size: 0.9rem; opacity: 0.85; margin-bottom: 20px; }
        .bundle-pricing { display: flex; gap: 20px; align-items: center; justify-content: center; margin-bottom: 28px; flex-wrap: wrap; }
        .bundle-price-new { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 600; color: #fff; }
        .bundle-price-old { font-size: 1.1rem; text-decoration: line-through; opacity: 0.6; }
        .bundle-save { background: rgba(255,255,255,0.2); border-radius: 20px; padding: 4px 14px; font-size: 0.82rem; font-weight: 600; }
        .testimonial-block { background: linear-gradient(145deg, #f3eeff, #e8e0f5); border-radius: 16px; padding: 40px; max-width: 680px; margin: 48px auto 0; border-left: 5px solid #9B7FC7; }
        .testimonial-block p { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-style: italic; color: #3D1A6E; line-height: 1.8; margin-bottom: 16px; }
        .testimonial-block cite { font-size: 0.78rem; color: #9B7FC7; font-style: normal; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .final-cta { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 64px 24px; }
        .final-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 500; margin-bottom: 14px; }
        .final-cta p { font-size: 1.05rem; opacity: 0.9; max-width: 500px; margin: 0 auto 28px; }
        @media (max-width: 600px) { .res-hero { padding: 56px 20px 48px; } .bundle-block { padding: 36px 24px; } }
      `}</style>

      <div className="res-body">

        {/* HERO */}
        <section className="res-hero">
          <h1>Know Before You Begin</h1>
          <p>The knowledge gap in surrogacy is expensive. These guides close it before you spend a dollar on anything else.</p>
        </section>

        {/* ROBYN INTRO */}
        <div className="section" style={{ paddingBottom: 0 }}>
          <span className="section-label">From Robyn</span>
          <h2 className="res-h2" style={{ textAlign: 'center' }}>Why These Guides Exist</h2>
          <div className="divider" />
          <div className="intro-block">
            <blockquote>
              &ldquo;After 34 years answering the same questions on calls, I wrote them all down. Not the sanitised version. The real answers. What things actually cost, what most agencies won&apos;t tell you upfront, what it&apos;s really like. If you&apos;re going to spend six figures on a surrogacy journey, you deserve to walk in knowing exactly what you&apos;re doing.&rdquo;
            </blockquote>
            <cite>Robyn Price, Executive Director, CSO</cite>
          </div>
        </div>

        {/* GUIDES */}
        <div className="section">
          <span className="section-label">The Guides</span>
          <h2 className="res-h2">Five Guides. One for Every Stage.</h2>
          <div className="divider divider-left" />
          <div className="guides-grid">
            {guides.map(g => (
              <div key={g.title} className={`guide-card${g.featured ? ' featured' : ''}`} style={{ position: 'relative' }}>
                {g.featured && <span className="guide-badge">Most Popular</span>}
                <div className="guide-icon">{g.icon}</div>
                <div className="guide-price">{g.price}</div>
                <h3>{g.title}</h3>
                <p className="desc">{g.desc}</p>
                <p className="for-who">{g.forWho}</p>
                <a href="/programs" className="btn btn-sm" style={{ textAlign: 'center', display: 'block' }}>Get This Guide</a>
              </div>
            ))}
          </div>

          {/* BUNDLE */}
          <div className="bundle-block">
            <h3>The Complete IP Bundle</h3>
            <p className="includes">The Canadian Surrogacy Roadmap + Independent Journey Checklist + IP Profile Template Pack</p>
            <div className="bundle-pricing">
              <span className="bundle-price-new">$199</span>
              <span className="bundle-price-old">$251</span>
              <span className="bundle-save">Save $52</span>
            </div>
            <a href="/programs" className="btn btn-white">Get the Bundle</a>
          </div>
        </div>

        {/* TESTIMONIAL */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">From a Reader</span>
            <div className="testimonial-block">
              <p>&ldquo;I bought the Roadmap before our first consultation with CSO. It completely changed the quality of questions I asked. I wasn&apos;t starting from zero. I already understood the process, the costs, and the things to watch out for. It was honestly the best $97 I spent in the whole journey.&rdquo;</p>
              <cite>Anonymous IP, Ontario</cite>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <section className="final-cta">
          <h2>Not Sure Which Guide Is Right for You?</h2>
          <p>Send us a message and we&apos;ll point you in the right direction. No upsell, just a real recommendation.</p>
          <a href="/contact" className="btn btn-white">Ask Us</a>
        </section>

      </div>
    </>
  );
}
