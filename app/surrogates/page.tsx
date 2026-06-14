import type { Metadata } from 'next';
import SurrogateLeadForm from '@/components/SurrogateLeadForm';

export const metadata: Metadata = {
  title: 'Become a Surrogate | Canadian Surrogacy Options',
  description: 'Give a family the gift of a lifetime. CSO has supported surrogates since 1992 with full legal support, dedicated coordinators, and a real community.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/surrogates' },
};

export default function SurrogatesPage() {
  return (
    <>
      <style>{`
        .sur-body { font-family: 'Jost', sans-serif; color: #2d2d2d; background: #fff; line-height: 1.7; font-weight: 300; }
        .sur-body a { color: #6B3FA0; text-decoration: none; }
        .sur-body a:hover { text-decoration: underline; }
        .sur-hero { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 72px 24px 60px; }
        .sur-hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.6rem, 6vw, 4rem); font-weight: 500; line-height: 1.15; margin-bottom: 18px; }
        .sur-hero p { font-size: 1.2rem; max-width: 620px; margin: 0 auto 32px; opacity: 0.92; }
        .trust-bar { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 28px; margin-top: 32px; font-size: 0.85rem; opacity: 0.85; letter-spacing: 0.05em; }
        .trust-bar span::before { content: "· "; }
        .urgency { background: #E8E0F5; border-left: 5px solid #3D1A6E; padding: 24px 32px; max-width: 780px; margin: 48px auto; border-radius: 6px; text-align: center; }
        .urgency p { font-size: 1.25rem; color: #3D1A6E; font-weight: 600; line-height: 1.5; }
        .btn { display: inline-block; background: #3D1A6E; color: #fff !important; padding: 16px 36px; border-radius: 50px; font-size: 1.05rem; font-weight: 600; letter-spacing: 0.03em; transition: background 0.2s; text-decoration: none !important; }
        .btn:hover { background: #6B3FA0; }
        .cta-center { text-align: center; margin: 36px 0; }
        .section { max-width: 820px; margin: 0 auto; padding: 56px 24px; }
        .section-dark { background: #3D1A6E; color: #fff; }
        .section-dark .section { color: #fff; }
        .section-lavender { background: #E8E0F5; }
        h2.sur-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 500; color: #3D1A6E; margin-bottom: 8px; line-height: 1.2; }
        .section-dark h2.sur-h2 { color: #E8E0F5; }
        .section-label { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 10px; display: block; }
        .section-dark .section-label { color: #C4ADEA; }
        .founder-block { display: flex; gap: 32px; align-items: flex-start; flex-wrap: wrap; }
        .founder-text { flex: 1; min-width: 260px; }
        .founder-text blockquote { font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 400; font-style: italic; line-height: 1.8; color: #fff; margin-bottom: 16px; }
        .founder-text cite { font-style: normal; font-size: 0.9rem; opacity: 0.8; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px; margin-top: 32px; }
        .testimonial-card { background: linear-gradient(145deg, #f3eeff 0%, #e8e0f5 100%); border-radius: 16px; padding: 36px 32px; border-left: 4px solid #9B7FC7; box-shadow: 0 4px 20px rgba(61,26,110,0.07); }
        .testimonial-card p { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 400; color: #3D1A6E; line-height: 1.8; margin-bottom: 18px; font-style: italic; }
        .testimonial-card cite { font-size: 0.78rem; color: #9B7FC7; font-style: normal; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .benefits-list { list-style: none; margin-top: 28px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; padding: 0; }
        .benefits-list li { background: #fff; border-radius: 10px; padding: 20px 22px; display: flex; gap: 14px; align-items: flex-start; box-shadow: 0 2px 8px rgba(61,26,110,0.07); }
        .benefits-list li .icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 2px; }
        .benefits-list li .text strong { display: block; font-size: 0.95rem; color: #3D1A6E; margin-bottom: 3px; }
        .benefits-list li .text span { font-size: 0.9rem; color: #555; }
        .req-list { list-style: none; margin-top: 28px; padding: 0; }
        .req-list li { padding: 12px 0; border-bottom: 1px solid #E8E0F5; display: flex; gap: 12px; align-items: center; font-size: 1rem; }
        .req-list li::before { content: "✓"; color: #6B3FA0; font-weight: 700; font-size: 1.1rem; flex-shrink: 0; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-top: 32px; }
        .step { text-align: center; padding: 24px 16px; }
        .step-num { font-size: 2.5rem; font-weight: 700; color: #9B7FC7; line-height: 1; margin-bottom: 12px; }
        .step h3 { font-size: 1.05rem; color: #3D1A6E; margin-bottom: 8px; }
        .step p { font-size: 0.93rem; color: #555; }
        .video-placeholder { background: #2a1050; border-radius: 14px; padding: 56px 32px; text-align: center; color: #fff; margin: 0 auto; max-width: 640px; border: 2px dashed #9B7FC7; }
        .video-placeholder .play-icon { font-size: 3.5rem; margin-bottom: 16px; opacity: 0.7; }
        .contact-row { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; margin-top: 28px; }
        .contact-row a { background: #fff; color: #3D1A6E !important; border: 2px solid #3D1A6E; padding: 12px 28px; border-radius: 50px; font-weight: 600; font-size: 0.95rem; transition: background 0.2s; text-decoration: none !important; }
        .contact-row a:hover { background: #E8E0F5; }
        .divider { width: 60px; height: 4px; background: #9B7FC7; margin: 16px auto 32px; border-radius: 2px; }
        .divider-left { margin-left: 0; }
        @media (max-width: 600px) { .sur-hero { padding: 52px 20px 44px; } .urgency { padding: 20px 20px; } }
      `}</style>

      <div className="sur-body">

        {/* HERO */}
        <section className="sur-hero">
          <h1>Give a Family the Gift of a Lifetime</h1>
          <p>Surrogacy is one of the most profound things a woman can do. We&apos;ve been here since 1992 and we&apos;ll be with you every step of the way.</p>
          <a href="#apply" className="btn">Start Your Application</a>
          <div className="trust-bar">
            <span>In Practice Since 1992</span>
            <span>100% Canadian</span>
            <span>Full Legal Support</span>
            <span>Compensation Up to $30,000</span>
          </div>
        </section>

        {/* URGENCY */}
        <div className="urgency">
          <p>56 families are waiting right now.<br />You could be the one who changes everything for them.</p>
        </div>

        {/* FOUNDER */}
        <div className="section-dark">
          <div className="section">
            <span className="section-label">From Our Executive Director</span>
            <h2 className="sur-h2">This Is Personal for Me</h2>
            <div className="divider" />
            <div className="founder-block">
              <div className="founder-text">
                <blockquote>
                  &ldquo;I grew up in this field. My mom Joanne was Canada&apos;s first surrogate in 1987 and she founded CSO in 1992. I&apos;ve been part of this world since I was 4 years old, was an egg donor five times, and now I lead CSO. When you join us, you&apos;re not a number. You&apos;re family.&rdquo;
                </blockquote>
                <cite>~ Robyn Price, Executive Director</cite>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-center" style={{ padding: '12px 24px' }}>
          <a href="#apply" className="btn">See If Surrogacy Is Right for You</a>
        </div>

        {/* BENEFITS */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">What You Get</span>
            <h2 className="sur-h2">You&apos;ll Never Do This Alone</h2>
            <div className="divider divider-left" />
            <p style={{ maxWidth: 620, marginBottom: 8 }}>We&apos;ve spent over 30 years building a program that actually takes care of surrogates. Here&apos;s what that looks like in practice.</p>
            <ul className="benefits-list">
              {[
                { icon: '💜', title: 'Your Own Support Coordinator', desc: 'Shondra is with you from day one through the whole journey, no matter what comes up.' },
                { icon: '👯', title: 'A Real Peer Community', desc: 'Connect with other CSO surrogates who truly get what you\'re going through.' },
                { icon: '✅', title: 'All Expenses Fully Reimbursed', desc: 'Every pregnancy-related expense is covered. You won\'t be out of pocket.' },
                { icon: '❤️', title: 'Browse Families Before You Commit', desc: 'Our portal lets you browse real family profiles before you even apply — get a feel for the families we work with and reach out if one resonates.' },
                { icon: '⚖️', title: 'Legal Counsel Included', desc: 'Your legal representation is fully paid for by the intended parents.' },
                { icon: '🏠', title: 'Judgment-Free Support', desc: 'Flexible, warm support from a team that\'s been doing this since 1992. We\'ve seen it all and we\'re here for all of it.' },
              ].map(b => (
                <li key={b.title}>
                  <span className="icon">{b.icon}</span>
                  <div className="text"><strong>{b.title}</strong><span>{b.desc}</span></div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-center" style={{ padding: '40px 24px 12px' }}>
          <a href="#apply" className="btn">Start Your Application</a>
        </div>

        {/* VIDEO */}
        <div className="section">
          <span className="section-label">A Note from Robyn</span>
          <h2 className="sur-h2" style={{ textAlign: 'center' }}>Hear It Straight from Me</h2>
          <div className="divider" />
          <div className="video-placeholder">
            <div className="play-icon">▶</div>
            <strong style={{ fontSize: '1.1rem' }}>Video coming soon</strong>
            <p>Robyn will be sharing a personal message for women considering surrogacy. Check back soon.</p>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="section">
          <span className="section-label">From Our Surrogates</span>
          <h2 className="sur-h2">What It&apos;s Actually Like</h2>
          <div className="divider" />
          <div className="testimonials-grid">
            {[
              { quote: 'Being a surrogate was the most meaningful thing I\'ve ever done. CSO made sure I felt supported, informed, and valued the whole way through.', cite: 'CSO Surrogate, Ontario' },
              { quote: 'I love the support from the team members. Everyone is supported no matter the problem. We truly are a family.', cite: 'CSO Surrogate' },
              { quote: 'Robyn takes the time to get to know you and has your best interest at heart. She is always available if you need her.', cite: 'CSO Surrogate' },
              { quote: 'CSO is a close knit family and leaves you feeling valued.', cite: 'CSO Surrogate' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <p>&ldquo;{t.quote}&rdquo;</p>
                <cite>{t.cite}</cite>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-center" style={{ padding: '12px 24px 48px' }}>
          <a href="#apply" className="btn">See If Surrogacy Is Right for You</a>
        </div>

        {/* REQUIREMENTS */}
        <div className="section">
          <span className="section-label">Do You Qualify?</span>
          <h2 className="sur-h2">Basic Requirements</h2>
          <div className="divider divider-left" />
          <p style={{ marginBottom: 8, maxWidth: 580 }}>Here&apos;s what we look for in a surrogate candidate. If you check most of these, we&apos;d love to hear from you.</p>
          <ul className="req-list">
            {['Between 21 and 42 years old', 'Have had at least one successful pregnancy', 'Canadian resident (citizen or PR)', 'Healthy BMI and no major health concerns', 'Non-smoker (and household)', 'Financially stable (not receiving social assistance)'].map(r => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        {/* HOW IT WORKS */}
        <div className="section-lavender">
          <div className="section">
            <span className="section-label">How It Works</span>
            <h2 className="sur-h2">Three Simple Steps to Get Started</h2>
            <div className="divider divider-left" />
            <div className="steps">
              <div className="step"><div className="step-num">01</div><h3>Apply Online</h3><p>Fill out our short application below. It takes about 10 minutes and there&apos;s no commitment at this stage.</p></div>
              <div className="step"><div className="step-num">02</div><h3>We&apos;ll Be in Touch</h3><p>One of our team members will reach out personally, usually within 1 to 2 business days, to chat and answer your questions.</p></div>
              <div className="step"><div className="step-num">03</div><h3>Get Matched</h3><p>Once approved, we&apos;ll introduce you to intended parents who are the right fit for you. You&apos;ll always have a say.</p></div>
            </div>
          </div>
        </div>

        {/* FREE GUIDE - LEAD MAGNET */}
        <div className="section" style={{ background: 'var(--lavender-light, #E8E0F5)', padding: '80px 40px' }}>
          <SurrogateLeadForm />
        </div>

        {/* APPLICATION FORM */}
        <div className="section" id="apply">
          <span className="section-label">Ready to Start?</span>
          <h2 className="sur-h2">Surrogate Application</h2>
          <div className="divider divider-left" />
          <p style={{ marginBottom: 28, maxWidth: 580 }}>This form is confidential and takes about 10 minutes. We read every single one.</p>
          <iframe
            src="https://form.jotform.com/260955096153058"
            title="Surrogate Application"
            style={{ width: '100%', minHeight: 900, border: 'none', borderRadius: 12 }}
            allowFullScreen
          />
        </div>

        {/* CONTACT */}
        <div className="section-dark">
          <div className="section" style={{ textAlign: 'center' }}>
            <span className="section-label">Have Questions First?</span>
            <h2 className="sur-h2">We&apos;re Real People</h2>
            <div className="divider" />
            <p style={{ maxWidth: 500, margin: '0 auto 8px', opacity: 0.9 }}>We love hearing from women who are curious about surrogacy. Reach out anytime, no pressure at all.</p>
            <div className="contact-row">
              <a href="tel:18774014175">📞 Call Us</a>
              <a href="sms:18774014175">💬 Text Us</a>
              <a href="mailto:info@canadiansurrogacyoptions.com">✉️ Email Us</a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
