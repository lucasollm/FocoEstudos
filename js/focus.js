/* ============================================================
   focus.js — Modo Foco: Pomodoro ou Meta de Aulas
============================================================ */

const FocusState = {
  active: false,
  mode: 'pomodoro',       // 'pomodoro' | 'goal'
  running: false,
  totalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  intervalId: null,
  distractions: 0,
  warningTimeout: null,
  sessionLessons: 0,      // aulas concluídas nesta sessão de foco
};

/* ── Abre modal de configuração antes de entrar ─────────── */
function toggleFocusMode() {
  if (FocusState.active) {
    exitFocusMode();
  } else {
    openFocusSetupModal();
  }
}

/* ── Entra no modo foco ─────────────────────────────────── */
function enterFocusMode(mode) {
  FocusState.active = true;
  FocusState.mode = mode || 'pomodoro';
  FocusState.distractions = 0;
  FocusState.sessionLessons = 0;

  // Mostra barra
  document.getElementById('focus-bar').classList.remove('hidden', 'distracted');
  document.body.classList.add('focus-active');

  // Modo imersivo: esconde sidebar, expande vídeo
  document.getElementById('sidebar').classList.add('focus-hidden');
  document.getElementById('player-main').classList.add('focus-immersive');

  // Atualiza botão topbar
  const btn = document.getElementById('btn-focus-mode');
  btn.classList.add('active');
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> Foco Ativo`;

  // Nome da aula na barra
  const lesson = getCurrentLesson();
  document.getElementById('focus-bar-lesson').textContent = lesson?.title || 'Modo Foco';

  // Configura barra por modo
  if (FocusState.mode === 'goal') {
    updateGoalModeBar();
  } else {
    updateDistractionCount();
    resetFocusTimer();
  }
}

/* ── Sai do modo foco ───────────────────────────────────── */
function exitFocusMode() {
  if (!FocusState.active) return;
  FocusState.active = false;
  FocusState.running = false;
  clearInterval(FocusState.intervalId);
  clearTimeout(FocusState.warningTimeout);

  document.getElementById('focus-bar').classList.add('hidden');
  document.body.classList.remove('focus-active', 'focus-warning-visible');

  // Restaura sidebar e player
  document.getElementById('sidebar').classList.remove('focus-hidden');
  document.getElementById('player-main').classList.remove('focus-immersive');

  // Restaura botão
  const btn = document.getElementById('btn-focus-mode');
  btn.classList.remove('active');
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> Modo Foco`;
}

function isFocusModeActive() { return FocusState.active; }

/* ── POMODORO: cronômetro ────────────────────────────────── */
function toggleFocusTimer() {
  FocusState.running ? pauseFocusTimer() : startFocusTimer();
}

function startFocusTimer() {
  FocusState.running = true;
  updatePlayBtn();
  FocusState.intervalId = setInterval(() => {
    if (FocusState.remainingSeconds <= 0) { onTimerComplete(); return; }
    FocusState.remainingSeconds--;
    renderTimer();
  }, 1000);
}

function pauseFocusTimer() {
  FocusState.running = false;
  clearInterval(FocusState.intervalId);
  updatePlayBtn();
}

function resetFocusTimer() {
  clearInterval(FocusState.intervalId);
  FocusState.running = false;
  FocusState.remainingSeconds = FocusState.totalSeconds;
  updatePlayBtn();
  renderTimer();
  setBarProgress(1);
}

function setFocusTime(minutes) {
  FocusState.totalSeconds = minutes * 60;
  resetFocusTimer();
  document.querySelectorAll('.focus-preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === `${minutes}m`);
  });
}

function renderTimer() {
  const m = Math.floor(FocusState.remainingSeconds / 60);
  const s = FocusState.remainingSeconds % 60;
  const display = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  document.getElementById('focus-timer-display').textContent = display;
  setBarProgress(FocusState.remainingSeconds / FocusState.totalSeconds);
}

function setBarProgress(ratio) {
  const el = document.getElementById('focus-bar-progress');
  if (el) el.style.transform = `scaleX(${ratio})`;
}

