/* ============================================================
   xp.js — Sistema de XP, Patentes, Rank e Metas
============================================================ */

/* ── Patentes ────────────────────────────────────────────── */
const RANKS = [
  {
    id: 'explorer',
    name: '🌱 Explorador',
    min: 0, max: 25,
    color: '#10B981', bg: '#D1FAE5',
    breakBonus: 5,        // minutos de descanso no pomodoro
    xpMultiplier: 1.0,
    perk: '5 min de descanso no Pomodoro',
  },
  {
    id: 'focused',
    name: '⚡ Concentrado',
    min: 26, max: 50,
    color: '#6366F1', bg: '#EEF2FF',
    breakBonus: 10,
    xpMultiplier: 1.2,
    perk: '10 min de descanso + XP 1.2x',
  },
  {
    id: 'determined',
    name: '🔥 Determinado',
    min: 51, max: 75,
    color: '#F59E0B', bg: '#FEF3C7',
    breakBonus: 15,
    xpMultiplier: 1.5,
    perk: '15 min de descanso + XP 1.5x',
  },
  {
    id: 'master',
    name: '🏆 Mestre do Foco',
    min: 76, max: 100,
    color: '#7C3AED', bg: '#EDE9FE',
    breakBonus: 20,
    xpMultiplier: 2.0,
    perk: '20 min de descanso + XP 2x',
  },
];

/* ── XP ganho/perdido ────────────────────────────────────── */
const XP_VALUES = {
  lessonComplete: 10,
  pomodoroComplete: 15,
  goalComplete: 20,
  distraction: -3,
};

/* ── Estado persistido no localStorage ─────────────────── */
const XPState = {
  xp: 0,
  totalXP: 0,         // XP acumulado total (nunca decresce, para rank)
  userName: '',
  rankHistory: [],    // histórico de patentes conquistadas
  dailyGoal: 0,       // meta de aulas do dia
  dailyDone: 0,       // aulas concluídas hoje
  dailyDate: '',      // data da meta (para resetar no dia seguinte)
  rank: [],           // rank local [{name, xp, date}]
};

function loadXPState() {
  try {
    const saved = localStorage.getItem('focuslearn_xp');
    if (saved) Object.assign(XPState, JSON.parse(saved));
    checkDailyReset();
  } catch (e) {}
}

function saveXPState() {
  try {
    localStorage.setItem('focuslearn_xp', JSON.stringify(XPState));
  } catch (e) {}
}

function checkDailyReset() {
  const today = new Date().toDateString();
  if (XPState.dailyDate !== today) {
    // Salva sessão anterior no rank se tiver nome
    if (XPState.userName && XPState.dailyDone > 0) {
      addToRank(XPState.userName, XPState.xp);
    }
    XPState.dailyDone = 0;
    XPState.dailyDate = today;
    saveXPState();
  }
}

/* ── Pegar patente atual ─────────────────────────────────── */
function getCurrentRank() {
  const xp = Math.min(XPState.totalXP, 100);
  return RANKS.find(r => xp >= r.min && xp <= r.max) || RANKS[0];
}

function getXPMultiplier() {
  return getCurrentRank().xpMultiplier;
}

function getBreakMinutes() {
  return getCurrentRank().breakBonus;
}

/* ── Ganhar / perder XP ──────────────────────────────────── */
function gainXP(type) {
  const base = XP_VALUES[type] || 0;
  if (base <= 0) return;

  const mult = getXPMultiplier();
  const gained = Math.round(base * mult);

  const prevRank = getCurrentRank();

  XPState.xp = Math.min(XPState.xp + gained, 100);
  XPState.totalXP = Math.min(XPState.totalXP + gained, 100);

  const newRank = getCurrentRank();

  saveXPState();
  updateXPUI();
  showXPPopup(`+${gained} XP`, 'gain');

  // Subiu de patente?
  if (newRank.id !== prevRank.id && newRank.min > prevRank.min) {
    setTimeout(() => showRankUpModal(newRank), 800);
  }
}

function loseXP(amount) {
  const lost = Math.abs(amount || XP_VALUES.distraction);
  XPState.xp = Math.max(XPState.xp - lost, 0);
  saveXPState();
  updateXPUI();
  showXPPopup(`-${lost} XP`, 'lose');
}

/* ── Meta diária ─────────────────────────────────────────── */
function setDailyGoal(n) {
  XPState.dailyGoal = n;
  XPState.dailyDone = 0;
  saveXPState();
  updateGoalUI();
}

function incrementDailyGoal() {
  if (XPState.dailyGoal === 0) return;
  XPState.dailyDone++;
  saveXPState();
  updateGoalUI();

  if (XPState.dailyDone >= XPState.dailyGoal) {
    gainXP('goalComplete');
    setTimeout(() => showGoalCompleteModal(), 600);
  }
}

