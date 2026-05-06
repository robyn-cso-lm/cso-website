import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About Us | Canadian Surrogacy Options',
  description: 'Founded in 1992 by Joanne Wright, Canadian Surrogacy Options is Canada\'s very first surrogacy agency. Meet Robyn Price and learn our story of building families for over 30 years.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Our Story</p>
          <h1 className={styles.heroTitle}>
            Built on love.<br />Running on legacy.
          </h1>
          <p className={styles.heroSub}>
            Canada&rsquo;s first surrogacy agency, founded 1992. Over three decades of walking
            beside families and surrogates through one of life&rsquo;s most profound journeys.
          </p>
        </div>
      </section>

      {/* Founding Story */}
      <section className={styles.founding}>
        <div className={styles.foundingInner}>
          <div className={styles.foundingText}>
            <h2 className={styles.sectionTitle}>Where it began.</h2>
            <p className={styles.body}>
              In 1992, a woman named Joanne Wright started something remarkable in Cambridge, Ontario.
              At a time when surrogacy was barely spoken about in Canada, when most people didn&rsquo;t
              understand it, let alone support it, Joanne believed deeply that every person who
              wanted to become a parent deserved a path to get there.
            </p>
            <p className={styles.body}>
              She built Canadian Surrogacy Options from the ground up, one family at a time, with
              compassion as her compass and integrity as her standard. She became a pioneer in a
              field that didn&rsquo;t yet have a roadmap.
            </p>
            <p className={styles.body}>
              And she raised her daughter in it.
            </p>
          </div>
          <div className={styles.foundingCard}>
            <div className={styles.foundingYear}>1992</div>
            <div className={styles.foundingLabel}>Year Founded</div>
            <div className={styles.foundingDivider} />
            <p className={styles.foundingNote}>
              Canada&rsquo;s very first surrogacy agency, established in Cambridge, Ontario
              before surrogacy was widely understood or accepted in this country.
            </p>
          </div>
        </div>
      </section>

      {/* Robyn's Story */}
      <section className={styles.robyn}>
        <div className={styles.robynInner}>
          <div className={styles.robynPhoto}>
            <div className={styles.robynPhotoPlaceholder}>
              <span>R</span>
            </div>
          </div>
          <div className={styles.robynText}>
            <p className={styles.eyebrowDark}>Executive Director</p>
            <h2 className={styles.robynTitle}>Robyn Price</h2>
            <blockquote className={styles.robynQuote}>
              &ldquo;I grew up in this field. My mother founded this agency when I was four years old.
              She spent years preparing me, trusting me, handing me the pieces of something she had
              built from love.&rdquo;
            </blockquote>
            <p className={styles.body}>
              Robyn didn&rsquo;t choose surrogacy as a career. She was born into it. She spent
              her childhood watching her mother change lives, and her adulthood learning every facet
              of what it takes to do this work with grace. When Joanne passed the torch, Robyn
              was ready.
            </p>
            <p className={styles.body}>
              Today, Robyn leads CSO with the same values her mother built it on: honesty, warmth,
              and a fierce commitment to every single person who walks through the door. She
              personally oversees every match, every journey, every family.
            </p>
            <p className={styles.body}>
              She&rsquo;s not a figurehead. She picks up the phone. She texts back. She shows up.
            </p>
            <div className={styles.robynContact}>
              <a href="mailto:robyn@canadiansurrogacyoptions.com" className={styles.robynEmail}>
                robyn@canadiansurrogacyoptions.com
              </a>
              <a href="tel:+18774014175" className={styles.robynPhone}>
                1-877-401-4175 (call or text)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className={styles.valuesInner}>
          <h2 className={styles.sectionTitleCentered}>What we stand for.</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤍</div>
              <h3 className={styles.valueTitle}>Compassion First</h3>
              <p className={styles.valueText}>
                We know this journey is emotional and complex. We meet you exactly where you are,
                without judgment, without rushing, without scripts.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🔍</div>
              <h3 className={styles.valueTitle}>Radical Transparency</h3>
              <p className={styles.valueText}>
                No hidden fees. No vague timelines. No sugar-coating. We tell you what to
                expect, including the hard parts, so you can make decisions with confidence.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🛡️</div>
              <h3 className={styles.valueTitle}>Unwavering Support</h3>
              <p className={styles.valueText}>
                From your first question to the moment you bring your baby home, we&rsquo;re
                with you. Not just on paper. Actually, genuinely, with you.
              </p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌈</div>
              <h3 className={styles.valueTitle}>Every Family Welcome</h3>
              <p className={styles.valueText}>
                LGBTQ+ families, single parents, couples facing infertility: we believe
                every person who wants to become a parent deserves that chance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className={styles.numbers}>
        <div className={styles.numbersInner}>
          <div className={styles.numberStat}>
            <span className={styles.numberNum}>2,500+</span>
            <span className={styles.numberLabel}>Families built</span>
          </div>
          <div className={styles.numberDivider} />
          <div className={styles.numberStat}>
            <span className={styles.numberNum}>30+</span>
            <span className={styles.numberLabel}>Years of experience</span>
          </div>
          <div className={styles.numberDivider} />
          <div className={styles.numberStat}>
            <span className={styles.numberNum}>#1</span>
            <span className={styles.numberLabel}>Canada&rsquo;s first agency</span>
          </div>
          <div className={styles.numberDivider} />
          <div className={styles.numberStat}>
            <span className={styles.numberNum}>Cambridge</span>
            <span className={styles.numberLabel}>Ontario, Canada</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to start your story?</h2>
          <p className={styles.ctaSub}>
            There are no silly questions. Every journey begins with a conversation.
          </p>
          <div className={styles.ctaButtons}>
            <a
              href="https://calendly.com/cso-robyn"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaPrimary}
            >
              Book a Free Call with Robyn
            </a>
            <Link href="/programs" className={styles.ctaSecondary}>
              See Our Programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