function onTimerComplete() {
  clearInterval(FocusState.intervalId);
  FocusState.running = false;
  FocusState.remainingSeconds = 0;
  renderTimer();
  updatePlayBtn();
  playBeep();
  gainXP('pomodoroComplete');
  showToast('🎉 Pomodoro concluído! +15 XP', 3500);

  // Barra fica verde por 2s
  const bar = document.getElementById('focus-bar');
  bar.style.borderBottomColor = '#10B981';
  setTimeout(() => {
    bar.style.borderBottomColor = '';
    exitFocusMode();
  }, 2000);
}

/* ── MODO META: barra de progresso ───────────────────────── */
function updateGoalModeBar() {
  const timerEl = document.getElementById('focus-timer-display');
  const goal = XPState.dailyGoal;
  const done = XPState.dailyDone;

  if (timerEl) {
    timerEl.textContent = goal > 0 ? `${done}/${goal}` : '0/0';
    timerEl.style.fontSize = '1.1rem';
  }

  const presets = document.querySelector('.focus-bar-presets');
  const playBtn = document.getElementById('btn-focus-play');
  if (presets) presets.style.display = 'none';
  if (playBtn) playBtn.style.display = 'none';

  const badge = document.getElementById('focus-bar-badge');
  if (badge) badge.textContent = '🎯 META DO DIA';

  if (goal > 0) setBarProgress(done / goal);
}

/* ── Notifica conclusão de aula no modo foco ────────────── */
function onLessonCompletedInFocus() {
  if (!FocusState.active) return;
  FocusState.sessionLessons++;

  if (FocusState.mode === 'goal') {
    updateGoalModeBar();
  }
}

/* ── Detecção de saída de aba ────────────────────────────── */
function setupVisibilityWatcher() {
  document.addEventListener('visibilitychange', () => {
    if (!isFocusModeActive()) return;

    if (document.hidden) {
      // Pausa timer e PAUSA O VÍDEO
      if (FocusState.running) pauseFocusTimer();
      ytPause();
    } else {
      // Voltou — conta distração, perde XP, toca alerta
      FocusState.distractions++;
      updateDistractionCount();
      triggerDistractedState();
      loseXP(Math.abs(XP_VALUES.distraction));
      // Retoma timer e RETOMA O VÍDEO
      if (FocusState.remainingSeconds > 0 && FocusState.mode === 'pomodoro') {
        startFocusTimer();
      }
      ytPlay();
    }
  });
}

function triggerDistractedState() {
  const bar = document.getElementById('focus-bar');
  const warning = document.getElementById('focus-bar-warning');
  const badge = document.getElementById('focus-bar-badge');

  bar.classList.add('distracted');
  warning.classList.remove('hidden');
  document.body.classList.add('focus-warning-visible');

  const msgs = [
    '😬 Você saiu da aba! Volta pro foco.',
    '👀 Ei! Você se distraiu de novo. -3 XP',
    `😤 ${FocusState.distractions}x já! Perdendo XP...`,
    `🔥 ${FocusState.distractions} fugas! Foca de verdade!`,
  ];
  warning.textContent = msgs[Math.min(FocusState.distractions - 1, msgs.length - 1)];
  badge.textContent = `⚠️ DISTRAÇÃO #${FocusState.distractions}`;

  playBeep(440, 0.15);
  clearTimeout(FocusState.warningTimeout);
  FocusState.warningTimeout = setTimeout(() => {
    bar.classList.remove('distracted');
    warning.classList.add('hidden');
    document.body.classList.remove('focus-warning-visible');
    badge.textContent = FocusState.mode === 'goal' ? '🎯 META DO DIA' : '🎯 FOCO';
  }, 4000);
}

function updateDistractionCount() {
  const n = FocusState.distractions;
  const el = document.getElementById('distraction-num');
  const pl = document.getElementById('distraction-plural');
  if (el) el.textContent = n;
  if (pl) pl.textContent = n !== 1 ? 'ões' : 'ão';
}

function updatePlayBtn() {
  const ip = document.getElementById('icon-play');
  const iP = document.getElementById('icon-pause');
  if (!ip) return;
  ip.style.display = FocusState.running ? 'none' : '';
  iP.style.display = FocusState.running ? '' : 'none';
}

function playBeep(freq = 880, vol = 0.7) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.2);
  } catch(e) {}
}

function getCurrentLesson() {
  const course = AppState?.currentCourse;
  if (!course || !AppState.currentLessonId) return null;
  return getAllLessons(course).find(l => l.id === AppState.currentLessonId);
}
