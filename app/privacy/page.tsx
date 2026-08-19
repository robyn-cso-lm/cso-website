import type { Metadata } from 'next';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Canadian Surrogacy Options collects, uses, protects, and manages personal information.',
  alternates: { canonical: 'https://canadiansurrogacyoptions.com/privacy' },
};

export default function PrivacyPage() {
  return <>
    <section className={styles.hero}><div className={styles.heroInner}>
      <p className={styles.eyebrow}>Your information matters</p>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.updated}>Last updated August 19, 2026</p>
    </div></section>
    <main className={styles.content}>
      <p>Canadian Surrogacy Options Inc. (CSO) respects the privacy of intended parents, surrogates, donors, families, website visitors, and people who contact us through advertising or social media. This policy explains what we collect, why we use it, and the choices available to you.</p>

      <h2>Information we collect</h2>
      <ul>
        <li>Contact details such as your name, email address, telephone number, and location.</li>
        <li>Information you provide in an inquiry, consultation, application, questionnaire, email, text, or social media message.</li>
        <li>Program and eligibility information, which may include family, fertility, pregnancy, medical, or other sensitive details when you choose to provide them.</li>
        <li>Website and advertising information such as pages visited, referral links, campaign, advertisement and form identifiers, device information, cookies, and similar analytics.</li>
        <li>Records of our communications and your consent or communication preferences.</li>
      </ul>

      <h2>How we use information</h2>
      <p>We use personal information to answer questions, understand which program may fit, assess applications, provide services and support, maintain records, prevent duplicate or unwanted contact, improve our website and advertising, protect our systems, and meet legal or regulatory obligations.</p>

      <h2>Meta lead forms and social media</h2>
      <p>If you submit a Facebook or Instagram lead form, Meta provides the information you entered along with source information such as the Page, campaign, advertisement, and form. We use that information to respond and direct your inquiry to the appropriate CSO, CSO Surrogates, CAMICA, or Little Miracles program. We do not rely on a name, photograph, or presumed gender to decide what someone wants.</p>

      <h2>When information is shared</h2>
      <p>We do not sell personal information. We may share information with authorized CSO staff and service providers that support our website, portal, communications, analytics, security, and program operations. Information may also be shared with clinics, legal professionals, mental health professionals, insurers, or other journey participants when it is necessary for services and authorized by you, or when required by law.</p>

      <h2>Storage and safeguards</h2>
      <p>We use administrative, technical, and organizational safeguards intended to protect personal information. Access is limited to people who need it for their work. No internet or storage system is completely secure, so we cannot guarantee absolute security.</p>

      <h2>Retention</h2>
      <p>We keep information only as long as reasonably needed for the purposes described here, to maintain appropriate business and service records, and to meet legal, accounting, dispute, security, or consent requirements. Retention periods vary with the type of record and the relationship.</p>

      <h2>Your choices</h2>
      <p>You may ask to access or correct your information, withdraw consent where applicable, change communication preferences, or request deletion. Some records may need to be retained where permitted or required by law. See our <a href="/data-deletion">Data Deletion Instructions</a> for the request process.</p>

      <h2>Cookies and analytics</h2>
      <p>Our website may use cookies and similar technologies for essential functions, analytics, advertising measurement, and remembering preferences. Browser settings can limit cookies, although some website functions may be affected.</p>

      <h2>Children</h2>
      <p>Our services and website are not directed to children. Please do not submit a child&apos;s personal information through a public inquiry or advertising form.</p>

      <h2>Contact us</h2>
      <p>Questions or privacy requests can be sent to <a href="mailto:robyn@canadiansurrogacyoptions.com">robyn@canadiansurrogacyoptions.com</a> or mailed to Canadian Surrogacy Options Inc., Unit 1-180 Shearson Crescent, Cambridge, Ontario N1T 1P4, Canada.</p>
      <p className={styles.notice}>Privacy obligations can vary by situation and jurisdiction. CSO handles personal information in accordance with applicable Canadian privacy requirements, including PIPEDA and applicable provincial requirements.</p>
    </main>
  </>;
}
