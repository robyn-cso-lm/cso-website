import '../editorial.css';

export const metadata = { title: 'From Surrogate to Agency Team | Career Guide', description: 'Explore six agency roles and prepare for career conversations.' };

export default function LandingPage() {
  return <div className="page">
    <main>
    <section className="hero">
    <div>
    <p className="label">Career guide for former surrogates</p>
    <h1>From Surrogate to Agency Team</h1>
    <p>Maybe the part you miss is the moment someone calls with a question you once had yourself. See what agency staff do each day, which role might suit you, and how to describe your experience in an application.</p>
    <a className="buy" href="https://buy.stripe.com/fZu8wO4eGa639U9a4X8Ra09">Buy the guide · $37 CAD</a>
    <p>16-page PDF · One-time purchase. Your personal download link arrives by email and is valid for 72 hours.</p>
    </div>
    <aside className="cover" aria-hidden="true">
    <span className="label">A practical career guide</span>
    <strong>From Surrogate<br />to Agency Team</strong>
    <span>Roles · Résumés · Interviews</span>
    </aside>
    </section>
    <section>
    <h2>Which role sounds like you?</h2>
    <p>Would you rather welcome someone on their first call or be the person they turn to after a match? Open the role comparison from the guide and look for the work you would enjoy doing on an ordinary Tuesday.</p>
    <details><summary>Look inside the guide · Six agency roles</summary><a href="/guide-roles-sample.png"><img src="/guide-roles-sample.png" style={{width:"100%",maxWidth:"46rem",height:"auto"}} alt="Sample page from the guide comparing six agency roles. Open the image for full size." /></a></details>
    <h2>Prepare your application</h2>
    <div className="rows">
    <div>
    <h3>Find a role that fits</h3>
    <p>Compare intake, matching, surrogate support, donor coordination, operations and community work. Use the role checklist to see where your interests fit.</p>
    </div>
    <div>
    <h3>Write your introduction</h3>
    <p>Use the résumé and email templates to explain what you bring to a team, while keeping the private details of a journey private.</p>
    </div>
    <div>
    <h3>Prepare for an interview</h3>
    <p>Work through ten practice questions. Prepare your own questions about supervision, caseload and what happens when someone needs extra support.</p>
    </div>
    <div>
    <h3>Choose your next step</h3>
    <p>The readiness check and 30-day plan give you room to explore, arrange an informational conversation or prepare an application at your own pace.</p>
    </div>
    </div>
    </section>
    <aside className="sample">
    <span className="label">Try a résumé exercise</span>
    <h2>Put a skill into words.</h2>
    <p>Think of one thing you personally did during your journey. What did it require of you? If you coordinated appointments, for example, you might write:</p>
    <blockquote>“Coordinated appointments across several schedules and kept the people involved informed when timing changed.”</blockquote>
    <p>Use a detail that’s true of your experience and leave out names and medical information.</p>
    </aside>
    <section>
    <h2>Ready to explore agency work?</h2>
    <p>This educational guide helps you prepare for career conversations. Buying it does not provide a job, interview or hiring preference at Canadian Surrogacy Options or any other agency.</p>
    <a className="buy" href="https://buy.stripe.com/fZu8wO4eGa639U9a4X8Ra09">Get the guide · $37 CAD</a>
    </section>
    </main>
    <footer>
    <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · <a href="/contact">Purchase support</a>
    </footer>
  </div>;
}
