import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Families Built Through CSO | Canadian Surrogacy Options',
  description: 'Over 2,500 families have been built through Canadian Surrogacy Options since 1992. Read their stories.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/families' },
};

const stories = [
  {
    names: 'Tom',
    location: 'Ontario',
    label: 'Single Dad',
    story: 'Tom came to CSO as a single gay man in his late thirties, certain he wanted to be a father and equally certain he\'d face barriers at every turn. He didn\'t. His daughter, Maya, was born two years into the process. He sends us a photo on her birthday every year.',
  },
  {
    names: 'André & Sébastien',
    location: 'Québec',
    label: 'Same-Sex Couple',
    story: 'André and Sébastien had tried to navigate surrogacy independently before finding CSO. The matching process alone had taken them almost two years on their own. Within five months of joining CSO, they were matched. Their son was born healthy, and their surrogate remains a part of their extended family.',
  },
  {
    names: 'Caroline & Rajan',
    location: 'British Columbia',
    label: 'After Six IVF Cycles',
    story: 'Six rounds of IVF. Two miscarriages. A grief that most people couldn\'t understand. When Caroline and Rajan finally reached out to CSO, Caroline said she wasn\'t sure she had hope left. She does now. Their twins are three years old.',
  },
  {
    names: 'James & Fiona',
    location: 'United Kingdom',
    label: 'International Family',
    story: 'James and Fiona live in London and spent months researching international surrogacy options. Canada kept coming up. They chose CSO after a video call with Robyn. They flew to Canada three times: for the transfer, for a prenatal visit, and for the birth. They brought their son home on a cold November morning.',
  },
  {
    names: 'Simone & Kieran',
    location: 'Nova Scotia',
    label: 'After a Late Loss',
    story: 'Simone and Kieran lost a pregnancy at 22 weeks. The kind of loss that changes a person. They came to surrogacy after that, not running from grief, but moving through it. Their surrogate, who knew their history, carried the pregnancy with extraordinary care. Their little girl arrived exactly on her due date.',
  },
  {
    names: 'Patricia & Gordon',
    location: 'Alberta',
    label: 'In Their Mid-Forties',
    story: 'Patricia and Gordon were 44 and 47 when they came to CSO. They\'d spent years caring for aging parents and building their careers, and parenthood had kept getting delayed. They weren\'t sure if it was too late. It wasn\'t. Their son is now two and they describe him as the best thing that ever happened to them.',
  },
  {
    names: 'Leila & Marcus',
    location: 'Ontario',
    label: 'Now on Their Second Journey',
    story: 'Leila and Marcus completed their first CSO journey six years ago. Their daughter asked them when she was four where babies come from, and they explained it in the most beautiful, age-appropriate way. This year, they came back to CSO to give her a sibling. The surrogate from their first journey is cheering them on.',
  },
  {
    names: 'Priya & Daniel',
    location: 'Manitoba',
    label: 'With an Egg Donor',
    story: 'Priya was born without ovaries, a fact she\'d lived with her whole adult life. Surrogacy wasn\'t the only piece of the puzzle; they also needed an egg donor. CSO coordinated both. Their daughter carries the genetic material of a generous donor and was carried by a warm, dedicated surrogate. She is, by every definition that matters, theirs.',
  },
];

