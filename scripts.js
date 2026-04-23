// ─── API Key ──────────────────────────────────────────────────────────────────
let apiKey = localStorage.getItem('cso_api_key') || '';

function showBannerStep(step) {
  // step: 'prompt' | 'input' | 'saved'
  document.getElementById('bannerPrompt').style.display = step === 'prompt' ? 'flex'  : 'none';
  document.getElementById('apiSetup').style.display     = step === 'input'  ? 'flex'  : 'none';
  document.getElementById('apiSaved').style.display     = step === 'saved'  ? 'flex'  : 'none';
}

function updateApiBanner() {
  document.getElementById('apiBanner').style.display = 'block';
  if (apiKey) {
    showBannerStep('saved');
  } else {
    showBannerStep('prompt');
  }
}
updateApiBanner();

document.getElementById('apiSetupBtn').onclick = () => showBannerStep('input');
document.getElementById('cancelKeyBtn').onclick = () => showBannerStep(apiKey ? 'saved' : 'prompt');
document.getElementById('changeKeyBtn').onclick = () => {
  document.getElementById('apiKeyInput').value = '';
  showBannerStep('input');
  document.getElementById('apiKeyInput').focus();
};

document.getElementById('saveKeyBtn').onclick = () => {
  const v = document.getElementById('apiKeyInput').value.trim();
  if (!v) return;
  // Accept any non-empty key — let the API call tell us if it's invalid
  apiKey = v;
  localStorage.setItem('cso_api_key', v);
  showBannerStep('saved');
  toast('API key saved ✓');
};

// Enter key in API input triggers save
document.getElementById('apiKeyInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('saveKeyBtn').click();
});

document.getElementById('testKeyBtn').onclick = async () => {
  const btn = document.getElementById('testKeyBtn');
  btn.textContent = 'Testing…';
  btn.disabled = true;
  try {
    await callClaude('You are a helpful assistant.', 'Reply with exactly: "Connected"');
    toast('✓ Connection works — you\'re ready to generate!');
  } catch (e) {
    toast('✗ ' + e.message, true);
  } finally {
    btn.textContent = 'Test connection';
    btn.disabled = false;
  }
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function toast(msg, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = 'toast' + (isError ? ' toast-error' : ' toast-ok');
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 3500);
}

// ─── Toggle groups ────────────────────────────────────────────────────────────
let selectedAudience = 'surrogate';
let selectedTone     = 'cheeky-edu';

function wireToggleGroup(containerId, onChange) {
  document.getElementById(containerId).addEventListener('click', e => {
    const btn = e.target.closest('.tog-btn');
    if (!btn) return;
    document.querySelectorAll(`#${containerId} .tog-btn`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    onChange(btn.dataset.val);
  });
}

wireToggleGroup('audienceBtns', v => { selectedAudience = v; });
wireToggleGroup('toneBtns',     v => { selectedTone     = v; });

// ─── Template bank ────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    aud: 'surrogate',
    title: 'What surrogacy compensation actually looks like',
    hook: '"Everyone thinks surrogates get paid a flat $50k. Here\'s what\'s actually in the contract."',
    topic: 'Break down real surrogacy compensation: base pay, monthly allowance, maternity clothes, lost wages, pumping fee, and more. Be specific and educational.',
  },
  {
    aud: 'surrogate',
    title: '5 questions to ask an agency before signing',
    hook: '"I wish someone told me this before I signed with my first agency."',
    topic: 'The 5 non-negotiable questions surrogates should ask any agency: exclusivity, communication, matching timeline, legal support, and psychological screening.',
  },
  {
    aud: 'surrogate',
    title: 'Myth: surrogates want to keep the baby',
    hook: '"I\'m so tired of this question. Let me explain why it doesn\'t work that way."',
    topic: 'Debunk the emotional attachment myth with empathy and science. Explain gestational surrogacy and the psychological preparation surrogates go through.',
  },
  {
    aud: 'donor',
    title: 'What egg donation does to your fertility',
    hook: '"Your doctor probably glossed over this part."',
    topic: 'Educate on what egg donation actually does to the body: stimulation, retrieval, recovery, and what science says about long-term fertility impact.',
  },
  {
    aud: 'donor',
    title: 'Why some donor profiles get chosen in days',
    hook: '"The difference between a profile that gets matched fast — it\'s not what you think."',
    topic: 'What IPs actually look for in donor profiles: genuine answers, personality, health history transparency. Not just looks.',
  },
  {
    aud: 'ip',
    title: '3 things IPs don\'t know about matching',
    hook: '"Nobody in the industry wants to tell you this."',
    topic: 'Honest education for intended parents: matching takes longer than agencies promise, surrogates also choose you, and the relationship matters as much as the contract.',
  },
  {
    aud: 'ip',
    title: 'Independent vs. agency surrogacy: real cost breakdown',
    hook: '"The price difference is huge. But so is the risk difference."',
    topic: 'Compare independent and agency-assisted surrogacy honestly — total costs, timeline, legal exposure, and who benefits from each path.',
  },
  {
    aud: 'ip',
    title: 'What IPs wish they\'d known before starting',
    hook: '"I asked 20 intended parents. Here\'s what they all said."',
    topic: 'Common regrets from IPs: starting legal earlier, being more selective in matching, managing timeline expectations.',
  },
];

