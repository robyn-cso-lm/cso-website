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
    <div className="rows">
    <div>
    <h3>Self-paced · CAD $997</h3>
    <p>For founders who want to work independently through the modules, templates and scripts, with a monthly group call.</p>
    </div>
    <div>
    <h3>Done With You · CAD $3,997</h3>
    <p>For founders looking for live cohort calls, one-to-one time and feedback on their documents as they prepare a launch plan.</p>
    </div>
    </div>
    <p>Ask about availability, dates and exactly what support is included before choosing a program.</p>
    <Waitlist />
    </section>
    </main>
    <footer>
    <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/contact">Purchase support</a>
    </footer>
  </div>;
}