/* ── Rank local ──────────────────────────────────────────── */
function addToRank(name, xp) {
  const entry = {
    name,
    xp,
    date: new Date().toLocaleDateString('pt-BR'),
    rank: getCurrentRank().name,
  };
  XPState.rank.push(entry);
  // Mantém top 10
  XPState.rank.sort((a, b) => b.xp - a.xp);
  XPState.rank = XPState.rank.slice(0, 10);
  saveXPState();
}

/* ── UI: barra de XP no topbar ───────────────────────────── */
function updateXPUI() {
  const rank = getCurrentRank();
  const xp = XPState.totalXP;
  const pct = Math.round(((xp - rank.min) / (rank.max - rank.min + 1)) * 100);

  // Topbar XP
  const el = document.getElementById('xp-bar-container');
  if (!el) return;

  el.innerHTML = `
    <div class="xp-rank-name" style="color:${rank.color}">${rank.name}</div>
    <div class="xp-bar-wrap" title="${xp} XP">
      <div class="xp-bar-fill" style="width:${Math.max(pct,2)}%;background:${rank.color}"></div>
    </div>
    <div class="xp-value">${xp} XP</div>
  `;
}

function updateGoalUI() {
  const el = document.getElementById('goal-display');
  if (!el || XPState.dailyGoal === 0) {
    if (el) el.classList.add('hidden');
    return;
  }
  el.classList.remove('hidden');
  const pct = Math.min((XPState.dailyDone / XPState.dailyGoal) * 100, 100);
  el.innerHTML = `
    <span class="goal-icon">🎯</span>
    <div class="goal-bar-wrap">
      <div class="goal-bar-fill" style="width:${pct}%"></div>
    </div>
    <span class="goal-label">${XPState.dailyDone}/${XPState.dailyGoal} aulas</span>
  `;
}

/* ── Popup flutuante de XP ───────────────────────────────── */
function showXPPopup(text, type) {
  const popup = document.createElement('div');
  popup.className = `xp-popup ${type}`;
  popup.textContent = text;
  document.body.appendChild(popup);
  // Posição aleatória no canto
  popup.style.right = '24px';
  popup.style.top = '70px';
  requestAnimationFrame(() => popup.classList.add('show'));
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 400);
  }, 1800);
}

/* ── Modal: subiu de patente ─────────────────────────────── */
function showRankUpModal(rank) {
  document.getElementById('rankup-rank-name').textContent = rank.name;
  document.getElementById('rankup-perk').textContent = rank.perk;
  document.getElementById('rankup-break').textContent = rank.breakBonus;
  document.getElementById('rankup-mult').textContent = rank.xpMultiplier + 'x';
  openModal('modal-rankup');
}

/* ── Modal: meta diária batida ───────────────────────────── */
function showGoalCompleteModal() {
  openModal('modal-goal-done');
}

/* ── Modal: rank ─────────────────────────────────────────── */
function openRankModal() {
  renderRankList();
  openModal('modal-rank');
}

function renderRankList() {
  const list = document.getElementById('rank-list');
  if (!list) return;

  if (XPState.rank.length === 0) {
    list.innerHTML = `<div class="rank-empty">Nenhuma sessão registrada ainda.<br>Complete aulas para aparecer aqui!</div>`;
    return;
  }

  list.innerHTML = XPState.rank.map((entry, i) => `
    <div class="rank-item ${i === 0 ? 'first' : i === 1 ? 'second' : i === 2 ? 'third' : ''}">
      <span class="rank-pos">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
      <span class="rank-name">${entry.name}</span>
      <span class="rank-badge" style="color:${RANKS.find(r=>r.name===entry.rank)?.color||'#6366F1'}">${entry.rank}</span>
      <span class="rank-xp">${entry.xp} XP</span>
    </div>
  `).join('');
}

/* ── Modal: configurar foco (modo + meta) ───────────────── */
function openFocusSetupModal() {
  // Preenche nome se já tiver
  const nameInput = document.getElementById('focus-setup-name');
  if (nameInput && XPState.userName) nameInput.value = XPState.userName;

  // Atualiza break minutes baseado na patente
  const breakEl = document.getElementById('focus-setup-break');
  if (breakEl) breakEl.textContent = getBreakMinutes();

  openModal('modal-focus-setup');
}

function confirmFocusSetup() {
  const mode = document.querySelector('input[name="focus-mode"]:checked')?.value;
  const name = document.getElementById('focus-setup-name')?.value.trim();
  const goalInput = document.getElementById('focus-goal-input');
  const goal = parseInt(goalInput?.value) || 0;

  if (name) {
    XPState.userName = name;
    saveXPState();
  }

  closeModal('modal-focus-setup');

  if (mode === 'pomodoro') {
    enterFocusMode('pomodoro');
  } else if (mode === 'goal') {
    if (goal > 0) setDailyGoal(goal);
    enterFocusMode('goal');
  }
}

/* ── Inicialização ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadXPState();
  updateXPUI();
  updateGoalUI();
});