const AUD_LABEL = { surrogate: 'Surrogate', donor: 'Donor', ip: 'Intended Parents' };

function renderTemplates() {
  const list = document.getElementById('templateList');
  list.innerHTML = '';
  TEMPLATES.forEach(t => {
    const el = document.createElement('div');
    el.className = 'template-item';
    const tag   = document.createElement('div');
    tag.className = `tmpl-tag ${t.aud}`;
    tag.textContent = AUD_LABEL[t.aud];
    const title = document.createElement('div');
    title.className = 'tmpl-title';
    title.textContent = t.title;
    const hook  = document.createElement('div');
    hook.className = 'tmpl-hook';
    hook.textContent = t.hook;
    el.append(tag, title, hook);
    el.onclick = () => {
      document.getElementById('topicInput').value = t.topic;
      // Sync audience button
      document.querySelectorAll('#audienceBtns .tog-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.val === t.aud);
      });
      selectedAudience = t.aud;
      // Scroll to script builder
      document.getElementById('scriptBtn').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    list.appendChild(el);
  });
}
renderTemplates();

// ─── Claude API ───────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userPrompt) {
  if (!apiKey) {
    throw new Error('No API key set — click "Set API Key" at the top of the page.');
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.content[0].text;
}

const SYSTEM = `You are a content strategist for a surrogacy and egg donation consultancy.
Brand voice: educated, direct, slightly cheeky — like the most knowledgeable friend in the room who says what agencies won't.
The audience trusts you because you speak plainly, use real numbers, and never talk down to them.
You write short-form TikTok scripts: strong hook, tight body, clear CTA.
Never use filler like "In today's video" or "Don't forget to like and subscribe".
Be specific. Use real figures where helpful. Own the expertise.`;

const AUDIENCE_LABELS = { surrogate: 'surrogates', donor: 'egg donors', ip: 'intended parents' };
const TONE_PROMPTS = {
  'cheeky-edu': 'Tone: educational but playful — light sarcasm, rhetorical questions, conversational asides. Smart friend spilling receipts.',
  'myth-bust':  'Tone: myth-busting — name the myth head-on, dismantle it with facts. Confident, slightly exasperated.',
  'story':      'Tone: story hook — open with a real-feeling scenario. Make it emotional before making it educational.',
  'hot-take':   'Tone: hot take — provocative opening statement that stops the scroll, then back it up with substance.',
};

// ─── Script generator ─────────────────────────────────────────────────────────
document.getElementById('scriptBtn').onclick = async () => {
  const topic  = document.getElementById('topicInput').value.trim();
  const length = document.getElementById('lengthSelect').value;
  const hook   = document.getElementById('hookSelect').value;

  setLoading(true, 'Writing your script…');
  try {
    const result = await callClaude(SYSTEM, `
Write a TikTok video script for ${AUDIENCE_LABELS[selectedAudience]}.
${TONE_PROMPTS[selectedTone]}
Hook style: ${hook}
Target length: ~${length} seconds spoken aloud (~${Math.round(length * 2.5)} words).
Topic: ${topic || 'Pick the most relevant, scroll-stopping topic for this audience right now.'}

Use EXACTLY these section labels (nothing else before the colon):
HOOK:
BODY:
CTA:
ON-SCREEN TEXT:
DIRECTORS NOTE:
`);
    renderScript(result);
  } catch (e) {
    showError(e.message);
  } finally {
    setLoading(false);
  }
};

function parseSection(raw, label, nextLabel) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lookahead = nextLabel
    ? `(?=${nextLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:)`
    : '$';
  const re = new RegExp(`${escaped}:\\s*([\\s\\S]*?)${lookahead}`, 'i');
  const m  = raw.match(re);
  return m ? m[1].trim() : '';
}

function renderScript(raw) {
  const sections = ['HOOK', 'BODY', 'CTA', 'ON-SCREEN TEXT', 'DIRECTORS NOTE'];
  const vals = {};
  sections.forEach((s, i) => {
    vals[s] = parseSection(raw, s, sections[i + 1]);
  });

  const clsMap = { HOOK: 'script-hook', CTA: 'script-cta', 'DIRECTORS NOTE': 'script-note' };
  let html = '';
  sections.forEach(s => {
    if (!vals[s]) return;
    html += `<div class="script-block ${clsMap[s] || ''}">
      <div class="script-label">${s}</div>
      <div class="script-text">${vals[s].replace(/\n/g, '<br>')}</div>
    </div>`;
  });

  showOutput('Generated Script', html || `<pre>${raw}</pre>`, raw, true);
}

