// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  videoFile: null,
  videoDuration: 0,
  ratio: '9:16',
  textCards: [],
  cardCounter: 0,
  playing: false,
  animFrame: null,
  currentTime: 0,
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const uploadZone   = document.getElementById('uploadZone');
const videoInput   = document.getElementById('videoInput');
const sourceVideo  = document.getElementById('sourceVideo');
const canvas       = document.getElementById('previewCanvas');
const ctx          = canvas.getContext('2d');
const overlay      = document.getElementById('canvasOverlay');
const playBtn      = document.getElementById('playBtn');
const scrubber     = document.getElementById('scrubber');
const timeDisplay  = document.getElementById('timeDisplay');
const exportBtn    = document.getElementById('exportBtn');
const progressWrap = document.getElementById('progressWrap');
const progressFill = document.getElementById('progressFill');
const progressLabel= document.getElementById('progressLabel');
const downloadLink = document.getElementById('downloadLink');
const textCardsList= document.getElementById('textCardsList');
const addCardBtn   = document.getElementById('addCard');

// ─── Ratio map ────────────────────────────────────────────────────────────────
const RATIOS = { '9:16': [1080, 1920], '16:9': [1920, 1080], '1:1': [1080, 1080] };

// ─── Upload ───────────────────────────────────────────────────────────────────
uploadZone.addEventListener('click', () => { if (!uploadZone.classList.contains('has-video')) videoInput.click(); });
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('video/')) loadVideo(file);
});
videoInput.addEventListener('change', () => { if (videoInput.files[0]) loadVideo(videoInput.files[0]); });

function loadVideo(file) {
  state.videoFile = file;
  const url = URL.createObjectURL(file);
  sourceVideo.src = url;
  sourceVideo.addEventListener('loadedmetadata', () => {
    state.videoDuration = sourceVideo.duration;
    uploadZone.classList.add('has-video');
    overlay.hidden = true;
    playBtn.disabled = false;
    scrubber.disabled = false;
    exportBtn.disabled = false;
    applyRatio();
    drawFrame();
    updateTimeDisplay();

    // Auto-set card timings to full duration
    state.textCards.forEach(c => {
      if (c.end === 0) { c.end = state.videoDuration; syncCardInputs(c); }
    });
  }, { once: true });
}

// ─── Ratio ────────────────────────────────────────────────────────────────────
document.querySelectorAll('.fmt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fmt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.ratio = btn.dataset.ratio;
    applyRatio();
    drawFrame();
  });
});

function applyRatio() {
  const [w, h] = RATIOS[state.ratio];
  canvas.width  = w;
  canvas.height = h;
}

