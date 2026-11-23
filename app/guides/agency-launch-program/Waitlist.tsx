'use client';

import { useRef } from 'react';

const email = 'robyn@canadiansurrogacyoptions.com';
const draft = 'mailto:' + email + '?subject=' + encodeURIComponent('Agency Launch Program waitlist') + '&body=' + encodeURIComponent('Hi Robyn,\n\nPlease add me to the Agency Launch Program waitlist and email me when enrollment opens.\n\nThank you,\n');

export default function Waitlist() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button type="button" className="buy" onClick={() => dialog.current?.showModal()}>Join the program waitlist</button>
    <dialog ref={dialog} className="waitlistDialog" aria-labelledby="waitlist-title">
      <h2 id="waitlist-title">Join the founder waitlist</h2>
      <p>Send Robyn a waitlist request. Your email app will open with a short message you can edit and send.</p>
      <a className="buy" href={draft}>Email Robyn to join</a>
      <p>Prefer to write your own? Email {email} with the subject “Agency Launch Program waitlist”.</p>
      <form method="dialog"><button type="submit">Close</button></form>
    </dialog>
  </>;
}