// ─── Daily plan ───────────────────────────────────────────────────────────────
document.getElementById('planBtn').onclick = async () => {
  setLoading(true, 'Planning your day…');
  try {
    const result = await callClaude(SYSTEM, `
Generate 2 TikTok video ideas for today for a surrogacy/egg donation consultancy.
Mix the audiences — one targeting surrogates or donors, one for intended parents.
For each:
VIDEO 1:
TITLE: (short punchy title)
AUDIENCE: surrogate | donor | ip
HOOK: (opening line)
WHY: (one sentence on why this is relevant now)

VIDEO 2:
TITLE:
AUDIENCE:
HOOK:
WHY:
`);
    renderPlan(result);
  } catch (e) {
    showError(e.message);
  } finally {
    setLoading(false);
  }
};

function renderPlan(raw) {
  [1, 2].forEach(n => {
    const re = new RegExp(
      `VIDEO ${n}:[\\s\\S]*?TITLE:\\s*(.*?)\\n[\\s\\S]*?AUDIENCE:\\s*(.*?)\\n[\\s\\S]*?HOOK:\\s*(.*?)\\n`,
      'i'
    );
    const m  = raw.match(re);
    const el = document.getElementById(`slot${n}`);
    if (m) {
      el.classList.add('loaded');
      const aud = m[2].trim().toLowerCase();
      const audLabel = aud === 'ip' ? 'Intended Parents' : aud === 'donor' ? 'Donor' : 'Surrogate';
      el.innerHTML = `<strong>${m[1].trim()}</strong><br>
        <span style="color:var(--accent-light);font-size:10px;text-transform:uppercase">${audLabel}</span><br>
        <em style="font-size:11px">"${m[3].trim()}"</em>`;
    }
  });
  showOutput("Today's Plan", `<pre style="white-space:pre-wrap;font-size:12px">${raw}</pre>`, raw, false);
}

// ─── 7-day calendar ───────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

document.getElementById('calendarBtn').onclick = async () => {
  setLoading(true, 'Building your week…');
  try {
    const result = await callClaude(SYSTEM, `
Create a 7-day TikTok content calendar for a surrogacy/egg donation consultancy.
2 videos per day. Rotate audiences: surrogates, donors, intended parents.
Vary tones: educational, myth-bust, story, hot take.

Return ONLY valid JSON — no extra text, no markdown fences:
[{"day":"Mon","aud":"surrogate","title":"Short title"},{"day":"Mon","aud":"ip","title":"Short title"},...]

Include exactly 14 objects, 2 per day for Mon–Sun.
`);
    const match = result.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('Could not parse calendar — try again');
    renderCalendar(JSON.parse(match[0]));
    showOutput('7-Day Calendar', '<p style="color:var(--muted);font-size:12px">Calendar generated below.</p>', result, false);
  } catch (e) {
    showError(e.message);
  } finally {
    setLoading(false);
  }
};

function renderCalendar(items) {
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';
  DAYS.forEach(day => {
    const col = document.createElement('div');
    col.className = 'cal-day';
    col.innerHTML = `<div class="cal-day-label">${day}</div>`;
    items.filter(i => i.day === day).forEach(i => {
      const entry = document.createElement('div');
      entry.className = `cal-entry ${i.aud}`;
      entry.textContent = i.title;
      col.appendChild(entry);
    });
    grid.appendChild(col);
  });
}

// ─── Output helpers ───────────────────────────────────────────────────────────
function showOutput(title, html, rawText, showUseBtn) {
  document.getElementById('outputTitle').textContent = title;
  document.getElementById('outputArea').innerHTML = html;

  const copyBtn  = document.getElementById('copyBtn');
  const useBtn   = document.getElementById('useInVideoBtn');
  copyBtn.style.display  = 'inline-block';
  useBtn.style.display   = showUseBtn ? 'inline-block' : 'none';

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(rawText).catch(() => {});
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
  };

  if (showUseBtn) {
    useBtn.onclick = () => {
      const m = rawText.match(/ON-SCREEN TEXT:\s*([\s\S]*?)(?:DIRECTORS NOTE:|$)/i);
      if (m) {
        const lines = m[1].trim().split('\n').map(l => l.replace(/^[-•*\d.]+\s*/, '').trim()).filter(Boolean);
        sessionStorage.setItem('cso_text_cards', JSON.stringify(lines));
      }
      window.location.href = 'index.html?from=scripts';
    };
  }
}

function setLoading(on, msg = '') {
  document.getElementById('spinner').style.display = on ? 'flex' : 'none';
  ['scriptBtn', 'planBtn', 'calendarBtn'].forEach(id => {
    document.getElementById(id).disabled = on;
  });
  if (on) {
    document.getElementById('outputArea').innerHTML = `<div class="output-empty">${msg}</div>`;
    document.getElementById('copyBtn').style.display  = 'none';
    document.getElementById('useInVideoBtn').style.display = 'none';
  }
}

function showError(msg) {
  document.getElementById('outputTitle').textContent = 'Error';
  document.getElementById('outputArea').innerHTML =
    `<div class="error-msg">${msg}</div>`;
  document.getElementById('copyBtn').style.display  = 'none';
  document.getElementById('useInVideoBtn').style.display = 'none';
}