export default function FamiliesPage() {
  return (
    <>
      <style>{`
        .fam-body { font-family: 'Jost', sans-serif; color: #2d2d2d; background: #fff; line-height: 1.7; font-weight: 300; }
        .fam-body a { color: #6B3FA0; text-decoration: none; }
        .fam-body a:hover { text-decoration: underline; }
        .fam-hero { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 80px 24px 64px; }
        .fam-hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.6rem, 6vw, 4.2rem); font-weight: 500; line-height: 1.1; margin-bottom: 20px; }
        .fam-hero p { font-size: 1.2rem; max-width: 600px; margin: 0 auto; opacity: 0.92; }
        .btn { display: inline-block; background: #3D1A6E; color: #fff !important; padding: 16px 36px; border-radius: 50px; font-size: 1.05rem; font-weight: 600; letter-spacing: 0.03em; transition: background 0.2s; text-decoration: none !important; }
        .btn:hover { background: #6B3FA0; }
        .btn-white { background: #fff; color: #3D1A6E !important; }
        .btn-white:hover { background: #E8E0F5; }
        .section { max-width: 880px; margin: 0 auto; padding: 60px 24px; }
        .section-lavender { background: #E8E0F5; }
        .section-dark { background: #3D1A6E; color: #fff; }
        .section-label { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 10px; display: block; }
        .section-dark .section-label { color: #C4ADEA; }
        h2.fam-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 500; color: #3D1A6E; margin-bottom: 8px; line-height: 1.2; }
        .section-dark h2.fam-h2 { color: #E8E0F5; }
        .divider { width: 60px; height: 4px; background: #9B7FC7; margin: 16px auto 32px; border-radius: 2px; }
        .divider-left { margin-left: 0; }
        .intro-block { display: flex; gap: 40px; align-items: flex-start; flex-wrap: wrap; }
        .intro-block blockquote { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-style: italic; line-height: 1.8; color: #3D1A6E; flex: 1; min-width: 260px; margin: 0; }
        .stories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 28px; margin-top: 40px; }
        .story-card { background: #fff; border-radius: 16px; padding: 36px 32px; box-shadow: 0 4px 20px rgba(61,26,110,0.08); border-top: 4px solid #9B7FC7; }
        .story-card .story-meta { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
        .story-card .story-label { background: #E8E0F5; color: #6B3FA0; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 12px; border-radius: 20px; }
        .story-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #3D1A6E; margin-bottom: 4px; font-weight: 500; }
        .story-card .location { font-size: 0.82rem; color: #9B7FC7; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 14px; }
        .story-card p { font-size: 0.95rem; color: #444; line-height: 1.75; }
        .pull-quote { background: #3D1A6E; color: #fff; padding: 60px 24px; text-align: center; }
        .pull-quote blockquote { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 400; font-style: italic; line-height: 1.6; max-width: 720px; margin: 0 auto 20px; }
        .pull-quote cite { font-size: 0.9rem; opacity: 0.75; font-style: normal; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; margin-top: 36px; }
        .stat-item { text-align: center; padding: 32px 20px; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(61,26,110,0.08); }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 3rem; font-weight: 600; color: #3D1A6E; line-height: 1; margin-bottom: 8px; }
        .stat-label { font-size: 0.9rem; color: #666; }
        .final-cta { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 72px 24px; }
        .final-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 500; margin-bottom: 16px; }
        .final-cta p { font-size: 1.1rem; opacity: 0.9; max-width: 540px; margin: 0 auto 32px; }
        @media (max-width: 600px) { .fam-hero { padding: 56px 20px 48px; } .stories-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="fam-body">

        {/* HERO */}
        <section className="fam-hero">
          <h1>2,500+ Families.<br />Every One a Miracle.</h1>
          <p>Since 1992, we&apos;ve had the privilege of walking with families through one of the most profound journeys of their lives. Here are some of their stories.</p>
        </section>

        {/* INTRO FROM ROBYN */}
        <div className="section">
          <span className="section-label">A Word from Robyn</span>
          <h2 className="fam-h2">What It Means to Witness This</h2>
          <div className="divider divider-left" />
          <div className="intro-block">
            <blockquote>
              &ldquo;I have been in delivery rooms. I have watched people become parents for the first time and completely fall apart in the best possible way. I have seen surrogates hand a baby to someone who had given up hope, and I have watched both of them cry. There is nothing else like it. After more than three decades, it still gets me every single time.&rdquo;
            </blockquote>
            <div style={{ flex: 1, minWidth: 220 }}>
              <p style={{ fontSize: '0.95rem', color: '#444' }}>Every family we work with has a unique story. The common thread isn&apos;t the path. It&apos;s the love that drove them here. These are just a few of the families who have allowed us to share their journeys.</p>
            </div>
          </div>
        </div>

        {/* STORIES GRID */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">Family Stories</span>
            <h2 className="fam-h2">Real Families. Real Journeys.</h2>
            <div className="divider divider-left" />
            <div className="stories-grid">
              {stories.map(s => (
                <div key={s.names} className="story-card">
                  <div className="story-meta">
                    <span className="story-label">{s.label}</span>
                  </div>
                  <h3>{s.names}</h3>
                  <div className="location">{s.location}</div>
                  <p>{s.story}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PULL QUOTE */}
        <section className="pull-quote">
          <blockquote>
            &ldquo;The moment a family walks out of that hospital with their baby, everything we do becomes worth it ten times over. That moment is why CSO exists.&rdquo;
          </blockquote>
          <cite>Robyn Price, Executive Director, Canadian Surrogacy Options</cite>
        </section>

        {/* STATS */}
        <div className="section">
          <span className="section-label">By the Numbers</span>
          <h2 className="fam-h2" style={{ textAlign: 'center' }}>34 Years of Families</h2>
          <div className="divider" />
          <div className="stats-grid">
            {[
              { num: '2,500+', label: 'Families built through CSO' },
              { num: '34', label: 'Years in practice' },
              { num: '96%', label: 'Client satisfaction rate' },
              { num: '10+', label: 'Provinces with active surrogates' },
            ].map(s => (
              <div key={s.label} className="stat-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <section className="final-cta">
          <h2>Ready to Start Your Story?</h2>
          <p>Every one of the families on this page started exactly where you are right now. A free call is all it takes to begin.</p>
          <a href="/contact" className="btn btn-white">Talk to Us Today</a>
        </section>

      </div>
    </>
  );
}