// ─── Draw ─────────────────────────────────────────────────────────────────────
function drawFrame() {
  const [cw, ch] = [canvas.width, canvas.height];
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cw, ch);

  if (sourceVideo.readyState >= 2) {
    const vw = sourceVideo.videoWidth, vh = sourceVideo.videoHeight;
    const scale = Math.max(cw / vw, ch / vh);
    const dw = vw * scale, dh = vh * scale;
    ctx.drawImage(sourceVideo, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  const t = sourceVideo.currentTime;
  state.textCards.forEach(card => {
    if (t >= card.start && t <= card.end) {
      drawTextCard(card, cw, ch);
    }
  });
}

function drawTextCard(card, cw, ch) {
  const text = card.text.trim();
  if (!text) return;

  const fontSize   = Math.round(cw * (card.size / 100));
  const isBold     = card.bold;
  const isItalic   = card.italic;
  const fontStyle  = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${fontSize}px`;
  ctx.font = `${fontStyle} 'Arial', sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  // Word-wrap
  const maxW = cw * 0.88;
  const lines = wrapText(ctx, text, maxW);
  const lineH  = fontSize * 1.3;
  const totalH = lines.length * lineH;

  let y;
  if (card.position === 'top')    y = ch * 0.12;
  else if (card.position === 'bottom') y = ch - ch * 0.12;
  else y = ch / 2;

  const blockTop = y - totalH / 2;

  lines.forEach((line, i) => {
    const ly = blockTop + i * lineH + lineH / 2;

    if (card.style === 'shadow') {
      ctx.shadowColor   = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur    = fontSize * 0.18;
      ctx.shadowOffsetX = fontSize * 0.04;
      ctx.shadowOffsetY = fontSize * 0.04;
      ctx.fillStyle = card.color;
      ctx.fillText(line, cw / 2, ly);
      ctx.shadowColor = 'transparent';
    } else if (card.style === 'outline') {
      ctx.strokeStyle = card.color === '#ffffff' ? '#000' : '#fff';
      ctx.lineWidth   = fontSize * 0.08;
      ctx.lineJoin    = 'round';
      ctx.strokeText(line, cw / 2, ly);
      ctx.fillStyle   = card.color;
      ctx.fillText(line, cw / 2, ly);
    } else if (card.style === 'box') {
      const m = ctx.measureText(line);
      const pad = fontSize * 0.18;
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.beginPath();
      ctx.roundRect(cw / 2 - m.width / 2 - pad, ly - fontSize * 0.6, m.width + pad * 2, fontSize * 1.15, 6);
      ctx.fill();
      ctx.fillStyle = card.color;
      ctx.fillText(line, cw / 2, ly);
    } else {
      ctx.fillStyle = card.color;
      ctx.fillText(line, cw / 2, ly);
    }
  });
}

function wrapText(ctx, text, maxW) {
  const words  = text.split(' ');
  const lines  = [];
  let current  = '';
  words.forEach(word => {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > maxW && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines;
}

// ─── Playback ─────────────────────────────────────────────────────────────────
playBtn.addEventListener('click', togglePlay);

function togglePlay() {
  if (!state.videoFile) return;
  if (state.playing) {
    sourceVideo.pause();
    state.playing = false;
    playBtn.textContent = '▶ Play Preview';
    cancelAnimationFrame(state.animFrame);
  } else {
    sourceVideo.play();
    state.playing = true;
    playBtn.textContent = '⏸ Pause';
    renderLoop();
  }
}

function renderLoop() {
  drawFrame();
  scrubber.value = (sourceVideo.currentTime / state.videoDuration) * 100;
  updateTimeDisplay();
  if (!sourceVideo.paused && !sourceVideo.ended) {
    state.animFrame = requestAnimationFrame(renderLoop);
  } else if (sourceVideo.ended) {
    state.playing = false;
    playBtn.textContent = '▶ Play Preview';
    sourceVideo.currentTime = 0;
    drawFrame();
  }
}

scrubber.addEventListener('input', () => {
  if (!state.videoDuration) return;
  sourceVideo.currentTime = (scrubber.value / 100) * state.videoDuration;
  if (!state.playing) drawFrame();
  updateTimeDisplay();
});

function updateTimeDisplay() {
  timeDisplay.textContent = `${fmt(sourceVideo.currentTime)} / ${fmt(state.videoDuration)}`;
}
function fmt(s) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Text Cards ───────────────────────────────────────────────────────────────
addCardBtn.addEventListener('click', () => addTextCard());

function addTextCard(data = {}) {
  const id = ++state.cardCounter;
  const card = {
    id,
    text:     data.text     || '',
    color:    data.color    || '#ffffff',
    size:     data.size     || 8,
    position: data.position || 'middle',
    style:    data.style    || 'shadow',
    bold:     data.bold     !== undefined ? data.bold : true,
    italic:   data.italic   || false,
    start:    data.start    || 0,
    end:      data.end      || state.videoDuration || 0,
  };
  state.textCards.push(card);
  renderCardUI(card);
  return card;
}

function renderCardUI(card) {
  const el = document.createElement('div');
  el.className = 'text-card';
  el.dataset.id = card.id;
  el.innerHTML = `
    <div class="card-header">
      <span class="card-num">Card #${card.id}</span>
      <button class="card-del" title="Remove">×</button>
    </div>
    <textarea placeholder="Your text here..." rows="2">${card.text}</textarea>
    <div class="row">
      <label>Color <input type="color" data-field="color" value="${card.color}" /></label>
      <label>Size %
        <input type="number" data-field="size" value="${card.size}" min="3" max="20" step="0.5" />
      </label>
    </div>
    <div class="row">
      <label>Position
        <select data-field="position">
          <option value="top"    ${card.position==='top'    ? 'selected':''}>Top</option>
          <option value="middle" ${card.position==='middle' ? 'selected':''}>Middle</option>
          <option value="bottom" ${card.position==='bottom' ? 'selected':''}>Bottom</option>
        </select>
      </label>
      <label>Style
        <select data-field="style">
          <option value="shadow"  ${card.style==='shadow'  ? 'selected':''}>Shadow</option>
          <option value="outline" ${card.style==='outline' ? 'selected':''}>Outline</option>
          <option value="box"     ${card.style==='box'     ? 'selected':''}>Box</option>
          <option value="plain"   ${card.style==='plain'   ? 'selected':''}>Plain</option>
        </select>
      </label>
    </div>
    <div class="row">
      <label>Start (s) <input type="number" data-field="start" value="${card.start}" min="0" step="0.5" /></label>
      <label>End (s)   <input type="number" data-field="end"   value="${card.end}"   min="0" step="0.5" /></label>
    </div>
    <div class="row">
      <div style="flex:1">
        <div style="font-size:11px;color:var(--muted);margin-bottom:4px">Style</div>
        <div class="style-btns">
          <button class="style-btn ${card.bold   ? 'active':''}" data-toggle="bold"  ><b>B</b></button>
          <button class="style-btn ${card.italic ? 'active':''}" data-toggle="italic"><i>I</i></button>
        </div>
      </div>
    </div>
  `;

  // Events
  el.querySelector('.card-del').addEventListener('click', () => removeCard(card.id));
  el.querySelector('textarea').addEventListener('input', e => { card.text = e.target.value; drawFrame(); });

  el.querySelectorAll('[data-field]').forEach(input => {
    input.addEventListener('input', e => {
      const field = e.target.dataset.field;
      card[field] = (field === 'color') ? e.target.value : parseFloat(e.target.value) || e.target.value;
      drawFrame();
    });
  });

  el.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.toggle;
      card[field] = !card[field];
      btn.classList.toggle('active', card[field]);
      drawFrame();
    });
  });

  textCardsList.appendChild(el);
}

