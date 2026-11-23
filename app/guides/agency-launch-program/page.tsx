import '../editorial.css';
import Waitlist from './Waitlist';

export const metadata = { title: 'Agency Launch Program | Founder Training', description: 'Explore the curriculum and compare two program options.' };

export default function LandingPage() {
  return <div className="page">
    <main>
    <section className="hero">
    <div>
    <p className="label">Agency Launch Program</p>
    <h1>Your first inquiry arrives. What happens next?</h1>
    <p>Before an agency takes its first call, someone has to decide who handles intake, how a match moves forward and where responsibility changes hands. Work through those decisions with an eight-module curriculum for prospective surrogacy and egg donation agency founders.</p>
    <a className="buy" href="#options">Compare program options</a>
    </div>
    <aside className="cover">
    <span className="label">Agency Launch Program</span>
    <strong>The founder’s<br />workbook series</strong>
    <span>Foundations through launch · Eight modules</span>
    </aside>
    </section>
    <section>
    <h2>Inside the workbooks</h2>
    <div className="rows">
    <div>
    <h3>Foundations &amp; local requirements</h3>
    <p>Map your agency’s role and prepare questions for qualified local advisers.</p>
    </div>
    <div>
    <h3>Inquiry, intake &amp; screening</h3>
    <p>Trace an inquiry from first contact through intake. Decide who coordinates each step and who makes screening decisions.</p>
    </div>
    <div>
    <h3>Matching &amp; financial workflows</h3>
    <p>Plan introductions, handoffs and the questions to resolve with counsel about contracts, money and escrow.</p>
    </div>
    <div>
    <h3>Support, launch &amp; growth</h3>
    <p>Outline how you’ll support a journey after matching and what has to be ready before opening day.</p>
    </div>
    </div>
    </section>
    <aside className="sample">
    <span className="label">A planning exercise</span>
    <h2>Walk through the first call.</h2>
    <blockquote>It’s Friday at 4:45. A family emails about matching. The person who usually handles intake is away until Tuesday.</blockquote>
    <p>Draft the two sentences you would send today. Who can answer the family’s immediate question? Who owns the Tuesday follow-up? Where would a colleague find that decision on Monday morning?</p>
    </aside>
    <section id="options">
    <h2>Choose your level of support.</h2>
    <p>Both options include 12 months of access to eight modules, companion workbooks, templates and scripts. Each also includes three 60-minute group Q&amp;A calls with Robyn, one per month during the first 90 days.</p>
    <div className="rows">
    <div>
    <h3>Self-paced · CAD $997</h3>
    <p className="label">10 self-paced spots in the first round</p>
    <p>Work through the curriculum on your own schedule. Use the checklists to review your intake workflow and launch plan, then bring your questions to the monthly calls. Support in this tier is delivered in the group.</p>
    </div>
    <div>
    <h3>Done With You · CAD $3,997</h3>
    <p className="label">4 coached spots in the first round</p>
    <p>Build your operating plan with Robyn over eight weeks. Alongside the shared curriculum and monthly Q&amp;As, you receive:</p>
    <ul style={{ listStyle: 'disc', paddingLeft: '1.4em' }}>
      <li><strong>Four 75-minute founder workshops</strong> in weeks 1, 3, 5 and 7.</li>
      <li><strong>Two private 45-minute calls</strong> with Robyn: a week-one kickoff and a week-eight launch-readiness review.</li>
      <li><strong>Two written document reviews.</strong> Submit your intake and follow-up workflow by week 3 and your 90-day operating plan by week 6. Each review covers one submission of up to five pages, with comments within five business days.</li>
      <li><strong>Private email support</strong> for short implementation questions during the eight weeks, with replies within two business days.</li>
    </ul>
    </div>
    </div>
    <p>Enrollment is currently waitlist only. Email Robyn to hear when the first round opens. You can mention which option interests you; joining the list is free and does not reserve a spot.</p>
    <Waitlist />
    </section>
    </main>
    <footer>
    <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
    </footer>
  </div>;
}
