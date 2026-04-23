// ─── API Key ──────────────────────────────────────────────────────────────────
let apiKey = localStorage.getItem('cso_api_key') || '';

const apiBanner  = document.getElementById('apiBanner');
const apiSetup   = document.getElementById('apiSetup');
const apiKeyInput= document.getElementById('apiKeyInput');

function updateApiBanner() {
  if (apiKey) { apiBanner.classList.add('hidden'); apiSetup.hidden = true; }
  else        { apiBanner.classList.remove('hidden'); }
}
updateApiBanner();

document.getElementById('apiSetupBtn').onclick = () => {
  apiSetup.hidden = false;
  apiBanner.classList.add('hidden');
  apiKeyInput.focus();
};
document.getElementById('saveKeyBtn').onclick = () => {
  const v = apiKeyInput.value.trim();
  if (v.startsWith('sk-ant-')) {
    apiKey = v;
    localStorage.setItem('cso_api_key', v);
    updateApiBanner();
  } else {
    alert('Key should start with sk-ant-');
  }
};
document.getElementById('cancelKeyBtn').onclick = () => { apiSetup.hidden = true; updateApiBanner(); };

// ─── State ────────────────────────────────────────────────────────────────────
let selectedAudience = 'surrogate';
let selectedTone     = 'cheeky-edu';

// ─── Audience & tone toggles ──────────────────────────────────────────────────
document.querySelectorAll('.aud-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.aud-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedAudience = btn.dataset.aud;
  };
});
document.querySelectorAll('.tone-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedTone = btn.dataset.tone;
  };
});

// ─── Templates bank ───────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    aud: 'surrogate',
    title: 'What surrogacy compensation actually looks like',
    hook: '"Everyone thinks surrogates get paid a flat $50k. Here\'s what\'s actually in the contract."',
    topic: 'Break down real surrogacy compensation: base pay, monthly allowance, maternity clothes, lost wages, pumping fee, and more. Be specific and educational.',
  },
  {
    aud: 'surrogate',
    title: 'The 5 questions you MUST ask an agency before signing',
    hook: '"I wish someone told me this before I signed with my first agency."',
    topic: 'The 5 non-negotiable questions surrogates should ask any agency: exclusivity, communication, matching timeline, legal support, and psychological screening.',
  },
  {
    aud: 'surrogate',
    title: 'Myth: surrogates get "attached" and want to keep the baby',
    hook: '"I\'m so tired of this question. Let me explain why it doesn\'t work that way."',
    topic: 'Debunk the emotional attachment myth with empathy and science. Explain gestational surrogacy vs. the psychological preparation surrogates go through.',
  },
  {
    aud: 'donor',
    title: 'What egg donation does (and doesn\'t) do to your fertility',
    hook: '"Your doctor probably glossed over this part."',
    topic: 'Educate on what egg donation actually does to the body: the stimulation process, retrieval, recovery, and what the science says about long-term fertility impact.',
  },
  {
    aud: 'donor',
    title: 'Why some donor profiles get chosen in days vs. months',
    hook: '"The difference between a profile that gets matched fast and one that sits — it\'s not what you think."',
    topic: 'What IPs actually look for in donor profiles: genuine answers, personality, health history transparency. Not just looks.',
  },
  {
    aud: 'ip',
    title: 'The 3 things IPs don\'t know about the matching process',
    hook: '"Nobody in the industry wants to tell you this."',
    topic: 'Honest education for intended parents: matching takes longer than agencies promise, surrogates also choose you, and the relationship matters as much as the contract.',
  },
  {
    aud: 'ip',
    title: 'Independent vs. agency surrogacy: the real cost breakdown',
    hook: '"The price difference is huge. But so is the risk difference."',
    topic: 'Compare independent and agency-assisted surrogacy honestly — total costs, timeline, legal exposure, and who actually benefits from each path.',
  },
  {
    aud: 'ip',
    title: 'What IPs wish they\'d known before starting',
    hook: '"I interviewed 20 intended parents. Here\'s what they all said."',
    topic: 'Common regrets and lessons from IPs: starting the legal process earlier, being more selective in matching, managing expectations about timelines.',
  },
];

function renderTemplates() {
  const list = document.getElementById('templateList');
  list.innerHTML = '';
  TEMPLATES.forEach(t => {
    const el = document.createElement('div');
    el.className = 'template-item';
    el.innerHTML = `
      <div class="tmpl-tag ${t.aud}">${t.aud === 'ip' ? 'Intended Parents' : t.aud === 'donor' ? 'Donor' : 'Surrogate'}</div>
      <div class="tmpl-title">${t.title}</div>
      <div class="tmpl-hook">${t.hook}</div>
    `;
    el.onclick = () => {
      document.getElementById('topicInput').value = t.topic;
      // Set audience
      document.querySelectorAll('.aud-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.aud === t.aud);
      });
      selectedAudience = t.aud;
    };
    list.appendChild(el);
  });
}
renderTemplates();