function syncCardInputs(card) {
  const el = textCardsList.querySelector(`[data-id="${card.id}"]`);
  if (!el) return;
  el.querySelector('[data-field="end"]').value = card.end;
}

function removeCard(id) {
  state.textCards = state.textCards.filter(c => c.id !== id);
  textCardsList.querySelector(`[data-id="${id}"]`).remove();
  drawFrame();
}

// ─── Export ───────────────────────────────────────────────────────────────────
exportBtn.addEventListener('click', exportVideo);

async function exportVideo() {
  if (!state.videoFile) return;

  // Reset video to start
  sourceVideo.pause();
  state.playing = false;
  playBtn.textContent = '▶ Play Preview';
  cancelAnimationFrame(state.animFrame);
  sourceVideo.currentTime = 0;
  await new Promise(r => { sourceVideo.onseeked = r; });

  exportBtn.disabled  = true;
  exportBtn.textContent = 'Exporting…';
  exportBtn.classList.add('recording');
  progressWrap.hidden = false;
  progressFill.style.width = '0%';
  progressLabel.textContent = '0%';

  const bitrate = parseInt(document.getElementById('qualitySelect').value);

  // Capture canvas stream
  const canvasStream = canvas.captureStream(30);

  // Extract audio from source video
  let outputStream = canvasStream;
  try {
    const audioCtx   = new AudioContext();
    const src        = audioCtx.createMediaElementSource(sourceVideo);
    const dest       = audioCtx.createMediaStreamDestination();
    src.connect(dest);
    src.connect(audioCtx.destination);
    const audioTrack = dest.stream.getAudioTracks()[0];
    if (audioTrack) outputStream = new MediaStream([...canvasStream.getTracks(), audioTrack]);
  } catch {
    // no audio or already captured — continue with video only
  }

  // Pick best supported codec
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  const mimeType = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';

  const recorder  = new MediaRecorder(outputStream, { mimeType, videoBitsPerSecond: bitrate });
  const chunks    = [];

  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mimeType });
    const ext  = mimeType.includes('webm') ? 'webm' : 'mp4';
    const url  = URL.createObjectURL(blob);
    downloadLink.href     = url;
    downloadLink.download = `video-${Date.now()}.${ext}`;
    downloadLink.hidden   = false;
    downloadLink.click();

    exportBtn.disabled   = false;
    exportBtn.textContent = 'Export Video';
    exportBtn.classList.remove('recording');
    progressFill.style.width = '100%';
    progressLabel.textContent = 'Done!';
    setTimeout(() => { progressWrap.hidden = true; }, 2500);
  };

  recorder.start(100);
  await sourceVideo.play();

  // Render loop during recording
  const renderDuringExport = () => {
    drawFrame();
    const pct = Math.min(sourceVideo.currentTime / state.videoDuration, 1);
    progressFill.style.width = `${pct * 100}%`;
    progressLabel.textContent = `${Math.round(pct * 100)}%`;

    if (!sourceVideo.paused && !sourceVideo.ended) {
      requestAnimationFrame(renderDuringExport);
    } else {
      recorder.stop();
    }
  };
  requestAnimationFrame(renderDuringExport);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
applyRatio();
addTextCard({ text: 'Your hook goes here', bold: true, size: 9, position: 'middle', style: 'shadow' });
