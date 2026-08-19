import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Website Terms of Use',
  description: 'Terms that apply when using the Canadian Surrogacy Options website and public information.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/terms' },
};

export default function TermsPage() {
  return <>
    <section className={styles.hero}><div className={styles.heroInner}>
      <p className={styles.eyebrow}>Clear expectations</p>
      <h1 className={styles.title}>Website Terms of Use</h1>
      <p className={styles.updated}>Last updated August 19, 2026</p>
    </div></section>
    <main className={styles.content}>
      <p>These terms apply to your use of canadiansurrogacyoptions.com and public information provided by Canadian Surrogacy Options Inc. By using this website, you agree to these terms. Separate written agreements govern any paid program or professional service.</p>

      <h2>Information, not professional advice</h2>
      <p>Website content is general educational information. It is not medical, legal, psychological, tax, insurance, or financial advice and is not a substitute for advice from an appropriately qualified professional who understands your circumstances.</p>

      <h2>No guarantee of eligibility or outcome</h2>
      <p>An inquiry, application, consultation, or website result does not guarantee acceptance, matching, pregnancy, birth, timing, cost, reimbursement, compensation, legal outcome, or any other result. Medical, psychological, legal, and program decisions are made through the applicable screening and professional processes.</p>

      <h2>Canadian surrogacy</h2>
      <p>Canadian surrogacy operates under an altruistic framework. Eligible expenses may be reimbursed in accordance with applicable law and professional advice. Website content must not be understood as offering payment for surrogacy in Canada.</p>

      <h2>Accurate and appropriate use</h2>
      <p>You agree to provide accurate information, use the website lawfully, respect the privacy and rights of others, and not interfere with the website, attempt unauthorized access, introduce malicious code, scrape protected information, or use content to misrepresent CSO or another person.</p>

      <h2>Intellectual property</h2>
      <p>Unless otherwise stated, website text, design, branding, resources, and original materials belong to CSO or are used with permission. You may use public content for personal information and evaluation. Commercial reuse, republication, or modification requires prior written permission.</p>

      <h2>Third-party services and links</h2>
      <p>The website may link to portals, scheduling, payment, social media, clinics, professionals, or other third-party services. Their terms and privacy practices apply to their services. A link does not guarantee or endorse every statement, service, or outcome provided by a third party.</p>

      <h2>Availability and changes</h2>
      <p>We may update, suspend, or change website content and features. We work to keep information accurate, but information can become incomplete or outdated and the website may occasionally be unavailable.</p>

      <h2>Limitation</h2>
      <p>To the extent permitted by law, CSO is not responsible for losses arising solely from reliance on general website information, third-party content, or events outside our reasonable control. Nothing in these terms excludes rights or responsibilities that cannot legally be excluded.</p>

      <h2>Privacy</h2>
      <p>Our <a href="/privacy">Privacy Policy</a> explains how we handle personal information. Our <a href="/data-deletion">Data Deletion Instructions</a> explain how to request deletion.</p>

      <h2>Contact</h2>
      <p>Questions about these terms can be sent to <a href="mailto:robyn@canadiansurrogacyoptions.com">robyn@canadiansurrogacyoptions.com</a>.</p>
    </main>
  </>;
}