// ─── Claude API call ──────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userPrompt) {
  if (!apiKey) {
    throw new Error('No API key set. Click "Set API Key" at the top.');
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

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM = `You are a content strategist for a surrogacy and egg donation consultancy.
The brand voice is: educated, direct, slightly cheeky — like the most knowledgeable friend in the room who isn't afraid to say what agencies won't.
The audience trusts you because you speak plainly, use real numbers, and never talk down to them.
You create short-form video scripts optimised for TikTok: strong hook, tight body, clear CTA.
Never use filler phrases like "In today's video" or "Don't forget to like and subscribe".
Be specific. Use real figures where helpful. Be the expert.`;

// ─── Script generator ─────────────────────────────────────────────────────────
const AUDIENCE_LABELS = { surrogate: 'surrogates', donor: 'egg donors', ip: 'intended parents' };
const TONE_PROMPTS = {
  'cheeky-edu':  'Tone: educational but playful — use light sarcasm, rhetorical questions, and conversational asides. Make it feel like a smart friend spilling receipts.',
  'myth-bust':   'Tone: myth-busting — start by naming the myth head-on, then dismantle it with facts. Confident, slightly exasperated.',
  'story':       'Tone: story hook — open with a real-feeling scenario or "I talked to someone who…" setup. Make it emotional before making it educational.',
  'hot-take':    'Tone: hot take — lead with a provocative statement that will stop the scroll, then back it up with substance. Polarising but defensible.',
};

document.getElementById('scriptBtn').onclick = async () => {
  const topic  = document.getElementById('topicInput').value.trim();
  const length = document.getElementById('lengthSelect').value;
  const hook   = document.getElementById('hookSelect').value;

  setLoading(true);
  try {
    const prompt = `
Write a TikTok video script for ${AUDIENCE_LABELS[selectedAudience]}.
${TONE_PROMPTS[selectedTone]}
Hook style: ${hook}
Target length: ~${length} seconds when spoken aloud (${Math.round(length * 2.5)} words).
Topic: ${topic || 'Choose a highly relevant, timely topic for this audience that will perform well on TikTok.'}

Format your response EXACTLY like this (use these exact labels):
HOOK:
[The opening line — must stop the scroll in 2 seconds]

BODY:
[The educational/story content — punchy, no fluff]

CTA:
[One clear call to action]

ON-SCREEN TEXT:
[3-5 short text overlay lines for the video maker, each under 8 words]

DIRECTOR'S NOTE:
[One sentence on b-roll or visual suggestions]
`;
    const result = await callClaude(SYSTEM, prompt);
    renderScript(result, topic);
  } catch (e) {
    showError(e.message);
  } finally {
    setLoading(false);
  }
};

function renderScript(raw, topic) {
  const outputArea  = document.getElementById('outputArea');
  const outputTitle = document.getElementById('outputTitle');
  const copyBtn     = document.getElementById('copyBtn');
  const useBtn      = document.getElementById('useInVideoBtn');

  outputTitle.textContent = 'Generated Script';
  copyBtn.hidden  = false;
  useBtn.hidden   = false;

  // Parse sections
  const sections = [
    { key: 'HOOK',            cls: 'script-hook' },
    { key: 'BODY',            cls: '' },
    { key: 'CTA',             cls: 'script-cta' },
    { key: 'ON-SCREEN TEXT',  cls: '' },
    { key: "DIRECTOR'S NOTE", cls: 'script-note' },
  ];

  let html = '';
  sections.forEach((s, i) => {
    const next = sections[i + 1]?.key;
    const re   = new RegExp(`${s.key}:\\s*([\\s\\S]*?)${next ? `(?=${next}:)` : '$'}`, 'i');
    const m    = raw.match(re);
    if (m) {
      html += `<div class="script-block ${s.cls}">
        <div class="script-label">${s.key}</div>
        <div class="script-text">${m[1].trim().replace(/\n/g, '<br>')}</div>
      </div>`;
    }
  });

  outputArea.innerHTML = html || `<pre>${raw}</pre>`;

  // Copy button
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(raw);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
  };

  // Use in video maker: open video maker with first ON-SCREEN TEXT line in clipboard
  useBtn.onclick = () => {
    const m = raw.match(/ON-SCREEN TEXT:\s*([\s\S]*?)(?=DIRECTOR'S NOTE:|$)/i);
    if (m) {
      const lines = m[1].trim().split('\n').filter(Boolean);
      sessionStorage.setItem('cso_text_cards', JSON.stringify(lines));
    }
    window.location.href = 'index.html?from=scripts';
  };
}

// ─── Daily plan ───────────────────────────────────────────────────────────────
document.getElementById('planBtn').onclick = async () => {
  setLoading(true);
  try {
    const prompt = `
Generate 2 TikTok video ideas for today for a surrogacy/egg donation consultancy.
Mix the audiences: one for [surrogates or donors], one for [intended parents].
For each idea return:
- TITLE: short punchy title
- AUDIENCE: surrogate | donor | ip
- HOOK: the opening line
- WHY NOW: one sentence on why this topic is relevant/timely

Format:
VIDEO 1:
TITLE: ...
AUDIENCE: ...
HOOK: ...
WHY NOW: ...

VIDEO 2:
TITLE: ...
AUDIENCE: ...
HOOK: ...
WHY NOW: ...
`;
    const result = await callClaude(SYSTEM, prompt);
    renderPlan(result);
  } catch (e) {
    showError(e.message);
  } finally {
    setLoading(false);
  }
};

function renderPlan(raw) {
  [1, 2].forEach(n => {
    const re = new RegExp(`VIDEO ${n}:[\\s\\S]*?TITLE:\\s*(.*?)\\nAUDIENCE:\\s*(.*?)\\nHOOK:\\s*(.*?)\\nWHY NOW:\\s*(.*?)(?=VIDEO \\d:|$)`, 'i');
    const m  = raw.match(re);
    const el = document.getElementById(`slot${n}`);
    if (m) {
      const [, title, aud, hook, why] = m;
      el.classList.add('loaded');
      el.innerHTML = `<strong>${title.trim()}</strong><br><span style="color:var(--accent-light);font-size:10px">${aud.trim().toUpperCase()}</span><br><em style="font-size:11px">"${hook.trim()}"</em>`;
    }
  });
  document.getElementById('outputArea').innerHTML = `<pre>${raw}</pre>`;
  document.getElementById('outputTitle').textContent = "Today's Plan";
  document.getElementById('copyBtn').hidden = false;
  document.getElementById('useInVideoBtn').hidden = true;
  document.getElementById('copyBtn').onclick = () => {
    navigator.clipboard.writeText(raw);
    document.getElementById('copyBtn').textContent = 'Copied!';
    setTimeout(() => { document.getElementById('copyBtn').textContent = 'Copy'; }, 1800);
  };
}

// ─── 7-day calendar ───────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

document.getElementById('calendarBtn').onclick = async () => {
  setLoading(true);
  try {
    const prompt = `
Create a 7-day TikTok content calendar for a surrogacy/egg donation consultancy.
2 videos per day. Rotate across audiences: surrogates, donors, intended parents.
Vary tones: educational, myth-bust, story, hot take.

Return ONLY a JSON array of 14 objects like:
[{"day":"Mon","aud":"surrogate","title":"Short title"},...]

No extra text. Valid JSON only.
`;
    const result = await callClaude(SYSTEM, prompt);
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Could not parse calendar JSON');
    const items = JSON.parse(jsonMatch[0]);
    renderCalendar(items);
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
    const dayItems = items.filter(i => i.day === day);
    const col = document.createElement('div');
    col.className = 'cal-day';
    col.innerHTML = `<div class="cal-day-label">${day}</div>` +
      dayItems.map(i => `<div class="cal-entry ${i.aud}">${i.title}</div>`).join('');
    grid.appendChild(col);
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function setLoading(on) {
  document.getElementById('spinner').hidden = !on;
  document.getElementById('scriptBtn').disabled = on;
  document.getElementById('planBtn').disabled   = on;
  document.getElementById('calendarBtn').disabled = on;
  if (on) {
    document.getElementById('outputArea').innerHTML = '<div class="output-empty">Generating…</div>';
    document.getElementById('copyBtn').hidden = true;
    document.getElementById('useInVideoBtn').hidden = true;
  }
}

function showError(msg) {
  document.getElementById('outputArea').innerHTML =
    `<div style="color:#ef4444;padding:12px">${msg}</div>`;
  document.getElementById('outputTitle').textContent = 'Error';
}

// ─── Import text cards from session storage ───────────────────────────────────
// (Used when returning from scripts page to video maker)
if (window.location.search.includes('from=scripts')) {
  const cards = sessionStorage.getItem('cso_text_cards');
  if (cards) {
    sessionStorage.removeItem('cso_text_cards');
    // Handled in app.js
  }
}
