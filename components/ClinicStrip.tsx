import styles from './ClinicStrip.module.css';

/**
 * "Clinics we've worked with" trust strip.
 *
 * Text only by design — clinic names are trademarks of their respective
 * clinics, so logos are intentionally omitted. Wording is deliberately past
 * tense and factual so it does not imply a current partnership or endorsement.
 *
 * Self-contained: colors use the site's brand CSS variables with explicit
 * hex fallbacks, so it renders correctly even on a page/branch that hasn't
 * loaded globals.css. Drop <ClinicStrip /> into any page (homepage, About,
 * programs) to reuse it.
 */

// Canadian fertility clinics CSO's intended parents & surrogates have worked
// with. Trim or extend this list as needed.
const CLINICS = [
  'CReATe Fertility',
  'Olive Fertility',
  'Markham Fertility',
  'TRIO Fertility',
  'Generation Fertility',
  'Pacific Centre for Reproductive Medicine (PCRM)',
  'Astra Fertility',
  'Hannam Fertility',
  'Anova Fertility',
  'Victory Reproductive Care (VRC)',
  'NewLife Fertility',
  'IVF Canada',
];

export default function ClinicStrip() {
  return (
    <section className={styles.strip} aria-labelledby="clinic-strip-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Across Canada</p>
        <h2 id="clinic-strip-heading" className={styles.heading}>
          Clinics our intended parents &amp; surrogates have worked with
        </h2>
        <ul className={styles.clinicList}>
          {CLINICS.map((clinic) => (
            <li key={clinic} className={styles.clinic}>
              {clinic}
            </li>
          ))}
        </ul>
        <p className={styles.disclaimer}>
          Clinic names are the property of their respective clinics and are listed
          for reference only. Their inclusion does not imply a current partnership
          or endorsement.
        </p>
      </div>
    </section>
  );
}
