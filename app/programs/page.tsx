import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './programs.module.css';

export const metadata: Metadata = {
  title: 'Surrogacy Programs & Services',
  description: 'Explore Canadian Surrogacy Options\' agency programs — Foundation, Guided Journey, Priority Match, and Independent Journey — plus digital guides and resources for your surrogacy path.',
  alternates: {
    canonical: 'https://canadiansurrogacyoptions.com/programs',
  },
  openGraph: {
    title: 'Surrogacy Programs & Services | Canadian Surrogacy Options',
    description: 'Find the program that\'s right for your family. From first-time explorers to families ready to match now.',
    url: 'https://canadiansurrogacyoptions.com/programs',
  },
};

const CALENDLY = 'https://calendly.com/cso-robyn';

// Stripe links read server-side
function getStripeLinks() {
  return {
    starter: process.env.STRIPE_STARTER_LINK || '#',
    roadmap: process.env.STRIPE_ROADMAP_LINK || '#',
    indie: process.env.STRIPE_INDIE_LINK || '#',
    surrogate: process.env.STRIPE_SURROGATE_LINK || '#',
    profile: process.env.STRIPE_PROFILE_LINK || '#',
  };
}

export default function ProgramsPage() {
  const stripe = getStripeLinks();

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Canadian Surrogacy Options</p>
          <h1 className={styles.heroH1}>Find the path that&rsquo;s right for your family</h1>
          <p className={styles.heroSub}>
            From your first question to the moment you hold your baby, we&rsquo;re here.
            Every family&rsquo;s journey is different &mdash; our programs are designed to meet you
            exactly where you are.
          </p>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.heroCTA}>
            Talk to Robyn &mdash; it&rsquo;s free
          </a>
        </div>
      </section>

      {/* Agency Programs */}
      <section className={styles.agencySection} id="programs">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Agency Programs</h2>
          <p className={styles.sectionSub}>
            Full-service support for families who want an experienced partner by their side.
          </p>
          <div className={styles.programGrid}>

            {/* Foundation */}
            <div className={styles.programCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Foundation</h3>
                <p className={styles.cardTagline}>For families who are informed and ready</p>
              </div>
              <ul className={styles.featureList}>
                <li>Surrogate matching coordination</li>
                <li>Legal and clinic referrals</li>
                <li>Journey milestone support</li>
                <li>Access to CSO&rsquo;s screened surrogate pool</li>
              </ul>
              <div className={styles.cardFooter}>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.btnOutline}>
                  Book a Free Call
                </a>
                <p className={styles.priceNote}>From $9,500 + HST</p>
              </div>
            </div>

            {/* Guided Journey */}
            <div className={styles.programCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Guided Journey</h3>
                <p className={styles.cardTagline}>For families who want a trusted partner</p>
              </div>
              <ul className={styles.featureList}>
                <li>Everything in Foundation</li>
                <li>Dedicated case management</li>
                <li>Regular journey check-ins</li>
                <li>IP profile creation and presentation</li>
                <li>Matching advocacy and surrogate introductions</li>
              </ul>
              <div className={styles.cardFooter}>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.btnOutline}>
                  Book a Free Call
                </a>
                <p className={styles.priceNote}>From $18,500 + HST</p>
              </div>
            </div>

            {/* Priority Match — Featured */}
            <div className={`${styles.programCard} ${styles.featured}`}>
              <div className={styles.featuredBadge}>Most Popular</div>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Priority Match</h3>
                <p className={styles.cardTagline}>For families who are ready now</p>
              </div>
              <ul className={styles.featureList}>
                <li>Everything in Guided Journey</li>
                <li>Priority matching</li>
                <li>Doubled surrogate recruitment</li>
                <li>Faster average match timeline</li>
                <li>Split payment structure available</li>
              </ul>
              <div className={styles.cardFooter}>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.btnFilled}>
                  Book a Free Call
                </a>
              </div>
            </div>

            {/* Independent Journey */}
            <div className={styles.programCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Independent Journey</h3>
                <p className={styles.cardTagline}>For families who want to navigate their own journey</p>
              </div>
              <ul className={styles.featureList}>
                <li>Comprehensive journey checklist</li>
                <li>Legal and clinic referrals</li>
                <li>Access to CSO document templates</li>
                <li>Consultation calls as needed</li>
                <li>Optional receipt management add-on</li>
              </ul>
              <div className={styles.cardFooter}>
                <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.btnOutline}>
                  Book a Free Call
                </a>
                <p className={styles.priceNote}>Contact for pricing</p>
              </div>
            </div>

          </div>

          {/* Concierge Teaser */}
          <div className={styles.conciergeTeaser} id="concierge">
            <div className={styles.conciergeLeft}>
              <p className={styles.conciergeEyebrow}>By Private Inquiry Only</p>
              <h3 className={styles.conciergeTitle}>The Concierge Experience</h3>
              <p className={styles.conciergeText}>
                For families who require complete discretion, cross-border expertise, or a fully
                bespoke journey with Robyn personally involved at every stage. This is not a
                standard program &mdash; it is a private arrangement.
              </p>
            </div>
            <div className={styles.conciergeRight}>
              <Link href="/private-inquiry" className={styles.conciergeBtn}>
                Submit a Private Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bridge Quote */}
      <section className={styles.bridge}>
        <div className={styles.bridgeInner}>
          <blockquote className={styles.bridgeQuote}>
            &ldquo;The timing of your journey matters less than the quality of the support around you.
            When you&rsquo;re ready &mdash; whether that&rsquo;s today or in six months &mdash; I want to make sure
            you have the right information to move forward with confidence.&rdquo;
          </blockquote>
          <cite className={styles.bridgeCite}>
            <strong>Robyn Price</strong>, Executive Director
          </cite>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.bridgeCTA}>
            Book a Free 30-Minute Call
          </a>
        </div>
      </section>

      {/* Digital Products */}
      <section className={styles.digitalSection} id="digital">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Digital Guides &amp; Resources</h2>
          <p className={styles.sectionSub}>
            Not ready to start? Start learning. Our digital guides give you the information
            you need to move forward at your own pace.
          </p>
          <div className={styles.productGrid}>

            <div className={styles.productCard}>
              <div className={styles.productIcon}>📋</div>
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>&ldquo;Is Surrogacy Right For Me?&rdquo;</h3>
                <p className={styles.productPrice}>$27</p>
              </div>
              <ul className={styles.productFeatures}>
                <li>How Canadian surrogacy actually works</li>
                <li>Realistic costs and timeline breakdown</li>
                <li>Legal framework overview</li>
                <li>What to look for in an agency</li>
                <li>Questions to ask before you sign anything</li>
              </ul>
              <a href={stripe.starter} className={styles.productBtn}>
                Get the Guide
              </a>
              <p className={styles.productNote}>Instant download. PDF.</p>
            </div>

            <div className={styles.productCard}>
              <div className={styles.productIcon}>🗺️</div>
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>&ldquo;The Canadian Surrogacy Roadmap&rdquo;</h3>
                <p className={styles.productPrice}>$97</p>
              </div>
              <ul className={styles.productFeatures}>
                <li>Full journey timeline with milestones</li>
                <li>Surrogate matching prep worksheets</li>
                <li>Legal prep guide and glossary</li>
                <li>Clinic considerations by province</li>
                <li>Budget tracker and cost planner</li>
              </ul>
              <a href={stripe.roadmap} className={styles.productBtn}>
                Get the Roadmap
              </a>
            </div>

            <div className={styles.productCard}>
              <div className={styles.productIcon}>🧭</div>
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>&ldquo;Independent Journey Checklist&rdquo;</h3>
                <p className={styles.productPrice}>$67</p>
              </div>
              <ul className={styles.productFeatures}>
                <li>Full independent journey checklist</li>
                <li>Legal milestones and timing guide</li>
                <li>Medical coordination checklist</li>
                <li>What your lawyer needs and when</li>
                <li>Common mistakes and how to avoid them</li>
                <li>Surrogate reimbursement tracking template</li>
              </ul>
              <a href={stripe.indie} className={styles.productBtn}>
                Get the Checklist
              </a>
            </div>

            <div className={styles.productCard}>
              <div className={styles.productIcon}>💜</div>
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>&ldquo;Surrogate Readiness Guide&rdquo;</h3>
                <p className={styles.productPrice}>$47</p>
              </div>
              <ul className={styles.productFeatures}>
                <li>Canadian eligibility requirements</li>
                <li>What the screening process looks like</li>
                <li>Reimbursement model explained</li>
                <li>How to choose the right agency</li>
                <li>Talking to your partner and family</li>
              </ul>
              <a href={stripe.surrogate} className={styles.productBtn}>
                Get the Guide
              </a>
            </div>

            <div className={styles.productCard}>
              <div className={styles.productIcon}>✨</div>
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>&ldquo;IP Profile Template Pack&rdquo;</h3>
                <p className={styles.productPrice}>$67</p>
              </div>
              <ul className={styles.productFeatures}>
                <li>Professionally designed profile template</li>
                <li>Story prompts and bio worksheets</li>
                <li>Photo selection guide</li>
                <li>What surrogates actually want to know</li>
                <li>Canva-compatible format</li>
              </ul>
              <a href={stripe.profile} className={styles.productBtn}>
                Get the Template Pack
              </a>
            </div>

            <div className={`${styles.productCard} ${styles.receiptCard}`}>
              <div className={styles.productIcon}>🧾</div>
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>&ldquo;Surrogate Expense Management&rdquo;</h3>
                <p className={styles.productPrice}>From $199/mo</p>
              </div>
              <ul className={styles.productFeatures}>
                <li>CSO holds funds in trust on your behalf</li>
                <li>Receipt submission and review</li>
                <li>Monthly expense statements</li>
                <li>Approval tracking and documentation</li>
                <li>Dispute support if needed</li>
                <li>Full audit trail</li>
              </ul>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.productBtn}>
                Book a Call to Learn More
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Not Sure */}
      <section className={styles.notSure}>
        <div className={styles.notSureInner}>
          <h2 className={styles.notSureTitle}>Not sure where to start?</h2>
          <p className={styles.notSureText}>
            A 30-minute call with Robyn costs nothing and obligates you to nothing. Ask your
            questions, share your concerns, and leave with a clear sense of what the next step
            looks like for your family.
          </p>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={styles.notSureBtn}>
            Book Your Free Call
          </a>
        </div>
      </section>
    </>
  );
}
