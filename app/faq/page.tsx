import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Canadian Surrogacy Options',
  description: 'Answers to the most common questions about surrogacy in Canada, for intended parents, surrogates, and anyone just starting to explore.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/faq',
  },
};

const sections = [
  {
    label: 'Getting Started',
    id: 'getting-started',
    questions: [
      {
        q: 'What is surrogacy?',
        a: 'Surrogacy is an arrangement where a woman (the surrogate) carries a pregnancy for another person or couple (the intended parents). In Canada, surrogacy is altruistic: surrogates are reimbursed for legitimate expenses but cannot receive a fee for carrying. It\'s a legally protected, well-established path to parenthood.',
      },
      {
        q: 'How does gestational surrogacy work?',
        a: 'In gestational surrogacy (the only type CSO facilitates) the surrogate has no genetic connection to the baby. An embryo created using the intended parents\' (or donors\') genetic material is transferred to the surrogate\'s uterus via IVF. The surrogate carries the pregnancy to term and the intended parents are the legal parents.',
      },
      {
        q: 'How long does the surrogacy process take?',
        a: 'From the time you begin working with CSO, most families are matched within 3–6 months and hold their baby within 18–24 months. The timeline depends on matching, embryo availability, and how quickly medical and legal steps are completed.',
      },
      {
        q: 'How much does surrogacy cost in Canada?',
        a: 'Total costs typically range from $80,000–$120,000 CAD. This includes the agency fee, surrogate reimbursements (lost wages, travel, medications, etc.), legal fees for both parties, and clinic costs. Medical procedures through your fertility clinic are not included in agency fees. Our programs page has a detailed breakdown.',
      },
      {
        q: 'What\'s the difference between using an agency and going independent?',
        a: 'An agency like CSO handles matching, screening, case management, and legal coordination. An independent journey means you find your own surrogate and manage everything yourself. It\'s possible, but complex. We offer a resource for independent journeys too. See our resources page.',
      },
      {
        q: 'Is surrogacy legal in Canada?',
        a: 'Yes. Surrogacy is governed by the Assisted Human Reproduction Act (2004). Altruistic surrogacy is fully legal. Commercial surrogacy (paying a surrogate a fee beyond expenses) is not permitted. Canada is consistently regarded as one of the safest and most family-friendly countries for surrogacy in the world.',
      },
    ],
  },
  {
    label: 'For Intended Parents',
    id: 'intended-parents',
    questions: [
      {
        q: 'Can a single person use surrogacy?',
        a: 'Absolutely. Single men and single women are among our intended parents. There\'s no legal requirement to be in a couple. If you\'re a single man using a donor egg plus a surrogate, we\'ll coordinate both sides of that process.',
      },
      {
        q: 'Can LGBTQ+ couples use CSO?',
        a: 'Yes, and they do, frequently. More than half of CSO\'s intended parent families are LGBTQ+. Same-sex male couples, lesbian couples, non-binary and trans parents are all welcome and fully supported. Canada\'s legal framework protects all family types.',
      },
      {
        q: 'Can international intended parents use CSO?',
        a: 'Yes. We work with families from the USA, UK, Australia, Israel, and Western Europe, among others. International families face some additional steps around embryo transport, travel planning, and citizenship documentation for their baby. We\'ve done this many times and know how to navigate it.',
      },
      {
        q: 'Do I need to have my own embryos ready before I start?',
        a: 'No. Many families start the process before their embryos are created. We can begin matching while you\'re completing IVF or working with an egg donor. Timing is coordinated so things align when the embryo is ready.',
      },
      {
        q: 'What happens if the embryo transfer fails?',
        a: 'Failed transfers are an unfortunate reality of IVF. Your surrogate\'s contract will outline the terms for additional transfer attempts. CSO supports both you and your surrogate through this emotionally difficult time, and we work with your clinic to plan next steps.',
      },
      {
        q: 'Can I be present at the birth?',
        a: 'Yes, and most families are. Being in the room (or just outside) when your baby is born is a moment most intended parents describe as the most extraordinary of their lives. This is discussed with your surrogate during the matching process so everyone is on the same page.',
      },
    ],
  },
  {
    label: 'For Surrogates',
    id: 'surrogates',
    questions: [
      {
        q: 'Do I need to have had my own children to become a surrogate?',
        a: 'Yes. Surrogates must have had at least one successful, uncomplicated pregnancy and delivery. This requirement exists to protect your health: it confirms that your body can carry a pregnancy safely and that you understand what pregnancy involves.',
      },
      {
        q: 'How much does a surrogate receive in Canada?',
        a: 'Surrogates in Canada don\'t receive a fee; surrogacy here is altruistic. However, all pregnancy-related expenses are fully reimbursed: lost wages, medical travel, medications, maternity clothing, childcare, housekeeping, and more. Total reimbursements typically range from $25,000–$30,000.',
      },
      {
        q: 'Can a surrogate use her own eggs?',
        a: 'No. In gestational surrogacy, the surrogate has no genetic connection to the baby. The embryo is created from the intended parents\' or donors\' genetic material. This is both a legal and medical requirement in Canadian surrogacy arrangements.',
      },
      {
        q: 'What happens emotionally after birth?',
        a: 'This is one of the most important conversations we have with surrogates before matching. Most surrogates describe a sense of joy and completion after birth, not loss, because they never saw the baby as theirs. That said, we provide full emotional support and counselling throughout and after the journey.',
      },
      {
        q: 'How does matching work for surrogates?',
        a: 'Once your application is approved, we present you with intended parent profiles that we think are a good fit. You review them. We arrange an introduction call. If it feels right on both sides, we move forward. You always have the right to decline a match. No questions asked.',
      },
      {
        q: 'Is there an age limit for surrogates?',
        a: 'Yes. Surrogates must be between 21 and 42 years old. This aligns with medical guidelines for safe pregnancy and is a standard requirement across reputable agencies and clinics.',
      },
    ],
  },
  {
    label: 'Legal & Medical',
    id: 'legal-medical',
    questions: [
      {
        q: 'Is a surrogacy contract legally enforceable in Canada?',
        a: 'Surrogacy agreements are legal documents, but their enforceability varies by province. What\'s most important is the parentage order: a court order obtained before or after birth that legally names the intended parents as the child\'s parents. This is what matters. CSO coordinates legal counsel for both parties.',
      },
      {
        q: 'Who goes on the birth certificate?',
        a: 'The intended parents. In most provinces, a pre-birth order is obtained so that intended parents\' names appear on the birth certificate from the moment it\'s issued. In some provinces, this happens post-birth. Either way, the intended parents are the legal parents.',
      },
      {
        q: 'Which laws apply to surrogacy in Canada?',
        a: 'The federal Assisted Human Reproduction Act governs what is and isn\'t permitted (altruistic yes, commercial no). Provincial family law governs parentage. Each province has slightly different rules for parentage orders, which is why having a qualified family lawyer is essential.',
      },
      {
        q: 'Does the surrogate have any parental rights?',
        a: 'No. Once a parentage order is in place, the surrogate has no parental rights or responsibilities. In gestational surrogacy, she also has no genetic connection to the child. Canadian courts have been consistently clear on this.',
      },
      {
        q: 'Do I need my own lawyer as an intended parent?',
        a: 'Yes. Both the intended parents and the surrogate must have independent legal counsel. This is a requirement, not a suggestion. CSO coordinates your surrogate\'s lawyer (paid for by you). You will need to retain your own family law lawyer separately.',
      },
      {
        q: 'What about citizenship for international IPs\' babies?',
        a: 'A baby born in Canada is a Canadian citizen by birth. International intended parents will need to work with their home country\'s embassy or consulate to establish citizenship or travel documents for their child. This process varies by country. CSO and our partner lawyers are experienced in supporting families through this.',
      },
    ],
  },
  {
    label: 'Working With CSO',
    id: 'working-with-cso',
    questions: [
      {
        q: 'How long has CSO been operating?',
        a: 'Since 1992. CSO was founded by Joanne Price, Canada\'s first surrogate, after her own surrogacy experience. Her daughter Robyn now leads the organization. Over 34 years, we\'ve supported more than 2,500 families.',
      },
      {
        q: 'What does the CSO agency fee cover?',
        a: 'The agency fee covers surrogate recruitment and screening, background checks, matching, case management throughout the pregnancy, expense coordination, and ongoing support for both parties. It does not cover legal fees, medical costs, or direct surrogate reimbursements; those are separate.',
      },
      {
        q: 'How many active surrogates does CSO have?',
        a: 'We maintain an active pool of screened surrogates across Canada at all times. The number fluctuates, but we actively recruit so that matches can happen in a reasonable timeframe. When you start your journey with us, we\'ll give you a realistic picture of current availability.',
      },
      {
        q: 'What support do surrogates get from CSO?',
        a: 'Surrogates are assigned a dedicated support coordinator, given access to our surrogate community, receive full expense reimbursement management, legal coordination, and emotional support throughout and after the journey. We take our responsibility to surrogates very seriously.',
      },
      {
        q: 'Can I switch case managers if it\'s not a good fit?',
        a: 'Yes. We want you to feel genuinely supported, not just assigned to someone. If a relationship isn\'t working, tell us. We\'ll find a better fit.',
      },
      {
        q: 'How do I get started with CSO?',
        a: 'The easiest first step is a free consultation call with Robyn or one of our senior coordinators. No pressure, no commitment. Just a real conversation about your situation and what surrogacy through CSO looks like. You can book at canadiansurrogacyoptions.com/contact or call us directly.',
      },
    ],
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: sections.flatMap(s =>
    s.questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <style>{`
        .faq-body { font-family: 'Jost', sans-serif; color: #2d2d2d; background: #fff; line-height: 1.7; font-weight: 300; }
        .faq-body a { color: #6B3FA0; text-decoration: none; }
        .faq-body a:hover { text-decoration: underline; }
        .faq-hero { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 72px 24px 56px; }
        .faq-hero h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 500; line-height: 1.15; margin-bottom: 18px; }
        .faq-hero p { font-size: 1.15rem; max-width: 580px; margin: 0 auto; opacity: 0.9; }
        .btn { display: inline-block; background: #3D1A6E; color: #fff !important; padding: 14px 32px; border-radius: 50px; font-size: 1rem; font-weight: 600; letter-spacing: 0.03em; transition: background 0.2s; text-decoration: none !important; }
        .btn:hover { background: #6B3FA0; }
        .btn-white { background: #fff; color: #3D1A6E !important; }
        .btn-white:hover { background: #E8E0F5; }
        .faq-nav { background: #E8E0F5; padding: 20px 24px; }
        .faq-nav-inner { max-width: 860px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 10px 20px; }
        .faq-nav-inner a { font-size: 0.9rem; color: #3D1A6E; font-weight: 600; text-decoration: none; padding: 6px 16px; border-radius: 20px; background: #fff; border: 1px solid #c4adea; transition: background 0.2s; }
        .faq-nav-inner a:hover { background: #3D1A6E; color: #fff; }
        .faq-section { max-width: 860px; margin: 0 auto; padding: 52px 24px; border-bottom: 1px solid #E8E0F5; }
        .faq-section:last-child { border-bottom: none; }
        .section-label { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: #9B7FC7; margin-bottom: 10px; display: block; }
        h2.faq-h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3.5vw, 2.4rem); font-weight: 500; color: #3D1A6E; margin-bottom: 8px; line-height: 1.2; }
        .divider-left { width: 60px; height: 4px; background: #9B7FC7; margin: 16px 0 36px; border-radius: 2px; }
        .faq-list { display: flex; flex-direction: column; gap: 0; }
        .faq-item { border-bottom: 1px solid #E8E0F5; padding: 22px 0; }
        .faq-item:last-child { border-bottom: none; }
        .faq-item h3 { font-size: 1.05rem; color: #3D1A6E; font-weight: 600; margin-bottom: 10px; line-height: 1.4; }
        .faq-item p { font-size: 0.95rem; color: #444; line-height: 1.75; }
        .faq-cta { background: linear-gradient(135deg, #3D1A6E 0%, #6B3FA0 100%); color: #fff; text-align: center; padding: 64px 24px; }
        .faq-cta h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 500; margin-bottom: 14px; }
        .faq-cta p { font-size: 1.05rem; opacity: 0.9; max-width: 520px; margin: 0 auto 28px; }
        @media (max-width: 600px) { .faq-hero { padding: 52px 20px 40px; } }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="faq-body">

        {/* HERO */}
        <section className="faq-hero">
          <h1>Frequently Asked Questions</h1>
          <p>34 years of questions, answered. If something isn&apos;t here, call us. We love talking through the details.</p>
        </section>

        {/* SECTION NAV */}
        <nav className="faq-nav" aria-label="FAQ sections">
          <div className="faq-nav-inner">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}>{s.label}</a>
            ))}
          </div>
        </nav>

        {/* FAQ SECTIONS */}
        {sections.map(section => (
          <div key={section.id} id={section.id} className="faq-section">
            <span className="section-label">{section.label}</span>
            <h2 className="faq-h2">{section.label}</h2>
            <div className="divider-left" />
            <div className="faq-list">
              {section.questions.map(faq => (
                <div key={faq.q} className="faq-item">
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <section className="faq-cta">
          <h2>Still Have Questions?</h2>
          <p>The best answers come from a real conversation. Book a free call with our team. No pressure, no sales pitch, just honest information.</p>
          <a href="/contact" className="btn btn-white">Book a Free Call</a>
        </section>

      </div>
    </>
  );
}
